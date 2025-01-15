"use client";

import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  KeyboardEvent,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import Image from "next/image";
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
const SLIDE_DURATION = 7000; // 7 seconds
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

// Skeleton for Slide Content
const SlideContentSkeleton = memo(() => {
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

const SlideImage = memo(
  ({ image, thumbnail, color, focusPoint, onLoad }: SlideProps) => {
    return (
      <div style={{ backgroundColor: color }}>
        <div
          className="relative h-[550px] md:h-[550px] lg:h-[550px] overflow-hidden"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: focusPoint,
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Thumbnail Image */}
          <Image
            src={thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-bottom blur"
            fill
            priority
            loading="eager"
          />
          {/* Main Image */}
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
const SlideContent = memo(
  ({ title, description }: { title: string; description: string }) => {
    return (
      <div className="md:w-8/12 lg:w-6/12 my-12 rounded-lg">
        <h2 className="text-2xl md:text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base md:text-lg lg:text-xl text-pretty font-medium">
          {description}
        </p>
      </div>
    );
  }
);
SlideContent.displayName = "SlideContent";

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
        "group absolute bottom-10 right-10 w-10 h-10 rounded-full flex items-center justify-center",
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
            className="text-text-dark-80 transition-all duration-300"
          />
        ) : (
          <Play
            size={16}
            fill="#f4d7eb"
            stroke="#f4d7eb"
            className="text-text-dark-80 transition-all duration-300"
          />
        )}
      </div>
    </button>
  );
};

const DotsNavigation = ({
  slides,
  selectedIndex,
  emblaApi,
  isLoaded,
  handleDotKeydown,
}: {
  slides: SlideType[];
  selectedIndex: number;
  emblaApi: UseEmblaCarouselType[1];
  isLoaded: boolean;
  handleDotKeydown: (event: KeyboardEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      role="group"
      aria-label="Navegación de diapositivas"
      className={cn(
        "absolute bottom-12 md:left-1/2 right-16 md:right-auto transform -translate-x-1/2 flex space-x-2 outline-offset-8 rounded-lg",
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
            { "bg-primary-light": index === selectedIndex },
            "w-3 h-3 rounded-full"
          )}
          onClick={() => isLoaded && emblaApi?.scrollTo(index)}
          aria-label={`Ir a la diapositiva ${index + 1}`}
          aria-pressed={index === selectedIndex}
          disabled={!isLoaded}
          tabIndex={-1}
        >
          <LightEffect />
        </button>
      ))}
    </div>
  );
};

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
        `absolute ${
          direction === "prev" ? "left-2" : "left-14"
        } bottom-8 group outline-none`,
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
            "shadow-xl",
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
  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });

  // State
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<SlideType | null>(slides[0]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Autoplay
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  const [isPlayingState, setIsPlayingState] = useState(!prefersReducedMotion);
  const progressRef = useRef(0); // store progress in ref (no re-render)
  const [progress, setProgress] = useState(0); // used for circle stroke

  // Loading
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs
  const endOfHeroRef = useRef<HTMLDivElement>(null);

  // Carousel controls
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const togglePlay = () => setIsPlayingState((prev) => !prev);

  // On slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setCurrentSlide(slides[index]);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Keyboard navigation for dots
  const handleDotKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dotsCount = slides.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      emblaApi?.scrollTo((selectedIndex + 1) % dotsCount);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      emblaApi?.scrollTo((selectedIndex - 1 + dotsCount) % dotsCount);
    }
  };

  // Initialize embla
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay with reduced re-renders (using ref + interval)
  useEffect(() => {
    if (!isPlayingState || !emblaApi) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      progressRef.current = Math.min(elapsed / SLIDE_DURATION, 1);

      if (elapsed < SLIDE_DURATION) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        emblaApi.scrollNext();
        startTime = timestamp;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    // Update state every 100ms to avoid continuous re-renders
    const intervalId = setInterval(() => {
      setProgress(progressRef.current);
    }, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [isPlayingState, emblaApi, selectedIndex]);

  // Handle image loading
  const handleMainImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative dark">
      {/* Hidden Skip Hero Button */}
      <button
        onClick={() => endOfHeroRef.current?.focus()}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-text-dark px-4 py-2 rounded-md z-10"
        tabIndex={0}
      >
        Saltar Hero
      </button>

      {/* Carousel */}
      <div className="hero_embla" ref={emblaRef} aria-live="polite">
        <div className="hero_embla__container">
          {slides.map((slide, index) => (
            <div key={index} className="hero_embla__slide">
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
      </div>

      <div className="absolute inset-0 bottom-gradient" />
      <div className="absolute bottom-16 left-0 right-0 text-text-dark container">
        <SlideContent
          title={currentSlide.title}
          description={currentSlide.description}
        />
      </div>

      <div className="container relative">
        {/* Navigation Controls */}
        <NavigationButton
          onClick={scrollPrev}
          ariaLabel="Diapositiva anterior"
          disabled={!canScrollPrev || !isLoaded}
          direction="prev"
          isLoaded={isLoaded}
        />
        <NavigationButton
          onClick={scrollNext}
          ariaLabel="Siguiente diapositiva"
          disabled={!canScrollNext || !isLoaded}
          direction="next"
          isLoaded={isLoaded}
        />

        {/* Dots Navigation */}
        <DotsNavigation
          slides={slides}
          selectedIndex={selectedIndex}
          emblaApi={emblaApi}
          isLoaded={isLoaded}
          handleDotKeydown={handleDotKeydown}
        />

        {/* Play/Pause Button */}
        <PlayPauseButton
          isPlaying={isPlayingState}
          onToggle={togglePlay}
          isLoaded={isLoaded}
          progress={progress}
        />
      </div>

      {/* Screenreader target for skipping hero */}
      <div
        ref={endOfHeroRef}
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      ></div>
    </div>
  );
}
