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
    bg: (color: string) => `bg-${color}-100/45`,
    bgSelected: (color: string) => `bg-${color}-100/60`,
    bgHover: (color: string) => `bg-${color}-100/50`,
    border: (color: string) => `border-${color}-200/55`,
    borderSelected: (color: string) => `border-${color}-300/70`,
    borderHover: (color: string) => `border-${color}-250/60`,
    iconBg: (color: string) => `bg-${color}-100/50`,
    iconBgSelected: (color: string) => `bg-${color}-100/65`,
    text: (color: string) => `text-${color}-700`,
    textHover: (color: string) => `text-${color}-800`,
    shadow: (color: string) => `shadow-${color}-200/25`,
    headerBg: (color: string) => `bg-${color}-50/80`,
    headerText: (color: string) => `text-${color}-800`,
    footerBg: (color: string) => `bg-${color}-100/30`,
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
