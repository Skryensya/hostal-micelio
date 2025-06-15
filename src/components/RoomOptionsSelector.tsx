"use client";

// Removed Card imports - now using simple divs
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RoomOption } from "@/lib/types";
import { Users, User, Undo } from "lucide-react";
import { useSelectionStore } from "@/store/useSelectionStore";
import { motion, AnimatePresence } from "framer-motion";

// Ordena las opciones por precio
const roomOptions = ROOM_FORMATS.sort((a, b) => a.price - b.price);

// Descripciones para cada tipo de habitación
const roomDescriptions = {
  HCO: "Espacio compartido, ambiente social y económico",
  HIN: "Privacidad total con servicios premium incluidos",
  HDB: "Perfecta para parejas o amigos que viajan juntos",
  HMA: "Ideal para viajeros independientes que buscan comodidad",
  HT: "Espacio amplio para grupos pequeños de hasta 3 personas",
  default: "Habitación estándar con todas las comodidades básicas",
} as const;

// Tokens de colores sutiles con soporte para dark mode
const roomColorTokens = {
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
  },
} as const;

const getRoomIcon = (id: string, isSelected: boolean = false) => {
  const icons = {
    HCO: { icon: <Users className="h-6 w-6" />, count: "1+" },
    HIN: { icon: <User className="h-6 w-6" />, count: "1" },
    HDB: { icon: <Users className="h-6 w-6" />, count: "2" },
    HMA: { icon: <Users className="h-6 w-6" />, count: "2" },
    HT: { icon: <Users className="h-6 w-6" />, count: "3" },
    default: { icon: <Users className="h-6 w-6" />, count: "1+" },
  };

  const { icon, count } = icons[id] || icons.default;
  const colors = roomColorTokens[id] || roomColorTokens.HCO;
  const people = count === "1" ? "Persona" : "Personas";

  return (
    <div
      className={cn(
        "rounded-lg p-2 transition-colors duration-200",
        isSelected ? colors.iconBgSelected : colors.iconBg,
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-base">{`${count} ${people}`}</span>
      </div>
    </div>
  );
};

export const RoomOptionsSelector = ({
  onSelect,
  filteredRoomsCount,
}: {
  onSelect: (option: RoomOption | null) => void;
  filteredRoomsCount: number;
}) => {
  const { selectedFormat, setSelectedFormat, clearSelectedFormat } =
    useSelectionStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    // Send the selectedFormat to parent
    onSelect(selectedFormat);
  }, [selectedFormat, onSelect]);

  // Detectar cuál elemento está centrado durante el scroll en mobile
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || window.innerWidth >= 640) return;

    isUserScrolling.current = true;

    // Después de 150ms sin scroll, detectar el elemento centrado
    setTimeout(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Encontrar el elemento más cercano al centro
      const buttons = container.querySelectorAll("button");
      let closestButton: HTMLButtonElement | null = null;
      let closestDistance = Infinity;

      buttons.forEach((button) => {
        const buttonRect = button.getBoundingClientRect();
        const buttonCenter = buttonRect.left + buttonRect.width / 2;
        const distance = Math.abs(containerCenter - buttonCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestButton = button;
        }
      });

      // Seleccionar la opción correspondiente al botón más centrado
      if (closestButton) {
        const buttonIndex = Array.from(buttons).indexOf(closestButton);
        const centeredOption = roomOptions[buttonIndex];
        if (centeredOption && centeredOption !== selectedFormat) {
          setSelectedFormat(centeredOption);
        }
      }

      isUserScrolling.current = false;
    }, 150);
  }, [selectedFormat, setSelectedFormat]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleOptionClick = (option: RoomOption) => {
    // Toggle selection - if clicking the same option, clear all filters
    if (option === selectedFormat) {
      clearSelectedFormat();
    } else {
      setSelectedFormat(option);
    }
  };

  const handleReset = () => {
    clearSelectedFormat();
  };

  return (
    <div className="py-10">
      <div className="mb-4 text-lg font-bold sm:font-mono">
        ¿Qué tipo de habitación buscas?
      </div>
      <div className="flex flex-col">
        {/* Contenedor de opciones: scroll horizontal en móvil y wrap en pantallas grandes */}
        <div className="relative sm:static">
          <div
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 sm:snap-none sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {roomOptions.map((option, index) => {
              const colors = roomColorTokens[option.id] || roomColorTokens.HCO;
              const isSelected = selectedFormat === option;
              const description =
                roomDescriptions[option.id] || roomDescriptions.default;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    "group w-[95dvw] min-w-[280px] grow snap-center rounded-xl border transition-all duration-200 sm:w-fit sm:min-w-fit md:w-fit",
                    isSelected
                      ? `${colors.borderSelected} ${colors.bgSelected} ${colors.shadow} shadow-md`
                      : `${colors.border} ${colors.bg} hover:${colors.borderHover} hover:${colors.bgHover} hover:scale-[1.02] hover:shadow-sm`,
                  )}
                >
                  <div className="p-3 transition-all duration-200">
                    <div className="flex flex-col items-start gap-2">
                      <div className="w-full text-left">
                        <h3
                          className={cn(
                            "font-body mb-1 !text-lg font-semibold transition-colors duration-200",
                            isSelected
                              ? colors.text
                              : `group-hover:${colors.textHover}`,
                          )}
                        >
                          Habitación {option.label}
                        </h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                          {description}
                        </p>
                      </div>

                      <div className="flex w-full items-center justify-between">
                        {getRoomIcon(option.id, isSelected)}
                        <div className="text-right">
                          <div
                            className={cn(
                              "text-xs font-medium transition-colors duration-200",
                              isSelected
                                ? colors.text
                                : "text-text-muted group-hover:text-text",
                            )}
                          >
                            Desde
                          </div>
                          <div
                            className={cn(
                              "text-lg font-bold transition-colors duration-200",
                              isSelected
                                ? colors.text
                                : `group-hover:${colors.textHover}`,
                            )}
                          >
                            ${option.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Gradientes estáticos para fade en mobile */}
          <div className="pointer-events-none absolute top-0 -left-1 z-10 h-full w-8 bg-gradient-to-r from-white/55 via-white/30 to-transparent sm:hidden" />
          <div className="pointer-events-none absolute top-0 -right-1 z-10 h-full w-8 bg-gradient-to-l from-white/55 via-white/30 to-transparent sm:hidden" />
        </div>
        <div className="flex items-center items-start justify-between gap-2 sm:justify-start md:flex-col">
          {selectedFormat && (
            <button
              onClick={handleReset}
              className="text-text hover:text-text md: order-1 order-2 flex h-6 w-fit items-center gap-1 text-base transition-colors duration-200"
            >
              <Undo className="h-4 w-4" />
              <span>Ver todas </span>
            </button>
          )}
          <span className="text-text-muted text- relative overflow-hidden sm:order-first">
            <AnimatePresence mode="wait">
              <motion.span
                key={filteredRoomsCount}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="inline-block"
              >
                {filteredRoomsCount}
              </motion.span>
            </AnimatePresence>{" "}
            {filteredRoomsCount === 1 ? "habitación" : "habitaciones"}{" "}
            disponibles
          </span>
        </div>
      </div>
    </div>
  );
};
