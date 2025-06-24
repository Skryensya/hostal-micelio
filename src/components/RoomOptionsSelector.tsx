"use client";

// Removed Card imports - now using simple divs
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { RoomOption } from "@/lib/types";
import {
  Users,
  User,
  Undo,
  PointerIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelectionStore } from "@/store/useSelectionStore";
import { motion, AnimatePresence } from "framer-motion";
import { getRoomColors } from "@/lib/roomColors";
import { LightEffect } from "@/components/ui/LightEffect";
import { getRoomGradientColor } from "@/lib/roomColors";
import useEmblaCarousel from "embla-carousel-react";

// Ordena las opciones por precio
const roomOptions = ROOM_FORMATS.sort((a, b) => a.price - b.price);

// Descripciones para cada tipo de habitación
const roomDescriptions = {
  HCO: "Espacio compartido y económico",
  HIN: "Privacidad total premium",
  HDB: "2 camas individuales",
  HMA: "Perfecta para parejas",
  HT: "Espacio amplio para grupos",
  default: "Habitación estándar",
} as const;

const getRoomIcon = (id: string, isSelected: boolean = false) => {
  const icons = {
    HCO: {
      icon: <Users className="h-4 w-4" />,
      count: "1+",
      people: "Personas",
    },
    HIN: { icon: <User className="h-4 w-4" />, count: "1", people: "Persona" },
    HDB: {
      icon: <Users className="h-4 w-4" />,
      count: "2",
      people: "Personas",
    },
    HMA: {
      icon: <Users className="h-4 w-4" />,
      count: "2",
      people: "Personas",
    },
    HT: { icon: <Users className="h-4 w-4" />, count: "3", people: "Personas" },
    default: {
      icon: <Users className="h-4 w-4" />,
      count: "1+",
      people: "Personas",
    },
  };

  const { icon, count, people } = icons[id] || icons.default;
  const colors = getRoomColors(id);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-lg border bg-white p-1.5 shadow-sm transition-all duration-200",
          isSelected ? colors.border : "border-gray-200",
        )}
      >
        <div
          className={cn(
            "transition-colors",
            isSelected ? colors.text : "text-text-muted",
          )}
        >
          {icon}
        </div>
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          isSelected ? colors.text : "text-text-muted",
        )}
      >
        {count} {people}
      </span>
    </div>
  );
};

