import type { MenuItem } from '../utils/restaurantLogic';

export const VERIFIED_BUSINESS_INFO = {
  name: 'El Jardín de los Milagros',
  motto: 'El sitio perfecto para el momento ideal',
  logo: '/assets/aistudio/Gemini_Generated_Image_73t7bn73t7bn73t7_550ea7ec.webp',
  artisanalBottlePhoto: '/assets/aistudio/image_5e8285aa_5bcf0e99.webp',
  brochurePhoto: '/assets/aistudio/image_1b89c37b.png',
  type: 'Restaurante de cocina caribeña, cubana, latina e internacional',
  address:
    'Calle 37 No. 817 entre 24 y San Juan Bautista, Nuevo Vedado, Plaza de la Revolución, La Habana 10607, Cuba',
  coordinates: {
    lat: 23.1180594,
    lng: -82.3987792,
  },
  hours: 'Todos los días de 12:00 p.m. a 11:00 p.m. (almuerzo, cena y noche)',
  phoneDisplay: '+53 5 2686237',
  phoneTel: 'tel:+5352686237',
  landlineDisplay: '78811053',
  landlineTel: 'tel:+5378811053',
  whatsappNumber: '5352686237',
  whatsappBaseUrl: 'https://wa.me/5352686237',
  instagramUrl: 'https://www.instagram.com/eljardindelosmilagros_cuba/',
  instagramHandle: '@eljardindelosmilagros_cuba',
  tripadvisorUrl:
    'https://www.tripadvisor.com/Restaurant_Review-g147271-d4053450-Reviews-El_Jardin_de_Los_Milagros-Havana_Ciudad_de_la_Habana_Province_Cuba.html',
  googleMapsLink: 'https://maps.app.goo.gl/NjkqJCRaKpfhd22J7',
  googleMapsEmbed: 'https://www.google.com/maps?q=23.1180594,-82.3987792&output=embed',
  tripadvisorRating: '4.7 en Tripadvisor',
  tripadvisorReviewsCount: '+149 opiniones',
};

export const TRIPADVISOR_RATING_BREAKDOWN = {
  overall: 4.7,
  label: 'Muy Bueno · Very Good',
  totalReviews: 149,
  distribution: [
    { label: 'Excelente', enLabel: 'Excellent', count: 118, percentage: 79.2 },
    { label: 'Muy bueno', enLabel: 'Good', count: 19, percentage: 12.8 },
    { label: 'Regular', enLabel: 'Average', count: 9, percentage: 6.0 },
    { label: 'Malo', enLabel: 'Poor', count: 3, percentage: 2.0 },
    { label: 'Pésimo', enLabel: 'Terrible', count: 0, percentage: 0 },
  ],
  subratings: [
    { label: 'Servicio', enLabel: 'Service', score: 4.8, fullDots: 5, halfDot: false },
    { label: 'Comida', enLabel: 'Food', score: 4.7, fullDots: 4, halfDot: true },
    { label: 'Calidad / Precio', enLabel: 'Value', score: 4.6, fullDots: 4, halfDot: true },
    { label: 'Atmósfera', enLabel: 'Atmosphere', score: 4.8, fullDots: 5, halfDot: false },
  ],
};

export interface BarCategory {
  id: string;
  label: string;
  subtitle: string;
  items: Array<{
    name: string;
    detail?: string;
    priceCUP: string;
    isHighlight?: boolean;
  }>;
}

