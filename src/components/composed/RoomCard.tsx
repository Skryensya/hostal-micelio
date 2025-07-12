"use client";

import type { Room as RoomType, RoomOption } from "@/lib/types";
import Link from "next/link";

import { ImageCarousel } from "../ImageCarousel";
// import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
import { useEffect,  useMemo } from "react";
import { User } from "lucide-react";
import { useRoomImages, useRoomFormats, useRoomAmenities } from "@/hooks/useData";
import { RoomFeatures } from "./RoomFeatures";
import { getRoomGradientColor } from "@/lib/roomColors";
import { Button } from "@/components/ui/button";
import { Badge, getGenderColor, getAmenityColor } from "@/components/ui/badge";


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
  // const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data using React Query
  const { data: roomFormats = [] } = useRoomFormats();
  const { data: roomAmenities = [] } = useRoomAmenities();
  const { data: roomImages = {} } = useRoomImages();

  // Cálculo del precio de la habitación
  const roomPrice = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy || !roomFormats.length) return null;
    const roomOption = roomFormats.find(
      (option: RoomOption) => option.id === searchBy,
    );
    const basePrice = roomOption ? roomOption.price : 0;
    const privateToiletPrice = hasPrivateToilet ? 10000 : 0;
    return basePrice + privateToiletPrice;
  }, [selectedFormat, defaultFormat, hasPrivateToilet, roomFormats]);

  const roomFormat = useMemo(() => {
    const searchBy = selectedFormat || defaultFormat;
    if (!searchBy || !roomFormats.length) return null;
    const roomOption = roomFormats.find(
      (option: RoomOption) => option.id === searchBy,
    );
    return roomOption ? roomOption : null;
  }, [selectedFormat, defaultFormat, roomFormats]);

  const amenities = useMemo(() => {
    const searchBy = roomFormat?.amenities;
    if (!searchBy || !roomAmenities.length) return null;

    let filteredRoomAmenities = roomAmenities.filter(
      (amenity) => searchBy.includes(amenity.id) && amenity.featured,
    );

    const PrivateBathroomAmenity = roomAmenities.find(
      (amenity) => amenity.id === "private-bathroom",
    );
    const FemaleOnlyRoomAmenity = roomAmenities.find(
      (amenity) => amenity.id === "female-only-room",
    );
    const MaleOnlyRoomAmenity = roomAmenities.find(
      (amenity) => amenity.id === "male-only-room",
    );

    // Create new arrays instead of mutating
    const additionalAmenities = [];

    if (hasPrivateToilet && PrivateBathroomAmenity) {
      additionalAmenities.push(PrivateBathroomAmenity);
      // Filter out shared bathroom
      filteredRoomAmenities = filteredRoomAmenities.filter(
        (amenity) => amenity.id !== "shared-bathroom",
      );
    }

    if (gender === "male" && MaleOnlyRoomAmenity) {
      additionalAmenities.push(MaleOnlyRoomAmenity);
    }

    if (gender === "female" && FemaleOnlyRoomAmenity) {
      additionalAmenities.push(FemaleOnlyRoomAmenity);
    }

    // Combine arrays without mutation
    let finalAmenities = [...filteredRoomAmenities, ...additionalAmenities];

    if (selectedFormat && selectedFormat !== "HCO") {
      finalAmenities = finalAmenities.filter(
        (amenity) =>
          amenity.id !== "female-only-room" && amenity.id !== "male-only-room",
      );
    }

    return finalAmenities.sort((a, b) => a.order - b.order);
  }, [roomFormat?.amenities, hasPrivateToilet, gender, selectedFormat, roomAmenities]);

  const images = useMemo(() => roomImages[slug] || [], [slug, roomImages]);

  // Add CSS animations after component mounts to avoid hydration issues
  useEffect(() => {
    const existingStyle = document.querySelector("#room-card-animations");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "room-card-animations";
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
  }, []);

  // useEffect(() => {
  //   const imgPromises = images.map(
  //     (image: any) =>
  //       new Promise((resolve) => {
  //         const img = new Image();
  //         img.src = image.src; // Access the src property from the image object
  //         img.onload = () => resolve(true);
  //         img.onerror = () => resolve(true);
  //       }),
  //   );
  //   Promise.all(imgPromises).then(() => setIsLoading(false));
  // }, [images]);

  // if (isLoading) {
  //   return <RoomCardSkeleton />;
  // }

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
                  <Badge color={getRoomGradientColor(roomFormat?.id)}>
                    Habitación {roomFormat?.label}
                  </Badge>

                  {/* Tag de género - solo para habitaciones compartidas */}
                  {gender && roomFormat?.id === "HCO" && (
                    <Badge color={getGenderColor(gender as "male" | "female" | "mixed")}>
                      {gender === "male"
                        ? "Solo hombres"
                        : gender === "female"
                          ? "Solo mujeres"
                          : "Mixta"}
                    </Badge>
                  )}

                  {/* Desayuno incluido tag - solo para habitaciones no compartidas */}
                  {roomFormat?.id !== "HCO" && (
                    <Badge color={getAmenityColor("breakfast")}>
                      Desayuno incluido
                    </Badge>
                  )}

                  {/* Baño privado tag */}
                  {hasPrivateToilet && (
                    <Badge color={getAmenityColor("private-bathroom")}>
                      Baño privado
                    </Badge>
                  )}
                </div>
                <div className="text-text-subtle hidden text-sm md:block">
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
                <div
                  className="text-xl !font-semibold md:!text-2xl"
                  style={{
                    color: `color-mix(in srgb, ${getRoomGradientColor(roomFormat?.id)} 80%, black 20%)`,
                  }}
                >
                  ${roomPrice?.toLocaleString("es-CL")}
                </div>
                <div className="text-text-muted -mt-1 text-xs">Por noche</div>
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
