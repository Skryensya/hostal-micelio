"use client";

import { notFound } from "next/navigation";
import ROOMS from "@/db/ROOMS.json";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { RoomAmenities } from "@/components/composed/RoomAmenities";
import { RoomBeds } from "@/components/composed/RoomBeds";
import { RoomBentoGrid } from "@/components/composed/RoomBentoGrid";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import { useSelectionStore } from "@/store/useSelectionStore";
import { ImagesShowcaseGrid } from "@/components/ImagesShowcaseGrid";
import { Room, RoomImage } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { RoomBookingSidebar } from "@/components/composed/RoomBookingSidebar";
import { getRoomColorsByFormat } from "@/lib/roomColors";
import { cn } from "@/lib/utils";

// Type assertion for ROOMS data
const typedRooms = ROOMS as Room[];

export default function RoomPage({ params }: { params: { slug: string } }) {
  const { selectedFormat } = useSelectionStore();
  const room = typedRooms.find((r) => r.slug === params.slug);

  if (!room) {
    notFound();
  }

  const roomImages: RoomImage[] | undefined =
    ROOM_IMAGES[room.slug as keyof typeof ROOM_IMAGES];

  // Use selected format if available and valid for this room, otherwise use default format
  const format =
    selectedFormat &&
    (selectedFormat.id === room.defaultFormat ||
      room.alternativeFormats.includes(selectedFormat.id))
      ? selectedFormat
      : ROOM_FORMATS.find((f) => f.id === room.defaultFormat);

  const price = format ? ROOM_FORMATS.find((f) => f.id === format.id)?.price || 0 : 0;
  const totalPrice = price + (room.hasPrivateToilet ? 10000 : 0);

  const amenities = format
    ? ROOM_AMENITIES.filter(
        (amenity) => format.amenities.includes(amenity.id) && amenity.featured,
      )
    : [];

  return (
    <main className="relative pt-32 pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-bold">{room.name}</h1>
        <div className="flex flex-col justify-between gap-8 md:gap-20 md:flex-row">
          <div className="order-2 w-full md:order-1 md:w-4/12">
            <RoomBookingSidebar room={room} />
          </div>
          <div className="w-full space-y-4 md:w-8/12">
            <ImagesShowcaseGrid imgs={roomImages} />
            <div>
              <p>{room.description}</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold">Características</h2>
              <ul className="list-inside list-disc space-y-2">
                <li>Capacidad: {room.capacity} personas</li>
                <li>
                  Baño: {room.hasPrivateToilet ? "Privado" : "Compartido"}
                </li>
                <li>Formato: {format?.label}</li>
                <li>Precio base: ${price.toLocaleString("es-CL")} CLP</li>
                {room.hasPrivateToilet && (
                  <li>Suplemento baño privado: $10.000 CLP</li>
                )}
                <li
                  className={cn(
                    "font-semibold",
                    format && getRoomColorsByFormat(format.id).textHover,
                  )}
                >
                  Precio total: ${totalPrice.toLocaleString("es-CL")} CLP
                </li>
              </ul>
            </div>

            <RoomBentoGrid 
              amenities={amenities}
              beds={room.beds}
              capacity={room.capacity}
              hasPrivateToilet={room.hasPrivateToilet}
              formatLabel={format?.label}
              price={totalPrice}
            />

            <div className="hidden">
              <h2 className="mb-2 text-xl font-semibold">Camas</h2>
              <RoomBeds beds={room.beds} />
            </div>

            <div className="hidden">
              <h2 className="mb-2 text-xl font-semibold">Amenidades</h2>
              <RoomAmenities amenities={amenities} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
