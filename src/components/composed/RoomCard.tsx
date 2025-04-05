"use client";

import type { Room as RoomType } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

type RoomCardProps = Partial<RoomType>;

function RoomCardSkeleton() {
  return (
    <div className="grid grid-cols-1 h-full w-full bg-surface-2 text-text rounded-xl overflow-hidden  ">
      <Skeleton className="w-full aspect-video" />
      <div className="flex flex-col flex-1 p-4 h-48">
        <span className="text-xs font-bold font-mono opacity-60 mb-2">
          <Skeleton className="w-24 h-4" />
        </span>
        <h3 className="mb-2">
          <Skeleton className="w-40 h-6" />
        </h3>
        <div className="mt-1 mb-4">
          <Skeleton className="w-full h-6 mb-1" />
          <Skeleton className="w-5/6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function RoomCard({ slug, name, description }: RoomCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const images = useMemo(() => ROOM_IMAGES[slug] || [], [slug]);

  useEffect(() => {
    const imgPromises = images.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
      });
    });

    Promise.all(imgPromises).then(() => setIsLoading(false));
  }, [images]);

  if (isLoading) {
    return <RoomCardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 h-full w-full group bg-surface-2 text-text rounded-[2rem] overflow-hidden ">
      <ImageCarousel imgs={images} aspectRatio="video" />

      <div className="flex flex-col justify-between p-4 min-h-48">
        <div className="flex flex-col">
          <span className="text-xs font-bold font-mono text-text-muted leading-[20px]">
            Parque Nacional
          </span>
          <h3 className="font-bold text-xl">{name}</h3>
          <p className="text-base mt-1 mb-4 line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="small">
            <span>Ver detalles</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
