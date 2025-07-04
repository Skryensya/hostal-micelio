"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Componente de imagen simple
type ImageType = {
  src: string;
  alt: string;
  aspectRatio: "square" | "video" | "vertical";
  className?: string;
};

type Transition = {
  target: number;
  direction: "next" | "prev";
};

const ASPECT_RATIOS = {
  square: "aspect-square",
  video: "aspect-[16/9]",
  card: "aspect-[5/4]",
} as const;

function SingleImageView({
  src,
  alt,
  aspectRatio,
  className,
}: {
  src: string;
  alt: string;
  aspectRatio: keyof typeof ASPECT_RATIOS;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full",
        ASPECT_RATIOS[aspectRatio],
        className,
      )}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="bg-gray-200 object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        draggable={false}
      />
    </div>
  );
}

// Botón de navegación – se muestran siempre en móvil y en hover en desktop
function NavigationButton({
  onClick,
  direction,
  label,
  color,
}: {
  onClick: () => void;
  direction: "prev" | "next";
  label: string;
  color?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const position = direction === "prev" ? "left-3" : "right-3";

  const baseOpacity = color ? `${color}cc` : "rgba(0, 0, 0, 0.5)"; // cc = 80% opacity

  return (
    <button
      onClick={onClick}
      aria-label={label}
      tabIndex={-1} // Evitamos que el botón reciba focus
      className={`absolute ${position} hover:bg-opacity-90 top-1/2 -translate-y-1/2 rounded-full p-2 text-white opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100`}
      style={{
        backgroundColor: baseOpacity,
      }}
    >
      <Icon className="h-5 w-5" />
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
  color?: string;
}) {
  return (
    <div
      className="absolute right-0 bottom-4 left-0 flex items-center justify-center gap-2"
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
            style={{
              backgroundColor: "white",
              opacity: isActive ? 1 : 0.5,
            }}
            className={`cursor-pointer rounded-full transition-all duration-300 ${
              isActive ? "h-3 w-3" : "h-2 w-2 hover:opacity-0.8"
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
  onClick,
  color,
}: {
  imgs?: ImageType[];
  aspectRatio?: keyof typeof ASPECT_RATIOS;
  ctaRef?: React.RefObject<HTMLElement>;
  className?: string;
  onClick?: () => void;
  color?: string;
}) {
  const countdownControls = useAnimation();
  const isHoveredRef = useRef(false);
  const isMountedRef = useRef(false);
  const isThrottledRef = useRef(false);
  const THROTTLE_DELAY = 400; // 400ms de throttle
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState<Transition | null>(null);
  const total = imgs?.length || 0;
  const transitionRef = useRef<Transition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Marcar el componente como montado
  useEffect(() => {
    isMountedRef.current = true;
    // Inicializar el estado de los controles después del montaje
    countdownControls.set({ width: "0%" });

    return () => {
      isMountedRef.current = false;
    };
  }, [countdownControls]);

  // Refs para eventos táctiles
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Función para navegar evitando múltiples transiciones
  const navigateTo = useCallback(
    (target: number, direction: "next" | "prev") => {
      if (transitionRef.current || isThrottledRef.current) return;
      
      // Activar el throttle
      isThrottledRef.current = true;
      setTimeout(() => {
        isThrottledRef.current = false;
      }, THROTTLE_DELAY);

      setTransition({ target, direction });
      transitionRef.current = { target, direction };

      // Reset countdown animation when navigating manually
      if (window.innerWidth >= 640 && isMountedRef.current) {
        countdownControls.stop();
        countdownControls.set({ width: "0%" });
        // Reiniciar la animación si el mouse sigue sobre el carrusel
        if (isHoveredRef.current) {
          countdownControls.start({
            width: "100%",
            transition: { duration: 3, ease: "linear" },
          });
        }
      }
    },
    [countdownControls],
  );

  const goNext = useCallback(() => {
    if (total <= 0) return;
    const nextIndex = (current + 1) % total;
    navigateTo(nextIndex, "next");
  }, [current, total, navigateTo]);

  // Lógica robusta de la barra de cuenta atrás (desktop)
  const handleMouseEnter = useCallback(async () => {
    if (window.innerWidth >= 640 && isMountedRef.current) {
      isHoveredRef.current = true;

      try {
        await countdownControls.start({
          width: "100%",
          transition: { duration: 3, ease: "linear" },
        });

        // Solo avanzamos si seguimos con hover y el componente está montado
        if (isHoveredRef.current && isMountedRef.current) {
          goNext();
          countdownControls.set({ width: "0%" });
        }
      } catch (error) {
        if (isMountedRef.current) {
          countdownControls.set({ width: "0%" });
        }
        console.error(error);
      }
    }
  }, [countdownControls, goNext]);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth >= 640 && isMountedRef.current) {
      isHoveredRef.current = false;
      countdownControls.stop();
      countdownControls.set({ width: "0%" });
    }
  }, [countdownControls]);

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
    [current, navigateTo, total],
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
        "group relative h-full w-full outline-none",
        ASPECT_RATIOS[aspectRatio],
        className,
      )}
    >
      <button
        onClick={onClick}
        className={`relative h-full w-full ${ASPECT_RATIOS[aspectRatio]}`}
      >
        {/* Imagen base */}
        <div className="absolute inset-0">
          <Image
            src={bottomImage.src || "/placeholder.svg"}
            alt={bottomImage.alt}
            fill
            className="bg-gray-200 object-cover"
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
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
              className="bg-gray-200 object-cover"
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              draggable={false}
            />
          </motion.div>
        )}

        {/* Barra de cuenta atrás (sólo en desktop) */}
        <motion.div
          className="absolute bottom-0 left-0 hidden h-1 sm:block"
          style={{ backgroundColor: color || "hsl(var(--primary))" }}
          initial={{ width: "0%" }}
          animate={countdownControls}
        />
      </button>

      {/* Se eliminó el botón de expandir (Gallery Opener) */}

      {/* Botones de navegación: se muestran en móvil */}
      <NavigationButton
        onClick={goPrev}
        direction="prev"
        label="Imagen anterior"
        color={color}
      />
      <NavigationButton
        onClick={goNext}
        direction="next"
        label="Siguiente imagen"
        color={color}
      />

      <NavigationDots
        total={total}
        current={current}
        onDotClick={goToIndex}
      />
    </div>
  );
}
