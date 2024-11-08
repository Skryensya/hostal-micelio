"use client";
import React from "react";
import { Card } from "../ui/card";
import { ImageCarousel } from "@/components/ImageCarousel";
// import { cn } from "@/lib/utils";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";

export default function RoomCard({
  slug,
  name,
  description,
  // floor,
}: {
  slug: string;
  name: string;
  description: string;
  // floor: number;
}) {
  return (
    <Card className="flex flex-col h-full ">
      <div className="w-full">
        <ImageCarousel
          disabledZoom={true}
          imgs={ROOM_IMAGES[slug].map((img) => ({
            src: img.src,
            alt: img.alt,
          }))}
        />
      </div>
      <div className="py-4 px-2">
        <h2 className="font-bold">{name}</h2>

        <p>{description}</p>
      </div>
    </Card>
  );
}
