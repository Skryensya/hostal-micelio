"use client";

import { Dot } from "lucide-react";
import type { Room as RoomType } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";

export default function RoomCard({
  slug,
  name,
  description,
  beds,
  capacity,
}: Partial<RoomType>) {
  const images = ROOM_IMAGES[slug] || [];

  return (
    <a
      href={`/hospedaje/${slug}`}
      className="flex flex-col h-full w-full group  "
    >
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-gray-200 aspect-[4/3] lg:aspect-square`}
      >
        <ImageCarousel imgs={images} />
      </div>
      <div className="flex flex-col flex-1  py-2  transition-all">
        <h3 className="font-bold text-base">{name}</h3>
        <div className="flex text-xs items-center">
          <span>{capacity} huespedes</span>
          <Dot size={16} />
          <span>{beds?.length} camas</span>
        </div>
        <p className="text-base mt-1 mb-4 line-clamp-2">{description}</p>
      </div>
    </a>
  );
}
