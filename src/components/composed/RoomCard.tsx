"use client";

import type { Room as RoomType } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ROOM_OPTIONS from "@/db/ROOM_OPTIONS.json";

type RoomCardProps = Partial<RoomType> & {
  onViewDetails?: () => void;
  selectedFormat?: string | null;
};

function RoomCardSkeleton() {
  return (
    <div className="grid grid-cols-1 h-full w-full bg-surface-2 text-text rounded-[2rem] overflow-hidden">
      <Skeleton className="w-full aspect-video rounded-t-[2rem]" />
      <div className="flex flex-col justify-between p-4 min-h-48">
        <div className="flex flex-col items-start">
          <div className="text-xs font-bold font-mono text-text-muted leading-[20px]">
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="font-bold text-xl">
            <Skeleton className="w-40 h-6 mt-2" />
          </div>
          <div className="text-base mt-1 mb-4 line-clamp-2 text-left">
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-5/6 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
    </div>
  );
}

export default function RoomCard({
  slug,
  name,
  description,
  onViewDetails,
  selectedFormat,
  defaultFormat,
  hasPrivateToilet,
}: RoomCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const roomPrice = useMemo(() => {
    const serachBy = selectedFormat || defaultFormat;
    if (!serachBy) return null;
    const roomOption = ROOM_OPTIONS.find((option) => option.id === serachBy);
    const basePrice = roomOption ? roomOption.price : 0;
    const privateToiletPrice = hasPrivateToilet ? 10000 : 0;
    return basePrice + privateToiletPrice;
  }, [selectedFormat, defaultFormat, hasPrivateToilet]);

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
    <button
      onClick={onViewDetails}
      className="items-start justify-start cursor-pointer grid grid-cols-1 h-full w-full group bg-surface-2 text-text rounded-[2rem] focus:outline-offset-4"
    >
      {images.length > 0 ? (
        <div className="h-full w-full rounded-t-[2rem]">
          <ImageCarousel
            imgs={images}
            aspectRatio="video"
            className="rounded-t-[2rem] overflow-hidden"
          />
        </div>
      ) : null}

      <div className="flex flex-col justify-between p-4 min-h-48">
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold font-mono text-text-muted leading-[20px]">
            Parque Nacional
          </span>
          <h3 className="font-bold text-xl">{name}</h3>
          <p className="text-base mt-1 mb-4 line-clamp-2 text-left">
            {description}
          </p>
        </div>
        {roomPrice && (
          <div className="text-xs font-bold font-mono text-text-muted leading-[20px]">
            {roomPrice}
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={onViewDetails}
            tabIndex={-1}
          >
            <span>Ver detalles</span>
          </Button>
        </div>
      </div>
    </button>
  );
}
