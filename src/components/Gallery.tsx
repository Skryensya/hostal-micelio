"use client";

import { motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useGallery } from "./GalleryProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, ZoomIn, ZoomOut } from "lucide-react";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const imageContainerRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  // Calcula y actualiza dinámicamente los límites de arrastre según el scale y el tamaño del contenedor.
  const updateDragConstraints = (newScale) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      if (newScale > 1) {
        const deltaX = (rect.width * (newScale - 1)) / 2;
        const deltaY = (rect.height * (newScale - 1)) / 2;
        setDragConstraints({
          left: -deltaX,
          right: deltaX,
          top: -deltaY,
          bottom: deltaY,
        });
      } else {
        setDragConstraints({ left: 0, right: 0, top: 0, bottom: 0 });
      }
    }
  };

  const handleDragEnd = () => {
    if (scale.get() === 1) {
      x.set(0);
      y.set(0);
    }
  };

  // Función que alterna el zoom y ajusta los constraints correspondientes.
  const toggleZoom = () => {
    if (isZoomed) {
      scale.set(1);
      x.set(0);
      y.set(0);
      setIsZoomed(false);
      updateDragConstraints(1);
    } else {
      scale.set(2);
      setIsZoomed(true);
      updateDragConstraints(2);
    }
  };

  const handleDoubleClick = () => {
    toggleZoom();
  };

  // Al iniciar el drag, si no está en zoom, se activa el modo zoom.
  const handleDragStart = () => {
    if (!isZoomed) {
      toggleZoom();
    }
  };

  if (!isOpen || !images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeGallery}>
      <DialogContent className="fixed inset-0 w-screen h-screen p-0 border-0 bg-transparent shadow-none select-none">
        <div className="relative w-full h-full translate-x-1/2 translate-y-1/2 flex flex-col items-center justify-between gap-8 select-none">
          {/* Contenedor principal de la imagen con zoom y pan */}
          <div className="h-full w-full mt-24 lg:mt-10 mb-10">
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-sm md:max-w-4xl mx-auto aspect-[4/3] overflow-hidden px-2 sm:px-0"
            >
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative w-full h-full mt-4"
                style={{ x, y, scale, cursor: isZoomed ? "grab" : "zoom-in" }}
                drag
                dragConstraints={dragConstraints}
                dragMomentum={false} // Desactiva el momentum al soltar
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDoubleClick={handleDoubleClick}
                whileDrag={{ cursor: "grabbing" }}
              >
                <Image
                  src={images[currentImage].src}
                  alt={images[currentImage].alt}
                  fill
                  className="object-contain"
                  //   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  draggable={false} // Impide el drag nativo
                  onDragStart={(e) => e.preventDefault()} // Previene comportamiento de copia
                />
              </motion.div>
              {/* Botón de zoom */}
              {/* <div className="absolute bottom-3 right-4">
         
              </div> */}
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-16">
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto max-w-[90vw] p-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    goToImage(index);
                    scale.set(1);
                    x.set(0);
                    y.set(0);
                    setIsZoomed(false);
                    updateDragConstraints(1);
                  }}
                  className={`relative flex-shrink-0 w-24 h-16 rounded overflow-hidden transition-all duration-150 ${
                    currentImage === index
                      ? "ring-2 ring-white"
                      : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="96px"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </button>
              ))}
            </div>

            {/* Botones de navegación */}
            <div className="flex gap-2 lg:absolute bottom-1/2 inset-x-0 max-w-5xl mx-auto justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="lg:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                  scale.set(1);
                  x.set(0);
                  y.set(0);
                  setIsZoomed(false);
                  updateDragConstraints(1);
                }}
                aria-label="Imagen anterior"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                  scale.set(1);
                  x.set(0);
                  y.set(0);
                  setIsZoomed(false);
                  updateDragConstraints(1);
                }}
                aria-label="Siguiente imagen"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* Botón de cerrar */}
          <div className="absolute top-4 right-4 flex gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              aria-label="Alternar zoom"
            >
              {isZoomed ? (
                <ZoomOut className="w-5 h-5" />
              ) : (
                <ZoomIn className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={closeGallery}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
