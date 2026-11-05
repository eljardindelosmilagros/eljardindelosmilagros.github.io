var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "15mb" }));
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { imageBase64, mimeType, presetPath, question } = req.body;
      let base64Data = imageBase64;
      let resolvedMimeType = mimeType || "image/png";
      if (!base64Data && presetPath) {
        const safeRelative = presetPath.replace(/^\/+/, "");
        const candidatePath = import_path.default.resolve(__dirname, "public", safeRelative);
        if (import_fs.default.existsSync(candidatePath)) {
          const buffer = import_fs.default.readFileSync(candidatePath);
          base64Data = buffer.toString("base64");
          resolvedMimeType = candidatePath.endsWith(".jpg") ? "image/jpeg" : "image/png";
        }
      }
      if (!base64Data) {
        res.status(400).json({
          error: "Por favor, sube una imagen o selecciona una foto del jard\xEDn para analizar."
        });
        return;
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(403).json({
          error: "No se encontr\xF3 una clave de API configurada. Revisa el panel Settings > Secrets en AI Studio para activar gemini-4-argon."
        });
        return;
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const promptText = question && question.trim().length > 0 ? `${question.trim()}

Responde en espa\xF1ol cubano c\xE1lido y elegante como el sommelier y anfitri\xF3n de "El Jard\xEDn de los Milagros" en Nuevo Vedado, La Habana. No inventes precios ni prometas disponibilidad fija.` : `Act\xFAa como el anfitri\xF3n gastron\xF3mico de "El Jard\xEDn de los Milagros" (Nuevo Vedado, La Habana). Analiza esta fotograf\xEDa y describe en espa\xF1ol c\xE1lido y elegante:
1. Qu\xE9 plato, bebida, ingrediente o rinc\xF3n del jard\xEDn se observa y sus texturas/aromas.
2. Etiquetas diet\xE9ticas probables (si aplica: Especialidad al carb\xF3n, Vegetariano, Vegano o Sin gluten).
3. Maridaje sugerido con nuestro bar completo (cocteler\xEDa cubana, limonada frapp\xE9 con hierbabuena del huerto o copa de vino) o con nuestra salsa picante artesanal de la casa.
Recuerda mencionar siempre consultar disponibilidad del d\xEDa al reservar.`;
      const imagePart = {
        inlineData: {
          mimeType: resolvedMimeType,
          data: base64Data
        }
      };
      const textPart = {
        text: promptText
      };
      const response = await ai.models.generateContent({
        model: "gemini-4-argon",
        contents: { parts: [imagePart, textPart] }
      });
      const text = response.text ?? "No se pudo obtener respuesta del modelo.";
      res.json({ analysis: text, model: "gemini-4-argon" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const status = message.includes("403") || message.includes("PERMISSION_DENIED") ? 403 : message.includes("429") || message.includes("RESOURCE_EXHAUSTED") ? 429 : message.includes("404") || message.includes("NOT_FOUND") ? 404 : 500;
      res.status(status).json({
        error: `No se pudo completar el an\xE1lisis con gemini-4-argon (${message}). Puedes verificar o seleccionar una clave de API con facturaci\xF3n activa en Settings > Secrets.`,
        details: message
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(__dirname, "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
