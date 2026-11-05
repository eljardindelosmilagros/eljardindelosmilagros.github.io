/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  Sun,
  Moon,
  ChevronDown,
  Utensils,
  Wine,
  Sprout,
  Users,
  Car,
  Accessibility,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Check,
  Sparkles,
  Heart,
  ShieldCheck,
  UserCheck,
  Pause,
  Play,
  BarChart3,
  Coffee,
  Menu,
} from 'lucide-react';
import {
  VERIFIED_BUSINESS_INFO,
  TRIPADVISOR_RATING_BREAKDOWN,
  BAR_MENU_CATEGORIES,
  POPULAR_HOURS_DATA,
  HERO_SCENES,
  EXPERIENCE_CAROUSEL_SLIDES,
  MENU_ITEMS,
  TRIPADVISOR_REVIEWS,
  GALLERY_PHOTOS,
  FAQ_ITEMS,
} from './data/restaurantData';
import {
  getHavanaOpenStatus,
  filterMenuItems,
  validateReservationForm,
  buildWhatsAppReservationData,
  type ReservationInput,
} from './utils/restaurantLogic';
import { ReservationModal } from './components/ReservationModal';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Hero background scene state + auto-fade control
  const [heroSceneIndex, setHeroSceneIndex] = useState<number>(0);
  const [heroPaused, setHeroPaused] = useState<boolean>(false);

  // Experience informative carousel state + auto-play control
  const [expSlideIndex, setExpSlideIndex] = useState<number>(0);
  const [expCarouselPaused, setExpCarouselPaused] = useState<boolean>(false);

  // Reviews 3-by-3 Carousel state (fade-out left, fade-in right)
  const [reviewPage, setReviewPage] = useState<number>(0);
  const [reviewsPaused, setReviewsPaused] = useState<boolean>(false);
  const totalReviewPages = Math.ceil(TRIPADVISOR_REVIEWS.length / 3);

  // Bar interactive menu tab state
  const [activeBarTab, setActiveBarTab] = useState<string>(BAR_MENU_CATEGORIES[0].id);

  // Popular hours day selector state
  const [popularDayKey, setPopularDayKey] = useState<string>('viernes-sabado');

  // Menu filters
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedDietary, setSelectedDietary] = useState<string>('todos');
  const [showChalkboardModal, setShowChalkboardModal] = useState<boolean>(false);

  // Lightbox state for Gallery
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Mobile navigation sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Reservation modal & inline form state
  const [isResModalOpen, setIsResModalOpen] = useState<boolean>(false);
  const [modalOccasion, setModalOccasion] = useState<string>('Cena en pareja');
  const [modalGuests, setModalGuests] = useState<string>('2');
  const [recentReservations, setRecentReservations] = useState<
    Array<ReservationInput & { whatsappUrl: string; createdAt: string }>
  >([]);

  // Inline bottom reservation form state
  const todayIso = new Date().toISOString().split('T')[0];
  const [inlineForm, setInlineForm] = useState<ReservationInput>({
    name: '',
    date: todayIso,
    time: '8:00 p.m.',
    guests: '2',
    occasion: 'Cena en pareja',
    dietaryNotes: '',
  });
  const [inlineErrors, setInlineErrors] = useState<Partial<Record<keyof ReservationInput, string>>>(
    {}
  );
  const [inlineResult, setInlineResult] = useState<{
    message: string;
    whatsappUrl: string;
  } | null>(null);

  // Dynamic Havana open status
  const [openStatus, setOpenStatus] = useState(() => getHavanaOpenStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setOpenStatus(getHavanaOpenStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Smooth auto-fading Hero background scenes every 6 seconds
  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setHeroSceneIndex((prev) => (prev + 1) % HERO_SCENES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroPaused]);

  // Auto-advancing informative carousel in "La Experiencia" every 4.2 seconds
  useEffect(() => {
    if (expCarouselPaused) return;
    const timer = setInterval(() => {
      setExpSlideIndex((prev) => (prev + 1) % EXPERIENCE_CAROUSEL_SLIDES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [expCarouselPaused]);

  // Auto-advancing 3-card Reviews carousel every 5.8 seconds
  useEffect(() => {
    if (reviewsPaused) return;
    const timer = setInterval(() => {
      setReviewPage((prev) => (prev + 1) % totalReviewPages);
    }, 5800);
    return () => clearInterval(timer);
  }, [reviewsPaused, totalReviewPages]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard navigation for gallery lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const openReservationWithPreset = (occasion: string, guests: string) => {
    setModalOccasion(occasion);
    setModalGuests(guests);
    setIsResModalOpen(true);
  };

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateReservationForm(inlineForm);
    if (!check.valid) {
      setInlineErrors(check.errors);
      setInlineResult(null);
      return;
    }
    setInlineErrors({});
    const built = buildWhatsAppReservationData(inlineForm);
    setInlineResult(built);
    setRecentReservations((prev) => [
      {
        ...inlineForm,
        whatsappUrl: built.whatsappUrl,
        createdAt: new Date().toLocaleTimeString('es-CU', { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  const filteredMenu = filterMenuItems(MENU_ITEMS, selectedCategory, selectedDietary);
  const currentHeroScene = HERO_SCENES[heroSceneIndex];
  const currentExpSlide = EXPERIENCE_CAROUSEL_SLIDES[expSlideIndex];
  const currentReviewTriplet = TRIPADVISOR_REVIEWS.slice(reviewPage * 3, reviewPage * 3 + 3);
  const currentBarCategory =
    BAR_MENU_CATEGORIES.find((c) => c.id === activeBarTab) || BAR_MENU_CATEGORIES[0];
  const currentPopularDay =
    POPULAR_HOURS_DATA[popularDayKey] || POPULAR_HOURS_DATA['viernes-sabado'];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C241E] dark:bg-[#0D1410] dark:text-[#F3EFE6] transition-colors duration-300 pb-20 lg:pb-0">
      {/* 1. BARRA SUPERIOR FIJA (Siempre visible al hacer scroll con opacidad translúcida ligera) */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#FAF7F2]/85 dark:bg-[#0D1410]/85 backdrop-blur-md border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Official Transparent Logo + Brand Title */}
          <a
            href="#"
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0 focus:outline-none"
          >
            <img
              src={VERIFIED_BUSINESS_INFO.logo}
              alt="Logo oficial de El Jardín de los Milagros Restaurante"
              className="h-10 sm:h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
            <span className="font-serif-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#1C241E] dark:text-[#F3EFE6] truncate">
              El Jardín de los Milagros
            </span>
          </a>

          {/* Zone 2: Navigation Links (Visibles en Tablet md+ y Escritorio lg+) */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#526056] dark:text-[#A7B5AC]"
          >
            <a
              href="#carta"
              className="hover:text-[#1E462D] dark:hover:text-[#E8C59E] hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              Carta
            </a>
            <a
              href="#ambiente"
              className="hover:text-[#1E462D] dark:hover:text-[#E8C59E] hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              Ambiente
            </a>
            <a
              href="#opiniones"
              className="hover:text-[#1E462D] dark:hover:text-[#E8C59E] hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              Opiniones
            </a>
            <a
              href="#como-llegar"
              className="hover:text-[#1E462D] dark:hover:text-[#E8C59E] hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              Cómo llegar
            </a>
          </nav>

          {/* Zone 3: En Escritorio (lg+) botón Reservar en el header; en Teléfono (< md) botón de Menú lateral */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => openReservationWithPreset('Cena en pareja', '2')}
              className="hidden lg:inline-flex items-center justify-center rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white text-sm font-semibold px-6 py-2.5 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
            >
              Reservar
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMobileMenuOpen}
              data-testid="mobile-menu-toggle"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#1C241E]/8 dark:bg-[#F3EFE6]/10 text-[#1C241E] dark:text-[#F3EFE6] hover:bg-[#1C241E]/15 dark:hover:bg-[#F3EFE6]/20 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR DE NAVEGACIÓN PARA TELÉFONO (< md) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-[70] md:hidden flex justify-end bg-black/65 backdrop-blur-xs"
            data-testid="mobile-menu-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid="mobile-menu-sidebar"
              aria-label="Menú lateral de navegación"
              className="w-[82vw] max-w-xs h-[100dvh] bg-[#FAF7F2] dark:bg-[#121B16] border-l border-[#1C241E]/15 dark:border-[#F3EFE6]/15 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={VERIFIED_BUSINESS_INFO.logo}
                      alt="Logo de El Jardín de los Milagros"
                      className="h-9 w-auto object-contain shrink-0"
                    />
                    <span className="font-serif-display text-lg font-bold text-[#1C241E] dark:text-[#F3EFE6] truncate">
                      El Jardín
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Cerrar menú lateral"
                    data-testid="mobile-menu-close"
                    className="w-10 h-10 rounded-full bg-[#1C241E]/8 dark:bg-[#F3EFE6]/10 flex items-center justify-center text-[#1C241E] dark:text-[#F3EFE6] hover:bg-[#1C241E]/15 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav aria-label="Enlaces del menú móvil" className="p-5 space-y-1.5">
                  {[
                    { href: '#carta', label: 'Carta y Brasas', icon: <Utensils className="w-4 h-4 text-[#B8522A]" /> },
                    { href: '#cocteleria', label: 'Coctelería y Bar', icon: <Wine className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399]" /> },
                    { href: '#ambiente', label: 'Ambiente y Jardín', icon: <Sparkles className="w-4 h-4 text-[#C5A059]" /> },
                    { href: '#huerto', label: 'Huerto y Miel', icon: <Sprout className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399]" /> },
                    { href: '#opiniones', label: 'Opiniones (★ 4.7)', icon: <Heart className="w-4 h-4 text-[#B8522A]" /> },
                    { href: '#como-llegar', label: 'Cómo llegar y Horarios', icon: <MapPin className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399]" /> },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:bg-[#1C241E]/6 dark:hover:bg-white/8 transition-colors"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-5 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10 space-y-3 bg-[#F2ECE1]/60 dark:bg-[#0D1410]/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openReservationWithPreset('Reserva desde menú móvil', '2');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white font-semibold py-3 px-5 text-sm shadow-md transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reservar mesa por WhatsApp
                </button>
                <a
                  href={VERIFIED_BUSINESS_INFO.phoneTel}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 py-2.5 px-4 text-xs font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Llamar al {VERIFIED_BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="pt-20 overflow-x-clip">
        {/* 2. HERO A PANTALLA COMPLETA CON LOGO OFICIAL EN EL CENTRO SUPERIOR Y CROSS-FADING SUAVE */}
        <section
          aria-labelledby="hero-heading"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          className="relative min-h-[690px] lg:min-h-[760px] flex items-center overflow-hidden bg-[#07100B]"
        >
          {/* Background Image Layer with smooth Cross-Fading (AnimatePresence) */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="sync">
              <motion.img
                key={currentHeroScene.image}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                src={currentHeroScene.image}
                alt={currentHeroScene.alt}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </AnimatePresence>
            {/* Multi-layer luxury scrims for guaranteed contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#07100B]/85 via-[#07100B]/65 to-[#07100B]/92" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,16,11,0.35)_0%,rgba(7,16,11,0.85)_100%)]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:py-16">
            {/* Top Utility Row: Dynamic Havana Hours + Dark/Light Mode Switch */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/15 text-xs text-white/85">
              <div className="flex flex-wrap items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E8C59E] shrink-0" />
                <span
                  className="font-semibold text-[#E8C59E] tracking-wide"
                  data-testid="dynamic-open-status"
                >
                  {openStatus.badgeText}
                </span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span>Nuevo Vedado, La Habana</span>
                <span aria-hidden="true" className="text-white/40 hidden sm:inline">
                  ·
                </span>
                <span className="hidden sm:inline text-white/75">{openStatus.sublabel}</span>
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#E8C59E]" />
                    <span>Ambiente de día</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#E8C59E]" />
                    <span>Ambiente de noche</span>
                  </>
                )}
              </button>
            </div>

            {/* TOP-CENTER OFFICIAL LOGO CREST & HERO PROPOSITION */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6"
            >
              {/* Official Transparent Logo Prominently Centered at the Top of the Hero */}
              <div className="flex flex-col items-center gap-3">
                <motion.img
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  src={VERIFIED_BUSINESS_INFO.logo}
                  alt="Emblema oficial de El Jardín de los Milagros Restaurante en el centro superior"
                  className="h-24 sm:h-32 w-auto object-contain drop-shadow-[0_14px_34px_rgba(0,0,0,0.65)]"
                />
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#E8C59E]">
                  Cocina Caribeña · Cubana · Especialidad en Carnes al Carbón
                </p>
              </div>

              {/* Emotional Headline <= 10 words */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-6xl lg:text-[4.35rem] font-semibold tracking-tight text-white leading-[1.05] text-balance drop-shadow-md"
              >
                Brasas al carbón en un jardín secreto habanero.
              </h1>

              {/* One-line Subtitle */}
              <p className="text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl font-normal">
                Desconecta del ruido de la ciudad entre helechos, coctelería de autor y el calor de
                una mesa compartida en Nuevo Vedado.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openReservationWithPreset('Cena en pareja', '2')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#B8522A] hover:bg-[#A14420] text-white font-semibold px-8 py-4 text-sm sm:text-base transition-all hover:-translate-y-0.5 shadow-xl cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5" />
                  Reservar mesa
                </button>

                <a
                  href="#como-llegar"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/12 hover:bg-white/22 backdrop-blur-md border border-white/30 px-7 py-4 text-sm sm:text-base font-semibold text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <MapPin className="w-5 h-5 text-[#E8C59E]" />
                  Cómo llegar
                </a>

                <a
                  href={VERIFIED_BUSINESS_INFO.phoneTel}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black/35 hover:bg-black/55 border border-white/15 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white/95 hover:text-white transition-colors whitespace-nowrap tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#E8C59E]" />
                  {VERIFIED_BUSINESS_INFO.phoneDisplay}
                </a>
              </div>

              {/* Centered Scene Switcher Bar with Smooth Cross-Fade Indicator */}
              <div className="pt-4 w-full max-w-xl mx-auto">
                <div className="rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 px-4 py-3 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-[11px] font-medium text-[#E8C59E]">
                      Escena en pantalla · Transición suave automática
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentHeroScene.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.35 }}
                        className="font-serif-display text-base sm:text-lg font-semibold"
                      >
                        {currentHeroScene.caption}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    role="group"
                    aria-label="Cambiar escena de fondo"
                  >
                    {HERO_SCENES.map((scene, idx) => (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => setHeroSceneIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          heroSceneIndex === idx
                            ? 'bg-[#B8522A] text-white shadow-xs'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {scene.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. FRANJA DE CONFIANZA */}
        <section
          aria-label="Indicadores de confianza verificados"
          className="py-5 bg-[#F2ECE1] dark:bg-[#141F18] border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-sm sm:text-base font-medium text-[#1C241E] dark:text-[#F3EFE6] text-center tabular-nums">
              <span className="font-semibold text-[#8C4A27] dark:text-[#E8C59E]">
                ★ 4.7 en Tripadvisor
              </span>
              <span aria-hidden="true" className="text-[#526056] dark:text-[#A7B5AC]">
                ·
              </span>
              <span>+149 opiniones reales</span>
              <span aria-hidden="true" className="text-[#526056] dark:text-[#A7B5AC]">
                ·
              </span>
              <span>Abierto todos los días (12:00 p.m. – 11:00 p.m.)</span>
              <span aria-hidden="true" className="text-[#526056] dark:text-[#A7B5AC]">
                ·
              </span>
              <span>Bar completo y terraza cubierta</span>
            </div>
          </div>
        </section>

        {/* 4. LA EXPERIENCIA (Con Carrusel Informativo en Movimiento y Fade-In) */}
        <section
          id="ambiente"
          aria-labelledby="experiencia-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 space-y-6"
              >
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  01. La Experiencia · Un Oasis en Nuevo Vedado
                </p>
                <h2
                  id="experiencia-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] leading-[1.12] text-balance"
                >
                  Un patio escondido donde la ciudad se queda afuera y solo importa la buena mesa
                </h2>
                <p className="text-base text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
                  Al cruzar nuestro sendero de lajas de piedra en la Calle 37, el calor del asfalto
                  cambia por la sombra fresca de los helechos y las enredaderas. Aquí el almuerzo se
                  alarga sin prisa y la noche cae entre copas, conversación tranquila y el aroma
                  inconfundible de la parrilla al carbón.
                </p>
                <p className="text-base text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
                  Quienes nos visitan coinciden en lo mismo: antes que un restaurante, se siente
                  como llegar al jardín de una casa familiar donde te reciben con profesionalismo y
                  calidez desde la puerta.
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-[#1E462D] dark:text-[#7AD399]">
                  <span>Mesas al aire libre</span>
                  <span aria-hidden="true">·</span>
                  <span>Servicio de mesa atento</span>
                  <span aria-hidden="true">·</span>
                  <span>Accesible en silla de ruedas</span>
                  <span aria-hidden="true">·</span>
                  <span>Parqueo propio</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openReservationWithPreset('Almuerzo en el jardín', '2')}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1E462D] hover:bg-[#163522] text-white text-sm font-semibold px-7 py-3.5 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    Aparta tu mesa bajo la pérgola
                  </button>
                </div>
              </motion.div>

              {/* Interactive Auto-Moving Informative Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7"
                onMouseEnter={() => setExpCarouselPaused(true)}
                onMouseLeave={() => setExpCarouselPaused(false)}
                data-testid="experience-carousel"
              >
                <div className="relative rounded-3xl overflow-hidden border border-[#1C241E]/12 dark:border-[#F3EFE6]/12 bg-[#121C16] shadow-xl">
                  {/* Slide Image with Smooth Cross-Fade & Subtle Motion */}
                  <div className="relative h-80 sm:h-[440px] w-full overflow-hidden">
                    <AnimatePresence mode="sync">
                      <motion.img
                        key={currentExpSlide.image}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        src={currentExpSlide.image}
                        alt={currentExpSlide.alt}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                    {/* Top Controls Row on Carousel */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#E8C59E]">
                        {currentExpSlide.tag}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setExpCarouselPaused((p) => !p)}
                          aria-label={expCarouselPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
                          className="p-2 rounded-full bg-black/55 hover:bg-black/75 text-white border border-white/20 transition-colors cursor-pointer"
                        >
                          {expCarouselPaused ? (
                            <Play className="w-3.5 h-3.5" />
                          ) : (
                            <Pause className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpSlideIndex(
                              (prev) =>
                                (prev - 1 + EXPERIENCE_CAROUSEL_SLIDES.length) %
                                EXPERIENCE_CAROUSEL_SLIDES.length
                            )
                          }
                          aria-label="Diapositiva anterior"
                          className="p-2 rounded-full bg-black/55 hover:bg-black/75 text-white border border-white/20 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpSlideIndex(
                              (prev) => (prev + 1) % EXPERIENCE_CAROUSEL_SLIDES.length
                            )
                          }
                          aria-label="Siguiente diapositiva"
                          className="p-2 rounded-full bg-black/55 hover:bg-black/75 text-white border border-white/20 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Informative Overlay inside Carousel */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentExpSlide.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35 }}
                        >
                          <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-white">
                            {currentExpSlide.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/85 mt-1.5 max-w-xl leading-relaxed">
                            {currentExpSlide.description}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Interactive Thumbnail / Progress Bar Strip */}
                      <div
                        className="grid grid-cols-5 gap-2 mt-5 pt-4 border-t border-white/15"
                        role="tablist"
                        aria-label="Seleccionar postal del jardín"
                      >
                        {EXPERIENCE_CAROUSEL_SLIDES.map((slide, i) => {
                          const active = i === expSlideIndex;
                          return (
                            <button
                              key={slide.id}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setExpSlideIndex(i)}
                              className="text-left group cursor-pointer focus:outline-none"
                            >
                              <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden mb-1.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    active
                                      ? 'w-full bg-[#B8522A]'
                                      : 'w-0 group-hover:w-1/2 bg-white/60'
                                  }`}
                                />
                              </div>
                              <p
                                className={`text-[11px] font-medium truncate ${
                                  active ? 'text-[#E8C59E] font-semibold' : 'text-white/65'
                                }`}
                              >
                                {slide.title}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. NUESTRA CARTA (Con Fade-In llamativo en cada tarjeta e imagen) */}
        <section
          id="carta"
          aria-labelledby="carta-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55 }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
            >
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  02. Nuestra Carta · Fuego de Carbón y Sabores del Caribe
                </p>
                <h2
                  id="carta-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1"
                >
                  Especialidad en carnes a las brasas y mesa de entrantes
                </h2>
                <p className="text-base text-[#526056] dark:text-[#A7B5AC] mt-2.5 max-w-2xl">
                  Asamos lentamente sobre carbón vegetal y servimos porciones generosas para
                  compartir al centro o disfrutar en plato fuerte. Contamos con opciones{' '}
                  <strong className="text-[#1C241E] dark:text-[#F3EFE6]">
                    vegetarianas, veganas y sin gluten
                  </strong>
                  .
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowChalkboardModal(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:bg-[#F2ECE1] dark:hover:bg-[#17221B] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Utensils className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399]" />
                  Ver pizarra del día en CUP
                </button>
              </div>
            </motion.div>

            {/* Mandatory Notice: Consulta la disponibilidad del día al reservar */}
            <div className="mt-7 rounded-2xl bg-[#F2ECE1] dark:bg-[#16221A] border border-[#1C241E]/12 dark:border-[#F3EFE6]/12 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#1C241E] dark:text-[#F3EFE6]">
                <strong>Cocina de mercado y brasas frescas:</strong> Nuestros cortes y sugerencias
                se preparan con productos frescos de la jornada.{' '}
                <span className="underline decoration-[#B8522A] underline-offset-4 font-semibold">
                  Consulta la disponibilidad del día al reservar.
                </span>
              </p>
              <button
                type="button"
                onClick={() => openReservationWithPreset('Consulta de carta y reserva', '2')}
                className="text-xs sm:text-sm font-semibold text-[#B8522A] dark:text-[#E08A58] hover:underline text-left sm:whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Preguntar sugerencias de hoy por WhatsApp →
              </button>
            </div>

            {/* Interactive Filter Controls */}
            <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Segmented Bar */}
              <div
                className="flex flex-wrap items-center gap-1 p-1.5 bg-[#F2ECE1] dark:bg-[#16221A] rounded-xl border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 w-fit"
                role="group"
                aria-label="Filtrar platos por categoría"
              >
                {[
                  { id: 'todas', label: 'Toda la selección' },
                  { id: 'carbon', label: 'Carnes al Carbón' },
                  { id: 'entrantes', label: 'Mesa de Entrantes' },
                  { id: 'especialidades', label: 'Mar y Huerto' },
                  { id: 'postres', label: 'Postres' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-[#1E462D] text-white shadow-xs'
                        : 'text-[#526056] dark:text-[#A7B5AC] hover:text-[#1C241E] dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dietary Filter Buttons */}
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Filtrar por preferencia dietética"
              >
                <span className="text-xs font-medium text-[#526056] dark:text-[#A7B5AC] mr-1">
                  Preferencias:
                </span>
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'carbon', label: 'Parrilla al Carbón' },
                  { id: 'vegetariano', label: 'Vegetariano' },
                  { id: 'vegano', label: 'Vegano' },
                  { id: 'sin-gluten', label: 'Sin Gluten' },
                ].map((diet) => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setSelectedDietary(diet.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      selectedDietary === diet.id
                        ? 'bg-[#B8522A] text-white border-[#B8522A]'
                        : 'bg-transparent text-[#526056] dark:text-[#A7B5AC] border-[#1C241E]/15 dark:border-[#F3EFE6]/15 hover:text-[#1C241E] dark:hover:text-white'
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Cards Grid with Staggered Fade-In */}
            <div
              className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
              data-testid="menu-grid"
            >
              {filteredMenu.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 26, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.55,
                    delay: (idx % 3) * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group rounded-2xl bg-[#F2ECE1]/75 dark:bg-[#16221A] border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-lg"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-[#1C241E]/10">
                      <motion.img
                        initial={{ opacity: 0, scale: 1.06 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65 }}
                        src={item.image}
                        alt={item.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#8C4A27] dark:text-[#E08A58] font-semibold">
                        <span>{item.categoryLabel}</span>
                        {item.isSpecialty && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5" /> Especialidad
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-2xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1.5">
                        {item.name}
                      </h3>

                      <p className="text-sm text-[#526056] dark:text-[#A7B5AC] mt-2.5 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-3.5 text-xs font-semibold text-[#1E462D] dark:text-[#7AD399]">
                        {item.dietary
                          .map((d) =>
                            d === 'carbon'
                              ? 'Asado al Carbón'
                              : d === 'sin-gluten'
                                ? 'Opción Sin Gluten'
                                : d === 'vegano'
                                  ? 'Opción Vegana'
                                  : 'Opción Vegetariana'
                          )
                          .join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10 flex items-center justify-between gap-2 bg-white/50 dark:bg-black/20">
                    <div>
                      <p className="text-sm font-bold font-mono text-[#1C241E] dark:text-[#F3EFE6] tabular-nums">
                        {item.boardPriceCUP}
                      </p>
                      <p className="text-[11px] text-[#526056] dark:text-[#A7B5AC]">
                        {item.priceStatus}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setInlineForm((prev) => ({
                          ...prev,
                          dietaryNotes: `Consultar disponibilidad de: ${item.name}`,
                        }));
                        openReservationWithPreset('Almuerzo o Cena', '2');
                      }}
                      className="text-xs font-semibold text-[#B8522A] dark:text-[#E08A58] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Reservar este plato →
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Bottom push to action for Menu */}
            <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-7 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10">
              <p className="text-sm sm:text-base text-[#526056] dark:text-[#A7B5AC]">
                ¿Antojo de carnes al carbón o de nuestra Tabla Los Milagros? Asegura tu mesa y te
                confirmamos al momento los cortes frescos de hoy.
              </p>
              <button
                type="button"
                onClick={() => openReservationWithPreset('Cena con carnes al carbón', '2')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white text-sm font-semibold px-6 sm:px-7 py-3.5 transition-all hover:-translate-y-0.5 cursor-pointer text-center sm:whitespace-nowrap w-full sm:w-auto self-start sm:self-auto shadow-sm"
              >
                Reservar y consultar carta del día
              </button>
            </div>
          </div>
        </section>

        {/* 6. COCTELERÍA, DESTILADOS Y CAFÉS (Con Carta Editorial Interactiva en Código + Fotos del Bar) */}
        <section
          id="cocteleria"
          aria-labelledby="cocteleria-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#F2ECE1]/60 dark:bg-[#121B15]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Top Header & 3 Atmospheric Bar Photos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-5 space-y-5"
              >
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  03. Coctelería, Destilados y Cafés · Hasta las 11:00 p.m.
                </p>
                <h2
                  id="cocteleria-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] leading-[1.12] text-balance"
                >
                  Carta “Del Bar”: tragos con hierbabuena fresca, rones cubanos y cafés
                </h2>
                <p className="text-base text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
                  Explora nuestra carta líquida con precios de referencia en CUP: desde un Mojito o
                  Daiquirí preparado en nuestra barra de madera hasta rones cubanos añejos, whiskies,
                  cremas, cervezas bien frías y cafés recién colados para la sobremesa.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => openReservationWithPreset('Entre amigos / Coctelería', '4')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E462D] hover:bg-[#163522] text-white text-sm font-semibold px-6 sm:px-7 py-3.5 transition-all hover:-translate-y-0.5 cursor-pointer text-center sm:whitespace-nowrap w-full sm:w-auto shadow-sm"
                  >
                    <Wine className="w-4 h-4 shrink-0" />
                    Reservar mesa para tragos y picadera
                  </button>
                </div>
              </motion.div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    src: '/assets/aistudio/image_6691ed9d_52d8fb0c.webp',
                    alt: 'Vaso frío con hierbabuena fresca junto a la salsa picante artesanal de El Jardín de los Milagros',
                    caption: 'Coctelería refrescante con hierbabuena recién cosechada',
                  },
                  {
                    src: VERIFIED_BUSINESS_INFO.artisanalBottlePhoto,
                    alt: 'Botella artesanal vestida en yute rústico con sello verde El Jardín de los Milagros Paladar',
                    caption: 'Elaboración artesanal vestida en yute con sello de la casa',
                  },
                  {
                    src: '/assets/aistudio/image_44062243.png',
                    alt: 'Carta física Del Bar de El Jardín de los Milagros entre hojas verdes',
                    caption: 'Carta física “Del Bar” en nuestras mesas del jardín',
                  },
                ].map((card, i) => (
                  <motion.div
                    key={card.src}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#17221B] shadow-md flex flex-col justify-between"
                  >
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3.5 text-xs font-medium text-[#526056] dark:text-[#A7B5AC] bg-white/95 dark:bg-[#0D1410]">
                      {card.caption}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Interactive Coded Bar & Drinks Menu Board (No photo per drink needed) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-[#132A1C] text-[#F3EFE6] border border-[#C5A059]/35 shadow-xl p-6 sm:p-10"
              data-testid="interactive-bar-menu"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/15">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[#E8C59E] flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Carta Líquida Oficial · Precios en Moneda Nacional (CUP)
                  </p>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-white mt-1">
                    {currentBarCategory.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mt-0.5">
                    {currentBarCategory.subtitle}
                  </p>
                </div>

                {/* Category Tabs */}
                <div
                  className="flex flex-wrap items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10"
                  role="tablist"
                  aria-label="Categorías del bar"
                >
                  {BAR_MENU_CATEGORIES.map((cat) => {
                    const active = cat.id === activeBarTab;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveBarTab(cat.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#B8522A] text-white shadow-sm'
                            : 'text-white/75 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editorial Two-Column Drink List with Dotted Leaders */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBarCategory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4"
                >
                  {currentBarCategory.items.map((drink) => (
                    <div
                      key={drink.name}
                      className="group flex items-baseline justify-between gap-3 py-2 border-b border-white/10"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif-display text-lg sm:text-xl font-semibold text-white group-hover:text-[#E8C59E] transition-colors">
                            {drink.name}
                          </span>
                          {drink.isHighlight && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E8C59E] bg-white/10 px-2 py-0.5 rounded">
                              Recomendado
                            </span>
                          )}
                        </div>
                        {drink.detail && (
                          <p className="text-xs text-white/65 mt-0.5">{drink.detail}</p>
                        )}
                      </div>

                      <div className="flex-1 border-b border-dotted border-white/25 mx-2 hidden sm:block" />

                      <span className="font-mono text-sm font-bold text-[#E8C59E] whitespace-nowrap tabular-nums shrink-0">
                        {drink.priceCUP}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
                <span>
                  * Consulta la disponibilidad del día en barra al realizar tu reserva.
                </span>
                <button
                  type="button"
                  onClick={() => openReservationWithPreset('Mesa en terraza y coctelería', '2')}
                  className="font-semibold text-[#E8C59E] hover:underline cursor-pointer"
                >
                  Apartar mesa junto al bar →
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 7. DEL HUERTO A LA MESA */}
        <section
          id="huerto"
          aria-labelledby="huerto-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                  className="rounded-2xl overflow-hidden border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 shadow-md"
                >
                  <img
                    src="/assets/aistudio/image_465b9dfd_131979da.webp"
                    alt="Canteros elevados de cultivo en el huerto de la azotea de El Jardín de los Milagros"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                  className="rounded-2xl overflow-hidden border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 shadow-md"
                >
                  <img
                    src="/assets/aistudio/image_6433fe10_ce86c8b9.webp"
                    alt="Cuidado y riego del huerto en la azotea bajo el sol de La Habana"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-6 space-y-5"
              >
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  04. Del Huerto en la Azotea a tu Mesa · Frescura Propia
                </p>
                <h2
                  id="huerto-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] leading-[1.12] text-balance"
                >
                  Hierbas recién cortadas en nuestra azotea y salsa picante de la casa
                </h2>
                <p className="text-base text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
                  En lo alto de nuestra casa cuidamos un huerto urbano con canteros elevados donde
                  cultivamos verduras, albahaca, romero y la hierbabuena que perfuma nuestros
                  mojitos y adobos al carbón, además de nuestra cosecha de miel.
                </p>
                <p className="text-base text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
                  Y para los amantes de las emociones intensas, elaboramos nuestra propia{' '}
                  <strong className="text-[#1C241E] dark:text-[#F3EFE6]">
                    Salsa Picante artesanal “El Jardín de los Milagros”
                  </strong>
                  , perfecta para realzar las carnes a la parrilla y disponible para llevar a casa
                  según disponibilidad.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInlineForm((prev) => ({
                        ...prev,
                        dietaryNotes: 'Interesado en probar la salsa picante artesanal de la casa',
                      }));
                      openReservationWithPreset('Almuerzo en familia', '4');
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8522A] dark:text-[#E08A58] hover:underline cursor-pointer"
                  >
                    <Sprout className="w-4 h-4" />
                    Reserva tu mesa y pide probar nuestra salsa picante casera →
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. OCASIONES (Cena en pareja, almuerzo en familia, celebraciones y grupos) */}
        <section
          id="ocasiones"
          aria-labelledby="ocasiones-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#F2ECE1]/40 dark:bg-[#121B15]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  05. Para Cada Momento · Parejas, Familias y Amigos
                </p>
                <h2
                  id="ocasiones-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1"
                >
                  Un rincón pensado para cada ocasión
                </h2>
              </div>

              <button
                type="button"
                onClick={() => openReservationWithPreset('Celebración o grupo', '8')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white text-sm font-semibold px-7 py-3.5 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap self-start lg:self-auto shadow-sm"
              >
                <Users className="w-4 h-4" />
                Reservar para grupo
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7">
              {[
                {
                  icon: <Heart className="w-5 h-5" />,
                  iconStyle:
                    'bg-[#1E462D]/10 dark:bg-[#7AD399]/15 text-[#1E462D] dark:text-[#7AD399]',
                  kicker: '01. Intimidad y calma',
                  title: 'Cena en pareja',
                  desc: 'Mesas resguardadas bajo las plantas, ambiente tranquilo lejos del bullicio, dos buenos cócteles y cortes al carbón recién salidos de las brasas.',
                  cta: 'Reservar mesa para 2 personas →',
                  preset: 'Cena en pareja',
                  guests: '2',
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  iconStyle:
                    'bg-[#1E462D]/10 dark:bg-[#7AD399]/15 text-[#1E462D] dark:text-[#7AD399]',
                  kicker: '02. Trato cercano y familiar',
                  title: 'Almuerzo en familia',
                  desc: 'Parqueo cómodo, acceso sin barreras para sillas de ruedas o coches, recepción profesional y tablas de picadera abundantes para compartir entre todos.',
                  cta: 'Reservar mesa familiar →',
                  preset: 'Almuerzo en familia',
                  guests: '4',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  iconStyle:
                    'bg-[#B8522A]/10 dark:bg-[#E08A58]/15 text-[#B8522A] dark:text-[#E08A58]',
                  kicker: '03. Cumpleaños y encuentros',
                  title: 'Celebraciones y grupos',
                  desc: 'Preparamos mesas largas bajo nuestra terraza cubierta para que celebres con amigos o familia con atención dedicada desde la llegada.',
                  cta: 'Reservar para grupo por WhatsApp →',
                  preset: 'Celebración o grupo',
                  guests: '8',
                },
              ].map((occ, idx) => (
                <motion.article
                  key={occ.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-2xl bg-[#FAF7F2] dark:bg-[#16221A] border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-xl ${occ.iconStyle} flex items-center justify-center mb-4`}
                    >
                      {occ.icon}
                    </div>
                    <p className="text-xs font-semibold text-[#8C4A27] dark:text-[#E08A58]">
                      {occ.kicker}
                    </p>
                    <h3 className="text-2xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1">
                      {occ.title}
                    </h3>
                    <p className="text-sm text-[#526056] dark:text-[#A7B5AC] mt-2.5 leading-relaxed">
                      {occ.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openReservationWithPreset(occ.preset, occ.guests)}
                    className="mt-6 text-left text-xs sm:text-sm font-semibold text-[#1E462D] dark:text-[#7AD399] hover:underline cursor-pointer"
                  >
                    {occ.cta}
                  </button>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* 9. GALERÍA DE FOTOS CON ANIMACIÓN FADE-IN AL ENTRAR EN PANTALLA */}
        <section
          id="galeria"
          aria-labelledby="galeria-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  06. Galería Real · El Jardín y Sus Platos
                </p>
                <h2
                  id="galeria-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1"
                >
                  Asómate a nuestra mesa antes de venir
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#526056] dark:text-[#A7B5AC]">
                Toca cualquier fotografía para verla en pantalla completa
              </p>
            </div>

            <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {GALLERY_PHOTOS.map((photo, index) => (
                <motion.button
                  key={photo.src}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Ampliar foto: ${photo.caption}`}
                  className="group relative rounded-2xl overflow-hidden border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#17221B] text-left h-64 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B8522A] shadow-xs"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <p className="text-[11px] font-medium text-[#E8C59E]">{photo.category}</p>
                    <p className="text-xs sm:text-sm font-semibold leading-snug mt-0.5">
                      {photo.caption}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* 10. OPINIONES VERIFICADAS (Con Panel Tripadvisor 4.7 en CÓDIGO + Carrusel de 3 en 3 con Fade-Out Izquierda / Fade-In Derecha) */}
        <section
          id="opiniones"
          aria-labelledby="opiniones-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#F2ECE1]/60 dark:bg-[#121B15] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                  07. Opiniones Verificadas · ★ 4.7 en Tripadvisor (+149 opiniones)
                </p>
                <h2
                  id="opiniones-heading"
                  className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1"
                >
                  Lo que dicen quienes ya han vivido el jardín
                </h2>
              </div>

              <a
                href={VERIFIED_BUSINESS_INFO.tripadvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#1C241E]/25 dark:border-[#F3EFE6]/25 px-6 py-3 text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:bg-white dark:hover:bg-[#17221B] transition-colors whitespace-nowrap self-start lg:self-auto"
              >
                Ver más en Tripadvisor
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* NATIVE CODED TRIPADVISOR 4.7 SUMMARY WIDGET (Built in code, animated bars) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="mt-8 rounded-3xl bg-white dark:bg-[#16221A] border border-[#1C241E]/12 dark:border-[#F3EFE6]/12 shadow-md p-6 sm:p-8"
              data-testid="coded-tripadvisor-summary"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Big 4.7 Score & Green Bubbles */}
                <div className="lg:col-span-3 rounded-2xl bg-[#F5F7F5] dark:bg-[#0D1410] p-6 text-center flex flex-col items-center justify-center border border-[#1C241E]/8 dark:border-white/10">
                  <span className="font-sans text-5xl sm:text-6xl font-extrabold text-[#1C241E] dark:text-white tracking-tight tabular-nums">
                    {TRIPADVISOR_RATING_BREAKDOWN.overall}
                  </span>
                  <p className="text-sm font-bold text-[#1C241E] dark:text-[#F3EFE6] mt-1.5">
                    {TRIPADVISOR_RATING_BREAKDOWN.label}
                  </p>

                  {/* 5 Green Tripadvisor Rating Circles (4 full + 1 partial) */}
                  <div
                    className="flex items-center gap-1.5 mt-3"
                    aria-label="Calificación 4.7 de 5 en Tripadvisor"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className="w-5 h-5 rounded-full bg-[#008529] inline-block shadow-2xs"
                      />
                    ))}
                    <span className="w-5 h-5 rounded-full border-2 border-[#008529] overflow-hidden inline-flex">
                      <span className="w-[70%] h-full bg-[#008529]" />
                      <span className="w-[30%] h-full bg-transparent" />
                    </span>
                    <span className="text-xs font-semibold text-[#526056] dark:text-[#A7B5AC] ml-1 tabular-nums">
                      ({TRIPADVISOR_RATING_BREAKDOWN.totalReviews})
                    </span>
                  </div>
                </div>

                {/* Middle Column: Animated Rating Distribution Bars (118, 19, 9, 3, 0) */}
                <div className="lg:col-span-5 space-y-3">
                  {TRIPADVISOR_RATING_BREAKDOWN.distribution.map((row, idx) => (
                    <div key={row.label} className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="w-24 font-medium text-[#1C241E] dark:text-[#F3EFE6] shrink-0">
                        {row.label}
                      </span>
                      <div className="flex-1 h-3.5 rounded-full bg-[#E9ECE9] dark:bg-[#0D1410] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.max(row.percentage, row.count > 0 ? 4 : 0)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                          className="h-full rounded-full bg-[#008529]"
                        />
                      </div>
                      <span className="w-9 text-right font-mono font-semibold text-[#1C241E] dark:text-[#F3EFE6] tabular-nums shrink-0">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Column: Service 4.8, Food 4.7, Value 4.6, Atmosphere 4.8 */}
                <div className="lg:col-span-4 lg:border-l border-[#1C241E]/10 dark:border-[#F3EFE6]/10 lg:pl-8 space-y-3.5">
                  {TRIPADVISOR_RATING_BREAKDOWN.subratings.map((sub) => (
                    <div
                      key={sub.label}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-[#1C241E] dark:text-[#F3EFE6]">
                        {sub.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1" aria-hidden="true">
                          {Array.from({ length: sub.fullDots }).map((_, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full bg-[#008529] inline-block"
                            />
                          ))}
                          {sub.halfDot && (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#008529] overflow-hidden inline-flex">
                              <span className="w-1/2 h-full bg-[#008529]" />
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-[#1C241E] dark:text-white w-7 text-right tabular-nums">
                          {sub.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 3-BY-3 REVIEWS CAROUSEL (Fade-out to Left, Fade-in from Right) */}
            <div
              className="mt-10"
              onMouseEnter={() => setReviewsPaused(true)}
              onMouseLeave={() => setReviewsPaused(false)}
              data-testid="reviews-triplet-carousel"
            >
              {/* Carousel Controls Header */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="text-xs sm:text-sm font-medium text-[#526056] dark:text-[#A7B5AC]">
                  Mostrando grupo {reviewPage + 1} de {totalReviewPages} · Reseñas reales en
                  Tripadvisor
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setReviewPage((prev) => (prev - 1 + totalReviewPages) % totalReviewPages)
                    }
                    aria-label="Ver tres opiniones anteriores"
                    className="p-2.5 rounded-full border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] hover:bg-[#1E462D] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewPage((prev) => (prev + 1) % totalReviewPages)}
                    aria-label="Ver tres opiniones siguientes"
                    className="p-2.5 rounded-full border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] hover:bg-[#1E462D] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Animated 3-Card Stage: Fade-out Left (x: -95, opacity: 0) & Fade-in Right (x: 95 -> 0, opacity: 1) */}
              <div className="relative min-h-[270px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`review-triplet-page-${reviewPage}`}
                    initial={{ opacity: 0, x: 95 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -95 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {currentReviewTriplet.map((rev) => (
                      <article
                        key={rev.id}
                        className="rounded-2xl bg-[#FAF7F2] dark:bg-[#16221A] border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs text-[#8C4A27] dark:text-[#E08A58]">
                            <span
                              aria-label="5 de 5 estrellas"
                              className="tracking-widest font-bold"
                            >
                              ★★★★★
                            </span>
                            <span className="font-medium">{rev.highlight}</span>
                          </div>
                          <p className="font-serif-display text-xl sm:text-2xl text-[#1C241E] dark:text-[#F3EFE6] mt-4 leading-snug">
                            “{rev.text}”
                          </p>
                        </div>

                        {/* Presentation Avatar Footer */}
                        <div className="mt-6 pt-4 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10 flex items-center gap-3.5">
                          <div
                            className={`relative w-11 h-11 rounded-full ${rev.avatarBg} border-2 border-[#C5A059]/70 flex items-center justify-center shrink-0 shadow-xs`}
                            aria-hidden="true"
                          >
                            <span className="font-serif-display text-sm font-bold tracking-wider">
                              {rev.initials}
                            </span>
                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1E462D] border border-white flex items-center justify-center text-white">
                              <UserCheck className="w-2.5 h-2.5" />
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F3EFE6]">
                              {rev.author}{' '}
                              <span className="font-normal text-[#526056] dark:text-[#A7B5AC]">
                                ({rev.date})
                              </span>
                            </p>
                            <p className="text-[11px] text-[#526056] dark:text-[#A7B5AC] leading-snug">
                              {rev.source} · {rev.profileTitle}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Page Indicator Pills */}
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2" role="tablist" aria-label="Páginas de reseñas">
                  {Array.from({ length: totalReviewPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={reviewPage === idx}
                      aria-label={`Grupo de reseñas ${idx + 1}`}
                      onClick={() => setReviewPage(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        reviewPage === idx
                          ? 'w-9 bg-[#B8522A]'
                          : 'w-2.5 bg-[#1C241E]/25 dark:bg-white/25 hover:bg-[#B8522A]/60'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openReservationWithPreset('Visita al jardín', '2')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8522A] dark:text-[#E08A58] hover:underline cursor-pointer"
                >
                  Ven a vivirlo en persona: reserva tu mesa hoy →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 11. CÓMO LLEGAR + GRÁFICO RECHARTS DE "HORAS MÁS POPULARES" */}
        <section
          id="como-llegar"
          aria-labelledby="como-llegar-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                08. Ubicación, Ruta Directa y Afluencia · Nuevo Vedado
              </p>
              <h2
                id="como-llegar-heading"
                className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1"
              >
                Cómo llegar sin perderte y mejores horarios para tu visita
              </h2>
              <p className="text-base text-[#526056] dark:text-[#A7B5AC] mt-2.5">
                Como buen jardín secreto, estamos resguardados tras un muro de piedra y vegetación
                tropical. Aquí tienes la fachada exacta, el mapa interactivo y los horarios de menor
                espera.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Address, Directions & Facade Photos */}
              <div className="lg:col-span-6 space-y-5">
                <div className="rounded-2xl bg-[#F2ECE1] dark:bg-[#16221A] border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 p-6 sm:p-7 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-[#8C4A27] dark:text-[#E08A58]">
                      Dirección oficial
                    </p>
                    <p className="text-lg font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1">
                      {VERIFIED_BUSINESS_INFO.address}
                    </p>
                    <p className="text-xs font-mono text-[#526056] dark:text-[#A7B5AC] mt-1 tabular-nums">
                      Coordenadas GPS: 23.1180594, -82.3987792
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10">
                    <p className="text-xs font-semibold text-[#1E462D] dark:text-[#7AD399]">
                      Referencias visuales al llegar a Calle 37:
                    </p>
                    <p className="text-sm text-[#526056] dark:text-[#A7B5AC] mt-1.5 leading-relaxed">
                      Al entrar en <strong>Calle 37 entre 24 y San Juan Bautista</strong> (Nuevo
                      Vedado), busca el <strong>muro de piedra rústica con cerca verde</strong>, el
                      sendero de lajas de piedra con la pizarra de bienvenida en la entrada y en lo
                      alto nuestro <strong>cartel ovalado en hierro forjado</strong>.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm text-[#1C241E] dark:text-[#F3EFE6]">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399] shrink-0" />
                      <span>Todos los días: 12:00 p.m. a 11:00 p.m.</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399] shrink-0" />
                      <span>Parqueo propio disponible</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Accessibility className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399] shrink-0" />
                      <span>Accesible para sillas de ruedas</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#1E462D] dark:text-[#7AD399] shrink-0" />
                      <span className="tabular-nums">
                        <a
                          href={VERIFIED_BUSINESS_INFO.phoneTel}
                          className="font-semibold hover:underline"
                        >
                          {VERIFIED_BUSINESS_INFO.phoneDisplay}
                        </a>{' '}
                        ·{' '}
                        <a
                          href={VERIFIED_BUSINESS_INFO.landlineTel}
                          className="font-semibold hover:underline"
                        >
                          {VERIFIED_BUSINESS_INFO.landlineDisplay}
                        </a>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={VERIFIED_BUSINESS_INFO.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E462D] hover:bg-[#163522] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 transition-colors whitespace-nowrap shadow-xs"
                    >
                      <MapPin className="w-4 h-4" />
                      Abrir en Google Maps
                    </a>
                    <a
                      href={VERIFIED_BUSINESS_INFO.phoneTel}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1C241E]/25 dark:border-[#F3EFE6]/25 px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:bg-white dark:hover:bg-[#0D1410] transition-colors whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar para indicaciones
                    </a>
                  </div>
                </div>

                {/* Real Exterior Reference Photos */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#17221B] shadow-xs">
                    <img
                      src="/assets/aistudio/image_ddc8e195_94a90cae.webp"
                      alt="Sendero de lajas de piedra y puerta de entrada en Calle 37 No. 817"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-40 object-cover"
                    />
                    <p className="p-3 text-xs font-medium text-[#526056] dark:text-[#A7B5AC] bg-white/90 dark:bg-[#16221A]">
                      1. Sendero de lajas y pizarra en Calle 37
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-[#1C241E]/10 dark:border-[#F3EFE6]/10 bg-[#17221B] shadow-xs">
                    <img
                      src="/assets/aistudio/image_8beae361_6fed55c5.webp"
                      alt="Muro de piedra, cerca verde y cartel ovalado de El Jardín de los Milagros"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-40 object-cover"
                    />
                    <p className="p-3 text-xs font-medium text-[#526056] dark:text-[#A7B5AC] bg-white/90 dark:bg-[#16221A]">
                      2. Cerca verde y cartel ovalado en lo alto
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#1C241E]/15 dark:border-[#F3EFE6]/15 bg-[#F2ECE1] dark:bg-[#16221A] h-[460px] lg:h-[560px] shadow-md">
                <iframe
                  title="Ubicación de El Jardín de los Milagros en Nuevo Vedado, La Habana"
                  src={VERIFIED_BUSINESS_INFO.googleMapsEmbed}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* RECHARTS POPULAR HOURS & WAIT-TIME OPTIMIZER CARD */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-[#F2ECE1] dark:bg-[#16221A] border border-[#1C241E]/12 dark:border-[#F3EFE6]/12 p-6 sm:p-8 shadow-sm"
              data-testid="popular-hours-chart-card"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10">
                <div>
                  <p className="text-xs font-semibold text-[#8C4A27] dark:text-[#E08A58] flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    Horas más populares · Planifica tu visita sin esperas
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1">
                    Afluencia habitual en el jardín (12:00 p.m. – 11:00 p.m.)
                  </h3>
                </div>

                {/* Day Filter Buttons */}
                <div
                  className="flex flex-wrap items-center gap-1.5 bg-white/80 dark:bg-[#0D1410] p-1.5 rounded-xl border border-[#1C241E]/10 dark:border-white/10 self-start lg:self-auto"
                  role="group"
                  aria-label="Seleccionar día de la semana"
                >
                  {Object.entries(POPULAR_HOURS_DATA).map(([key, dayObj]) => {
                    const active = key === popularDayKey;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPopularDayKey(key)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#1E462D] text-white shadow-2xs'
                            : 'text-[#526056] dark:text-[#A7B5AC] hover:text-[#1C241E] dark:hover:text-white'
                        }`}
                      >
                        {dayObj.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Recharts BarChart */}
                <div className="lg:col-span-8 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={currentPopularDay.hours}
                      margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 12, fill: darkMode ? '#A7B5AC' : '#526056' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11, fill: darkMode ? '#A7B5AC' : '#526056' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(30, 70, 45, 0.08)' }}
                        contentStyle={{
                          backgroundColor: '#132A1C',
                          borderRadius: '12px',
                          border: '1px solid rgba(232, 197, 158, 0.35)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                        }}
                        formatter={(value, _name, item) => [
                          `${value ?? 0}% de ocupación (${(item?.payload as { status?: string } | undefined)?.status || ''})`,
                          'Afluencia estimada',
                        ]}
                      />
                      <Bar dataKey="occupancy" radius={[8, 8, 2, 2]}>
                        {currentPopularDay.hours.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={
                              entry.occupancy >= 80
                                ? '#B8522A'
                                : entry.occupancy >= 55
                                  ? '#C5A059'
                                  : '#1E462D'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend & Actionable Advice */}
                <div className="lg:col-span-4 space-y-4 bg-white/80 dark:bg-[#0D1410] rounded-2xl p-5 border border-[#1C241E]/10 dark:border-white/10">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#B8522A] shrink-0" />
                      <span className="font-semibold text-[#1C241E] dark:text-[#F3EFE6]">
                        Hora punta (recomendado reservar antes)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#C5A059] shrink-0" />
                      <span className="text-[#526056] dark:text-[#A7B5AC]">
                        Ambiente animado · Moderado
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#1E462D] shrink-0" />
                      <span className="text-[#526056] dark:text-[#A7B5AC]">
                        Horario tranquilo · Sin esperas
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1C241E]/10 dark:border-white/10 space-y-1.5 text-xs text-[#526056] dark:text-[#A7B5AC]">
                    <p>
                      <strong className="text-[#1C241E] dark:text-white">Horas pico:</strong>{' '}
                      {currentPopularDay.peakNote}
                    </p>
                    <p>
                      <strong className="text-[#1E462D] dark:text-[#7AD399]">
                        Sin esperas:
                      </strong>{' '}
                      {currentPopularDay.quietNote}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openReservationWithPreset('Reserva en hora punta', '2')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white text-xs font-semibold py-2.5 px-4 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Asegurar mesa sin espera
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 12. PREGUNTAS FRECUENTES */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="py-20 sm:py-28 border-b border-[#1C241E]/10 dark:border-[#F3EFE6]/10"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#8C4A27] dark:text-[#E08A58]">
                09. Preguntas Frecuentes · Información Útil
              </p>
              <h2
                id="faq-heading"
                className="text-3xl sm:text-5xl font-semibold text-[#1C241E] dark:text-[#F3EFE6] mt-1"
              >
                Todo lo que necesitas saber antes de tu visita
              </h2>
            </div>

            <div className="mt-9 divide-y divide-[#1C241E]/10 dark:divide-[#F3EFE6]/10 border-y border-[#1C241E]/10 dark:border-[#F3EFE6]/10">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 text-left py-2.5 cursor-pointer"
                    >
                      <span className="text-lg sm:text-xl font-semibold text-[#1C241E] dark:text-[#F3EFE6]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#526056] dark:text-[#A7B5AC] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pt-2 pb-3 text-sm sm:text-base text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 13. LLAMADA FINAL Y FORMULARIO DIRECTO DE RESERVA POR WHATSAPP */}
        <section
          id="reservar"
          aria-labelledby="llamada-final-heading"
          className="py-20 sm:py-28 bg-[#163522] text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <img
                  src={VERIFIED_BUSINESS_INFO.logo}
                  alt="Logo de El Jardín de los Milagros"
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
                />
                <p className="text-xs font-semibold tracking-wider text-[#E8C59E]">
                  10. Reserva Tu Experiencia · Te Esperamos Hoy
                </p>
                <h2
                  id="llamada-final-heading"
                  className="text-3xl sm:text-5xl font-semibold text-white leading-tight text-balance"
                >
                  Tu mesa bajo la sombra del jardín ya está lista.
                </h2>
                <p className="text-base text-white/85 leading-relaxed">
                  Escríbenos por WhatsApp o llámanos en un toque para apartar tu mesa, encargar
                  comida para llevar o consultar los cortes al carbón disponibles hoy.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openReservationWithPreset('Cena en el jardín', '2')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white font-semibold px-8 py-4 text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reservar
                  </button>

                  <a
                    href={VERIFIED_BUSINESS_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-4 text-sm sm:text-base transition-colors whitespace-nowrap"
                  >
                    Instagram ({VERIFIED_BUSINESS_INFO.instagramHandle})
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {recentReservations.length > 0 && (
                  <div
                    className="mt-4 rounded-xl bg-white/10 border border-white/20 p-4 text-xs text-white/90 space-y-1.5"
                    data-testid="recent-reservations-list"
                  >
                    <p className="font-semibold text-[#E8C59E]">
                      Solicitudes preparadas en esta sesión ({recentReservations.length}):
                    </p>
                    {recentReservations.map((r, i) => (
                      <p key={i}>
                        • {r.name} · {r.guests} pers. · {r.date} ({r.time}) —{' '}
                        <a
                          href={r.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold"
                        >
                          Enviar por WhatsApp
                        </a>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Pre-filled Reservation Form */}
              <div className="lg:col-span-7 rounded-2xl bg-[#FAF7F2] dark:bg-[#0D1410] text-[#1C241E] dark:text-[#F3EFE6] p-6 sm:p-9 shadow-2xl border border-white/10">
                <h3 className="text-2xl sm:text-3xl font-semibold">
                  Envía tu reserva directa por WhatsApp ({VERIFIED_BUSINESS_INFO.phoneDisplay})
                </h3>
                <p className="text-xs sm:text-sm text-[#526056] dark:text-[#A7B5AC] mt-1">
                  Sin esperas ni intermediarios: completa tus datos y se abrirá un mensaje listo con
                  nombre, fecha, hora y número de personas.
                </p>

                <form onSubmit={handleInlineSubmit} className="mt-6 space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inline-name" className="block text-xs font-semibold mb-1.5">
                        Tu nombre *
                      </label>
                      <input
                        id="inline-name"
                        type="text"
                        value={inlineForm.name}
                        onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
                        placeholder="Ej. Claudia Domínguez"
                        className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] px-3.5 py-2.5 text-sm"
                      />
                      {inlineErrors.name && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
                          {inlineErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="inline-guests" className="block text-xs font-semibold mb-1.5">
                        Número de personas *
                      </label>
                      <input
                        id="inline-guests"
                        type="number"
                        min={1}
                        max={60}
                        value={inlineForm.guests}
                        onChange={(e) => setInlineForm({ ...inlineForm, guests: e.target.value })}
                        className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] px-3.5 py-2.5 text-sm tabular-nums"
                      />
                      {inlineErrors.guests && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
                          {inlineErrors.guests}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inline-date" className="block text-xs font-semibold mb-1.5">
                        Fecha *
                      </label>
                      <input
                        id="inline-date"
                        type="date"
                        value={inlineForm.date}
                        onChange={(e) => setInlineForm({ ...inlineForm, date: e.target.value })}
                        className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] px-3.5 py-2.5 text-sm tabular-nums"
                      />
                      {inlineErrors.date && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
                          {inlineErrors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="inline-time" className="block text-xs font-semibold mb-1.5">
                        Hora (12:00 p.m. – 11:00 p.m.) *
                      </label>
                      <select
                        id="inline-time"
                        value={inlineForm.time}
                        onChange={(e) => setInlineForm({ ...inlineForm, time: e.target.value })}
                        className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] px-3.5 py-2.5 text-sm"
                      >
                        <option value="12:30 p.m.">12:30 p.m.</option>
                        <option value="1:30 p.m.">1:30 p.m.</option>
                        <option value="2:30 p.m.">2:30 p.m.</option>
                        <option value="6:00 p.m.">6:00 p.m.</option>
                        <option value="7:30 p.m.">7:30 p.m.</option>
                        <option value="8:00 p.m.">8:00 p.m.</option>
                        <option value="8:30 p.m.">8:30 p.m.</option>
                        <option value="9:00 p.m.">9:00 p.m.</option>
                        <option value="9:30 p.m.">9:30 p.m.</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inline-notes" className="block text-xs font-semibold mb-1.5">
                      Notas adicionales (alergias, opciones veganas/sin gluten o platos a consultar)
                    </label>
                    <input
                      id="inline-notes"
                      type="text"
                      value={inlineForm.dietaryNotes}
                      onChange={(e) =>
                        setInlineForm({ ...inlineForm, dietaryNotes: e.target.value })
                      }
                      placeholder="Ej. Mesa en el jardín, consultar disponibilidad de carnes al carbón..."
                      className="w-full rounded-xl border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 bg-white dark:bg-[#16221A] px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] hover:bg-[#9E431F] text-white font-semibold px-7 py-3.5 text-sm transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Generar mensaje de WhatsApp
                    </button>
                    <a
                      href={VERIFIED_BUSINESS_INFO.phoneTel}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1C241E]/20 dark:border-[#F3EFE6]/20 px-5 py-3.5 text-sm font-semibold hover:bg-[#1C241E]/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar al {VERIFIED_BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </form>

                {inlineResult && (
                  <div
                    className="mt-5 rounded-xl bg-[#EBF3ED] dark:bg-[#1D3124] border border-[#1E462D]/30 p-4 space-y-2.5"
                    data-testid="inline-reservation-ready"
                  >
                    <p className="text-xs font-semibold text-[#1E462D] dark:text-[#8CE0A6] flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      ¡Listo! Haz clic debajo para enviar tu solicitud en WhatsApp:
                    </p>
                    <p className="text-xs text-[#1C241E] dark:text-[#F3EFE6] whitespace-pre-line">
                      {inlineResult.message}
                    </p>
                    <a
                      href={inlineResult.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#1E462D] text-white text-xs font-semibold px-5 py-2.5 hover:bg-[#163522] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar ahora por WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 14. FOOTER CON LOGO OFICIAL */}
      <footer className="bg-[#FAF7F2] dark:bg-[#090E0B] border-t border-[#1C241E]/10 dark:border-[#F3EFE6]/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={VERIFIED_BUSINESS_INFO.logo}
                alt="Logo oficial de El Jardín de los Milagros"
                className="h-12 sm:h-14 w-auto object-contain shrink-0"
              />
              <div>
                <p className="font-serif-display text-2xl font-bold text-[#1C241E] dark:text-[#F3EFE6]">
                  {VERIFIED_BUSINESS_INFO.name}
                </p>
                <p className="font-serif-display italic text-xs text-[#8C4A27] dark:text-[#E8C59E]">
                  “{VERIFIED_BUSINESS_INFO.motto}”
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#526056] dark:text-[#A7B5AC] leading-relaxed">
              {VERIFIED_BUSINESS_INFO.type}. Especialidad en carnes al carbón, mesa de entrantes y
              coctelería en un patio natural en Nuevo Vedado.
            </p>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-[#526056] dark:text-[#A7B5AC]">
            <p className="font-semibold text-[#1C241E] dark:text-[#F3EFE6]">Dirección y Horario</p>
            <p>{VERIFIED_BUSINESS_INFO.address}</p>
            <p>Horario: {VERIFIED_BUSINESS_INFO.hours}</p>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-[#526056] dark:text-[#A7B5AC]">
            <p className="font-semibold text-[#1C241E] dark:text-[#F3EFE6]">
              Reservas y Redes Oficiales
            </p>
            <p>
              WhatsApp / Móvil:{' '}
              <a
                href={VERIFIED_BUSINESS_INFO.phoneTel}
                className="font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:underline tabular-nums"
              >
                {VERIFIED_BUSINESS_INFO.phoneDisplay}
              </a>{' '}
              · Fijo:{' '}
              <a
                href={VERIFIED_BUSINESS_INFO.landlineTel}
                className="font-semibold text-[#1C241E] dark:text-[#F3EFE6] hover:underline tabular-nums"
              >
                {VERIFIED_BUSINESS_INFO.landlineDisplay}
              </a>
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <a
                href={VERIFIED_BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#B8522A] dark:text-[#E08A58] hover:underline"
              >
                Instagram ({VERIFIED_BUSINESS_INFO.instagramHandle})
              </a>
              <a
                href={VERIFIED_BUSINESS_INFO.tripadvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1E462D] dark:text-[#7AD399] hover:underline"
              >
                Tripadvisor (★ 4.7)
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE EN TELÉFONO Y TABLET (< lg, donde no está en el header) */}
      <div className="lg:hidden fixed bottom-3 left-4 right-4 z-40 pointer-events-none flex justify-center">
        <button
          type="button"
          onClick={() => openReservationWithPreset('Reserva desde móvil', '2')}
          className="pointer-events-auto w-full max-w-sm inline-flex items-center justify-center gap-2 rounded-full bg-[#B8522A] text-white font-semibold py-3.5 px-6 text-sm shadow-xl border border-white/20 cursor-pointer whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" />
          Reservar · {VERIFIED_BUSINESS_INFO.phoneDisplay}
        </button>
      </div>

      {/* MODAL DE RESERVA */}
      <ReservationModal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        initialOccasion={modalOccasion}
        initialGuests={modalGuests}
        onReservationCreated={(newRes) => setRecentReservations((prev) => [newRes, ...prev])}
      />

      {/* MODAL DE PIZARRA EN CUP */}
      {showChalkboardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Fotografía de la pizarra del menú en CUP"
          onClick={() => setShowChalkboardModal(false)}
        >
          <div
            className="relative max-w-lg w-full rounded-2xl bg-[#FAF7F2] dark:bg-[#151F19] p-5 border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-lg font-semibold">
                Pizarra del jardín (Precios de referencia en CUP)
              </h3>
              <button
                type="button"
                onClick={() => setShowChalkboardModal(false)}
                aria-label="Cerrar pizarra"
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src="/assets/aistudio/image_2043e750.png"
              alt="Pizarra verde con el menú y precios en CUP de El Jardín de los Milagros"
              className="w-full max-h-[65vh] object-contain rounded-xl bg-black"
            />
            <p className="text-xs text-[#526056] dark:text-[#A7B5AC] mt-3">
              Recuerda: la carta y los precios pueden variar según la disponibilidad del día.
              Confirma siempre al reservar por WhatsApp al +53 5 2686237.
            </p>
          </div>
        </div>
      )}

      {/* LIGHTBOX PARA LA GALERÍA */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotografías"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
              );
            }}
            aria-label="Foto anterior"
            className="absolute left-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_PHOTOS[lightboxIndex].src}
              alt={GALLERY_PHOTOS[lightboxIndex].alt}
              className="w-full max-h-[78vh] object-contain rounded-xl"
            />
            <p className="text-sm text-white font-medium">
              {GALLERY_PHOTOS[lightboxIndex].caption}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % GALLERY_PHOTOS.length);
            }}
            aria-label="Foto siguiente"
            className="absolute right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