export const BAR_MENU_CATEGORIES: BarCategory[] = [
  {
    id: 'cocteleria',
    label: 'Coctelería',
    subtitle: 'Preparados al momento en nuestra barra con hierbabuena fresca del huerto',
    items: [
      { name: 'Mojito de la Casa', detail: 'Con hierbabuena recién cortada en la azotea', priceCUP: '850 CUP', isHighlight: true },
      { name: 'Piña Colada', detail: 'Cremosa y tropical', priceCUP: '890 CUP', isHighlight: true },
      { name: 'Margarita', detail: 'Clásica con borde cítrico', priceCUP: '890 CUP' },
      { name: 'Gin Tonic', detail: 'Refrescante y aromático', priceCUP: '850 CUP' },
      { name: 'Tinto de Verano', detail: 'Ideal para tardes en la terraza', priceCUP: '850 CUP' },
      { name: 'Daiquirí', detail: 'Receta clásica habanera frappé', priceCUP: '750 CUP', isHighlight: true },
      { name: 'Caipiriña', detail: 'Lima fresca macerada', priceCUP: '750 CUP' },
      { name: 'Cuba Libre', detail: 'Ron cubano, cola y limón criollo', priceCUP: '590 CUP' },
      { name: 'Sangría', detail: 'Vino tinto y toque frutal', priceCUP: '550 CUP', isHighlight: true },
      { name: 'Caipirosca', detail: 'Vodka y lima fresca', priceCUP: '550 CUP' },
      { name: 'Screw Driver', detail: 'Vodka y jugo natural', priceCUP: '550 CUP' },
      { name: 'Servicio Michelada', detail: 'Con limón, sal y toque picante', priceCUP: '550 CUP' },
      { name: 'Cubata', detail: 'Ron añejo y refresco cola', priceCUP: '430 CUP' },
      { name: 'Servicio Chelada', detail: 'Limón criollo y borde escarchado', priceCUP: '390 CUP' },
    ],
  },
  {
    id: 'rones-vinos',
    label: 'Rones y Vinos',
    subtitle: 'Selección de rones cubanos de tradición y copas de vino para maridar las brasas',
    items: [
      { name: 'Ron Selección de Maestros', detail: 'Trago · Triple barrel', priceCUP: '950 CUP', isHighlight: true },
      { name: 'Ron Santiago 12 Años', detail: 'Trago · Añejo superior oriental', priceCUP: '890 CUP', isHighlight: true },
      { name: 'Ron Santiago 11 Años', detail: 'Trago · Cuna del ron ligero', priceCUP: '850 CUP' },
      { name: 'Havana Club 7 Años', detail: 'Trago · Clásico oscuro cubano', priceCUP: '530 CUP', isHighlight: true },
      { name: 'Havana Club Reserva', detail: 'Trago · Suave y equilibrado', priceCUP: '450 CUP' },
      { name: 'Copa de Vino', detail: 'Maridaje para carnes al carbón', priceCUP: '550 CUP', isHighlight: true },
    ],
  },
  {
    id: 'whisky',
    label: 'Whisky (Tragos)',
    subtitle: 'Etiquetas internacionales servidas en las rocas o a tu gusto',
    items: [
      { name: "Jack Daniel's", detail: 'Tennessee Whiskey', priceCUP: '1 250 CUP', isHighlight: true },
      { name: "Buchanan's De Luxe", detail: 'Blended Scotch 12 Años', priceCUP: '1 100 CUP', isHighlight: true },
      { name: 'The Glenlivet', detail: 'Single Malt Scotch', priceCUP: '950 CUP' },
      { name: 'Johnnie Walker Black Label', detail: '12 Años', priceCUP: '790 CUP', isHighlight: true },
      { name: 'Chivas Regal 12 Años', detail: 'Blended Scotch', priceCUP: '750 CUP' },
      { name: "Ballantine's 12 Años", detail: 'Añejo escocés', priceCUP: '710 CUP' },
      { name: 'Jameson', detail: 'Irish Whiskey', priceCUP: '610 CUP' },
      { name: 'Johnnie Walker Red Label', detail: 'Trago clásico', priceCUP: '550 CUP' },
      { name: "Ballantine's Finest", detail: 'Scotch Whisky', priceCUP: '490 CUP' },
      { name: 'Black & White', detail: 'Blended Scotch', priceCUP: '440 CUP' },
    ],
  },
  {
    id: 'licores-destilados',
    label: 'Cremas, Vodka y Tequila',
    subtitle: 'Digestivos para después de la cena, vodkas y tequilas',
    items: [
      { name: 'Ciroc', detail: 'Vodka Premium (Trago)', priceCUP: '750 CUP', isHighlight: true },
      { name: 'Baileys', detail: 'Crema irlandesa (Trago)', priceCUP: '730 CUP', isHighlight: true },
      { name: 'Amaretto', detail: 'Licor de almendras (Trago)', priceCUP: '720 CUP' },
      { name: 'Olmeca Reposado', detail: 'Tequila (Trago)', priceCUP: '650 CUP', isHighlight: true },
      { name: 'Absolut', detail: 'Vodka sueco (Trago)', priceCUP: '610 CUP' },
      { name: 'Jägermeister', detail: 'Licor de 56 hierbas (Trago)', priceCUP: '550 CUP' },
      { name: 'Olmeca Blanco', detail: 'Tequila (Trago)', priceCUP: '550 CUP' },
      { name: 'Krova', detail: 'Vodka (Trago)', priceCUP: '550 CUP' },
    ],
  },
  {
    id: 'liquidos-cafes',
    label: 'Cervezas, Líquidos y Cafés',
    subtitle: 'Para refrescar el almuerzo en el jardín o cerrar la sobremesa',
    items: [
      { name: 'Limonada de la Casa', detail: 'Con hierbabuena fresca', priceCUP: '970 CUP', isHighlight: true },
      { name: 'Cerveza Gama Alta', detail: 'Bien fría', priceCUP: '750 CUP', isHighlight: true },
      { name: 'Cerveza Gama Media', detail: 'Bien fría', priceCUP: '500 CUP' },
      { name: 'Refrescos', detail: 'Variedad disponible', priceCUP: '590 CUP' },
      { name: 'Energizante', detail: 'Lata fría', priceCUP: '590 CUP' },
      { name: 'Aguas', detail: 'Natural o gaseada', priceCUP: '290 CUP' },
      { name: 'Frappuccino', detail: 'Especialidad de café frío', priceCUP: '800 CUP', isHighlight: true },
      { name: 'Café Bombón', detail: 'Expresso con leche condensada', priceCUP: '700 CUP', isHighlight: true },
      { name: 'Cappuccino', detail: 'Espuma cremosa', priceCUP: '550 CUP' },
      { name: 'Café Cortado', detail: 'Tradicional cubano', priceCUP: '450 CUP' },
      { name: 'Café Expresso / Americano', detail: 'Recién colado', priceCUP: '350 CUP' },
    ],
  },
];

