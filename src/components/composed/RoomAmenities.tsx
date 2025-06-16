import {
  EggFried,
  Home,
  Toilet,
  CookingPot,
  Wifi,
  Mars,
  Venus,
  KeyRound,
} from "lucide-react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Amenity = {
  id: string;
  label: string;
  featured: boolean;
  color: string; // ej. "text-green-600"
  order: number;
};

type RoomAmenitiesProps = {
  amenities: Amenity[] | null;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  breakfast: EggFried,
  "shared-bathroom": Toilet,
  "shared-spaces": Home,
  "private-bathroom": Toilet,
  "shared-kitchen": CookingPot,
  wifi: Wifi,
  "male-only-room": Mars,
  "female-only-room": Venus,
};

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!amenities?.length) return null;

  return (
    <section className=" ">
      <span className="text-text-muted mb-1 flex items-center gap-1 text-sm">
        Comodidades
      </span>
      {/* ─── Lista de íconos con tooltip (desktop / tablet) ─── */}
      <div className="hidden flex-wrap gap-1 sm:flex">
        {amenities.map((a) => {
          const Icon = ICONS[a.id];
          return (
            <TooltipProvider key={a.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded ${a.color}`}
                  >
                    {Icon && <Icon className={`h-5 w-5`} />}
                    {a.id === "private-bathroom" && (
                      <div className="absolute -right-1.5 -bottom-1.5 flex items-center justify-center">
                        <KeyRound className="h-6 w-6 fill-yellow-400 stroke-white stroke-2 drop-shadow-md" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{a.label}</p>
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
          {amenities.map((a) => {
            const Icon = ICONS[a.id];
            return (
              <div
                key={a.id}
                className={`border-border relative flex h-8 w-8 items-center justify-center rounded border ${a.color}`}
              >
                {Icon && <Icon className={`h-5 w-5`} />}
                {a.id === "private-bathroom" && (
                  <div className="absolute -right-1.5 -bottom-1.5 flex items-center justify-center">
                    <KeyRound className="h-6 w-6 fill-yellow-400 stroke-white stroke-2 drop-shadow-md" />
                  </div>
                )}
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
            {amenities.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-2 rounded py-0 pl-3 text-sm"
              >
                <div className="bg-text h-1 w-1 flex-shrink-0 rounded-full" />
                <span className="text-text">{a.label}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
