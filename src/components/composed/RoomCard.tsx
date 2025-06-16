"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";

import { User } from "lucide-react";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import { RoomAmenities } from "./RoomAmenities";
import { RoomBeds } from "./RoomBeds";

// Function to get room type color
const getRoomTypeColor = (roomId: string | undefined) => {
  const roomColorMap = {
    HCO: "#3b82f6", // blue-500
    HIN: "#10b981", // emerald-500
    HDB: "#8b5cf6", // purple-500
    HMA: "#f43f5e", // rose-500
    HT: "#f59e0b", // amber-500
  };
  return roomColorMap[roomId] || "#6b7280"; // gray-500 as fallback
};

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
      (option: RoomOption) => option.id === searchBy,
    );
    const basePrice = roomOption ? roomOption.price : 0;
    const privateToiletPrice = hasPrivateToilet ? 10000 : 0;
    return basePrice + privateToiletPrice;
  }, [selectedFormat, defaultFormat, hasPrivateToilet]);

  const roomFormat = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy) return null;
    const roomOption = ROOM_FORMATS.find(
      (option: RoomOption) => option.id === searchBy,
    );
    return roomOption ? roomOption : null;
  }, [selectedFormat, defaultFormat]);

  const amenities = useMemo(() => {
    const searchBy = roomFormat?.amenities;
    if (!searchBy) return null;
    let roomAmenities = ROOM_AMENITIES.filter(
      (amenity) => searchBy.includes(amenity.id) && amenity.featured,
    );

    const PrivateBathroomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "private-bathroom",
    );
    const FemaleOnlyRoomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "female-only-room",
    );
    const MaleOnlyRoomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "male-only-room",
    );

    if (hasPrivateToilet) {
      roomAmenities.push(PrivateBathroomAmenity);
      // remote the shared bathroom
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "shared-bathroom",
      );
    }
    if (gender === "male") roomAmenities.push(MaleOnlyRoomAmenity);
    if (gender === "female") roomAmenities.push(FemaleOnlyRoomAmenity);

    if (selectedFormat && selectedFormat !== "HCO") {
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "female-only-room",
      );
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "male-only-room",
      );
    }

    return roomAmenities.sort((a, b) => a.order - b.order);
  }, [roomFormat, hasPrivateToilet, gender, selectedFormat]);

  const images = useMemo(() => ROOM_IMAGES[slug] || [], [slug]);

  useEffect(() => {
    const imgPromises = images.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        }),
    );
    Promise.all(imgPromises).then(() => setIsLoading(false));
  }, [images]);

  if (isLoading) {
    return <RoomCardSkeleton />;
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow border-2"
      style={{
        borderColor: `${getRoomTypeColor(roomFormat?.id)}30`
      }}
    >
      {/* Gradient background container */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${getRoomTypeColor(roomFormat?.id)}35 0%, ${getRoomTypeColor(roomFormat?.id)}15 40%, hsl(var(--surface-1)) 80%, hsl(var(--surface-1)) 100%)`
        }}
      />
      
      {/* Content container */}
      <div className="relative flex flex-col gap-4 p-4 md:flex-row md:gap-6">
      {/* Image Section */}
      {images.length > 0 && (
        <div className="w-full flex-shrink-0 md:w-80">
          <div className="h-48 w-full overflow-hidden rounded-xl md:h-64">
            <ImageCarousel imgs={images} className="h-full overflow-hidden" />
          </div>
        </div>
      )}

      {/* Content Section - Unstyled div */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Header */}
        <div className="mb-3">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="mb-2 text-xl font-bold">{name}</h3>
              
              {/* Tags container */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${getRoomTypeColor(roomFormat?.id)}20`,
                    color: getRoomTypeColor(roomFormat?.id),
                  }}
                >
                  Habitación {roomFormat?.label}
                </span>
                
                {gender && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      gender === "male"
                        ? "bg-blue-100 text-blue-700"
                        : gender === "female"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {gender === "male"
                      ? "Solo hombres"
                      : gender === "female"
                        ? "Solo mujeres"
                        : "Mixta"}
                  </span>
                )}
                
                {/* Desayuno incluido tag - solo para habitaciones no compartidas */}
                {roomFormat?.id !== "HCO" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                    Desayuno incluido
                  </span>
                )}
              </div>
              
              {capacity && (
                <div className="text-text-muted flex items-center gap-1 text-sm">
                  <User className="h-3 w-3" />
                  <span>
                    Hasta {capacity} {capacity === 1 ? "persona" : "personas"}
                  </span>
                </div>
              )}
            </div>
            {/* Price - Prominente */}
            <div className="text-right mt-1 md:mt-0">
              <div
                className="text-xl font-bold md:text-2xl"
                style={{ color: getRoomTypeColor(roomFormat?.id) }}
              >
                ${roomPrice?.toLocaleString("es-CL")}
              </div>
              <div className="text-text-muted text-xs">por noche</div>
            </div>
          </div>

          <p className="text-text line-clamp-2 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Key Features - Compact */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-3 text-xs">
            {hasPrivateToilet && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 font-medium text-green-700">
                ✓ Baño privado
              </span>
            )}
          </div>
        </div>

        {/* Amenities & Beds - Compact */}
        <div className="mb-4 grid md:grid-cols-9 gap-4">
          <div className="space-y-1 col-span-2">
            <RoomBeds beds={beds} />
          </div>
          <div className="space-y-1 col-span-4">
            <RoomAmenities amenities={amenities} />
          </div>
        </div>

        {/* CTA */}
        {/* <div className="flex items-center justify-between">
          <div className="text-text-muted text-xs">
            Parque Nacional Villarrica
          </div>
          <Button variant="primary" onClick={onViewDetails} className="px-6">
            Ver disponibilidad
          </Button>
        </div> */}
      </div>
    </div>
    </div>
  );
}
