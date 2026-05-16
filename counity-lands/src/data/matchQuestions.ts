export interface MatchOption {
  id: string;
  text: string;
  pointsTo?: "hub-innovacion" | "costa-olas" | "campo-soberania" | "longevidad-salud" | "coliving" | null;
  tag?: string;
}

export interface MatchQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: MatchOption[];
}

export const matchQuestions: MatchQuestion[] = [
  {
    id: "q1",
    title: "¿Qué es lo que más te empuja a buscar un nuevo entorno hoy?",
    subtitle: "Seleccioná tu motivación principal.",
    options: [
      {
        id: "q1_1",
        text: "Necesito silencio y foco profundo para trabajar sin burnout.",
        pointsTo: "hub-innovacion",
      },
      {
        id: "q1_2",
        text: "Quiero que la naturaleza y el aire libre marquen mi rutina.",
        pointsTo: "costa-olas", // Simplificado para que apunte a Costa, aunque podría ser Campo. La pregunta 2 desempata.
      },
      {
        id: "q1_3",
        text: "Busco autonomía real: entender qué consumo y cómo genero mi energía.",
        pointsTo: "campo-soberania",
      },
      {
        id: "q1_4",
        text: "Quiero un entorno diseñado para mi bienestar físico y paz a largo plazo.",
        pointsTo: "longevidad-salud",
      },
    ],
  },
  {
    id: "q2",
    title: "Imaginá tu día ideal en Counity. ¿Dónde pasás la mayor parte del tiempo?",
    subtitle: "Elegí el ritmo que mejor te representa.",
    options: [
      {
        id: "q2_1",
        text: "En un laboratorio de ideas o encerrado en mi espacio insonorizado.",
        pointsTo: "hub-innovacion",
      },
      {
        id: "q2_2",
        text: "Chequeando el viento y metido en el agua.",
        pointsTo: "costa-olas",
      },
      {
        id: "q2_3",
        text: "En la huerta, en el taller o cocinando con ingredientes propios.",
        pointsTo: "campo-soberania",
      },
      {
        id: "q2_4",
        text: "Caminando por senderos seguros y en espacios de salud preventiva.",
        pointsTo: "longevidad-salud",
      },
    ],
  },
  {
    id: "q3",
    title: "¿Cómo te relacionás con tu comunidad ideal?",
    subtitle: "Dinámica social.",
    options: [
      {
        id: "q3_1",
        text: "Priorizo mi privacidad extrema, pero valoro cruzarme con gente brillante en el cowork.",
        tag: "private_cowork",
      },
      {
        id: "q3_2",
        text: "Me gusta la vida activa, los asados grupales y la dinámica constante.",
        tag: "active_social",
      },
      {
        id: "q3_3",
        text: "Disfruto de compartir el trabajo duro (la tierra, los oficios) y los logros comunes.",
        tag: "shared_work",
      },
      {
        id: "q3_4",
        text: "Busco tranquilidad, apoyo mutuo cercano y ritmos pausados.",
        tag: "calm_support",
      },
    ],
  },
  {
    id: "q4",
    title: "¿Cómo tenés pensado usar este espacio en el ecosistema Counity?",
    subtitle: "Intención de uso.",
    options: [
      {
        id: "q4_1",
        text: "Como mi base principal (Residencia permanente).",
        tag: "permanent",
      },
      {
        id: "q4_2",
        text: "Como mi refugio de temporada (Uso híbrido + Swap).",
        tag: "hybrid_swap",
      },
      {
        id: "q4_3",
        text: "Principalmente como inversión diversificada (Renta).",
        tag: "investment",
      },
      {
        id: "q4_4",
        text: "Busco estadías cortas o coliving (Aún no quiero invertir).",
        pointsTo: "coliving", // Esto puede derivar a otro funnel si fuera necesario
        tag: "short_stay",
      },
    ],
  },
  {
    id: "q5",
    title: "Para poder ubicarte en el esquema correcto, ¿cuál es tu rango de inversión disponible?",
    subtitle: "Sé transparente, esto nos ayuda a guiarte mejor.",
    options: [
      {
        id: "q5_1",
        text: "Solo busco opciones de Coliving/Alquiler.",
        tag: "0_rent",
      },
      {
        id: "q5_2",
        text: "Hasta USD 50.000 (Opciones iniciales o participaciones).",
        tag: "up_to_50k",
      },
      {
        id: "q5_3",
        text: "USD 50.000 - USD 120.000 (Refugios estándar).",
        tag: "50k_120k",
      },
      {
        id: "q5_4",
        text: "Más de USD 120.000 (Unidades premium / ubicaciones exclusivas).",
        tag: "over_120k",
      },
    ],
  },
  {
    id: "q6",
    title: "¿Para cuándo te imaginás haciendo este movimiento?",
    subtitle: "Tu urgencia define los próximos pasos.",
    options: [
      {
        id: "q6_1",
        text: "Lo antes posible (0 a 6 meses).",
        tag: "0_6_months",
      },
      {
        id: "q6_2",
        text: "Lo estoy planificando con tiempo (1 a 2 años).",
        tag: "1_2_years",
      },
      {
        id: "q6_3",
        text: "Solo estoy explorando ideas para el futuro.",
        tag: "exploring",
      },
    ],
  },
];
