"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ROOM_OPTIONS from "@/db/ROOM_OPTIONS.json";
import { WavyDivider } from "@/components/composed/WavyDivider";
import {
  User,
  EggFried,
  Toilet,
  Home,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AMENITIES_DICTIONARY = {
  breakfast: {
    icon: EggFried,
    label: "Desayuno incluido",
  },
  "shared-bathroom": {
    icon: Toilet,
    label: "Uso de baños compartidos",
  },
  "private-bathroom": {
    icon: Toilet,
    label: "Acceso a baño privado",
  },
  "shared-spaces": {
    icon: Home,
    label: "Uso de los espacios comunes",
  },
} as const;

type RoomCardProps = Partial<RoomType> & {
  onViewDetails?: () => void;
  selectedFormat?: string | null;
  amenities?: (keyof typeof AMENITIES_DICTIONARY)[];
};

export default function RoomCard({
  slug,
  name,
  onViewDetails,
  selectedFormat,
  defaultFormat,
  hasPrivateToilet,
  // beds, beds es un arreglo de IDs (ej. ["B01", "B03", "B04"])
  capacity,
  description,
  amenities = [],
}: RoomCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Cálculo del precio de la habitación
  const roomPrice = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy) return null;
    const roomOption = ROOM_OPTIONS.find(
      (option: RoomOption) => option.id === searchBy
    );
    const basePrice = roomOption ? roomOption.price : 0;
    const privateToiletPrice = hasPrivateToilet ? 10000 : 0;
    return basePrice + privateToiletPrice;
  }, [selectedFormat, defaultFormat, hasPrivateToilet]);

  const roomFormat = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy) return null;
    const roomOption = ROOM_OPTIONS.find(
      (option: RoomOption) => option.id === searchBy
    );
    return roomOption ? roomOption.label : null;
  }, [selectedFormat, defaultFormat]);

  const images = useMemo(() => ROOM_IMAGES[slug] || [], [slug]);

  useEffect(() => {
    const imgPromises = images.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        })
    );
    Promise.all(imgPromises).then(() => setIsLoading(false));
  }, [images]);

  if (isLoading) {
    return <RoomCardSkeleton />;
  }

  return (
    <div className="relative items-start justify-start cursor-pointer flex flex-col h-full w-full group bg-surface-2 text-text rounded-[1.6rem] focus:outline-offset-4 overflow-hidden isolate shadow-md @container">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 w-full ">
        <div className="bg-surface-2 z-10 relative flex justify-between items-end px-4 pt-1 ">
          <div className="flex flex-col items-start translate-y-1  ">
            <span className="text-xs translate-y-1 text-text-muted">
              Parque Nacional
            </span>
            <h3 className="font-bold text-xl">{name}</h3>
          </div>
          <div className="items-center mb-2 text-xs flex @max-xs:hidden">
            <User className="w-4 h-4" /> {capacity}
          </div>
        </div>
        <WavyDivider direction="bottom" backgroundClass="bg-surface-2" />
      </div>

      {/* Carousel */}
      {images.length > 0 && (
        <div className="h-full w-full z-0 aspect-square overflow-hidden border border-surface-2 rounded-t-[1.6rem]">
          <ImageCarousel
            imgs={images}
            aspectRatio="card"
            className="overflow-hidden"
          />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col justify-between px-3 py-2 h-full w-full">
        <div>
          <h4 className="text-sm font-semibold mb-2">Amenidades</h4>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((key) => {
              const amenity = AMENITIES_DICTIONARY[key];
              if (!amenity) return null;
              const IconComponent = amenity.icon;
              return (
                <TooltipProvider key={key}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 text-sm">
                        <IconComponent className="w-4 h-4 text-text-muted" />
                        <span>{amenity.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{amenity.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>

        <p className="text-sm pb-10">{description}</p>

        <div className="flex items-center gap-2"></div>
        {/* Footer */}
        <div className="border-t pt-2">
          <div className="text-xs font-semibold font-mono leading-[20px]">
            Habitación {roomFormat}
          </div>
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex flex-col items-start gap-1">
              <div className="pb-1  @max-sm:flex-col  @max-sm:flex">
                <span className="text-sm font-thin font-mono leading-[20px] @max-xs:text-xs">
                  {roomPrice.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                  CLP
                </span>
                <span className="text-sm text-text-muted"> / Noche</span>
              </div>
            </div>
            <Button
              className="mr-1"
              variant="ghost"
              size="small"
              onClick={onViewDetails}
              tabIndex={-1}
            >
              <span>Ver detalles</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Se extrae la lógica de las camas a nuestro componente BedIcons */}
    </div>
  );
}
