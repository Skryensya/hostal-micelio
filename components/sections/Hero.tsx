"use client";
import React, { ReactNode, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Define the type for the slide objects, now with `focusPoint`
type SlideType = {
  img: string;
  content: ReactNode;
  focusPoint: string; // Focus point for the background position
};

const slides: SlideType[] = [
  {
    img: "/assets/shared-spaces/puerta-principal/PHOTO_03.jpg",
    focusPoint: "center bottom", // Focus on the center of the image
    content: (
      <>
        <h2 className="text-4xl font-bold pb-6">Adventure Awaits</h2>
        <p className="text-xl">
          Embark on thrilling journeys and create lasting memories.
        </p>
      </>
    ),
  },
  {
    img: "/assets/villarrica/PHOTO_00.jpg",
    focusPoint: "center bottom", // Example of focusing on the bottom center of the image
    content: (
      <>
        <h2 className="text-4xl font-bold mb-6">Discover Amazing Places</h2>
        <p className="text-xl">
          Explore breathtaking destinations around the world.
        </p>
      </>
    ),
  },
  {
    img: "/assets/shared-spaces/living/PHOTO_01.jpg",
    focusPoint: "75% 75%", // Focus on the top right of the image
    content: (
      <>
        <h2 className="text-4xl font-bold mb-6">Relax in Paradise</h2>
        <p className="text-xl">
          Unwind in luxurious resorts and serene landscapes.
        </p>
      </>
    ),
  },
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect(); // Run on initial render
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Embla Carousel */}
      <div className="hero_embla" ref={emblaRef}>
        <div className="hero_embla__container">
          {/* map over the slides passed as a prop */}
          {slides.map((slide, index) => (
            <div key={index} className="hero_embla__slide">
              <Slide backgroundImage={slide.img} focusPoint={slide.focusPoint}>
                {slide.content}
              </Slide>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full`}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="text-white" />
      </button>

      <button
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full`}
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

type SlideProps = {
  children: ReactNode;
  backgroundImage: string;
  focusPoint: string; // New prop for the focus point of the image
};

const Slide = ({ children, backgroundImage, focusPoint }: SlideProps) => {
  return (
    <div
      className="relative h-[500px] overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: focusPoint, // Use the focusPoint prop for the backgroundPosition
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent " />
      <div className="absolute top-0 left-0 right-0 p-8 text-white container">
        {children}
      </div>
    </div>
  );
};
