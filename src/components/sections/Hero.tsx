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
import { WavyDivider } from "@/components/composed/WavyDivider";
// Types
type SlideType = {
  img: string;
  thumbnail: string;
  title: string;
  description: string;
  focusPoint: string;
  color: string;
  cardColorClassName: string;
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
    img: "/assets/images/_webp/hero/00.webp",
    thumbnail: "/assets/images/_thumbnails/hero/00.webp",
    focusPoint: "center bottom",
    color: "#799bb9",
    title: "Descubre lugares maravillosos",
    description:
      "Conoce todo lo que Villarrica tiene para ofrecer. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsos ",
    cardColorClassName: "bg-surface-1",
  },
  {
    img: "/assets/images/_webp/hero/01.webp",
    thumbnail: "/assets/images/_thumbnails/hero/01.webp",
    focusPoint: "75% 75%",
    color: "#6c513e",
    title: "Relájate en el paraíso",
    description:
      "Despierta en lujosos hoteles y paisajes serenos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsos ",
    cardColorClassName: "bg-surface-1",
  },
  {
    img: "/assets/images/_webp/hero/02.webp",
    thumbnail: "/assets/images/_thumbnails/hero/02.webp",
    focusPoint: "center bottom",
    color: "#47504a",
    title: "¡La aventura en espera!",
    description:
      "Experimenta emocionantes aventuras y crea memorias únicas. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsos ",
    cardColorClassName: "bg-surface-1",
  },
];

// Skeleton para el contenido (se mantiene igual)
const SlideContentSkeleton = React.memo(() => {
  return (
    <div className="my-12 rounded-lg md:w-8/12 lg:w-6/12">
      <div className="mb-4 h-10 w-8/12 rounded-lg bg-neutral-200" />
      <div className="space-y-3">
        <div className="h-6 w-11/12 rounded-lg bg-neutral-200" />
        <div className="h-6 w-10/12 rounded-lg bg-neutral-200" />
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
          className="relative h-[450px] overflow-hidden md:h-[550px]"
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
            className="absolute inset-0 h-full w-full object-cover object-bottom"
            fill
            priority
            loading="eager"
          />
          {/* Imagen Principal */}
          <Image
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-bottom"
            fill
            loading="lazy"
            fetchPriority="low"
            onLoad={onLoad}
          />
        </div>
      </div>
    );
  },
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
    <div className="p-1">
      <button
        className={cn(
          "group flex h-10 w-10 items-center justify-center rounded-full",
          !isLoaded && "cursor-not-allowed opacity-50",
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
            stroke="hsl(var(--accent))"
            className="stroke-translate"
            strokeWidth="3"
            strokeDasharray={`${progress * 113.1} 113.1`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        </svg>

        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "z-10 h-10 rounded-full",
          )}
        >
          <LightEffect />
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </div>
      </button>
    </div>
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
        "group outline-none",
        !isLoaded && "cursor-not-allowed opacity-50",
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      tabIndex={isLoaded ? 0 : -1}
    >
      <div className="m-1 rounded-full bg-black/20 ring-offset-[1px] outline-offset-0 outline-[#458bfb] group-focus-visible:ring group-focus-visible:ring-white group-focus-visible:outline">
        <div
          className={cn(
            "shadow-xl",
            buttonVariants({ variant: "ghost", size: "icon" }),
          )}
        >
          <LightEffect />
          {direction === "prev" ? (
            <ChevronLeft className="transition-all duration-300" />
          ) : (
            <ChevronRight className="translate-x-0.5 transition-all duration-300" />
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
    <>
      <div className="bg-surface-2 -z-10 pt-12 pb-8 md:pt-24 md:pb-16">
        {/* Botón para saltar el hero (accesibilidad) */}
        <button
          onClick={() => {}}
          className="text-text-dark sr-only z-10 rounded-md bg-blue-600 px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
          tabIndex={0}
        >
          Saltar Hero
        </button>
        <div className="relative isolate mx-auto grid max-w-6xl grid-cols-12 gap-4 px-0 md:px-4">
          <div className="pointer-events-none z-20 order-2 col-span-12 md:order-1 md:col-span-3">
            <div className="mx-auto flex h-full w-full max-w-[450px] flex-col justify-center gap-4 px-4 md:mx-0 md:w-[200%] md:px-0">
              <div
                className={`${slides[activeSlide].cardColorClassName} pointer-events-auto rounded-2xl px-4 pt-2 pb-4 md:pt-4 md:pb-8`}
              >
                <div
                  className="min-h-[80%] max-w-6xl transition-opacity duration-1000"
                  // style={{ opacity: isLoaded ? 1 : 0 }}
                >
                  <h2 className="mb-2 text-2xl leading-tight font-bold md:mb-4 md:text-3xl md:leading-tight">
                    {slides[activeSlide].title}
                  </h2>
                  <p className="text-base font-medium text-pretty md:text-lg lg:text-xl">
                    {slides[activeSlide].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 col-span-12 md:order-2 md:col-span-9">
            <div
              className="bg-surface-muted relative isolate h-[450px] md:h-[550px] md:rounded-3xl"
              // style={{ height: "500px" }}
            >
              {/* Slides con efecto fade */}
              <div className="relative h-[450px] w-full overflow-hidden rounded-[inherit] md:h-[550px]">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="absolute top-0 left-0 h-full w-full transition-opacity duration-1000"
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
                <div className="absolute top-6 right-auto left-2 md:top-4 md:right-0 md:left-auto">
                  <Image
                    src="/assets/logos/LOGO_COLOR.png"
                    alt="Hostal Micelio Logo"
                    className="aspect-square h-28 w-28 md:mr-4 md:h-32 md:w-32"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="absolute right-0 left-0 flex -translate-y-full justify-between gap-4 px-4 pb-4 md:static md:right-auto md:bottom-auto md:left-auto">
                {/* Botones de navegación */}
                <div className="order-2 flex gap-1 md:order-1">
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

                {/* Dots de navegación */}
                {/* <div
                role="group"
                aria-label="Navegación de diapositivas"
                className={cn(
                  "absolute bottom-12 -translate-y-1/2 md:translate-y-0 md:left-1/2 right-20 md:right-auto transform -translate-x-1/2 flex space-x-2 outline-offset-8 rounded-lg",
                  !isLoaded && "opacity-50 cursor-not-allowed"
                )}
                tabIndex={isLoaded ? 0 : -1}
                onKeyDown={isLoaded ? handleDotKeydown : undefined}
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
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

                {/* Botón Play/Pause */}
                <div className="order-1 flex items-center md:order-2">
                  <PlayPauseButton
                    isPlaying={isPlaying}
                    onToggle={togglePlay}
                    isLoaded={isLoaded}
                    progress={progress}
                  />
                </div>
              </div>

              {/* Target para saltar el hero */}
              <div className="sr-only" tabIndex={-1}></div>
            </div>
          </div>
        </div>
      </div>
      <WavyDivider backgroundClass="bg-surface-1" />
    </>
  );
}
