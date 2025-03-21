"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  // KeyboardEvent,
} from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LightEffect } from "@/components/ui/LightEffect";

// Types
type SlideType = {
  img: string;
  thumbnail: string;
  title: string;
  description: string;
  focusPoint: string;
  color: string;
};

type SlideProps = {
  image: string;
  focusPoint: string;
  thumbnail: string;
  color: string;
  onLoad?: () => void;
};

// Constants
const SLIDE_DURATION = 7000; // 7 segundos
const slides: SlideType[] = [
  {
    img: "/assets/images/_webp/hero/PHOTO_00.webp",
    thumbnail: "/assets/images/_thumbnails/hero/PHOTO_00.webp",
    focusPoint: "center bottom",
    color: "#799bb9",
    title: "Descubre lugares maravillosos",
    description:
      "Conoce todo lo que Villarrica tiene para ofrecer. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsos ",
  },
  {
    img: "/assets/images/_webp/hero/PHOTO_01.webp",
    thumbnail: "/assets/images/_thumbnails/hero/PHOTO_01.webp",
    focusPoint: "75% 75%",
    color: "#6c513e",
    title: "Relájate en el paraíso",
    description:
      "Despierta en lujosos hoteles y paisajes serenos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsos ",
  },
  {
    img: "/assets/images/_webp/hero/PHOTO_02.webp",
    thumbnail: "/assets/images/_thumbnails/hero/PHOTO_02.webp",
    focusPoint: "center bottom",
    color: "#47504a",
    title: "¡La aventura en espera!",
    description:
      "Experimenta emocionantes aventuras y crea memorias únicas. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsos ",
  },
];

// Skeleton para el contenido (se mantiene igual)
const SlideContentSkeleton = React.memo(() => {
  return (
    <div className="md:w-8/12 lg:w-6/12 my-12 rounded-lg">
      <div className="h-10 bg-text-light-30 dark:bg-text-dark-30 rounded-lg w-8/12 mb-4" />
      <div className="space-y-3">
        <div className="h-6 bg-text-light-30 dark:bg-text-dark-30 rounded-lg w-11/12" />
        <div className="h-6 bg-text-light-30 dark:bg-text-dark-30 rounded-lg w-10/12" />
      </div>
    </div>
  );
});
SlideContentSkeleton.displayName = "SlideContentSkeleton";

// Componente para la imagen del slide
const SlideImage = React.memo(
  ({ image, thumbnail, color, focusPoint, onLoad }: SlideProps) => {
    return (
      <div style={{ backgroundColor: color }}>
        <div
          className="relative h-[550px] overflow-hidden"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: focusPoint,
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Imagen Thumbnail */}
          <Image
            src={thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-bottom blur"
            fill
            priority
            loading="eager"
          />
          {/* Imagen Principal */}
          <Image
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-bottom"
            fill
            loading="lazy"
            fetchPriority="low"
            onLoad={onLoad}
          />
        </div>
      </div>
    );
  }
);
SlideImage.displayName = "SlideImage";

// Componente para el contenido del slide

// Botón de play/pause
const PlayPauseButton = ({
  isPlaying,
  onToggle,
  isLoaded,
  progress,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  isLoaded: boolean;
  progress: number;
}) => {
  return (
    <button
      className={cn(
        "group w-10 h-10 rounded-full flex items-center justify-center",
        !isLoaded && "opacity-50 cursor-not-allowed"
      )}
      onClick={onToggle}
      aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
      disabled={!isLoaded}
      tabIndex={isLoaded ? 0 : -1}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" className="absolute">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          className="stroke-translate"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          className="stroke-primary-light"
          strokeWidth="3"
          strokeDasharray={`${progress * 113.1} 113.1`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
      </svg>

      <div
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "z-10 rounded-full h-10"
        )}
      >
        <LightEffect />
        {isPlaying ? (
          <Pause
            size={16}
            fill="#f4d7eb"
            stroke="#f4d7eb"
            className="text-text-dark transition-all duration-300"
          />
        ) : (
          <Play
            size={16}
            fill="#f4d7eb"
            stroke="#f4d7eb"
            className="text-text-dark transition-all duration-300"
          />
        )}
      </div>
    </button>
  );
};

