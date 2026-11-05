export type DietaryTag = 'vegetariano' | 'vegano' | 'sin-gluten' | 'carbon';

export interface MenuItem {
  id: string;
  name: string;
  category: 'carbon' | 'entrantes' | 'especialidades' | 'postres';
  categoryLabel: string;
  description: string;
  boardPriceCUP?: string;
  priceStatus: string;
  image: string;
  imageAlt: string;
  isSpecialty?: boolean;
  dietary: DietaryTag[];
}

export interface ReservationInput {
  name: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  dietaryNotes: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ReservationInput, string>>;
}

export interface OpenStatus {
  isOpen: boolean;
  badgeText: 'Abierto ahora · hasta las 11 p.m.' | 'Abre a las 12 p.m.';
  havanaTimeFormatted: string;
  sublabel: string;
}

/**
 * Calculates whether El Jardín de los Milagros is currently open in Havana time (12:00 PM - 11:00 PM daily).
 * Can accept a custom hour (0-23) and minute (0-59) for deterministic testing.
 */
export function getHavanaOpenStatus(overrideHour?: number, overrideMinute?: number): OpenStatus {
  let hour = overrideHour;
  let minute = overrideMinute ?? 0;

  if (hour === undefined) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Havana',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date());
      const hPart = parts.find((p) => p.type === 'hour')?.value;
      const mPart = parts.find((p) => p.type === 'minute')?.value;
      hour = hPart !== undefined ? parseInt(hPart, 10) % 24 : 14;
      minute = mPart !== undefined ? parseInt(mPart, 10) : 0;
    } catch {
      const now = new Date();
      hour = now.getHours();
      minute = now.getMinutes();
    }
  }

  // Open daily from 12:00 (noon) until 23:00 (11:00 p.m.)
  const isOpen = hour >= 12 && hour < 23;
  const displayHour12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour >= 12 ? 'p.m.' : 'a.m.';
  const paddedMin = String(minute).padStart(2, '0');
  const havanaTimeFormatted = `${displayHour12}:${paddedMin} ${ampm}`;

  if (isOpen) {
    return {
      isOpen: true,
      badgeText: 'Abierto ahora · hasta las 11 p.m.',
      havanaTimeFormatted,
      sublabel: `Hora en La Habana: ${havanaTimeFormatted} · Cocina y bar activos`,
    };
  }

  return {
    isOpen: false,
    badgeText: 'Abre a las 12 p.m.',
    havanaTimeFormatted,
    sublabel: `Hora en La Habana: ${havanaTimeFormatted} · Reserva por WhatsApp para hoy o próximos días`,
  };
}

/**
 * Validates reservation inputs without silently substituting fallback values.
 */
export function validateReservationForm(input: ReservationInput): ValidationResult {
  const errors: Partial<Record<keyof ReservationInput, string>> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Por favor, escribe tu nombre para la reserva.';
  }

  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date.trim())) {
    errors.date = 'Selecciona una fecha válida para tu visita.';
  }

  if (!input.time || !input.time.trim()) {
    errors.time = 'Selecciona la hora estimada (entre 12:00 p.m. y 10:30 p.m.).';
  }

  const guestsNum = Number(input.guests);
  if (!input.guests || Number.isNaN(guestsNum) || guestsNum < 1 || guestsNum > 60) {
    errors.guests = 'Indica el número de personas (de 1 a 60).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Builds the pre-filled WhatsApp message and URL for +53 5 2686237.
 */
export function buildWhatsAppReservationData(input: ReservationInput): {
  message: string;
  whatsappUrl: string;
} {
  const cleanName = input.name.trim();
  const cleanDate = input.date.trim();
  const cleanTime = input.time.trim();
  const cleanGuests = input.guests.trim();
  const cleanOccasion = input.occasion.trim() || 'Visita al jardín';
  const cleanDietary = input.dietaryNotes.trim();

  const lines = [
    'Hola, equipo de *El Jardín de los Milagros*. Quisiera solicitar una reserva de mesa:',
    `• *Nombre:* ${cleanName}`,
    `• *Fecha:* ${cleanDate}`,
    `• *Hora:* ${cleanTime}`,
    `• *Personas:* ${cleanGuests}`,
    `• *Ocasión:* ${cleanOccasion}`,
  ];

  if (cleanDietary) {
    lines.push(`• *Preferencias / Dieta:* ${cleanDietary}`);
  }

  lines.push(
    '',
    '¿Me podrían confirmar la disponibilidad de mesa y los platos disponibles del día? ¡Muchas gracias!'
  );

  const message = lines.join('\n');
  const whatsappUrl = `https://wa.me/5352686237?text=${encodeURIComponent(message)}`;

  return { message, whatsappUrl };
}

/**
 * Filters menu items by category and dietary restriction.
 */
export function filterMenuItems(
  items: MenuItem[],
  category: string,
  dietaryFilter: string
): MenuItem[] {
  return items.filter((item) => {
    const matchesCategory = category === 'todas' || item.category === category;
    const matchesDietary =
      dietaryFilter === 'todos' || item.dietary.includes(dietaryFilter as DietaryTag);
    return matchesCategory && matchesDietary;
  });
}