export const POPULAR_HOURS_DATA: Record<
  string,
  {
    label: string;
    peakNote: string;
    quietNote: string;
    hours: Array<{ hour: string; occupancy: number; status: string }>;
  }
> = {
  'viernes-sabado': {
    label: 'Viernes y Sábado',
    peakNote: 'Mayor movimiento: 1:30 p.m. – 3:00 p.m. y 7:30 p.m. – 10:00 p.m.',
    quietNote: 'Tarde tranquila sin esperas: 4:00 p.m. – 6:30 p.m.',
    hours: [
      { hour: '12p', occupancy: 42, status: 'Moderado' },
      { hour: '1p', occupancy: 76, status: 'Concurrido' },
      { hour: '2p', occupancy: 88, status: 'Hora punta de almuerzo' },
      { hour: '3p', occupancy: 68, status: 'Ambiente animado' },
      { hour: '4p', occupancy: 38, status: 'Tranquilo · Sin espera' },
      { hour: '5p', occupancy: 34, status: 'Tranquilo · Ideal coctelería' },
      { hour: '6p', occupancy: 52, status: 'Moderado' },
      { hour: '7p', occupancy: 82, status: 'Concurrido' },
      { hour: '8p', occupancy: 96, status: 'Hora punta de cena' },
      { hour: '9p', occupancy: 92, status: 'Hora punta de cena' },
      { hour: '10p', occupancy: 64, status: 'Noche de tragos' },
    ],
  },
  domingo: {
    label: 'Domingo Familiar',
    peakNote: 'Mayor movimiento en almuerzo familiar: 1:00 p.m. – 4:00 p.m.',
    quietNote: 'Tarde-noche relajada: 5:30 p.m. – 9:30 p.m.',
    hours: [
      { hour: '12p', occupancy: 55, status: 'Moderado' },
      { hour: '1p', occupancy: 89, status: 'Hora punta familiar' },
      { hour: '2p', occupancy: 95, status: 'Hora punta familiar' },
      { hour: '3p', occupancy: 84, status: 'Sobremesa animada' },
      { hour: '4p', occupancy: 58, status: 'Moderado' },
      { hour: '5p', occupancy: 40, status: 'Tranquilo · Sin espera' },
      { hour: '6p', occupancy: 48, status: 'Tranquilo' },
      { hour: '7p', occupancy: 66, status: 'Moderado' },
      { hour: '8p', occupancy: 74, status: 'Concurrido' },
      { hour: '9p', occupancy: 55, status: 'Moderado' },
      { hour: '10p', occupancy: 35, status: 'Tranquilo' },
    ],
  },
  'lunes-jueves': {
    label: 'Lunes a Jueves',
    peakNote: 'Cenas acogedoras entre 7:30 p.m. y 9:30 p.m.',
    quietNote: 'Amplia disponibilidad durante el mediodía y la tarde',
    hours: [
      { hour: '12p', occupancy: 32, status: 'Tranquilo · Sin espera' },
      { hour: '1p', occupancy: 58, status: 'Moderado' },
      { hour: '2p', occupancy: 64, status: 'Moderado' },
      { hour: '3p', occupancy: 45, status: 'Tranquilo' },
      { hour: '4p', occupancy: 28, status: 'Muy tranquilo' },
      { hour: '5p', occupancy: 30, status: 'Muy tranquilo' },
      { hour: '6p', occupancy: 44, status: 'Moderado' },
      { hour: '7p', occupancy: 68, status: 'Ambiente ideal' },
      { hour: '8p', occupancy: 78, status: 'Concurrido' },
      { hour: '9p', occupancy: 70, status: 'Ambiente ideal' },
      { hour: '10p', occupancy: 42, status: 'Tranquilo' },
    ],
  },
};

