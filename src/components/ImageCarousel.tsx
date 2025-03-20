"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageType = {
  src: string;
  alt: string;
};

type Transition = {
  target: number;
  direction: "next" | "prev";
};

export function ImageCarousel({
  imgs,
  aspectRatio = "square",
}: {
  imgs: ImageType[];
  aspectRatio?: "square" | "video";
}) {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState<Transition | null>(null);
  const total = imgs.length;

  if (total <= 0) return null;

  if (total === 1) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imgs[0].src}
          alt={imgs[0].alt}
          fill
          className="object-cover bg-gray-200"
          priority
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      </div>
    );
  }

  // Funciones para navegar evitando nuevos clicks durante transición
  const goNext = () => {
    if (transition) return;
    const nextIndex = (current + 1) % total;
    setTransition({ target: nextIndex, direction: "next" });
  };

  const goPrev = () => {
    if (transition) return;
    const prevIndex = (current - 1 + total) % total;
    setTransition({ target: prevIndex, direction: "prev" });
  };

  // Determinamos las imágenes y animaciones según la dirección
  let topImage: ImageType | null = null;
  let bottomImage: ImageType;
  let topInitial = {};
  let topAnimate = {};

  if (transition) {
    if (transition.direction === "next") {
      // Para avanzar: la imagen actual está encima y se desvanece (fade out)
      topImage = imgs[current];
      bottomImage = imgs[transition.target];
      topInitial = { opacity: 1 };
      topAnimate = { opacity: 0 };
    } else {
      // Para retroceder: la imagen destino se coloca encima y se desvanece (fade in)
      bottomImage = imgs[current];
      topImage = imgs[transition.target];
      topInitial = { opacity: 0 };
      topAnimate = { opacity: 1 };
    }
  } else {
    // Sin transición, mostramos la imagen actual de fondo
    bottomImage = imgs[current];
  }

  // Cuando finaliza la animación, actualizamos el índice actual
  const handleAnimationComplete = () => {
    if (transition) {
      setCurrent(transition.target);
      setTransition(null);
    }
  };

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <div
        className={`relative w-full h-full ${
          aspectRatio === "video"
            ? "aspect-[4/3]"
            : "lg:aspect-square aspect-[4/3]"
        }`}
      >
        {/* Imagen de fondo (siempre cargada) */}
        <div className="absolute inset-0">
          <Image
            src={bottomImage.src}
            alt={bottomImage.alt}
            fill
            className="object-cover bg-gray-200"
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
          />
        </div>

        {/* Imagen de transición */}
        {topImage && (
          <motion.div
            className="absolute inset-0"
            initial={topInitial}
            animate={topAnimate}
            transition={{ duration: 0.4 }}
            onAnimationComplete={handleAnimationComplete}
          >
            <Image
              src={topImage.src}
              alt={topImage.alt}
              fill
              className="object-cover bg-gray-200"
              loading="eager"
              sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 50vw,
                     33vw"
            />
          </motion.div>
        )}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 
                   group-hover:opacity-80 transition-opacity duration-300 
                   bg-gray-400/50 hover:bg-gray-400/75 rounded-full p-1"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 
                   group-hover:opacity-80 transition-opacity duration-300 
                   bg-gray-400/50 hover:bg-gray-400/75 rounded-full p-1"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots de navegación */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
        {imgs.map((_, index) => {
          const isActive = current === index;
          return (
            <div
              key={index}
              onClick={() => {
                if (transition) return;
                if (index === current) return;
                const direction = index > current ? "next" : "prev";
                setTransition({ target: index, direction });
              }}
              className={`cursor-pointer rounded-full ${
                isActive ? "w-3 h-3 bg-white" : "w-2 h-2 bg-white/70"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
