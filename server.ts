import express from 'express';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function collectProjectFiles(rootDir: string): { relativePath: string; fullPath: string }[] {
  const results: { relativePath: string; fullPath: string }[] = [];
  const topFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'metadata.json',
    '.env.example',
    '.gitignore',
    'server.ts',
  ];

  for (const file of topFiles) {
    const full = path.join(rootDir, file);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      results.push({ relativePath: file, fullPath: full });
    }
  }

  const walkDir = (dirRelative: string) => {
    const absDir = path.join(rootDir, dirRelative);
    if (!fs.existsSync(absDir)) return;
    for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
      const rel = path.posix.join(dirRelative, entry.name);
      const abs = path.join(rootDir, rel);
      if (entry.isDirectory()) {
        walkDir(rel);
      } else if (entry.isFile() && entry.name !== 'image_507dc702.png') {
        results.push({ relativePath: rel, fullPath: abs });
      }
    }
  };

  walkDir('src');
  walkDir('public');
  return results;
}

function createZipBuffer(files: { relativePath: string; fullPath: string }[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const rawData = fs.readFileSync(file.fullPath);
    const compressed = zlib.deflateRawSync(rawData);
    const crc = zlib.crc32(rawData) >>> 0;
    const nameBuf = Buffer.from(file.relativePath, 'utf8');

    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6); // UTF-8 flag
    localHeader.writeUInt16LE(8, 8); // Deflate
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(rawData.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(rawData.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);

    localParts.push(localHeader, compressed);
    centralParts.push(centralHeader);
    offset += localHeader.length + compressed.length;
  }

  const centralBuffer = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralBuffer, eocd]);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  app.get('/api/download-code', (_req, res) => {
    try {
      const files = collectProjectFiles(__dirname);
      const zipBuffer = createZipBuffer(files);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="el-jardin-de-los-milagros-codigo.zip"'
      );
      res.send(zipBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: `No se pudo generar el archivo ZIP: ${message}` });
    }
  });

  app.post('/api/analyze-image', async (req, res) => {
    try {
      const { imageBase64, mimeType, presetPath, question } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        presetPath?: string;
        question?: string;
      };

      let base64Data = imageBase64;
      let resolvedMimeType = mimeType || 'image/png';

      if (!base64Data && presetPath) {
        const safeRelative = presetPath.replace(/^\/+/, '');
        const candidatePath = path.resolve(__dirname, 'public', safeRelative);
        if (fs.existsSync(candidatePath)) {
          const buffer = fs.readFileSync(candidatePath);
          base64Data = buffer.toString('base64');
          resolvedMimeType = candidatePath.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
        }
      }

      if (!base64Data) {
        res.status(400).json({
          error: 'Por favor, sube una imagen o selecciona una foto del jardín para analizar.',
        });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(403).json({
          error:
            'No se encontró una clave de API configurada. Revisa el panel Settings > Secrets en AI Studio para activar gemini-4-argon.',
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptText =
        question && question.trim().length > 0
          ? `${question.trim()}\n\nResponde en español cubano cálido y elegante como el sommelier y anfitrión de "El Jardín de los Milagros" en Nuevo Vedado, La Habana. No inventes precios ni prometas disponibilidad fija.`
          : `Actúa como el anfitrión gastronómico de "El Jardín de los Milagros" (Nuevo Vedado, La Habana). Analiza esta fotografía y describe en español cálido y elegante:
1. Qué plato, bebida, ingrediente o rincón del jardín se observa y sus texturas/aromas.
2. Etiquetas dietéticas probables (si aplica: Especialidad al carbón, Vegetariano, Vegano o Sin gluten).
3. Maridaje sugerido con nuestro bar completo (coctelería cubana, limonada frappé con hierbabuena del huerto o copa de vino) o con nuestra salsa picante artesanal de la casa.
Recuerda mencionar siempre consultar disponibilidad del día al reservar.`;

      const imagePart = {
        inlineData: {
          mimeType: resolvedMimeType,
          data: base64Data,
        },
      };

      const textPart = {
        text: promptText,
      };

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: { parts: [imagePart, textPart] },
      });

      const text = response.text ?? 'No se pudo obtener respuesta del modelo.';
      res.json({ analysis: text, model: 'gemini-4-argon' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const status =
        message.includes('403') || message.includes('PERMISSION_DENIED')
          ? 403
          : message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
            ? 429
            : message.includes('404') || message.includes('NOT_FOUND')
              ? 404
              : 500;

      res.status(status).json({
        error: `No se pudo completar el análisis con gemini-4-argon (${message}). Puedes verificar o seleccionar una clave de API con facturación activa en Settings > Secrets.`,
        details: message,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