export const HERO_SCENES = [
  {
    id: 'jardin',
    label: 'Terraza',
    image: '/assets/aistudio/image_06da6fac_02387b20.webp',
    alt: 'Terraza cubierta de helechos y enredaderas con mesas vestidas y bar completo en El Jardín de los Milagros',
    caption: 'Terraza principal bajo pérgola natural y bar completo',
  },
  {
    id: 'brasas',
    label: 'Al Carbón',
    image: '/assets/aistudio/image_c52e79d0_b412d2da.webp',
    alt: 'Cortes de carne al carbón fileteados en tabla de madera con chimichurri del huerto y mariquitas',
    caption: 'Especialidad de la casa: cortes al carbón vegetal y hierbas del huerto',
  },
  {
    id: 'patio',
    label: 'El Patio',
    image: '/assets/aistudio/image_9f088b63.png',
    alt: 'Patio interior soleado con banco de hierro forjado y plantas tropicales',
    caption: 'Rincón íntimo rodeado de vegetación tropical en Nuevo Vedado',
  },
];

export const EXPERIENCE_CAROUSEL_SLIDES = [
  {
    id: 'slide-terraza',
    tag: '01 · El Jardín Principal',
    title: 'Terraza bajo pérgola de helechos y enredaderas',
    description:
      'Mesas vestidas al aire libre bajo un techo vivo de vegetación tropical, con brisa fresca y nuestra barra de madera al fondo.',
    image: '/assets/aistudio/image_06da6fac_02387b20.webp',
    alt: 'Terraza cubierta de vegetación con mesas vestidas en El Jardín de los Milagros',
  },
  {
    id: 'slide-patio',
    tag: '02 · Rincón Íntimo',
    title: 'El patio interior de piedra y plantas',
    description:
      'Un ambiente tranquilo y familiar que hace sentir a cada visitante como en el jardín de su propia casa en Nuevo Vedado.',
    image: '/assets/aistudio/image_9f088b63.png',
    alt: 'Patio interior con banco de hierro forjado y mesa servida entre plantas',
  },
  {
    id: 'slide-brasas',
    tag: '03 · Nuestra Especialidad',
    title: 'Carnes al carbón con hierbas recién cortadas',
    description:
      'Cortes asados al momento sobre brasas de carbón vegetal, servidos en tabla de madera con chimichurri del huerto y mariquitas.',
    image: '/assets/aistudio/image_c52e79d0_b412d2da.webp',
    alt: 'Cortes de carne al carbón sobre tabla de madera con chimichurri y chips de vianda',
  },
  {
    id: 'slide-entrantes',
    tag: '04 · Para Compartir',
    title: 'Mesa de entrantes y Tabla Los Milagros',
    description:
      'Croquetas de la casa, chorizos al carbón, chicharrones crujientes, dados de queso y salsas artesanales al centro de la mesa.',
    image: '/assets/aistudio/image_e9af6048_d5eb4a19.webp',
    alt: 'Tabla de entrantes abundante para compartir en El Jardín de los Milagros',
  },
  {
    id: 'slide-bar',
    tag: '05 · Bar y Sello de la Casa',
    title: 'Coctelería con hierbabuena y picante artesanal',
    description:
      'Tragos preparados con hierbabuena fresca de la azotea y nuestra emblemática botella artesanal vestida en yute.',
    image: '/assets/aistudio/image_6691ed9d_52d8fb0c.webp',
    alt: 'Coctel frío con hierbabuena junto a botella artesanal de El Jardín de los Milagros',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'tabla-milagros',
    name: 'Tabla Los Milagros (Mesa de Entrantes)',
    category: 'entrantes',
    categoryLabel: 'Picadera del Jardín · Para Compartir',
    description:
      'Nuestra picadera insignia al centro de la mesa: chorizos asados, chicharrones crujientes, croquetas de la casa, dados de queso y jamón, mariquitas de plátano y salsa de la casa.',
    boardPriceCUP: '3 870 CUP',
    priceStatus: 'Precio en pizarra · Para compartir',
    image: '/assets/aistudio/image_95691c2d_596b2523.webp',
    imageAlt:
      'Tabla Los Milagros con chorizos al carbón, chicharrones, croquetas de la casa, queso, mariquitas y salsas sobre madera',
    isSpecialty: true,
    dietary: ['carbon'],
  },
  {
    id: 'cortes-carbon',
    name: 'Cortes al Carbón con Chimichurri del Huerto',
    category: 'carbon',
    categoryLabel: 'Especialidad de la Casa · A la Parrilla',
    description:
      'Jugosos cortes de cerdo y res asados lentamente a las brasas de carbón vegetal, coronados con picadillo de hierbas frescas, chips de viandas crujientes y vegetales.',
    boardPriceCUP: '3 370 CUP / lb',
    priceStatus: 'Costilla o cogote al carbón · Según peso',
    image: '/assets/aistudio/image_c52e79d0_b412d2da.webp',
    imageAlt:
      'Carnes al carbón fileteadas en tabla de madera con chimichurri de hierbas frescas y chips de boniato y plátano',
    isSpecialty: true,
    dietary: ['carbon', 'sin-gluten'],
  },
  {
    id: 'bife-parrilla',
    name: 'Corte de Res a las Brasas',
    category: 'carbon',
    categoryLabel: 'Especialidad · A la Parrilla',
    description:
      'Corte de res sellado al carbón en su punto exacto de jugosidad, servido en tabla rústica con papas fritas doradas y puré cremoso de vianda.',
    boardPriceCUP: 'Consultar en pizarra',
    priceStatus: 'Según corte disponible del día',
    image: '/assets/aistudio/image_aad0e8bf_e15a422c.webp',
    imageAlt: 'Corte de res asado al carbón sobre tabla de madera con papas fritas y puré',
    isSpecialty: true,
    dietary: ['carbon', 'sin-gluten'],
  },
  {
    id: 'pollo-conejo-carbon',
    name: 'Asado al Carbón al Romero y Ajo',
    category: 'carbon',
    categoryLabel: 'Especialidad · A la Parrilla',
    description:
      'Asado entero al carbón con piel dorada y crujiente, perfumado con romero recién cortado, cabeza de ajo asado, papas salteadas, congrí oriental y ensalada fresca.',
    boardPriceCUP: '2 570 CUP / lb',
    priceStatus: 'Asado al carbón vegetal · Según peso',
    image: '/assets/aistudio/image_912c24cc_771f436f.webp',
    imageAlt: 'Asado al carbón en tabla de madera con cabeza de ajo asado, romero fresco y salsa',
    isSpecialty: true,
    dietary: ['carbon', 'sin-gluten'],
  },
  {
    id: 'langosta-grillada',
    name: 'Langosta al Gusto a la Brasa',
    category: 'especialidades',
    categoryLabel: 'Sugerencia del Chef · Del Mar',
    description:
      'Cola de langosta caribeña dorada a la plancha y brasa con mantequilla, limón criollo y rodajas frescas de pepino.',
    boardPriceCUP: '3 890 CUP / lb',
    priceStatus: 'Sugerencia fresca del mar',
    image: '/assets/aistudio/image_31019da2_d2b04eb1.webp',
    imageAlt: 'Cola de langosta grillada servida en plato blanco con pepino y limón',
    dietary: ['carbon', 'sin-gluten'],
  },
  {
    id: 'berenjena-huerto',
    name: 'Berenjena Rellena con Albahaca del Huerto',
    category: 'especialidades',
    categoryLabel: 'Cocina Vegetariana · Del Huerto',
    description:
      'Berenjena tierna rellena de vegetales salteados, coronada con romero y ramillete de albahaca fresca cosechada en nuestra azotea sobre reducción de remolacha.',
    boardPriceCUP: 'Consultar al reservar',
    priceStatus: 'Opción vegetariana y vegana',
    image: '/assets/aistudio/image_1ee0bc0a_0e919dc2.webp',
    imageAlt: 'Berenjena rellena de vegetales con albahaca fresca y copa de vino tinto',
    dietary: ['vegetariano', 'vegano', 'sin-gluten'],
  },
  {
    id: 'pescado-plancha',
    name: 'Filete de Pescado a la Plancha',
    category: 'especialidades',
    categoryLabel: 'Sugerencia del Chef · Sin Gluten',
    description:
      'Filete de pescado fresco hecho a la plancha con aceite de oliva y ajo, acompañado de habichuelas tiernas del huerto y ají cachucha.',
    boardPriceCUP: '2 890 CUP / lb',
    priceStatus: 'Pesca fresca del día',
    image: '/assets/aistudio/image_8d9639d3_94382578.webp',
    imageAlt: 'Filete de pescado a la plancha con habichuelas verdes y ají cachucha',
    dietary: ['sin-gluten'],
  },
  {
    id: 'frutas-tropicales',
    name: 'Plato de Frutas Tropicales con Menta Fresca',
    category: 'entrantes',
    categoryLabel: 'Fresco y Natural · 100% Vegano',
    description:
      'Selección fresca del día con fruta bomba (papaya), cascos de guayaba y piña dulce perfumada con hojas de hierbabuena del huerto.',
    boardPriceCUP: 'Consultar al reservar',
    priceStatus: 'Fruta natural de estación',
    image: '/assets/aistudio/image_efd24b14_0742dd37.webp',
    imageAlt: 'Plato de fruta bomba, guayaba y piña con hojas de menta fresca',
    dietary: ['vegetariano', 'vegano', 'sin-gluten'],
  },
  {
    id: 'flan-casa',
    name: 'Flan Casero Tradicional al Caramelo',
    category: 'postres',
    categoryLabel: 'Postre de la Casa',
    description:
      'Receta cubana de textura suave y cremosa bañada en caramelo dorado hecho en casa, ideal para cerrar la velada con un café.',
    boardPriceCUP: 'Consultar al reservar',
    priceStatus: 'Elaboración casera diaria',
    image: '/assets/aistudio/image_b0fafeca_40081b72.webp',
    imageAlt: 'Porción de flan casero con caramelo en plato blanco',
    dietary: ['vegetariano', 'sin-gluten'],
  },
];

