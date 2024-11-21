"use client";

import React, { useState } from "react";
import { ImageCarousel } from "../ImageCarousel";
import { Dot } from "lucide-react";
import type { Room as RoomType } from "@/lib/types";
import roomImages from "@/db/ROOM_IMAGES.json";
import { RoomDrawer } from "./RoomDrawer";

export default function RoomCard({
  slug,
  name,
  description,
  beds,
  capacity,
}: Partial<RoomType>) {
  const images = roomImages[slug] || [];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RoomDrawer
        room={{ slug, name, description, beds, capacity }}
        isOpen={isOpen}
        closeFn={() => {
          setIsOpen(false);
        }}
      />
      <button
        className="flex flex-col h-full w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <div className="flex flex-col h-full w-full group">
          <div
            className={`relative w-full aspect-square overflow-hidden rounded-xl bg-[url(https://dummyimage.com/400x400/e288c7/280b1f.jpg&text=+++Sin+imagen+++)] bg-fill`}
          >
            <ImageCarousel imgs={images} />
          </div>
          <div className="flex flex-col flex-1 py-2 transition-all">
            <h3 className="font-bold text-base">{name}</h3>
            <div className="flex text-xs items-center">
              <span>{capacity} huespedes</span>
              <Dot size={16} />
              <span>{beds?.length} camas</span>
            </div>
            <p className="text-sm mt-1 mb-4 line-clamp-2">{description}</p>
          </div>
        </div>
      </button>
    </>
  );
}
