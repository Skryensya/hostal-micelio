// [slug]/page.tsx
import React from "react";
import ROOMS from "@/db/ROOMS.json";
import PRICE_OF_NIGHT_PER_ROOM from "@/db/PRICE_OF_NIGHT_PER_ROOM.json";
import TYPE_OF_BEDS from "@/db/TYPES_OF_BEDS.json";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoomCard from "@/components/composed/RoomCard";

// Dynamic Room Page Component
export default async function RoomPage({
  params,
}: {
  params: { slug: string };
}) {
  const room = ROOMS.find((room) => room.slug === params.slug);

  if (!room) {
    return <div>Room not found</div>;
  }

  const beds = room.beds.map((bed_code) => TYPE_OF_BEDS[bed_code]);
  const price = PRICE_OF_NIGHT_PER_ROOM[room.slug];

  return (
    <div className="container mx-auto flex gap-4 flex-wrap">
      <div className="mt-60 flex gap-12 w-full">
        <div className="w-5/12">
          <ImageCarousel
            imgs={ROOM_IMAGES[room.slug].map((img) => ({
              src: img.src,
              alt: img.alt,
            }))}
          />
        </div>
        <div className="w-7/12">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-4xl font-bold pb-4">{room.name}</h1>
              <p>{room.description}</p>
              <p>Precio: ${price}</p>
              <p>Piso #{room.floor}</p>
              <p>
                Capacidad para {room.capacity}{" "}
                {room.capacity > 1 ? "personas" : "persona"}
              </p>
              <ul>
                {beds.map((bed) => (
                  <li key={bed.name}>
                    {bed.name} - {bed.size}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-8">
              <Button>
                <Link href={`/booking/${room.slug}`} className="text-xl">
                  Reservar
                </Link>
              </Button>
              <Button>
                <Link href={`/contact`} className="text-xl">
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 pt-40">
        {/* get 3 random rooms and create a card of each one of them */}
        {ROOMS.slice(0, 4).map((room) => (
          <div key={room.slug} className="w-1/3">
            <RoomCard {...room} />
          </div>
        ))}
      </div>
    </div>
  );
}

// `generateStaticParams` generates paths for all rooms
export async function generateStaticParams() {
  return ROOMS.map((room) => ({
    slug: room.slug,
  }));
}