export const TRIPADVISOR_REVIEWS = [
  {
    id: 'miriam-g',
    author: 'Miriam G',
    initials: 'MG',
    profileTitle: 'Comensal verificada · Visita de noche y coctelería',
    avatarBg: 'bg-[#1E462D] text-[#E8C59E]',
    date: 'abr. 2026',
    source: 'Reseña en Tripadvisor',
    text: 'sitio acogedor, ambiente tranquilo, buen servicio y cocteles muy buenos.',
    highlight: 'Ambiente y Coctelería',
  },
  {
    id: 'renecito-s',
    author: 'Renecito S',
    initials: 'RS',
    profileTitle: 'Comensal verificado · Encuentro en familia',
    avatarBg: 'bg-[#8C4A27] text-white',
    date: 'abr. 2026',
    source: 'Reseña en Tripadvisor',
    text: 'lo pasó en familia, destaca la calidad y el profesionalismo desde la recepción.',
    highlight: 'Trato Familiar',
  },
  {
    id: 'carla-lucia-a',
    author: 'Carla Lucía A',
    initials: 'CA',
    profileTitle: 'Comensal verificada · Almuerzo en el jardín',
    avatarBg: 'bg-[#2B583C] text-[#F3EFE6]',
    date: 'oct. 2024',
    source: 'Reseña en Tripadvisor',
    text: 'comida muy rica, lugar que parece un jardín, servicio rápido.',
    highlight: 'Jardín y Rapidez',
  },
  {
    id: 'daymel-a',
    author: 'Daymel A',
    initials: 'DA',
    profileTitle: 'Comensal verificado · Experiencia gastronómica',
    avatarBg: 'bg-[#6E3B1E] text-[#E8C59E]',
    date: 'nov. 2024',
    source: 'Reseña en Tripadvisor',
    text: 'calidez familiar, buena comida y servicio.',
    highlight: 'Calidez de Casa',
  },
  {
    id: 'marlen',
    author: 'Marlen',
    initials: 'ML',
    profileTitle: 'Comensal verificada · Parrilla y entrantes',
    avatarBg: 'bg-[#163522] text-[#E8C59E]',
    date: 'nov. 2024',
    source: 'Reseña en Tripadvisor',
    text: 'mezcla de naturaleza y gastronomía, mesa de entrantes y carnes al carbón.',
    highlight: 'Brasas y Naturaleza',
  },
  {
    id: 'consenso-tripadvisor',
    author: 'Comunidad de Comensales',
    initials: '4.7',
    profileTitle: '149 opiniones verificadas · Servicio 4.8 · Ambiente 4.8',
    avatarBg: 'bg-[#B8522A] text-white',
    date: '2024–2026',
    source: 'Reseña en Tripadvisor',
    text: 'Ambiente de jardín tranquilo y acogedor, carnes al carbón, buena coctelería, mesa de entrantes y trato familiar.',
    highlight: 'Lo más destacado',
  },
];

