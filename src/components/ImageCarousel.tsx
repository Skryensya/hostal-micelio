"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGallery } from "./GalleryProvider";

// Componente de imagen simple
type ImageType = {
  src: string;
  alt: string;
};

type Transition = {
  target: number;
  direction: "next" | "prev";
};

function SingleImageView({
  src,
  alt,
  aspectRatio,
  className,
}: {
  src: string;
  alt: string;
  aspectRatio: "square" | "video";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full h-full",
        aspectRatio === "square"
          ? "lg:aspect-square aspect-[4/3]"
          : "aspect-[4/3]",
        className
      )}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover bg-gray-200"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Botón de navegación – se muestran siempre en móvil
function NavigationButton({
  onClick,
  direction,
  label,
}: {
  onClick: () => void;
  direction: "prev" | "next";
  label: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const position = direction === "prev" ? "left-3" : "right-3";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      tabIndex={-1} // Evitamos que el botón reciba focus
      className={`block sm:hidden absolute ${position} top-1/2 -translate-y-1/2 opacity-100 
                  transition-opacity duration-300 bg-gray-400/50 hover:bg-gray-400/75 rounded-full p-1`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

function NavigationDots({
  total,
  current,
  onDotClick,
}: {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div
      className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2"
      role="tablist"
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = current === index;
        return (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            tabIndex={-1}
            aria-label={`Ir a la imagen ${index + 1}`}
            aria-selected={isActive}
            role="tab"
            className={`cursor-pointer rounded-full transition-all duration-300 ${
              isActive
                ? "w-3 h-3 bg-white"
                : "w-2 h-2 bg-white/70 hover:bg-white/90"
            }`}
          />
        );
      })}
    </div>
  );
}

export function ImageCarousel({
  imgs = [],
  aspectRatio = "square",
  ctaRef,
  className,
}: {
  imgs?: ImageType[];
  aspectRatio?: "square" | "video";
  ctaRef?: React.RefObject<HTMLElement>;
  className?: string;
}) {
  const {
    /* openGallery,  */
  } = useGallery(); // Se elimina la función para abrir en galería
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState<Transition | null>(null);
  const total = imgs?.length || 0;
  const transitionRef = useRef<Transition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs para eventos táctiles
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Función para navegar evitando múltiples transiciones
  const navigateTo = useCallback(
    (target: number, direction: "next" | "prev") => {
      if (transitionRef.current) return;
      setTransition({ target, direction });
      transitionRef.current = { target, direction };
    },
    []
  );

  const goNext = useCallback(() => {
    if (total <= 0) return;
    const nextIndex = (current + 1) % total;
    navigateTo(nextIndex, "next");
  }, [current, total, navigateTo]);

  const goPrev = useCallback(() => {
    if (total <= 0) return;
    const prevIndex = (current - 1 + total) % total;
    navigateTo(prevIndex, "prev");
  }, [current, total, navigateTo]);

  const goToIndex = useCallback(
    (index: number) => {
      if (transitionRef.current || index === current || total <= 0) return;
      const direction = index > current ? "next" : "prev";
      navigateTo(index, direction);
    },
    [current, navigateTo, total]
  );

  // Al terminar la animación, actualizamos el estado y liberamos el ref.
  const handleAnimationComplete = useCallback(() => {
    if (transition) {
      setCurrent(transition.target);
      setTransition(null);
      transitionRef.current = null;
    }
  }, [transition]);

  // Calculamos imágenes y animación según la transición.
  const { topImage, bottomImage, topInitial, topAnimate } = useMemo(() => {
    if (!transition || !imgs?.length) {
      return {
        topImage: null,
        bottomImage: imgs?.[current] || { src: "/placeholder.svg", alt: "" },
        topInitial: {},
        topAnimate: {},
      };
    }
    if (transition.direction === "next") {
      return {
        topImage: imgs[current],
        bottomImage: imgs[transition.target],
        topInitial: { opacity: 1 },
        topAnimate: { opacity: 0 },
      };
    } else {
      return {
        topImage: imgs[transition.target],
        bottomImage: imgs[current],
        topInitial: { opacity: 0 },
        topAnimate: { opacity: 1 },
      };
    }
  }, [transition, imgs, current]);

  if (total <= 0) return null;

  if (total === 1) {
    return (
      <SingleImageView
        {...imgs[0]}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  // Manejo de eventos de teclado.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Tab") {
      if (ctaRef && ctaRef.current) {
        e.preventDefault();
        ctaRef.current.focus();
      }
    }
  };

  // Swipe en mobile.
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Lógica robusta de la barra de cuenta atrás (desktop)
  const countdownControls = useAnimation();
  const isHoveredRef = useRef(false);

  const handleMouseEnter = async () => {
    if (window.innerWidth >= 640) {
      isHoveredRef.current = true;
      try {
        await countdownControls.start({
          width: "100%",
          transition: { duration: 3, ease: "easeIn" },
        });
        if (isHoveredRef.current) {
          goNext();
          countdownControls.set({ width: "0%" });
        }
      } catch (error) {
        countdownControls.set({ width: "0%" });
      }
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 640) {
      isHoveredRef.current = false;
      countdownControls.stop();
      countdownControls.set({ width: "0%" });
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full h-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group",
        className
      )}
    >
      <div
        className={`relative w-full h-full ${
          aspectRatio === "video"
            ? "aspect-[4/3]"
            : "lg:aspect-square aspect-[4/3]"
        }`}
      >
        {/* Imagen base */}
        <div className="absolute inset-0">
          <Image
            src={bottomImage.src || "/placeholder.svg"}
            alt={bottomImage.alt}
            fill
            className="object-cover bg-gray-200"
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Imagen en transición */}
        {topImage && (
          <motion.div
            className="absolute inset-0"
            initial={topInitial}
            animate={topAnimate}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onAnimationComplete={handleAnimationComplete}
          >
            <Image
              src={topImage.src || "/placeholder.svg"}
              alt={topImage.alt}
              fill
              className="object-cover bg-gray-200"
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        )}

        {/* Barra de cuenta atrás (sólo en desktop) */}
        <motion.div
          className="hidden sm:block absolute bottom-0 left-0 h-1 bg-primary"
          initial={{ width: "0%" }}
          animate={countdownControls}
        />
      </div>

      {/* Se eliminó el botón de expandir (Gallery Opener) */}

      {/* Botones de navegación: se muestran en móvil */}
      <NavigationButton
        onClick={goPrev}
        direction="prev"
        label="Imagen anterior"
      />
      <NavigationButton
        onClick={goNext}
        direction="next"
        label="Siguiente imagen"
      />

      <NavigationDots total={total} current={current} onDotClick={goToIndex} />
    </div>
  );
}
