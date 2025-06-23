// Definición de colores base por tipo de habitación
export const baseColors = {
  HCO: "emerald", // Verde para habitaciones compartidas - económico y fresco
  HIN: "blue",    // Azul para habitaciones individuales - premium y profesional
  HDB: "purple",  // Púrpura para habitaciones dobles - elegante y versátil
  HMA: "rose",    // Rosa para habitaciones matrimoniales - romántico y acogedor
  HT: "amber",    // Ámbar para habitaciones triples - cálido y grupal
} as const;

// Tokens de intensidad para cada uso
const intensityTokens = {
  subtle: {
    bg: (color: string) => `bg-${color}-100/45 dark:bg-${color}-900/10`,
    bgSelected: (color: string) => `bg-${color}-100/60 dark:bg-${color}-900/18`,
    bgHover: (color: string) => `bg-${color}-100/50 dark:bg-${color}-900/25`,
    border: (color: string) => `border-${color}-200/55 dark:border-${color}-700/30`,
    borderSelected: (color: string) => `border-${color}-300/70 dark:border-${color}-600/40`,
    borderHover: (color: string) => `border-${color}-250/60 dark:border-${color}-700/35`,
    iconBg: (color: string) => `bg-${color}-100/50 dark:bg-${color}-800/18`,
    iconBgSelected: (color: string) => `bg-${color}-100/65 dark:bg-${color}-800/25`,
    text: (color: string) => `text-${color}-700 dark:text-${color}-300`,
    textHover: (color: string) => `text-${color}-800 dark:text-${color}-200`,
    shadow: (color: string) => `shadow-${color}-200/25 dark:shadow-${color}-900/20`,
    headerBg: (color: string) => `bg-${color}-50/80 dark:bg-${color}-900/20`,
    headerText: (color: string) => `text-${color}-800 dark:text-${color}-200`,
    footerBg: (color: string) => `bg-${color}-100/30 dark:bg-${color}-800/20`,
  },
} as const;

// Función para obtener los colores de una habitación
export const getRoomColors = (roomId: string) => {
  const baseColor = baseColors[roomId] || baseColors.HCO;
  return {
    bg: intensityTokens.subtle.bg(baseColor),
    bgSelected: intensityTokens.subtle.bgSelected(baseColor),
    bgHover: intensityTokens.subtle.bgHover(baseColor),
    border: intensityTokens.subtle.border(baseColor),
    borderSelected: intensityTokens.subtle.borderSelected(baseColor),
    borderHover: intensityTokens.subtle.borderHover(baseColor),
    iconBg: intensityTokens.subtle.iconBg(baseColor),
    iconBgSelected: intensityTokens.subtle.iconBgSelected(baseColor),
    text: intensityTokens.subtle.text(baseColor),
    textHover: intensityTokens.subtle.textHover(baseColor),
    shadow: intensityTokens.subtle.shadow(baseColor),
    headerBg: intensityTokens.subtle.headerBg(baseColor),
    headerText: intensityTokens.subtle.headerText(baseColor),
    footerBg: intensityTokens.subtle.footerBg(baseColor),
  };
};

// Función para obtener el color del formato de habitación
export const getRoomColorsByFormat = getRoomColors;

// Color sólido/acento para gradientes y fondos llamativos
const roomGradientColors: Record<string, string> = {
  HCO: "#10b981", // emerald-500
  HIN: "#3b82f6", // blue-500
  HDB: "#8b5cf6", // purple-500
  HMA: "#f43f5e", // rose-500
  HT: "#f59e0b", // amber-500
};

export const getRoomGradientColor = (roomId: string) => {
  return roomGradientColors[roomId] || "#a3a3a3"; // gray-400 fallback
};
