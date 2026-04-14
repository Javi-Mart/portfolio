import { reelAsset } from './assets';

export type ProjectMedia = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster?: string;
};

export type Project = {
  id: string;
  title: string;
  eyebrow: string;
  year: string;
  summary: string;
  description: string;
  tags: string[];
  media: ProjectMedia[];
  links?: {
    label: string;
    href: string;
  }[];
};

export const siteMeta = {
  name: 'Javier Creative Tech',
  role: 'Design + Motion + 3D + AI',
  email: 'hola@tu-dominio.com',
  location: 'El Salvador / Remote',
};

export const navigation = [
  { label: 'Reel', href: '#reel' },
  { label: 'Perfil', href: '#perfil' },
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Trabajos', href: '#trabajos' },
  { label: 'Contacto', href: '#contacto' },
];

export const hero = {
  eyebrow: 'Portafolio profesional',
  title: 'Arte, branding y sistemas 3D para experiencias que se sienten vivas.',
  body: 'Diseño visual, motion graphics, technical art, AI y tecnología creativa conectados en una presencia digital precisa, inmersiva y lista para evolucionar.',
  primaryCta: { label: 'Ver trabajos', href: '#trabajos' },
  secondaryCta: { label: 'Hablemos', href: `mailto:${siteMeta.email}` },
  ambientText: ['AI', '3D', 'MOTION', 'DESIGN'],
};

export const reel = {
  eyebrow: 'Selected motion',
  title: 'Reel visual para piezas con ritmo, textura y presencia.',
  body: 'Un espacio directo para mostrar montaje, dirección visual, edición, animación y exploraciones generativas. Reemplaza el archivo reel.mp4 y todo queda conectado.',
  videoSrc: reelAsset,
  poster:
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1600&q=80',
};

export const about = {
  eyebrow: 'Perfil híbrido',
  title: 'Diseño con criterio técnico, tecnología con sensibilidad visual.',
  paragraphs: [
    'Trabajo en la intersección entre identidad visual, motion, 3D, AI y experiencias interactivas. Mi enfoque une dirección de arte, sistemas visuales y producción técnica para construir piezas que se ven premium y funcionan con precisión.',
    'Me interesa convertir ideas complejas en artefactos claros: marcas con lenguaje propio, escenas 3D optimizadas, narrativas de movimiento y prototipos digitales que ayudan a tomar mejores decisiones creativas.',
  ],
  facts: [
    { value: '3D', label: 'Technical art y visual systems' },
    { value: 'AI', label: 'Procesos creativos asistidos' },
    { value: 'Motion', label: 'Ritmo, edición y animación' },
  ],
};

export const specialties = [
  {
    title: 'Diseño y Branding',
    label: '01',
    description:
      'Sistemas visuales, dirección de arte, identidad, campañas y lenguaje gráfico para marcas con presencia digital fuerte.',
  },
  {
    title: 'Motion Graphics',
    label: '02',
    description:
      'Animación, edición, ritmo visual, piezas para social, launch films, reels y microinteracciones con intención.',
  },
  {
    title: 'Technical Art 3D',
    label: '03',
    description:
      'Escenas, materiales, iluminación, assets GLB y experiencias WebGL pensadas para verse bien y cargar con criterio.',
  },
  {
    title: 'AI Creative Systems',
    label: '04',
    description:
      'Exploración visual, prototipado, pipelines generativos y herramientas para acelerar decisiones sin perder dirección artística.',
  },
];

export const projects: Project[] = [
  {
    id: 'neural-brand-system',
    title: 'Neural Brand System',
    eyebrow: 'Branding / AI',
    year: '2026',
    summary:
      'Sistema de identidad para una marca experimental con lenguaje visual generado, curado y refinado para uso real.',
    description:
      'Exploracion de un sistema visual donde AI, grillas modulares y direccion de arte conviven en un kit editable. El objetivo fue pasar de moodboards generativos a piezas utilizables: key visuals, motion tests, material digital y reglas de consistencia para ejecucion diaria.',
    tags: ['Brand system', 'AI workflow', 'Art direction'],
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=82',
        alt: 'Abstract generative visual system with vivid forms on a dark field',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=1400&q=82',
        alt: 'High contrast digital composition with layered technical surfaces',
      },
    ],
  },
  {
    id: 'realtime-product-stage',
    title: 'Realtime Product Stage',
    eyebrow: '3D / WebGL',
    year: '2025',
    summary:
      'Escena interactiva para presentar un objeto 3D con iluminacion dramatica, control visual y performance web.',
    description:
      'Prototipo de escenario WebGL con foco en jerarquia visual, interaccion sutil y carga eficiente. El trabajo se penso como una base reutilizable para lanzamientos, portfolios de producto y demos donde el objeto debe sentirse integrado al layout.',
    tags: ['React Three Fiber', 'GLB', 'Lighting'],
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=82',
        alt: 'Dimensional geometric structure with a premium technology mood',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=82',
        alt: 'Dark technology environment with screens and luminous details',
      },
    ],
  },
  {
    id: 'motion-identity-reel',
    title: 'Motion Identity Reel',
    eyebrow: 'Motion / Edit',
    year: '2025',
    summary:
      'Paquete de direccion visual para piezas cortas con transiciones, montaje y acentos de marca.',
    description:
      'Direccion y edicion para un paquete de motion pensado para vivir en formatos verticales y horizontales. El sistema define ritmo, cortes, uso de tipografia, textura, tratamiento de color y variantes para campañas de alto volumen.',
    tags: ['Motion system', 'Editing', 'Social assets'],
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=82',
        alt: 'Creative production desk with design tools and visual references',
      },
      {
        type: 'video',
        src: reelAsset,
        poster:
          'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1400&q=82',
        alt: 'Portfolio reel video placeholder',
      },
    ],
  },
  {
    id: 'ai-production-lab',
    title: 'AI Production Lab',
    eyebrow: 'AI / Pipeline',
    year: '2026',
    summary:
      'Flujo de produccion visual que combina investigacion, prompts, curaduria y assets listos para diseno.',
    description:
      'Laboratorio de exploracion para transformar conceptos abstractos en rutas visuales accionables. Incluye matrices de prompts, criterios de seleccion, iteraciones de composicion, tratamiento final y preparacion para piezas de branding, motion o prototipos.',
    tags: ['Prompt craft', 'Visual research', 'Production'],
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=82',
        alt: 'Robot and human scale technology environment used as AI production reference',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=1400&q=82',
        alt: 'Abstract digital surface with precise production mood',
      },
    ],
  },
];

export const contact = {
  eyebrow: 'Contacto',
  title: 'Construyamos algo con presencia, movimiento y buen criterio tecnico.',
  body: 'Disponible para branding, motion, escenas 3D, sistemas visuales, prototipos creativos y exploraciones con AI.',
  email: siteMeta.email,
  links: [
    { label: 'Behance', href: 'https://www.behance.net/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
};
