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

const AMENITY_COLORS: Record<string, string> = {
  breakfast: "bg-orange-50 border-orange-200 text-orange-600 shadow-sm",
  "shared-bathroom": "bg-cyan-50 border-cyan-200 text-cyan-600 shadow-sm",
  "shared-spaces": "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm",
  "private-bathroom": "bg-blue-50 border-blue-200 text-blue-600 shadow-sm",
  "shared-kitchen": "bg-amber-50 border-amber-200 text-amber-600 shadow-sm",
  wifi: "bg-purple-50 border-purple-200 text-purple-600 shadow-sm",
  "male-only-room": "bg-sky-50 border-sky-200 text-sky-600 shadow-sm",
  "female-only-room": "bg-pink-50 border-pink-200 text-pink-600 shadow-sm",
};

const AMENITY_TOOLTIP_COLORS: Record<string, { bg: string; text: string }> = {
  breakfast: { bg: "#fff7ed", text: "#9a3412" }, // orange-50 bg, orange-800 text
  "shared-bathroom": { bg: "#ecfeff", text: "#155e75" }, // cyan-50 bg, cyan-800 text
  "shared-spaces": { bg: "#eef2ff", text: "#3730a3" }, // indigo-50 bg, indigo-800 text
  "private-bathroom": { bg: "#eff6ff", text: "#1e40af" }, // blue-50 bg, blue-800 text
  "shared-kitchen": { bg: "#fffbeb", text: "#92400e" }, // amber-50 bg, amber-800 text
  wifi: { bg: "#faf5ff", text: "#6b21a8" }, // purple-50 bg, purple-800 text
  "male-only-room": { bg: "#f0f9ff", text: "#075985" }, // sky-50 bg, sky-800 text
  "female-only-room": { bg: "#fdf2f8", text: "#9d174d" }, // pink-50 bg, pink-800 text
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
                    className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${AMENITY_COLORS[a.id] || a.color}`}
                  >
                    {Icon && <Icon className={`h-5 w-5`} strokeWidth={1.5} />}
                    {a.id === "private-bathroom" && (
                      <div className="absolute -right-1.5 -bottom-1.5 flex items-center justify-center">
                        <KeyRound className="h-5 w-5 fill-yellow-400 stroke-white stroke-2 drop-shadow-md" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  className="border-0 shadow-lg"
                  style={{
                    backgroundColor: AMENITY_TOOLTIP_COLORS[a.id]?.bg,
                    color: AMENITY_TOOLTIP_COLORS[a.id]?.text,
                  }}
                >
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
                className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${AMENITY_COLORS[a.id] || a.color}`}
              >
                {Icon && <Icon className={`h-5 w-5`} strokeWidth={1.5} />}
                {a.id === "private-bathroom" && (
                  <div className="absolute -right-1.5 -bottom-1.5 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 fill-yellow-400 stroke-white stroke-2 drop-shadow-md" />
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
