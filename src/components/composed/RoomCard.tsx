"use client";

import type { Room as RoomType } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";

export default function RoomCard({
  slug,
  name,
  description,
  // beds,
  // capacity,
}: Partial<RoomType>) {
  const images = ROOM_IMAGES[slug] || [];

  return (
    <div className="grid grid-cols-1 h-full w-full group bg-surface-3-light-70 dark:bg-surface-3-dark-70 rounded-xl overflow-hidden shadow-md shadow-primary/10">
      <ImageCarousel imgs={images} aspectRatio="video" />

      <div className="flex flex-col flex-1 py-2 transition-all col-span-1 p-2 h-48 text-start">
        <span className="text-sm font-bold font-mono opacity-60">
          Parque Nacional
        </span>
        <h3 className="font-bold text-xl">{name}</h3>
        {/* <div className="flex text-xs">
          <span>{capacity} huespedes</span>
          <Dot size={16} />
          <span>{beds?.length} camas</span>
        </div> */}
        <p className="text-base mt-1 mb-4 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
