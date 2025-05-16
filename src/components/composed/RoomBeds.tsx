import { BedDouble, BedSingle } from "lucide-react";
import { BunkBed } from "@/lib/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RoomBedsProps = {
  beds: string[];
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

export function RoomBeds({ beds }: RoomBedsProps) {
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

  return (
    <section className=" ">
      <p className="font-bold pb-1 !font-body">Camas</p>
      {/* ─── Lista de íconos con tooltip (desktop / tablet) ─── */}
      <div className="hidden sm:flex flex-wrap gap-1">
        {processedBeds.map((bedId, index) => {
          const Icon = BED_ICONS[bedId];
          return (
            <TooltipProvider key={`${bedId}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative h-8 w-8 border border-border flex items-center justify-center bg-white/50">
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

      {/* ─── Lista simple (solo móvil) ─── */}
      <ul className="flex flex-col gap-1 md:mb-6 sm:hidden">
        {processedBeds.map((bedId, index) => {
          const Icon = BED_ICONS[bedId];
          return (
            <li key={`${bedId}-${index}`} className="flex items-center gap-3">
              <div className="h-8 w-8 border border-border flex items-center justify-center bg-white/50">
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <span className="text-sm">{BED_LABELS[bedId]}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
