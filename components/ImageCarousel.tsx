"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EmblaCarouselType } from "embla-carousel";
import { motion } from "framer-motion";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type ImageType = {
  src: string;
  alt: string;
};

export function ImageCarousel({ imgs }: { imgs: ImageType[] }) {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);

  // Detect if the screen is mobile or desktop
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateButtons = () => {
      setCanScrollNext(api.canScrollNext());
      setCanScrollPrev(api.canScrollPrev());
    };

    setCurrent(api.selectedScrollSnap());
    updateButtons();

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      updateButtons();
    });
  }, [api]);

  const visibleDots = (index: number) => {
    const totalDots = imgs.length;
    const maxVisibleDots = 5;
    const start = Math.max(
      0,
      Math.min(current - 2, totalDots - maxVisibleDots)
    );
    const end = Math.min(totalDots, start + maxVisibleDots);
    return index >= start && index < end;
  };

  if (imgs.length === 1) {
    return (
      <div className="relative w-full h-full aspect-square">
        <Image
          src={imgs[0].src}
          alt={imgs[0].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <Carousel
        opts={{
          align: "center",
        }}
        setApi={(api) => setApi(api as EmblaCarouselType)}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {imgs.map((image, index) => (
            <CarouselItem key={index} className="w-full h-full pl-0">
              <div className="relative w-full h-full aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* dot components */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-2">
          {imgs.map((_, index) =>
            visibleDots(index) ? (
              <motion.div
                key={index}
                className={`rounded-full transition-colors duration-200 ${
                  index === current
                    ? "bg-white w-2.5 h-2.5"
                    : index === current - 1 || index === current + 1
                    ? "bg-white/80 w-2 h-2"
                    : "bg-white/70 w-1.5 h-1.5"
                }
                ${index === 0 ? " h-2.5 w-2.5 " : ""}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : null
          )}
        </div>
        {canScrollPrev && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
            <CarouselPrevious className="bg-gray-400/50 hover:bg-gray-400/75 text-white">
              <ChevronLeft className="h-6 w-6" />
            </CarouselPrevious>
          </div>
        )}
        {canScrollNext && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 -translate-x-12 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
            <CarouselNext className="bg-gray-400/50 hover:bg-gray-400/75 text-white">
              <ChevronRight className="h-6 w-6" />
            </CarouselNext>
          </div>
        )}
      </Carousel>
    </div>
  );
}
