import { 
  EggFried, 
  Home, 
  Toilet, 
  CookingPot, 
  Wifi, 
  Mars, 
  Venus, 
  KeyRound,
  BedDouble,
  BedSingle,
  Users,
  Bath,
  Tag
} from "lucide-react";
import { BunkBed } from "@/lib/icons"; 
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Amenity = {
  id: string;
  label: string;
  featured: boolean;
  color: string;
  order: number;
};

type RoomBentoGridProps = {
  amenities: Amenity[];
  beds: string[];
  capacity: number;
  hasPrivateToilet: boolean;
  formatLabel?: string;
  price: number;
};

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  breakfast: EggFried,
  "shared-bathroom": Toilet,
  "shared-spaces": Home,
  "private-bathroom": Toilet,
  "shared-kitchen": CookingPot,
  wifi: Wifi,
  "male-only-room": Mars,
  "female-only-room": Venus,
};

const BED_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  B01: BedDouble,
  B02: BedSingle,
  B03: BunkBed,
  B04: BunkBed,
};

const BED_LABELS: Record<string, string> = {
  B01: "Cama matrimonial",
  B02: "Cama individual",
  B03: "Cama camarote",
  B04: "Cama camarote",
};

const AMENITY_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  breakfast: { bg: "bg-orange-50/50", border: "border-orange-200/60", text: "text-orange-700", accent: "text-orange-500" },
  "shared-bathroom": { bg: "bg-cyan-50/50", border: "border-cyan-200/60", text: "text-cyan-700", accent: "text-cyan-500" },
  "shared-spaces": { bg: "bg-indigo-50/50", border: "border-indigo-200/60", text: "text-indigo-700", accent: "text-indigo-500" },
  "private-bathroom": { bg: "bg-blue-50/50", border: "border-blue-200/60", text: "text-blue-700", accent: "text-blue-500" },
  "shared-kitchen": { bg: "bg-amber-50/50", border: "border-amber-200/60", text: "text-amber-700", accent: "text-amber-500" },
  wifi: { bg: "bg-purple-50/50", border: "border-purple-200/60", text: "text-purple-700", accent: "text-purple-500" },
  "male-only-room": { bg: "bg-sky-50/50", border: "border-sky-200/60", text: "text-sky-700", accent: "text-sky-500" },
  "female-only-room": { bg: "bg-pink-50/50", border: "border-pink-200/60", text: "text-pink-700", accent: "text-pink-500" },
};

const BED_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  B01: { bg: "bg-rose-50/50", border: "border-rose-200/60", text: "text-rose-700", accent: "text-rose-500" },
  B02: { bg: "bg-blue-50/50", border: "border-blue-200/60", text: "text-blue-700", accent: "text-blue-500" },
  B03: { bg: "bg-emerald-50/50", border: "border-emerald-200/60", text: "text-emerald-700", accent: "text-emerald-500" },
  B04: { bg: "bg-emerald-50/50", border: "border-emerald-200/60", text: "text-emerald-700", accent: "text-emerald-500" },
};

export function RoomBentoGrid({ 
  amenities, 
  beds, 
  capacity, 
  hasPrivateToilet, 
  formatLabel,  
}: RoomBentoGridProps) {
  
  // Process beds to group bunks
  const processedBeds = beds.reduce((acc: string[], bed, index, array) => {
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
  }, []);

  // Count bed types
  const bedCounts = processedBeds.reduce((acc: Record<string, number>, bedId) => {
    acc[bedId] = (acc[bedId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Detalles de la habitación</h2>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Capacity Card */}
          <Card className="p-4 bg-gray-50/50 border-gray-200/60 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100/80 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Capacidad</p>
                <p className="text-xs text-gray-600">{capacity} personas</p>
              </div>
            </div>
          </Card>

          {/* Bathroom Card */}
          <Card className="p-4 bg-cyan-50/50 border-cyan-200/60 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100/80 rounded-lg relative">
                <Bath className="h-5 w-5 text-cyan-600" />
                {hasPrivateToilet && (
                  <div className="absolute -right-1 -top-1">
                    <KeyRound className="h-3 w-3 text-yellow-500" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-900">Baño</p>
                <p className="text-xs text-cyan-700">
                  {hasPrivateToilet ? "Privado" : "Compartido"}
                </p>
              </div>
            </div>
          </Card>

          {/* Format Card */}
          {formatLabel && (
            <Card className="p-4 bg-indigo-50/50 border-indigo-200/60 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100/80 rounded-lg">
                  <Tag className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">Formato</p>
                  <p className="text-xs text-indigo-700">{formatLabel}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Beds Cards */}
          {Object.entries(bedCounts).map(([bedId, count]) => {
            const Icon = BED_ICONS[bedId];
            const colors = BED_COLORS[bedId];
            const label = BED_LABELS[bedId];
            
            return (
              <Card 
                key={bedId} 
                className={cn(
                  "p-4 hover:shadow-sm transition-shadow",
                  colors.bg,
                  colors.border
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", colors.bg)}>
                    {Icon && <Icon className={cn("h-5 w-5", colors.accent)} />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", colors.text)}>
                      {count > 1 ? `${count}x ${label}` : label}
                    </p>
                    <p className={cn("text-xs", colors.text, "opacity-70")}>
                      {bedId === "B03" || bedId === "B04" ? "Camarote" : bedId === "B01" ? "Matrimonial" : "Individual"}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Amenities Cards */}
          {amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity.id];
            const colors = AMENITY_COLORS[amenity.id];
            
            return (
              <Card 
                key={amenity.id} 
                className={cn(
                  "p-4 hover:shadow-sm transition-shadow",
                  colors.bg,
                  colors.border
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg relative", colors.bg)}>
                    {Icon && <Icon className={cn("h-5 w-5", colors.accent)} />}
                    {amenity.id === "private-bathroom" && (
                      <div className="absolute -right-1 -top-1">
                        <KeyRound className="h-3 w-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", colors.text)}>
                      {amenity.label}
                    </p>
                    <p className={cn("text-xs", colors.text, "opacity-70")}>
                      Incluido
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}