export const GALLERY_PHOTOS = [
  {
    src: '/assets/aistudio/image_06da6fac_02387b20.webp',
    alt: 'Terraza cubierta de enredaderas y helechos colgantes con el bar de madera al fondo en El Jardín de los Milagros',
    caption: 'Terraza principal bajo pérgola natural y bar completo',
    category: 'El Jardín',
  },
  {
    src: '/assets/aistudio/image_c52e79d0_b412d2da.webp',
    alt: 'Especialidad de carnes al carbón fileteadas con chimichurri de hierbas y chips de viandas',
    caption: 'Cortes al carbón con hierbas frescas y mariquitas',
    category: 'Parrilla al Carbón',
  },
  {
    src: '/assets/aistudio/image_9f088b63.png',
    alt: 'Rincón íntimo del patio interior con banco de hierro y madera rodeado de plantas',
    caption: 'Patio interior rodeado de vegetación tropical',
    category: 'El Jardín',
  },
  {
    src: '/assets/aistudio/image_6b8d8fa2_db4c92e4.webp',
    alt: 'Mesa de entrantes con croquetas de la casa, masas de cerdo, chicharrones y salsas sobre mesa de mosaico',
    caption: 'Mesa de entrantes para compartir en buena compañía',
    category: 'Entrantes',
  },
  {
    src: '/assets/aistudio/image_6691ed9d_52d8fb0c.webp',
    alt: 'Coctel refrescante con hierbabuena y botella de salsa picante artesanal El Jardín de los Milagros',
    caption: 'Coctelería con hierbabuena y nuestra salsa picante hecha en casa',
    category: 'Bar y Huerto',
  },
  {
    src: '/assets/aistudio/image_5e8285aa_5bcf0e99.webp',
    alt: 'Botella artesanal vestida en yute con el sello verde de El Jardín de los Milagros Paladar',
    caption: 'Nuestra botella artesanal vestida en yute con sello de la casa',
    category: 'Bar y Huerto',
  },
  {
    src: '/assets/aistudio/image_465b9dfd_131979da.webp',
    alt: 'Terraza superior con canteros elevados del huerto en la azotea y mesas de hierro forjado',
    caption: 'Terraza alta junto a los canteros de cultivo en la azotea',
    category: 'Bar y Huerto',
  },
  {
    src: '/assets/aistudio/image_5a3306c0_6f7759be.webp',
    alt: 'Primer plano de carnes asadas al carbón jugosas con mojo de hierbas frescas',
    caption: 'El punto exacto de nuestras brasas',
    category: 'Parrilla al Carbón',
  },
  {
    src: '/assets/aistudio/image_ddc8e195_94a90cae.webp',
    alt: 'Entrada empedrada desde Calle 37 en Nuevo Vedado con pizarra de bienvenida y buganvillas',
    caption: 'Nuestra entrada de lajas de piedra en Calle 37, Nuevo Vedado',
    category: 'El Jardín',
  },
];

