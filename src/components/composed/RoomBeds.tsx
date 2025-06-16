import { BedDouble, BedSingle } from "lucide-react";
import { BunkBed } from "@/lib/icons";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RoomBedsProps = {
  beds: string[];
  roomType?: string;
};

const BED_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  B01: BedDouble, // Matrimonial
  B02: BedSingle, // Individual
  B03: BunkBed, // Litera
  B04: BunkBed, // Litera
};

const BED_LABELS: Record<string, string> = {
  B01: "Cama matrimonial",
  B02: "Cama individual",
  B03: "Cama camarote",
  B04: "Cama camarote",
};

export function RoomBeds({ beds, roomType }: RoomBedsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!beds?.length) return null;

  // Procesar las camas para unir literas solo cuando vienen en pares
  const processedBeds = beds.reduce((acc: string[], bed, index, array) => {
    // Si es una litera superior (B03)
    if (bed === "B03") {
      // Verificar si la siguiente cama es una litera inferior (B04)
      if (array[index + 1] === "B04") {
        // Si es un par, agregar solo una litera
        acc.push("B03");
        // Saltar la siguiente cama (B04)
        array.splice(index + 1, 1);
      } else {
        // Si no tiene pareja, agregar la litera superior
        acc.push(bed);
      }
    }
    // Si es una litera inferior (B04) y no fue procesada como parte de un par
    else if (bed === "B04" && array[index - 1] !== "B03") {
      acc.push(bed);
    }
    // Para cualquier otra cama
    else if (bed !== "B04") {
      acc.push(bed);
    }
    return acc;
  }, []);

  // Contar y agrupar las camas por tipo para la lista expandida
  const groupedBeds = processedBeds.reduce(
    (acc: Record<string, number>, bedId) => {
      acc[bedId] = (acc[bedId] || 0) + 1;
      return acc;
    },
    {},
  );

  // Función para pluralizar correctamente las camas
  const pluralizeBed = (label: string, count: number) => {
    if (count === 1) return label;

    const pluralRules = {
      "Cama individual": `${count} camas individuales`,
      "Cama matrimonial": `${count} camas matrimoniales`,
      "Cama camarote": `${count} camas camarote`,
    };

    return pluralRules[label] || `${count} ${label.toLowerCase()}s`;
  };

  // Crear la lista de camas con cantidades
  const bedsList = Object.entries(groupedBeds).map(([bedId, count]) => {
    const label = BED_LABELS[bedId];
    return pluralizeBed(label, count);
  });

  // Obtener los colores del tipo de habitación o usar un color por defecto

  return (
    <section className=" ">
      <span className="text-text-muted mb-1 flex items-center gap-1 text-sm">
        Camas
      </span>
      {/* ─── Lista de íconos con tooltip (desktop / tablet) ─── */}
      <div className="hidden flex-wrap gap-1 sm:flex">
        {processedBeds.map((bedId, index) => {
          const Icon = BED_ICONS[bedId];
          return (
            <TooltipProvider key={`${bedId}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="border-border relative flex h-8 w-8 items-center justify-center rounded border bg-white/50">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{BED_LABELS[bedId]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* ─── Iconos horizontales (solo móvil) ─── */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded p-1 transition-all duration-200 hover:bg-white/30"
        >
          {processedBeds.map((bedId, index) => {
            const Icon = BED_ICONS[bedId];
            return (
              <div
                key={`${bedId}-${index}`}
                className="border-border flex h-8 w-8 items-center justify-center rounded border bg-white/50"
              >
                {Icon && <Icon className="h-5 w-5" />}
              </div>
            );
          })}
        </button>
      </div>

      {/* ─── Lista expandida (solo móvil) ─── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mt-2 flex flex-col gap-1 overflow-hidden sm:hidden"
          >
            {bedsList.map((bedLabel, index) => (
              <li
                key={index}
                className="flex items-center gap-2 rounded py-0 text-sm pl-3"
              >
                <div
                  className={`h-1 w-1 rounded-full bg-text flex-shrink-0`}
                />
                <span className="text-text">{bedLabel}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
