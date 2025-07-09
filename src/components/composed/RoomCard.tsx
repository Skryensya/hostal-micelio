"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import Link from "next/link";

// Add CSS animations for circular gradients
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes floatCircle1 {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes floatCircle2 {
      0% { transform: translate(0px, 0px) scale(0.8); }
      50% { transform: translate(-40px, 30px) scale(1.2); }
      100% { transform: translate(0px, 0px) scale(0.8); }
    }
    @keyframes floatCircle3 {
      0% { transform: translate(0px, 0px) scale(1.1); }
      40% { transform: translate(25px, 35px) scale(0.7); }
      80% { transform: translate(-30px, -25px) scale(1.3); }
      100% { transform: translate(0px, 0px) scale(1.1); }
    }
  `;
  document.head.appendChild(style);
}
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect, useState, useMemo } from "react";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";

import { User } from "lucide-react";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import { RoomFeatures } from "./RoomFeatures";
import { getRoomGradientColor } from "@/lib/roomColors";
import { Button } from "@/components/ui/button";

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
          backgroundColor: `${customColor}08`, // Much more subtle opacity
          color: `${customColor}dd`, // Slightly muted color
          border: `1px solid ${customColor}20`,
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
      className="relative overflow-hidden rounded-3xl transition-all duration-500"
      style={{
        transition: "all 0.5s ease",
      }}
    >
      {/* Floating circular gradients - only visible on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: "transparent",
        }}
      >
        <div
          className="absolute h-32 w-32 rounded-full opacity-30 blur-xl"
          style={{
            background: `radial-gradient(circle, ${getRoomGradientColor(roomFormat?.id)}40 0%, transparent 70%)`,
            top: "10%",
            left: "15%",
            animation: "floatCircle1 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute h-24 w-24 rounded-full opacity-25 blur-lg"
          style={{
            background: `radial-gradient(circle, ${getRoomGradientColor(roomFormat?.id)}30 0%, transparent 70%)`,
            top: "60%",
            right: "20%",
            animation: "floatCircle2 5s ease-in-out infinite 1s",
          }}
        />
        <div
          className="absolute h-20 w-20 rounded-full opacity-20 blur-md"
          style={{
            background: `radial-gradient(circle, ${getRoomGradientColor(roomFormat?.id)}25 0%, transparent 70%)`,
            bottom: "20%",
            left: "25%",
            animation: "floatCircle3 3.5s ease-in-out infinite 0.5s",
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative flex flex-col gap-2 pb-4 md:flex-row md:gap-4">
        {/* Image Section */}
        {images.length > 0 && (
          <div className="w-full flex-shrink-0 md:w-80">
            <div className="h-56 w-full overflow-hidden rounded-4xl md:h-72">
              <ImageCarousel
                imgs={images}
                className="h-full overflow-hidden"
                accentColor={getRoomGradientColor(roomFormat?.id)}
              />
            </div>
          </div>
        )}

        {/* Content Section - With animated circular gradient from price */}
        <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[28px] p-4">
          {/* Multiple circular gradients - responsive */}
          <div
            className="absolute inset-0 opacity-70 transition-all duration-700 group-hover:opacity-85"
            style={{
              background: `
                radial-gradient(circle at 85% 15%, ${getRoomGradientColor(roomFormat?.id)}30 0%, ${getRoomGradientColor(roomFormat?.id)}18 35%, ${getRoomGradientColor(roomFormat?.id)}10 55%, transparent 70%),
                radial-gradient(circle at 5% 85%, ${getRoomGradientColor(roomFormat?.id)}12 0%, ${getRoomGradientColor(roomFormat?.id)}06 45%, transparent 65%),
                radial-gradient(circle at 95% 85%, ${getRoomGradientColor(roomFormat?.id)}10 0%, ${getRoomGradientColor(roomFormat?.id)}05 40%, transparent 60%)
              `,
            }}
          />
          {/* Mobile-only bottom gradients */}
          <div
            className="absolute inset-0 opacity-50 transition-all duration-700 group-hover:opacity-65 md:hidden"
            style={{
              background: `
                radial-gradient(circle at 15% 85%, ${getRoomGradientColor(roomFormat?.id)}10 0%, ${getRoomGradientColor(roomFormat?.id)}05 35%, transparent 55%),
                radial-gradient(circle at 85% 85%, ${getRoomGradientColor(roomFormat?.id)}08 0%, ${getRoomGradientColor(roomFormat?.id)}04 30%, transparent 50%)
              `,
            }}
          />
          {/* Header */}
          <div className="mb-3">
            <div className="mb-2 flex items-start justify-between">
              <div>
                {/* Tags container */}
                <div className="mb-2 -ml-2 flex flex-wrap gap-2">
                  {(() => {
                    const primaryBadge = getBadgeStyles("primary");
                    return (
                      <span
                        className={primaryBadge.className}
                        style={{
                          backgroundColor: `${getRoomGradientColor(roomFormat?.id)}15`,
                          color: `${getRoomGradientColor(roomFormat?.id)}dd`,
                          border: `1px solid ${getRoomGradientColor(roomFormat?.id)}30`,
                        }}
                      >
                        Habitación {roomFormat?.label}
                      </span>
                    );
                  })()}

                  {/* Tag de género - solo para habitaciones compartidas */}
                  {gender &&
                    roomFormat?.id === "HCO" &&
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
                <div className="text-text-subtle hidden text-xs md:block">
                  {" "}
                  Parque Nacional{" "}
                </div>
                <Link href={`/habitaciones/${slug}`}>
                  <h3 className="mb-2 cursor-pointer text-xl font-bold transition-all duration-200 hover:underline hover:decoration-wavy hover:decoration-2 hover:underline-offset-4">
                    {name}
                  </h3>
                </Link>

                {capacity && (
                  <div className="text-text-muted flex items-center gap-1 text-sm">
                    <User className="h-3 w-3" />
                    <span>
                      Hasta {capacity} {capacity === 1 ? "persona" : "personas"}
                    </span>
                  </div>
                )}
              </div>
              {/* Price - More subtle on desktop */}
              <div className="mt-1 text-right md:mt-0">
                <div className="md:text-text text-xl font-bold md:text-2xl">
                  <span
                    style={{
                      color: `color-mix(in srgb, ${getRoomGradientColor(roomFormat?.id)} 80%, black 20%)`,
                    }}
                  >
                    ${roomPrice?.toLocaleString("es-CL")}
                  </span>
                </div>
                <div className="text-text-muted -mt-1 text-xs">Por Noche</div>
              </div>
            </div>

            <p className="text-text line-clamp-3 text-sm leading-relaxed text-pretty md:max-w-[450px]">
              {description}
            </p>
          </div>

          {/* Features & CTA */}
          <div className="space-y-6 md:grid md:grid-cols-3 md:items-end md:gap-4 md:space-y-0">
            <div className="md:col-span-2">
              <RoomFeatures beds={beds} amenities={amenities} />
            </div>
            <div className="md:col-span-1 md:flex md:justify-end">
              <Button
                onClick={onViewDetails}
                variant="room-card"
                size="room-card"
                accentColor={getRoomGradientColor(roomFormat?.id)}
                className="group"
              >
                {/* Mobile button - full width with stronger colors */}
                <span
                  className="flex items-center justify-center gap-2 md:hidden"
                  style={{
                    color: getRoomGradientColor(roomFormat?.id),
                  }}
                >
                  Ver habitación
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>

                {/* Desktop button with accent color */}
                <span
                  className="hidden transition-colors duration-300 md:inline-flex md:items-center md:gap-2"
                  style={{
                    color: getRoomGradientColor(roomFormat?.id),
                  }}
                >
                  Ver más detalles
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
                </span>

                {/* Desktop subtle accent border on hover */}
                <div
                  className="absolute inset-0 hidden rounded-full border opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"
                  style={{
                    borderColor: `color-mix(in srgb, ${getRoomGradientColor(roomFormat?.id)} 20%, white 80%)`,
                  }}
                />

                {/* Mobile subtle glow effect */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-20 md:hidden"
                  style={{
                    background: `radial-gradient(circle at center, ${getRoomGradientColor(roomFormat?.id)}40 0%, transparent 70%)`,
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
