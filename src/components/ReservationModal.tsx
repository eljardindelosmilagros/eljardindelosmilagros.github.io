import React, { useState } from 'react';
import { X, Phone, MessageCircle, Check, Copy, Calendar, Users, Clock } from 'lucide-react';
import {
  validateReservationForm,
  buildWhatsAppReservationData,
  type ReservationInput,
} from '../utils/restaurantLogic';
import { VERIFIED_BUSINESS_INFO } from '../data/restaurantData';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOccasion?: string;
  initialGuests?: string;
  onReservationCreated: (res: ReservationInput & { whatsappUrl: string; createdAt: string }) => void;
}

const TIME_SLOTS = [
  '12:00 p.m.',
  '12:30 p.m.',
  '1:00 p.m.',
  '1:30 p.m.',
  '2:00 p.m.',
  '2:30 p.m.',
  '3:00 p.m.',
  '5:00 p.m.',
  '6:00 p.m.',
  '7:00 p.m.',
  '7:30 p.m.',
  '8:00 p.m.',
  '8:30 p.m.',
  '9:00 p.m.',
  '9:30 p.m.',
  '10:00 p.m.',
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  initialOccasion = 'Cena en pareja',
  initialGuests = '2',
  onReservationCreated,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<ReservationInput>({
    name: '',
    date: todayIso,
    time: '8:00 p.m.',
    guests: initialGuests,
    occasion: initialOccasion,
    dietaryNotes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservationInput, string>>>({});
  const [preparedData, setPreparedData] = useState<{
    message: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({
        ...prev,
        occasion: initialOccasion || prev.occasion,
        guests: initialGuests || prev.guests,
      }));
      setPreparedData(null);
      setErrors({});
    }
  }, [isOpen, initialOccasion, initialGuests]);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateReservationForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setPreparedData(null);
      return;
    }

    setErrors({});
    const result = buildWhatsAppReservationData(form);
    setPreparedData(result);
    onReservationCreated({
      ...form,
      whatsappUrl: result.whatsappUrl,
      createdAt: new Date().toLocaleTimeString('es-CU', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleCopyMessage = async () => {
    if (!preparedData) return;
    try {
      await navigator.clipboard.writeText(preparedData.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-reserva-titulo"
      data-testid="reservation-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-h-[90dvh] sm:max-w-xl flex flex-col rounded-none sm:rounded-2xl bg-[#FAF7F2] dark:bg-[#151F19] border-0 sm:border border-[#1C241E]/15 dark:border-[#F3EFE6]/15 shadow-2xl overflow-hidden"
        data-testid="reservation-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera fija siempre visible en móvil, tablet y escritorio */}
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#FAF7F2]/95 dark:bg-[#151F19]/95 backdrop-blur-md px-5 py-4 sm:px-7 sm:py-5 z-10">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#8C4A27] dark:text-[#E08A58] truncate">
              Reserva sin intermediarios · Respuesta directa
            </p>
            <h2
              id="modal-reserva-titulo"
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-0.5 leading-tight"
            >
              Reserva tu mesa en el jardín
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de reserva"
            data-testid="reservation-modal-close"
            className="shrink-0 min-h-[44px] px-3.5 py-2 rounded-full bg-[#1C241E]/10 dark:bg-[#F3EFE6]/10 text-[#1C241E] dark:text-[#F3EFE6] hover:bg-[#1C241E]/20 dark:hover:bg-[#F3EFE6]/20 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="text-xs font-semibold">Cerrar</span>
          </button>
        </div>

        {/* Cuerpo con scroll interno fluido en teléfono y tablet */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-sm text-[#526056] dark:text-[#A7B5AC]">
            Completa los datos para generar tu mensaje prellenado de WhatsApp al{' '}
            <span className="font-semibold text-[#1C241E] dark:text-[#F3EFE6] tabular-nums">
              {VERIFIED_BUSINESS_INFO.phoneDisplay}
            </span>
            . Recuerda: <strong>consulta la disponibilidad del día al reservar</strong>.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-4" noValidate>
            <div>
              <label
                htmlFor="res-name"
                className="block text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] mb-1.5"
              >
                Nombre completo *
              </label>
              <input
                id="res-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Alejandro Valdés"
                className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#0F1612] px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-[#1C241E] dark:text-[#F3EFE6] focus:outline-none focus:ring-2 focus:ring-[#1E462D] dark:focus:ring-[#D96B3F]"
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label
                  htmlFor="res-date"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] mb-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#1E462D] dark:text-[#65B881]" />
                  Fecha *
                </label>
                <input
                  id="res-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#0F1612] px-3 py-3 sm:py-2.5 text-base sm:text-sm text-[#1C241E] dark:text-[#F3EFE6] tabular-nums"
                />
                {errors.date && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="res-time"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] mb-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-[#1E462D] dark:text-[#65B881]" />
                  Hora *
                </label>
                <select
                  id="res-time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#0F1612] px-3 py-3 sm:py-2.5 text-base sm:text-sm text-[#1C241E] dark:text-[#F3EFE6]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="res-guests"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] mb-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-[#1E462D] dark:text-[#65B881]" />
                  Personas *
                </label>
                <input
                  id="res-guests"
                  type="number"
                  min={1}
                  max={60}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#0F1612] px-3 py-3 sm:py-2.5 text-base sm:text-sm text-[#1C241E] dark:text-[#F3EFE6] tabular-nums"
                />
                {errors.guests && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
                    {errors.guests}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="res-occasion"
                  className="block text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] mb-1.5"
                >
                  Ocasión
                </label>
                <select
                  id="res-occasion"
                  value={form.occasion}
                  onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                  className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#0F1612] px-3 py-3 sm:py-2.5 text-base sm:text-sm text-[#1C241E] dark:text-[#F3EFE6]"
                >
                  <option value="Cena en pareja">Cena en pareja</option>
                  <option value="Almuerzo en familia">Almuerzo en familia</option>
                  <option value="Celebración o grupo">Celebración o grupo</option>
                  <option value="Entre amigos / Coctelería">Entre amigos / Coctelería</option>
                  <option value="Comida para llevar">Encargo para llevar</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="res-dietary"
                  className="block text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] mb-1.5"
                >
                  Opciones dietéticas o platos a consultar
                </label>
                <input
                  id="res-dietary"
                  type="text"
                  value={form.dietaryNotes}
                  onChange={(e) => setForm({ ...form, dietaryNotes: e.target.value })}
                  placeholder="Ej. Carnes al carbón, 1 vegano, sin gluten..."
                  className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#0F1612] px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-[#1C241E] dark:text-[#F3EFE6]"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white font-semibold py-3.5 sm:py-3 px-6 text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Preparar reserva por WhatsApp
              </button>
              <a
                href={VERIFIED_BUSINESS_INFO.phoneTel}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 px-5 py-3.5 sm:py-3 text-sm font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:bg-[#1C241E]/5 dark:hover:bg-[#F3EFE6]/10 transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                Llamar {VERIFIED_BUSINESS_INFO.phoneDisplay}
              </a>
            </div>
          </form>

          {preparedData && (
            <div
              className="mt-5 rounded-xl bg-[#EBF3ED] dark:bg-[#1D3124] border border-[#1E462D]/25 dark:border-[#65B881]/30 p-4 space-y-3"
              data-testid="reservation-confirmation"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#1E462D] dark:text-[#8CE0A6] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Mensaje de reserva listo para enviar a WhatsApp
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#1C241E] dark:text-[#F3EFE6] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? '¡Texto copiado!' : 'Copiar texto'}
                </button>
              </div>
              <pre className="text-xs whitespace-pre-wrap font-sans bg-white/80 dark:bg-[#0F1612]/80 p-3 rounded-lg text-[#1C241E] dark:text-[#F3EFE6] border border-[#1C241E]/10 dark:border-[#F3EFE6]/10">
                {preparedData.message}
              </pre>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={preparedData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1E462D] hover:bg-[#163522] text-white text-xs font-semibold px-5 py-3 sm:py-2.5 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp ahora ({VERIFIED_BUSINESS_INFO.phoneDisplay})
                </a>
              </div>
            </div>
          )}

          {/* Botón adicional de cierre en pantallas móviles para máxima comodidad */}
          <div className="mt-6 pt-4 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10 sm:hidden">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full border border-[#1C241E]/15 dark:border-[#F3EFE6]/15 text-xs font-semibold text-[#526056] dark:text-[#A7B5AC] hover:bg-[#1C241E]/5 dark:hover:bg-[#F3EFE6]/5 transition-colors"
            >
              Volver a la página principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
