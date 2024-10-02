"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EmblaCarouselType } from "embla-carousel";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/carousel-image-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Search,
} from "lucide-react";

type ImageType = {
  src: string;
  alt: string;
};

export function ImageCarousel({
  imgs,
  disabledZoom,
}: {
  imgs: ImageType[];
  disabledZoom?: boolean;
}) {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [magnifyOpen, setMagnifyOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handlePrevImage = useCallback(() => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : imgs.length - 1));
  }, [imgs.length]);

  const handleNextImage = useCallback(() => {
    setCurrent((prev) => (prev < imgs.length - 1 ? prev + 1 : 0));
  }, [imgs.length]);

  return (
    <div className="w-full h-full relative group">
      <Carousel
        opts={{
          align: "start",
          loop: true,
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
                {!disabledZoom && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 left-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                    onClick={() => setMagnifyOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {imgs.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-standar transition-colors duration-200 ${
                index === current ? "bg-gray-600" : "bg-gray-400"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
          <CarouselPrevious className="bg-gray-400/50 hover:bg-gray-400/75 text-white">
            <ChevronLeft className="h-6 w-6" />
          </CarouselPrevious>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 -translate-x-12 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
          <CarouselNext className="bg-gray-400/50 hover:bg-gray-400/75 text-white">
            <ChevronRight className="h-6 w-6" />
          </CarouselNext>
        </div>
      </Carousel>

      <Dialog open={magnifyOpen} onOpenChange={setMagnifyOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0">
          <div className="relative w-full h-full">
            <Image
              src={imgs[current].src}
              alt={imgs[current].alt}
              fill
              className="object-contain"
              style={{ transform: `scale(${zoom})` }}
              sizes="90vw"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button variant="secondary" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              <Button variant="secondary" size="icon" onClick={handlePrevImage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleNextImage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