const SwipeIndicator = () => {
  return (
    <div className="-mt-2 flex flex-col items-center gap-1 py-1 md:hidden">
      <span className="text-text-muted/70 text-center text-xs">
        Desliza para seleccionar
      </span>
      <div className="flex items-center gap-1">
        <ChevronLeft className="text-text-muted/40 h-4 w-4" strokeWidth={1.5} />
        <motion.div
          animate={{ rotate: [-15, 15, -15] }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{ originY: 1 }} // Set rotation origin to bottom
        >
          <PointerIcon
            className="text-text-muted/70 h-6 w-6"
            strokeWidth={1.5}
          />
        </motion.div>
        <ChevronRight
          className="text-text-muted/40 h-4 w-4"
          strokeWidth={1.5}
        />
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

  // Embla carousel setup for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: false,
    containScroll: "trimSnaps",
    align: "center",
    skipSnaps: false,
  });

  // Set first option as default on mobile
  useEffect(() => {
    if (!selectedFormat && window.innerWidth < 768) {
      setSelectedFormat(roomOptions[0]);
    }
  }, [selectedFormat, setSelectedFormat]);

  // Sync Embla with selected format ONLY on manual scroll
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      // Only update if the change was from user interaction
      const selectedIndex = emblaApi.selectedScrollSnap();
      const option = roomOptions[selectedIndex];
      if (option !== selectedFormat) {
        setSelectedFormat(option);
      }
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, selectedFormat, setSelectedFormat]);

  useEffect(() => {
    onSelect(selectedFormat);
  }, [selectedFormat, onSelect]);

  const handleOptionClick = (option: RoomOption) => {
    if (option === selectedFormat) {
      clearSelectedFormat();
    } else {
      setSelectedFormat(option);
    }
  };

  const handleReset = () => {
    clearSelectedFormat();
  };

  const AvailableRoomsSpan = () => {
    return (
      <div className="mt-4 flex w-full items-center justify-between gap-4">
        <div className="text-text-muted text-sm">
          <AnimatePresence mode="wait">
            <motion.span
              key={filteredRoomsCount}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="inline-block"
            >
              {filteredRoomsCount}
            </motion.span>
          </AnimatePresence>{" "}
          {filteredRoomsCount === 1 ? "habitación" : "habitaciones"} disponibles
        </div>

        {selectedFormat && (
          <button
            onClick={handleReset}
            className="text-text hover:text-text hidden items-center gap-1 text-sm transition-colors duration-200 md:flex"
          >
            <Undo className="h-4 w-4" />
            <span>Ver todas</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pt-6 pb-2">
      <div className="h2 mb-4 text-lg font-bold sm:font-mono md:mb-10">
        Tipos de habitación
      </div>

      {/* Mobile Carousel */}
      <div className="-mx-4 md:hidden">
        <div
          className="overflow-x-hidden overflow-y-visible pb-4"
          ref={emblaRef}
        >
          <div className="flex">
            {roomOptions.map((option, index) => {
              const colors = getRoomColors(option.id);
              const isSelected = selectedFormat === option;
              const description =
                roomDescriptions[option.id] || roomDescriptions.default;
              const gradientColor = getRoomGradientColor(option.id);

              return (
                <div
                  key={index}
                  className={cn(
                    "group bg-surface-1 relative mx-3 flex flex-[0_0_80%] flex-col overflow-hidden rounded-xl border-2",
                    isSelected && "shadow-lg",
                  )}
                  style={{
                    borderColor: `${gradientColor}70`,
                  }}
                >
                  {/* Gradient corner detail */}
                  <div
                    className={cn(
                      "pointer-events-none absolute top-0 left-0 h-72 w-72 transition-opacity duration-200",
                      isSelected ? "opacity-35" : "opacity-20",
                    )}
                    style={{
                      background: `radial-gradient(circle at top left, ${gradientColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Color accent bar - minimal */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 left-0 h-1 rounded-t-xl transition-all duration-200",
                      colors.bg,
                    )}
                  />

                  {/* Mobile Layout - Reorganized */}
                  <div className="relative z-10 flex h-full flex-col p-4">
                    {/* Header Section */}
                    <div className="mb-4">
                      <h3
                        className={cn(
                          "mb-1",
                          isSelected ? colors.textHover : "text-text",
                        )}
                      >
                        Habitación {option.label}
                      </h3>
                      <p className="text-text-muted line-clamp-2 text-sm">
                        {description}
                      </p>
                    </div>

                    {/* Capacity Section */}
                    <div className="mb-4">
                      {getRoomIcon(option.id, isSelected)}
                    </div>

                    {/* Price Section */}
                    <div className="mt-0">
                      <div className="text-text-muted text-xs capitalize">
                        Desde
                      </div>
                      <div
                        className={cn(
                          "flex items-baseline gap-1 text-xl font-bold",
                          isSelected ? colors.textHover : "text-text",
                        )}
                      >
                        ${option.price.toLocaleString("es-CL")}
                        <span className="text-text-muted text-sm font-normal">
                          / Noche
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Swipe Indicator - Below Carousel */}
      <SwipeIndicator />

      {/* Desktop Grid */}
      <div className="mb-8 hidden grid-cols-2 gap-4 sm:grid-cols-3 md:grid md:grid-cols-5 lg:grid-cols-5">
        {roomOptions.map((option, index) => {
          const colors = getRoomColors(option.id);
          const isSelected = selectedFormat === option;
          const description =
            roomDescriptions[option.id] || roomDescriptions.default;
          const gradientColor = getRoomGradientColor(option.id);

          return (
            <div
              key={index}
              className={cn(
                "group bg-surface-1 relative flex flex-col overflow-hidden rounded-xl border-2 p-4 transition-all duration-300",
                isSelected ? "scale-105 shadow-lg" : "hover:scale-[1.02]",
              )}
              style={{
                borderColor: `${gradientColor}70`,
              }}
            >
              {/* Gradient corner detail */}
              <div
                className={cn(
                  "pointer-events-none absolute top-0 left-0 h-52 w-52 transition-opacity duration-200",
                  isSelected ? "opacity-35" : "opacity-20",
                )}
                style={{
                  background: `radial-gradient(circle at top left, ${gradientColor} 0%, transparent 70%)`,
                }}
              />

              {/* Color accent bar - minimal */}
              <div
                className={cn(
                  "absolute top-0 right-0 left-0 h-1 rounded-t-xl transition-all duration-200",
                  colors.bg,
                )}
              />

              {/* Room Type */}
              <div className="relative z-10 mt-1 mb-3 text-center">
                <div
                  className={cn(
                    "mb-1 text-xs font-medium transition-colors duration-200",
                    isSelected ? "text-text" : "text-text-muted",
                  )}
                >
                  Habitación
                </div>
                <h3
                  className={cn(
                    "mb-1 text-sm font-semibold transition-colors duration-200",
                    isSelected ? colors.textHover : "text-text",
                  )}
                >
                  {option.label}
                </h3>
                <p
                  className={cn(
                    "text-xs leading-tight transition-colors duration-200",
                    isSelected ? "text-text" : "text-text-muted",
                  )}
                >
                  {description}
                </p>
              </div>

              {/* Icon and Capacity */}
              <div className="relative z-10 mb-4 flex justify-center">
                {getRoomIcon(option.id, isSelected)}
              </div>

              {/* Price */}
              <div className="relative z-10 mb-4 text-center">
                <div
                  className={cn(
                    "mb-1 text-xs font-medium transition-colors duration-200",
                    isSelected ? "text-text" : "text-text-muted",
                  )}
                >
                  Desde
                </div>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-lg font-bold transition-colors duration-200",
                    isSelected ? colors.textHover : "text-text",
                  )}
                >
                  ${option.price.toLocaleString("es-CL")}
                  <span className="text-text-muted text-xs font-normal">
                    / Noche
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => handleOptionClick(option)}
                className={cn(
                  "relative z-10 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                  isSelected ? "text-white shadow-sm" : "text-text",
                )}
                style={{
                  backgroundColor: isSelected
                    ? `${gradientColor}BB` // 80% opacity for moderate intensity when selected
                    : `${gradientColor}30`, // 20% opacity for lighter color when not selected
                }}
              >
                {isSelected ? "Seleccionado" : "Ver habitaciones"}
                <LightEffect />
              </button>
            </div>
          );
        })}
      </div>

      <AvailableRoomsSpan />
    </div>
  );
};
