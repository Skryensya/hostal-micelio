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
  if (!amenities?.length) return null;

  return (
    <section className=" ">
      <p className=" font-bold pb-1 !font-body">Comodidades</p>
      {/* ─── Lista de íconos con tooltip (desktop / tablet) ─── */}
      <div className="hidden sm:flex flex-wrap gap-1">
        {amenities.map((a) => {
          const Icon = ICONS[a.id];
          return (
            <TooltipProvider key={a.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={` relative h-8 w-8 border border-border flex items-center justify-center ${a.color}`}
                  >
                    {Icon && <Icon className={`h-5 w-5 `} />}
                    {a.id === "private-bathroom" && (
                      <div className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center">
                        <KeyRound className="h-5 w-5 scale-90 fill-yellow-300 stroke-black-300" />
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

      {/* ─── Lista simple (solo móvil) ─── */}
      <ul className="flex flex-col gap-1 md:mb-6 sm:hidden">
        {amenities.map((a) => {
          const Icon = ICONS[a.id];
          return (
            <li key={a.id} className="flex items-center gap-3">
              <div
                className={`relative h-8 w-8 border border-border flex items-center justify-center ${a.color}`}
              >
                {Icon && <Icon className={`h-5 w-5`} />}
                {a.id === "private-bathroom" && (
                  <div className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 scale-90 fill-yellow-300 stroke-black-300" />
                  </div>
                )}
              </div>
              <span className="text-sm">{a.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
