"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGallery } from "./GalleryProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export function Gallery() {
  const {
    isOpen,
    currentImage,
    images,
    closeGallery,
    nextImage,
    prevImage,
    goToImage,
  } = useGallery();
  const imageContainerRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextImage();
          break;
        case "Escape":
          e.preventDefault();
          closeGallery();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, prevImage, nextImage, closeGallery]);

  if (!isOpen || !images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeGallery}>
      <DialogContent className="fixed inset-0 !top-0 !left-0 h-screen !max-h-none w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !bg-white/10 !p-0 !shadow-none !backdrop-blur-xs select-none [&>button]:!hidden">
        <div className="relative flex h-full w-full flex-col select-none">
          {/* Header with controls */}
          <div className="absolute top-0 right-0 left-0 z-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium !text-white/90">
                  {currentImage + 1} / {images.length}
                </div>
                <div className="hidden text-xs !text-white/70 sm:block">
                  Usa las flechas o desliza para navegar
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="gallery-white"
                  size="icon"
                  className="h-10 w-10"
                  onClick={closeGallery}
                  aria-label="Cerrar galería"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main image container */}
          <div className="flex flex-1 items-center justify-center px-20 py-20 md:px-24 md:py-16">
            <div
              ref={imageContainerRef}
              className="relative max-h-[70vh] max-w-[90vw] overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative overflow-hidden rounded-lg shadow-2xl"
                >
                  <Image
                    src={images[currentImage].src}
                    alt={images[currentImage].alt}
                    width={0}
                    height={0}
                    className="h-auto max-h-[70vh] w-auto max-w-[90vw] rounded-lg object-contain"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    priority
                    style={{ borderRadius: "8px" }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation arrows for desktop - positioned at page sides */}
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Button
              variant="gallery-white"
              size="icon"
              className="h-14 w-14"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>
          </div>

          <div className="absolute inset-y-0 right-4 flex items-center">
            <Button
              variant="gallery-white"
              size="icon"
              className="h-14 w-14"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </div>

          {/* Bottom controls */}
          <div className="absolute right-0 bottom-0 left-0 z-50 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex flex-col items-center gap-4">
              {/* Mobile navigation buttons */}
              <div className="flex gap-4 md:hidden">
                <Button
                  variant="gallery-white"
                  size="icon"
                  className="h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Imagen anterior"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="gallery-white"
                  size="icon"
                  className="h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Siguiente imagen"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Thumbnails with improved styling */}
              <div className="scrollbar-hide flex max-w-[90vw] gap-3 overflow-visible px-1 py-2">
                {images.map((img, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      goToImage(index);
                    }}
                    className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 md:h-14 md:w-20 ${
                      currentImage === index
                        ? "scale-110 shadow-lg ring-2 ring-white"
                        : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
