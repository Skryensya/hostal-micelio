"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect, useState, useMemo } from "react";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";

import { User } from "lucide-react";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import { RoomAmenities } from "./RoomAmenities";
import { RoomBeds } from "./RoomBeds";

// Function to get room type color with improved contrast
const getRoomTypeColor = (roomId: string | undefined) => {
  const roomColorMap = {
    HCO: "#10b981", // emerald-500
    HIN: "#3b82f6", // blue-500
    HDB: "#8b5cf6", // purple-500
    HMA: "#f43f5e", // rose-500
    HT: "#f59e0b",  // amber-500
  };
  return roomColorMap[roomId] || "#6b7280"; // gray-500 as fallback
};

// Function to get consistent badge styles - ALL badges will have the same structure
const getBadgeStyles = (
  variant:
    | "primary"
    | "gender-male"
    | "gender-female"
    | "breakfast"
    | "private-bathroom"
    | "mixed",
  customColor?: string,
) => {
  // Base classes identical for ALL badges - SMALLER SIZE
  const baseClasses =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm";

  const variants = {
    primary: customColor
      ? {
          backgroundColor: `${customColor}15`, // Light opacity for subtle look
          color: customColor,
          border: `1px solid ${customColor}30`,
        }
      : {},
    "gender-male": {
      backgroundColor: "#dbeafe", // blue-100
      color: "#3b82f6", // blue-500
      border: "1px solid #93c5fd", // blue-300
    },
    "gender-female": {
      backgroundColor: "#fce7f3", // pink-100
      color: "#f43f5e", // rose-500
      border: "1px solid #f9a8d4", // pink-300
    },
    mixed: {
      backgroundColor: "#f3f4f6", // gray-100
      color: "#6b7280", // gray-500
      border: "1px solid #d1d5db", // gray-300
    },
    breakfast: {
      backgroundColor: "#fef3c7", // amber-100
      color: "#f59e0b", // amber-500
      border: "1px solid #fcd34d", // amber-300
    },
    "private-bathroom": {
      backgroundColor: "#d1fae5", // emerald-100
      color: "#10b981", // emerald-500
      border: "1px solid #86efac", // emerald-300
    },
  };

  return { className: baseClasses, style: variants[variant] };
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
      className="relative overflow-hidden rounded-3xl border-2 shadow"
      style={{
        borderColor: `${getRoomTypeColor(roomFormat?.id)}30`,
      }}
    >
      {/* Gradient background container */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${getRoomTypeColor(roomFormat?.id)}35 0%, ${getRoomTypeColor(roomFormat?.id)}15 40%, hsl(var(--surface-1)) 80%, hsl(var(--surface-1)) 100%)`,
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
                <div className="mb-2 flex flex-wrap gap-2">
                  {(() => {
                    const primaryBadge = getBadgeStyles(
                      "primary",
                      getRoomTypeColor(roomFormat?.id),
                    );
                    return (
                      <span
                        className={primaryBadge.className}
                        style={primaryBadge.style}
                      >
                        Habitación {roomFormat?.label}
                      </span>
                    );
                  })()}

                  {gender &&
                    (() => {
                      const genderVariant =
                        gender === "male"
                          ? "gender-male"
                          : gender === "female"
                            ? "gender-female"
                            : "mixed";
                      const genderBadge = getBadgeStyles(genderVariant);
                      return (
                        <span
                          className={genderBadge.className}
                          style={genderBadge.style}
                        >
                          {gender === "male"
                            ? "Solo hombres"
                            : gender === "female"
                              ? "Solo mujeres"
                              : "Mixta"}
                        </span>
                      );
                    })()}

                  {/* Desayuno incluido tag - solo para habitaciones no compartidas */}
                  {roomFormat?.id !== "HCO" &&
                    (() => {
                      const breakfastBadge = getBadgeStyles("breakfast");
                      return (
                        <span
                          className={breakfastBadge.className}
                          style={breakfastBadge.style}
                        >
                          Desayuno incluido
                        </span>
                      );
                    })()}

                  {/* Baño privado tag */}
                  {hasPrivateToilet &&
                    (() => {
                      const bathroomBadge = getBadgeStyles("private-bathroom");
                      return (
                        <span
                          className={bathroomBadge.className}
                          style={bathroomBadge.style}
                        >
                          Baño privado
                        </span>
                      );
                    })()}
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
              <div className="mt-1 text-right md:mt-0">
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

          {/* Amenities & Beds & CTA - Same line */}
          <div className="grid items-end gap-4 md:grid-cols-9">
            <div className="col-span-2 space-y-1">
              <RoomBeds beds={beds} />
            </div>
            <div className="col-span-4 space-y-1">
              <RoomAmenities amenities={amenities} />
            </div>
            <div className="items col-span-3 flex justify-end">
                              <button
                  onClick={onViewDetails}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                  style={{
                    backgroundColor: `${getRoomTypeColor(roomFormat?.id)}15`, // 15% opacity for subtle background
                    color: getRoomTypeColor(roomFormat?.id),
                    border: `1px solid ${getRoomTypeColor(roomFormat?.id)}30`, // 30% opacity border
                  }}
                >
                Ver más detalles
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
