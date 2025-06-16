"use client";

// Removed Card imports - now using simple divs
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { RoomOption } from "@/lib/types";
import { Users, User, Undo } from "lucide-react";
import { useSelectionStore } from "@/store/useSelectionStore";
import { motion, AnimatePresence } from "framer-motion";
import { getRoomColors } from "@/lib/roomColors";
import { LightEffect } from "@/components/ui/LightEffect";

// Ordena las opciones por precio
const roomOptions = ROOM_FORMATS.sort((a, b) => a.price - b.price);

const getGradientColor = (roomId: string) => {
  // Mapeo específico por room ID para mayor precisión - colors with improved contrast
  const roomColorMap = {
    HCO: "#0891b2", // cyan-600 - celeste más claro y diferenciado
    HIN: "#047857", // emerald-700 - más intenso
    HDB: "#7c3aed", // purple-600 - más intenso
    HMA: "#be185d", // pink-700 - más romántico y apropiado
    HT: "#d97706", // amber-600 - más intenso
  };

  return roomColorMap[roomId] || "#374151"; // gray-700 as fallback - más intenso
};

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

export const RoomOptionsSelector = ({
  onSelect,
  filteredRoomsCount,
}: {
  onSelect: (option: RoomOption | null) => void;
  filteredRoomsCount: number;
}) => {
  const { selectedFormat, setSelectedFormat, clearSelectedFormat } =
    useSelectionStore();

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

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-bold sm:font-mono">
          Tipos de habitación
        </div>
        <div className="flex items-center gap-4">
          {selectedFormat && (
            <button
              onClick={handleReset}
              className="text-text hover:text-text flex items-center gap-1 text-sm transition-colors duration-200"
            >
              <Undo className="h-4 w-4" />
              <span>Ver todas</span>
            </button>
          )}
          <span className="text-text-muted text-sm">
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
            {filteredRoomsCount === 1 ? "habitación" : "habitaciones"}{" "}
            disponibles
          </span>
        </div>
      </div>

      {/* Room Types Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
        {roomOptions.map((option, index) => {
          const colors = getRoomColors(option.id);
          const isSelected = selectedFormat === option;
          const description =
            roomDescriptions[option.id] || roomDescriptions.default;
          const gradientColor = getGradientColor(option.id);

          return (
            <div
              key={index}
              className={cn(
                "group bg-surface-1 dark:bg-surface-2 relative flex flex-col overflow-hidden rounded-xl border-2 p-4 transition-all duration-300",
                isSelected
                  ? "scale-105 shadow-lg"
                  : "hover:scale-[1.02]",
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
                    "text-lg font-bold transition-colors duration-200",
                    isSelected ? colors.textHover : "text-text",
                  )}
                >
                  ${option.price.toLocaleString("es-CL")}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => handleOptionClick(option)}
                className={cn(
                  "relative z-10 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                  isSelected
                    ? "text-white shadow-sm"
                    : "text-gray-700",
                )}
                style={{
                  backgroundColor: isSelected 
                    ? `${gradientColor}90` // 80% opacity for moderate intensity when selected
                    : `${gradientColor}20`, // 20% opacity for lighter color when not selected
                }}
              >
                {isSelected ? "Seleccionado" : "Ver habitaciones"}
                <LightEffect />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
