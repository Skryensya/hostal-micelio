// Tokens de colores sutiles con soporte para dark mode
export const roomColorTokens = {
  HCO: {
    bg: "bg-blue-100/50 dark:bg-blue-800/15",
    bgSelected: "bg-blue-100/65 dark:bg-blue-700/20",
    bgHover: "bg-blue-100/55 dark:bg-blue-800/25",
    border: "border-blue-200/60 dark:border-blue-600/30",
    borderSelected: "border-blue-300/75 dark:border-blue-500/40",
    borderHover: "border-blue-250/65 dark:border-blue-600/35",
    iconBg: "bg-blue-100/55 dark:bg-blue-800/20",
    iconBgSelected: "bg-blue-200/70 dark:bg-blue-700/25",
    text: "text-blue-700 dark:text-blue-300",
    textHover: "text-blue-800 dark:text-blue-200",
    shadow: "shadow-blue-200/25 dark:shadow-blue-900/20",
    // Colores para header de card
    headerBg: "bg-blue-50 dark:bg-blue-900/20",
    headerText: "text-blue-800 dark:text-blue-200",
    footerBg: "bg-blue-100 dark:bg-blue-800/20",
  },
  HIN: {
    bg: "bg-emerald-100/45 dark:bg-emerald-900/10",
    bgSelected: "bg-emerald-100/60 dark:bg-emerald-900/18",
    bgHover: "bg-emerald-100/50 dark:bg-emerald-900/25",
    border: "border-emerald-200/55 dark:border-emerald-700/30",
    borderSelected: "border-emerald-300/70 dark:border-emerald-600/40",
    borderHover: "border-emerald-250/60 dark:border-emerald-700/35",
    iconBg: "bg-emerald-100/50 dark:bg-emerald-800/18",
    iconBgSelected: "bg-emerald-100/65 dark:bg-emerald-800/25",
    text: "text-emerald-700 dark:text-emerald-300",
    textHover: "text-emerald-800 dark:text-emerald-200",
    shadow: "shadow-emerald-200/25 dark:shadow-emerald-900/20",
    // Colores para header de card
    headerBg: "bg-emerald-50/80 dark:bg-emerald-900/20",
    headerText: "text-emerald-800 dark:text-emerald-200",
    footerBg: "bg-emerald-100/30 dark:bg-emerald-800/20",
  },
  HDB: {
    bg: "bg-purple-100/45 dark:bg-purple-900/10",
    bgSelected: "bg-purple-100/60 dark:bg-purple-900/18",
    bgHover: "bg-purple-100/50 dark:bg-purple-900/25",
    border: "border-purple-200/55 dark:border-purple-700/30",
    borderSelected: "border-purple-300/70 dark:border-purple-600/40",
    borderHover: "border-purple-250/60 dark:border-purple-700/35",
    iconBg: "bg-purple-100/50 dark:bg-purple-800/18",
    iconBgSelected: "bg-purple-100/65 dark:bg-purple-800/25",
    text: "text-purple-700 dark:text-purple-300",
    textHover: "text-purple-800 dark:text-purple-200",
    shadow: "shadow-purple-200/25 dark:shadow-purple-900/20",
    // Colores para header de card
    headerBg: "bg-purple-50/80 dark:bg-purple-900/20",
    headerText: "text-purple-800 dark:text-purple-200",
    footerBg: "bg-purple-100/30 dark:bg-purple-800/20",
  },
  HMA: {
    bg: "bg-rose-100/45 dark:bg-rose-900/10",
    bgSelected: "bg-rose-100/60 dark:bg-rose-900/18",
    bgHover: "bg-rose-100/50 dark:bg-rose-900/25",
    border: "border-rose-200/55 dark:border-rose-700/30",
    borderSelected: "border-rose-300/70 dark:border-rose-600/40",
    borderHover: "border-rose-250/60 dark:border-rose-700/35",
    iconBg: "bg-rose-100/50 dark:bg-rose-800/18",
    iconBgSelected: "bg-rose-100/65 dark:bg-rose-800/25",
    text: "text-rose-700 dark:text-rose-300",
    textHover: "text-rose-800 dark:text-rose-200",
    shadow: "shadow-rose-200/25 dark:shadow-rose-900/20",
    // Colores para header de card
    headerBg: "bg-rose-50/80 dark:bg-rose-900/20",
    headerText: "text-rose-800 dark:text-rose-200",
    footerBg: "bg-rose-100/30 dark:bg-rose-800/20",
  },
  HT: {
    bg: "bg-amber-100/45 dark:bg-amber-900/10",
    bgSelected: "bg-amber-100/60 dark:bg-amber-900/18",
    bgHover: "bg-amber-100/50 dark:bg-amber-900/25",
    border: "border-amber-200/55 dark:border-amber-700/30",
    borderSelected: "border-amber-300/70 dark:border-amber-600/40",
    borderHover: "border-amber-250/60 dark:border-amber-700/35",
    iconBg: "bg-amber-100/50 dark:bg-amber-800/18",
    iconBgSelected: "bg-amber-100/65 dark:bg-amber-800/25",
    text: "text-amber-700 dark:text-amber-300",
    textHover: "text-amber-800 dark:text-amber-200",
    shadow: "shadow-amber-200/25 dark:shadow-amber-900/20",
    // Colores para header de card
    headerBg: "bg-amber-50/80 dark:bg-amber-900/20",
    headerText: "text-amber-800 dark:text-amber-200",
    footerBg: "bg-amber-100/30 dark:bg-amber-800/20",
  },
} as const;

// Función para obtener los colores de una habitación
export const getRoomColors = (roomId: string) => {
  return roomColorTokens[roomId] || roomColorTokens.HCO;
};

// Función para obtener el color del formato de habitación
export const getRoomColorsByFormat = (formatId: string) => {
  return getRoomColors(formatId);
};
