"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { WavyDivider } from "@/components/composed/WavyDivider";
import { User } from "lucide-react";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import { RoomAmenities } from "./RoomAmenities";
import { RoomBeds } from "./RoomBeds";

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
  capacity,
  description,
  gender,
  beds,
}: RoomCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Cálculo del precio de la habitación
  const roomPrice = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy) return null;
    const roomOption = ROOM_FORMATS.find(
      (option: RoomOption) => option.id === searchBy
    );
    const basePrice = roomOption ? roomOption.price : 0;
    const privateToiletPrice = hasPrivateToilet ? 10000 : 0;
    return basePrice + privateToiletPrice;
  }, [selectedFormat, defaultFormat, hasPrivateToilet]);

  const roomFormat = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy) return null;
    const roomOption = ROOM_FORMATS.find(
      (option: RoomOption) => option.id === searchBy
    );
    return roomOption ? roomOption : null;
  }, [selectedFormat, defaultFormat]);

  const amenities = useMemo(() => {
    const searchBy = roomFormat?.amenities;
    if (!searchBy) return null;
    let roomAmenities = ROOM_AMENITIES.filter(
      (amenity) => searchBy.includes(amenity.id) && amenity.featured
    );

    const PrivateBathroomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "private-bathroom"
    );
    const FemaleOnlyRoomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "female-only-room"
    );
    const MaleOnlyRoomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "male-only-room"
    );

    if (hasPrivateToilet) {
      roomAmenities.push(PrivateBathroomAmenity);
      // remote the shared bathroom
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "shared-bathroom"
      );
    }
    if (gender === "male") roomAmenities.push(MaleOnlyRoomAmenity);
    if (gender === "female") roomAmenities.push(FemaleOnlyRoomAmenity);

    if (selectedFormat && selectedFormat !== "HCO") {
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "female-only-room"
      );
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "male-only-room"
      );
    }

    return roomAmenities.sort((a, b) => a.order - b.order);
  }, [roomFormat, hasPrivateToilet, gender]);

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
    <div className="relative items-start justify-start cursor-pointer flex flex-col h-fit md:h-full w-full group bg-surface-2 text-text rounded-[1.6rem] focus:outline-offset-4 overflow-hidden isolate shadow-md @container">
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
            <User className="w-5 h-5" /> {capacity}
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
      <div className="flex flex-col md:justify-between px-3 pt-2 h-full w-full">
        <div className="flex flex-col justify-between h-full gap-2 mb-4">
          <p className="text-sm   ">{description}</p>
          <div className="flex flex-col gap-2">
            <RoomBeds beds={beds} />
            <RoomAmenities amenities={amenities} />
          </div>
        </div>

        {/* Footer */}
        <div className="-mx-4 pt-4">
          <WavyDivider
            direction="top"
            backgroundClass="bg-primary/20"
            noAlpha
          />
          <div className="px-4 bg-primary/20 pb-4 pt-2 mt-[1px]">
            <div className="text-sm font-thin italic font-mono leading-[20px] pb-2">
              Habitación {roomFormat?.label}
            </div>
            <div className="flex items-center justify-between gap-2 w-full  ">
              <div className="px-4 py-1.5 flex gap-1 rounded-full bg-white/50">
                <span className="md:text-lg font-semibold italic font-mono leading-[20px]   @max-xs:text-xs">
                  {roomPrice.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                  CLP
                </span>
                <span className="text-sm text-text"> / Noche</span>
              </div>

              <Button
                className="mr-1"
                variant="primary"
                size="small"
                onClick={onViewDetails}
                tabIndex={-1}
              >
                <span>Ver detalles</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Se extrae la lógica de las camas a nuestro componente BedIcons */}
    </div>
  );
}
