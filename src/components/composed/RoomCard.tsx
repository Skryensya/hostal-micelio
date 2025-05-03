"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ROOM_OPTIONS from "@/db/ROOM_OPTIONS.json";
import { WavyDivider } from "@/components/composed/WavyDivider";
import { User } from "lucide-react";
type RoomCardProps = Partial<RoomType> & {
  onViewDetails?: () => void;
  selectedFormat?: string | null;
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
    <div className="relative items-start justify-start cursor-pointer grid grid-cols-1 h-full w-full group bg-surface-2 text-text rounded-[2rem] focus:outline-offset-4 overflow-hidden isolate shadow-md  ">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 w-full ">
        <div className="bg-surface-2 z-10 relative flex justify-between items-end px-4 pt-1">
          <div className="flex flex-col items-start translate-y-1  ">
            <span className="text-xs translate-y-1 text-text-muted">
              Parque Nacional
            </span>
            <h3 className="font-bold text-xl">{name}</h3>
          </div>
          <div className="flex items-center mb-2 text-xs">
            <User className="w-4 h-4" /> {capacity}
          </div>
        </div>
        <WavyDivider direction="bottom" backgroundClass="bg-surface-2" />
      </div>

      {/* Carousel */}
      {images.length > 0 && (
        <div className="h-full w-full z-0 max-h-[250px] overflow-hidden border border-surface-2 rounded-t-[2rem]">
          <ImageCarousel
            imgs={images}
            aspectRatio="card"
            className="overflow-hidden"
          />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col justify-between px-3 py-2 min-h-40 h-full">
        <p className="text-sm  pb-10">{description}</p>

        <div className="flex items-center gap-2"></div>
        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t pt-2 pl-2">
          <div className="flex flex-col items-start gap-1">
            <div className="text-xs font-bold font-mono leading-[20px]">
              Habitación {roomFormat}
            </div>
            <div className="pb-1">
              <span className="text-sm font-bold font-mono leading-[20px]">
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

      {/* Se extrae la lógica de las camas a nuestro componente BedIcons */}
    </div>
  );
}
