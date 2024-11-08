"use client";

import React, {
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";

type SlideType = {
  img: string;
  content: ReactNode;
  focusPoint: string;
};

const slides: SlideType[] = [
  {
    img: "/assets/shared-spaces/puerta-principal/PHOTO_03.jpg",
    focusPoint: "center bottom",
    content: (
      <>
        <h2 className="text-4xl font-bold pb-6">¡La aventura en espera!</h2>
        <p className="text-xl">
          Experimenta emocionantes aventuras y crea memorias únicas.
        </p>
      </>
    ),
  },
  {
    img: "/assets/villarrica/PHOTO_00.jpg",
    focusPoint: "center bottom",
    content: (
      <>
        <h2 className="text-4xl font-bold mb-6">
          Descubre lugares maravillosos
        </h2>
        <p className="text-xl">
          Conoce todo lo que Villarrica tiene para ofrecer.
        </p>
      </>
    ),
  },
  {
    img: "/assets/shared-spaces/living/PHOTO_01.jpg",
    focusPoint: "75% 75%",
    content: (
      <>
        <h2 className="text-4xl font-bold mb-6">Relájate en el paraíso</h2>
        <p className="text-xl">
          Despierta en lujosos hoteles y paisajes serenos.
        </p>
      </>
    ),
  },
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const endOfHeroRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const handleSkipToContent = () => {
    endOfHeroRef.current?.focus();
  };

  const handleDotKeydown = (event: React.KeyboardEvent) => {
    const dotsCount = slides.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (selectedIndex + 1) % dotsCount;
      emblaApi?.scrollTo(nextIndex);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = (selectedIndex - 1 + dotsCount) % dotsCount;
      emblaApi?.scrollTo(prevIndex);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      emblaApi?.scrollTo(selectedIndex);
    }
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isPlaying && emblaApi) {
      let animationFrame: number;
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const duration = 7 * 1000;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);

        if (elapsed < duration) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          emblaApi.scrollNext();
          startTime = timestamp;
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    } else {
      setProgress(0); // Reset progress when paused
    }
  }, [isPlaying, emblaApi, selectedIndex]);

  return (
    <div className="relative">
      {/* Hidden Skip Hero Button */}
      <button
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-10"
        tabIndex={0}
      >
        Saltar Hero
      </button>

      <div className="hero_embla" ref={emblaRef} aria-live="polite">
        <div className="hero_embla__container">
          {slides.map((slide, index) => (
            <div key={index} className="hero_embla__slide">
              <Slide backgroundImage={slide.img} focusPoint={slide.focusPoint}>
                {slide.content}
              </Slide>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div
        role="group"
        aria-label="Navegación de diapositivas"
        className="absolute bottom-12 md:left-1/2 right-16 md:right-auto transform -translate-x-1/2 flex space-x-2 outline-offset-8 rounded-lg"
        tabIndex={0} // Make the container focusable
        onKeyDown={handleDotKeydown} // Handle keyboard events here
      >
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border border-white/30 ${
              index === selectedIndex ? "bg-primary-light" : "bg-white/50"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-selected={index === selectedIndex}
            tabIndex={-1}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <button
        className="absolute left-4 md:top-1/2 md:transform md:-translate-y-1/2 bottom-10 md:bottom-4 md:p-4 group outline-none"
        onClick={scrollPrev}
        aria-label="Diapositiva anterior"
        disabled={!canScrollPrev}
        tabIndex={0}
      >
        <div className="rounded-full p-1 group-focus:outline outline-[#458bfb] outline-offset-0  group-focus:ring group-focus: ring-white ring-offset-[1px]">
          <div className="p-2 md:p-3 rounded-full bg-white/70 flex items-center justify-center ">
            <ChevronLeft className="text-text-light" />
          </div>
        </div>
      </button>

      <button
        className="absolute left-16 md:left-auto md:top-1/2 md:transform md:-translate-y-1/2 bottom-10 md:bottom-4 md:right-4 group md:p-4 outline-none"
        onClick={scrollNext}
        aria-label="Siguiente diapositiva"
        disabled={!canScrollNext}
        tabIndex={0}
      >
        <div className="rounded-full p-1 group-focus:outline outline-[#458bfb] outline-offset-0  group-focus:ring group-focus: ring-white ring-offset-[1px]">
          <div className="p-2 md:p-3 rounded-full bg-white/70 flex items-center justify-center">
            <ChevronRight className="text-text-light" />
          </div>
        </div>
      </button>

      {/* Play/Pause Button with Circular Progress */}
      <button
        className="absolute bottom-10 right-10 w-8 h-8 rounded-full bg-white/70 shadow-md flex items-center justify-center"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
        tabIndex={0}
      >
        <svg width="37" height="37" viewBox="0 0 40 40" className="absolute">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            className="stroke-surface-light-10"
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
        <div className="z-10">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </div>
      </button>

      <div
        ref={endOfHeroRef}
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      ></div>
    </div>
  );
}

type SlideProps = {
  children: ReactNode;
  backgroundImage: string;
  focusPoint: string;
};

const Slide = ({ children, backgroundImage, focusPoint }: SlideProps) => {
  return (
    <div
      className="relative h-[700px] max-h-[80dvh] min-h-[500px] overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: focusPoint,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute top-0 left-0 right-0 p-8 text-white container">
        {children}
      </div>
    </div>
  );
};