// Botón de navegación
const NavigationButton = ({
  onClick,
  ariaLabel,
  disabled,
  direction,
  isLoaded,
}: {
  onClick: () => void;
  ariaLabel: string;
  disabled: boolean;
  direction: "prev" | "next";
  isLoaded: boolean;
}) => {
  return (
    <button
      className={cn(
        ` group outline-none`,
        !isLoaded && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      tabIndex={isLoaded ? 0 : -1}
    >
      <div className="rounded-full p-1 group-focus-visible:outline outline-[#458bfb] outline-offset-0 group-focus-visible:ring group-focus-visible:ring-white ring-offset-[1px]">
        <div
          className={cn(
            "shadow-xl backdrop-invert-25 bg-white/10",
            buttonVariants({ variant: "outline", size: "icon" })
          )}
        >
          <LightEffect />
          {direction === "prev" ? (
            <ChevronLeft className="text-text-dark transition-all duration-300" />
          ) : (
            <ChevronRight className="translate-x-0.5 text-text-dark transition-all duration-300" />
          )}
        </div>
      </div>
    </button>
  );
};

export function Hero() {
  // State para el slide activo
  const [activeSlide, setActiveSlide] = useState(0);
  // Autoplay (play/pause)
  const [isPlaying, setIsPlaying] = useState(true);
  // Carga de la imagen (para habilitar controles)
  const [isLoaded, setIsLoaded] = useState(false);
  // Progreso para el círculo (autoplay)
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  // Autoplay con efecto fade (usando requestAnimationFrame)
  useEffect(() => {
    if (!isPlaying) return;
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      progressRef.current = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(progressRef.current);

      if (elapsed < SLIDE_DURATION) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        startTime = timestamp;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, activeSlide]);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);

  const handleMainImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Navegación de puntos con teclado
  // const handleDotKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
  //   const dotsCount = slides.length;
  //   if (event.key === "ArrowRight" || event.key === "ArrowDown") {
  //     event.preventDefault();
  //     setActiveSlide((prev) => (prev + 1) % dotsCount);
  //   } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
  //     event.preventDefault();
  //     setActiveSlide((prev) => (prev - 1 + dotsCount) % dotsCount);
  //   }
  // };

  return (
    <div className="bg-white">
      <div className="bg-surface-light-80 dark:bg-surface-dark-80   pb-16">
        <div className="container mx-auto grid grid-cols-12 gap-4">
          <div className="col-span-2 gap-4 flex flex-col justify-between">
            <div className="w-full h-full flex justify-center items-center">
              <Image
                src="/assets/logos/LOGO_COLOR.png"
                alt="Hostal Micelio Logo"
                className="aspect-square"
                width={200}
                height={200}
              />
            </div>
            <div
              className="light text-text-light container transition-opacity duration-1000  "
              style={{ opacity: isLoaded ? 1 : 0 }}
            >
              <h2 className="text-2xl md:text-2xl font-bold mb-4">
                {slides[activeSlide].title}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-pretty font-medium">
                {slides[activeSlide].description}
              </p>
            </div>
          </div>
          <div className="col-span-10 pt-10">
            <div
              className="relative     rounded-3xl     isolate bg-white"
              style={{ height: "550px" }}
            >
              {/* Botón para saltar el hero (accesibilidad) */}
              <button
                onClick={() => {}}
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-text-dark px-4 py-2 rounded-md z-10"
                tabIndex={0}
              >
                Saltar Hero
              </button>

              {/* Slides con efecto fade */}
              <div className="relative h-full w-full rounded-[inherit] overflow-hidden  ">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
                    style={{ opacity: index === activeSlide ? 1 : 0 }}
                  >
                    <SlideImage
                      image={slide.img}
                      focusPoint={slide.focusPoint}
                      thumbnail={slide.thumbnail}
                      color={slide.color}
                      onLoad={handleMainImageLoad}
                    />
                  </div>
                ))}
              </div>

              {/* Target para saltar el hero */}
              <div className="sr-only" tabIndex={-1}></div>
            </div>
            <div className="flex w-fit justify-between items-center mt-1 gap-4 px-4 -translate-y-16">
              {/* Botón Play/Pause */}
              <PlayPauseButton
                isPlaying={isPlaying}
                onToggle={togglePlay}
                isLoaded={isLoaded}
                progress={progress}
              />
              {/* Botones de navegación */}
              <div className="flex items-center">
                <NavigationButton
                  onClick={prevSlide}
                  ariaLabel="Diapositiva anterior"
                  disabled={!isLoaded}
                  direction="prev"
                  isLoaded={isLoaded}
                />
                <NavigationButton
                  onClick={nextSlide}
                  ariaLabel="Siguiente diapositiva"
                  disabled={!isLoaded}
                  direction="next"
                  isLoaded={isLoaded}
                />
              </div>

              {/* Dots de navegación
              <div
                role="group"
                aria-label="Navegación de diapositivas"
                className={cn(
                  " flex space-x-2 outline-offset-8 rounded-lg",
                  !isLoaded && "opacity-50 cursor-not-allowed"
                )}
                tabIndex={isLoaded ? 0 : -1}
                onKeyDown={isLoaded ? handleDotKeydown : undefined}
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      { "bg-primary-light": index === activeSlide },
                      "w-3 h-3 rounded-full"
                    )}
                    onClick={() => isLoaded && setActiveSlide(index)}
                    aria-label={`Ir a la diapositiva ${index + 1}`}
                    aria-pressed={index === activeSlide}
                    disabled={!isLoaded}
                    tabIndex={-1}
                  >
                    <LightEffect />
                  </button>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