export const FAQ_ITEMS = [
  {
    question: '¿Cómo puedo reservar una mesa y consultar qué platos hay hoy?',
    answer:
      'Puedes reservar directamente escribiéndonos por WhatsApp o llamando al +53 5 2686237 (o al teléfono fijo 78811053). Como trabajamos con ingredientes frescos cada día, te confirmamos al instante las carnes al carbón y sugerencias disponibles para tu visita.',
  },
  {
    question: '¿Tienen opciones vegetarianas, veganas y sin gluten?',
    answer:
      'Sí. Contamos con opciones vegetarianas, veganas y platos naturalmente libres de gluten (como nuestras carnes asadas al carbón, pescados a la plancha, frutas tropicales, ensaladas y preparaciones de vegetales del huerto como la berenjena rellena). Indícalo al reservar para atenderte como mereces.',
  },
  {
    question: '¿Aceptan reservas para grupos, cumpleaños o celebraciones familiares?',
    answer:
      'Sí, nuestro jardín y terraza cuentan con mesas amplias ideales para almuerzos en familia, cenas con amigos y celebraciones especiales. Escríbenos por WhatsApp indicando la cantidad de personas para prepararte el espacio ideal.',
  },
  {
    question: '¿Cuáles son las formas de pago aceptadas?',
    answer:
      'Aceptamos pagos en moneda nacional (CUP). Para consultar opciones de transferencia o detalles específicos para tu mesa o grupo, escríbenos directamente por WhatsApp al +53 5 2686237 al hacer tu reserva.',
  },
  {
    question: '¿Cuentan con parqueo y acceso para sillas de ruedas?',
    answer:
      'Sí, disponemos de parqueo propio y entrada accesible para sillas de ruedas a través de nuestro sendero de lajas de piedra desde la Calle 37.',
  },
  {
    question: '¿Ofrecen comida para llevar?',
    answer:
      'Sí, contamos tanto con servicio de mesa en el jardín y la terraza como con pedidos para llevar. Puedes encargar llamando o escribiendo al +53 5 2686237.',
  },
];
