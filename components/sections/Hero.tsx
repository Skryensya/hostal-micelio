"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import Image from "next/image";

// Types
type SlideType = {
  img: string;
  thumbnail: string;
  title: string;
  description: string;
  focusPoint: string;
  color: string;
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

export function Hero() {
  // Carousel state
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<SlideType | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Animation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Refs
  const endOfHeroRef = useRef<HTMLDivElement>(null);

  // Carousel controls
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const togglePlay = () => setIsPlaying(!isPlaying);

  // Update state on slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setCurrentSlide(slides[index]);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Keyboard navigation for dots
  const handleDotKeydown = (event: React.KeyboardEvent) => {
    const dotsCount = slides.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      emblaApi?.scrollTo((selectedIndex + 1) % dotsCount);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      emblaApi?.scrollTo((selectedIndex - 1 + dotsCount) % dotsCount);
    }
  };

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Handle autoplay animation
  useEffect(() => {
    if (!isPlaying || !emblaApi) return;

    let animationFrame: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(newProgress);

      if (elapsed < SLIDE_DURATION) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        emblaApi.scrollNext();
        startTime = timestamp;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, emblaApi, selectedIndex]);

  return (
    <div className="relative">
      {/* Hidden Skip Hero Button */}
      <button
        onClick={() => endOfHeroRef.current?.focus()}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-10"
        tabIndex={0}
      >
        Saltar Hero
      </button>

      <div className="hero_embla" ref={emblaRef} aria-live="polite">
        <div className="hero_embla__container">
          {slides.map((slide, index) => (
            <div key={index} className="hero_embla__slide">
              <Slide
                image={slide.img}
                focusPoint={slide.focusPoint}
                thumbnail={slide.thumbnail}
                color={slide.color}
              >
                <SlideContent
                  title={slide.title}
                  description={slide.description}
                />
              </Slide>
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark-70 to-transparent" />
      <div className="absolute bottom-16 left-0 right-0  text-text-dark container">
        {currentSlide && (
          <SlideContent
            title={currentSlide.title}
            description={currentSlide.description}
          />
        )}
      </div>

      <div className="container relative">
        {/* Navigation Controls */}
        <button
          className="group absolute left-2 bottom-8 outline-none"
          onClick={scrollPrev}
          aria-label="Diapositiva anterior"
          disabled={!canScrollPrev}
          tabIndex={0}
        >
          <div className="rounded-full p-1 group-focus-visible:outline outline-[#458bfb] outline-offset-0 group-focus-visible:ring group-focus-visible:ring-white ring-offset-[1px]">
            <div className="p-2 rounded-full bg-white/30 group-hover:bg-primary-light-60 flex items-center justify-center transition-all duration-300">
              <ChevronLeft className=" text-white  transition-all duration-300" />
            </div>
          </div>
        </button>

        <button
          className=" absolute left-14 bottom-8 group outline-none"
          onClick={scrollNext}
          aria-label="Siguiente diapositiva"
          disabled={!canScrollNext}
          tabIndex={0}
        >
          <div className="rounded-full p-1 group-focus-visible:outline outline-[#458bfb] outline-offset-0 group-focus-visible:ring group-focus-visible:ring-white ring-offset-[1px]">
            <div className="p-2 rounded-full  bg-white/30 group-hover:bg-primary-light-60 flex items-center justify-center transition-all duration-300">
              <ChevronRight className="  translate-x-0.5 text-white  transition-all duration-300" />
            </div>
          </div>
        </button>

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
              className={`w-3 h-3 rounded-full   ${
                index === selectedIndex ? "bg-primary-light" : "bg-white/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
              aria-pressed={index === selectedIndex}
              tabIndex={-1}
            />
          ))}
        </div>

        {/* Play/Pause Button with Circular Progress */}
        <button
          className="group absolute bottom-10 right-10 w-8 h-8 rounded-full bg-white/30 shadow-md flex items-center justify-center"
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
            {isPlaying ? (
              <Pause
                size={16}
                fill="white"
                className="text-white/80 transition-all duration-300"
              />
            ) : (
              <Play
                size={16}
                fill="white"
                className="text-white/80 transition-all duration-300"
              />
            )}
          </div>
        </button>
      </div>

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
  children: React.ReactNode;
  image: string;
  focusPoint: string;
  thumbnail: string;
  color: string;
};

const Slide = ({
  // children,
  image,
  thumbnail,
  color,
  focusPoint,
}: SlideProps) => {
  return (
    <div
      style={{
        backgroundColor: color,
      }}
    >
      <div
        className="relative h-[550px] md:h-[550px] lg:h-[650px]  overflow-hidden"
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
          className="absolute inset-0 w-full h-full object-cover object-bottom blur "
          fill
          priority
        />
        {/* Main Image */}
        <Image
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          fill
          loading="lazy"
        />
      </div>
    </div>
  );
};

const SlideContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className=" md:w-8/12 lg:w-6/12   my-12 rounded-lg">
      <h2 className="text-2xl md:text-3xl   font-bold mb-4">{title}</h2>
      <p className="text-base md:text-lg lg:text-xl  text-pretty font-medium">
        {description}
      </p>
    </div>
  );
};
