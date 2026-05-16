export interface Land {
  id: string;
  name: string;
  location: string;
  swapLevel: number;
  swapText: string;
  tag: string;
  headline: string;
  summary: string;
  highlights: string[];
  image: string;
  extendedDescription: {
    privateVsShared: string;
    experience: string;
    governance: string;
  };
}

export const lands: Land[] = [
  {
    id: "hub-innovacion",
    name: "Hub de Innovación",
    location: "Buenos Aires (Zona Norte) & Punta del Este (Cercanías)",
    swapLevel: 90, // Muy alto
    swapText: "Muy alto",
    tag: "Tech & Bosque",
    headline: "Foco absoluto. Sin burnout.",
    summary: "Refugios privados inmersos en la naturaleza, diseñados para fundadores, desarrolladores y creadores que necesitan alternar entre deep work extremo y conexión de alto valor con pares.",
    highlights: [
      "Workspaces 24/7 insonorizados",
      "Eventos de networking cerrados",
      "Proximidad a la ciudad"
    ],
    image: "/lands/hub_innovacion.png",
    extendedDescription: {
      privateVsShared: "Tu casa es una cabaña modular minimalista, 100% aislada acústicamente, pensada para que nadie interrumpa tu flujo de trabajo. Todo lo demás está afuera: cocinas industriales comunitarias para cenas de networking, un coworking de nivel corporativo en medio del bosque y salas de reuniones equipadas con última tecnología.",
      experience: "Acá no hay small talk forzado. Es común ver a alguien programando bajo los árboles a las 3 AM o uniendo fuerzas con otro founder en el fogón de la noche. La energía está puesta en crear, y el entorno se encarga de la logística.",
      governance: "Regido por un 'Consejo de Innovadores', donde el financiamiento interno y la organización de hackathons son prioridades. Alta flexibilidad para la rotación de residentes."
    }
  },
  {
    id: "costa-olas",
    name: "Costa & Olas",
    location: "Costa Atlántica de Buenos Aires & Costa Este de Uruguay",
    swapLevel: 75, // Alto
    swapText: "Alto",
    tag: "Mar & Movimiento",
    headline: "Ritmo costero. Espacio propio.",
    summary: "Para quienes el océano es su forma de resetear. Unidades eficientes a metros de la playa, combinando la cultura del surf y el deporte con la infraestructura para nómadas digitales que exigen alta conectividad.",
    highlights: [
      "Guardería de tablas y equipos",
      "Zonas de entrenamiento y recuperación",
      "Starlink & fibra óptica"
    ],
    image: "/lands/costa_olas.png",
    extendedDescription: {
      privateVsShared: "Lofts compactos de diseño eficiente. Tienen lo esencial para el descanso y la privacidad, pero la vida ocurre en el mar y en el gran 'Surf Club' central, que oficia de restaurante, coworking con vista al mar y zona de relax post-entrenamiento.",
      experience: "El ritmo lo marcan las olas y el viento. Trabajar unas horas, entrar al agua, volver para una call importante y terminar el día compartiendo una comida con otros apasionados del océano. La vida al aire libre es innegociable.",
      governance: "Enfocada en el mantenimiento de infraestructuras compartidas (guardería, gimnasio) y la preservación del entorno costero. Un ambiente relajado pero comprometido con el cuidado del lugar."
    }
  },
  {
    id: "campo-soberania",
    name: "Campo & Soberanía",
    location: "Sierras de Córdoba / Interior de Buenos Aires / Interior de Uruguay",
    swapLevel: 50, // Moderado
    swapText: "Moderado",
    tag: "Tierra & Autonomía",
    headline: "Raíces reales. Autonomía real.",
    summary: "Para familias y personas que buscan desconectarse del ritmo urbano y reconectar con la tierra. Mayor espacio privado, foco en la soberanía alimentaria y energética, sin perder la comunidad.",
    highlights: [
      "Huertas orgánicas y permacultura",
      "Educación alternativa para niños",
      "Generación de energía renovable"
    ],
    image: "/lands/campo_soberania.png",
    extendedDescription: {
      privateVsShared: "Las unidades de vivienda son más grandes (casas familiares), con parcelas propias para huertas privadas. Los espacios compartidos incluyen grandes invernaderos comunitarios, un centro de aprendizaje para los niños y talleres de herramientas compartidas.",
      experience: "Una vida más analógica y rítmica. Se trata de cultivar los propios alimentos, aprender oficios, y criar a los hijos en un entorno seguro y en contacto directo con la naturaleza y con otras familias con valores similares.",
      governance: "Decisiones enfocadas en la gestión de recursos naturales, el mantenimiento de la infraestructura agrícola y la organización de la educación infantil comunitaria."
    }
  },
  {
    id: "longevidad-salud",
    name: "Longevidad & Salud",
    location: "Zonas suburbanas tranquilas (BA) / Colonia (UY)",
    swapLevel: 30, // Bajo
    swapText: "Bajo",
    tag: "Bienestar & Red Intergeneracional",
    headline: "Sumar años activos. Vivir en red.",
    summary: "Diseñado para el bienestar a largo plazo y la convivencia intergeneracional. Un entorno enfocado en la salud física, mental y la conexión humana, combatiendo la epidemia de la soledad urbana.",
    highlights: [
      "Centro de salud preventiva y longevidad",
      "Diseño arquitectónico accesible",
      "Actividades de integración continua"
    ],
    image: "/lands/longevidad_salud.png",
    extendedDescription: {
      privateVsShared: "Viviendas diseñadas bajo principios de diseño universal (sin barreras, adaptables). La intimidad del hogar es prioritaria, pero se complementa fuertemente con un gran 'Centro de Bienestar' que incluye spa, clínica preventiva, espacios de meditación y comedores compartidos.",
      experience: "Un entorno tranquilo y curativo. Se fomenta el intercambio de conocimientos entre generaciones, el cuidado mutuo y rutinas saludables. Es un lugar donde el diseño del entorno facilita naturalmente el envejecimiento activo y saludable en compañía.",
      governance: "Prioridad en la contratación y gestión de servicios de salud preventiva, mantenimiento de espacios accesibles y la organización de un calendario continuo de actividades de bienestar."
    }
  }
];
