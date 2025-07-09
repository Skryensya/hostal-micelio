import React, { useState } from "react";
import { BedDouble, BedSingle } from "lucide-react";
import { BunkBed } from "@/lib/icons";
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
  color: string;
  order: number;
};

type RoomFeaturesProps = {
  beds: string[];
  amenities: Amenity[] | null;
  roomType?: string;
};

// Bed configurations
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

const BED_COLORS: Record<string, string> = {
  B01: "bg-rose-50 border-rose-200 text-rose-600 shadow-sm", // Matrimonial
  B02: "bg-blue-50 border-blue-200 text-blue-600 shadow-sm", // Individual
  B03: "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm", // Camarote
  B04: "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm", // Camarote
};

const BED_TOOLTIP_COLORS: Record<string, { bg: string; text: string }> = {
  B01: { bg: "#fecaca", text: "#7f1d1d" }, // rose-300 bg, rose-900 text
  B02: { bg: "#93c5fd", text: "#1e3a8a" }, // blue-300 bg, blue-900 text
  B03: { bg: "#86efac", text: "#14532d" }, // emerald-300 bg, emerald-900 text
  B04: { bg: "#86efac", text: "#14532d" }, // emerald-300 bg, emerald-900 text
};

// Amenity configurations
const AMENITY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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
  breakfast: { bg: "#fed7aa", text: "#7c2d12" }, // orange-300 bg, orange-900 text
  "shared-bathroom": { bg: "#67e8f9", text: "#164e63" }, // cyan-300 bg, cyan-900 text
  "shared-spaces": { bg: "#a5b4fc", text: "#312e81" }, // indigo-300 bg, indigo-900 text
  "private-bathroom": { bg: "#93c5fd", text: "#1e3a8a" }, // blue-300 bg, blue-900 text
  "shared-kitchen": { bg: "#fcd34d", text: "#78350f" }, // amber-300 bg, amber-900 text
  wifi: { bg: "#c4b5fd", text: "#581c87" }, // purple-300 bg, purple-900 text
  "male-only-room": { bg: "#7dd3fc", text: "#0c4a6e" }, // sky-300 bg, sky-900 text
  "female-only-room": { bg: "#f9a8d4", text: "#831843" }, // pink-300 bg, pink-900 text
};

export function RoomFeatures({ beds, amenities }: RoomFeaturesProps) {
  const [openTooltips, setOpenTooltips] = useState<Set<string>>(new Set());

  const toggleTooltip = (id: string) => {
    setOpenTooltips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.clear(); // Close other tooltips
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Process beds (same logic as RoomBeds)
  const processedBeds =
    beds?.reduce((acc: string[], bed, index, array) => {
      if (bed === "B03") {
        if (array[index + 1] === "B04") {
          acc.push("B03");
          array.splice(index + 1, 1);
        } else {
          acc.push(bed);
        }
      } else if (bed === "B04" && array[index - 1] !== "B03") {
        acc.push(bed);
      } else if (bed !== "B04") {
        acc.push(bed);
      }
      return acc;
    }, []) || [];

  if (!beds?.length && !amenities?.length) return null;

  return (
    <TooltipProvider>
      <div className=" ">
        {/* Desktop layout - separate sections */}
        <div className="hidden grid-cols-2 gap-6 sm:grid">
          {/* Beds section */}
          {beds?.length > 0 && (
            <section>
              <span className="text-text-muted mb-1 flex items-center gap-1 text-sm">
                Camas
              </span>
              <div className="flex flex-wrap gap-1">
                {processedBeds.map((bedId, index) => {
                  const Icon = BED_ICONS[bedId];
                  const tooltipId = `bed-${bedId}-${index}`;
                  return (
                    <Tooltip
                      key={`${bedId}-${index}`}
                      open={openTooltips.has(tooltipId)}
                    >
                      <TooltipTrigger asChild>
                        <div
                          className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${BED_COLORS[bedId]} cursor-pointer`}
                          onClick={() => toggleTooltip(tooltipId)}
                        >
                          {Icon && <Icon className="h-5 w-5" />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="border-0 shadow-lg"
                        style={{
                          backgroundColor: BED_TOOLTIP_COLORS[bedId]?.bg,
                          color: BED_TOOLTIP_COLORS[bedId]?.text,
                        }}
                        onPointerDownOutside={() => setOpenTooltips(new Set())}
                      >
                        <p>{BED_LABELS[bedId]}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </section>
          )}

          {/* Amenities section */}
          {amenities?.length > 0 && (
            <section>
              <span className="text-text-muted mb-1 flex items-center gap-1 text-sm">
                Comodidades
              </span>
              <div className="flex flex-wrap gap-1">
                {amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a.id];
                  const tooltipId = `amenity-${a.id}`;
                  return (
                    <Tooltip key={a.id} open={openTooltips.has(tooltipId)}>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${AMENITY_COLORS[a.id] || a.color} cursor-pointer`}
                          onClick={() => toggleTooltip(tooltipId)}
                        >
                          {Icon && <Icon className="h-5 w-5" />}
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
                        onPointerDownOutside={() => setOpenTooltips(new Set())}
                      >
                        <p>{a.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
      {/* Mobile layout - unified */}
      <div className="sm:hidden">
        <div className="space-y-2">
          {/* Beds section */}
          {beds?.length > 0 && (
            <div>
              <span className="text-text-muted mb-1 flex items-center gap-1 text-sm">
                Camas
              </span>
              <div className="flex items-center gap-1">
                {processedBeds.map((bedId, index) => {
                  const Icon = BED_ICONS[bedId];
                  return (
                    <div
                      key={`bed-${bedId}-${index}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${BED_COLORS[bedId]}`}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amenities section */}
          {amenities?.length > 0 && (
            <div>
              <span className="text-text-muted mb-1 flex items-center gap-1 text-sm">
                Comodidades
              </span>
              <div className="flex items-center gap-1">
                {amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity.id];
                  return (
                    <div
                      key={`amenity-${amenity.id}`}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${AMENITY_COLORS[amenity.id] || amenity.color}`}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      {amenity.id === "private-bathroom" && (
                        <div className="absolute -right-1.5 -bottom-1.5 flex items-center justify-center">
                          <KeyRound className="h-5 w-5 fill-yellow-400 stroke-white stroke-2 drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
