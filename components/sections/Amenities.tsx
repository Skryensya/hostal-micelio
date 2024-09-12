"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

const AMENITIES = [
  { icon: "🛏", name: "Servicio de habitación" },
  { icon: "🍳", name: "Desayuno incluido" },
  { icon: "🧼", name: "Limpieza diaria" },
  { icon: "🚿", name: "Agua caliente" },
  { icon: "🧺", name: "Lavandería" },
  { icon: "🛏", name: "Servicio de habitación" },
  { icon: "🍳", name: "Desayuno incluido" },
  { icon: "🧼", name: "Limpieza diaria" },
  { icon: "🚿", name: "Agua caliente" },
  { icon: "🧺", name: "Lavandería" },
  { icon: "🛏", name: "Servicio de habitación" },
  { icon: "🍳", name: "Desayuno incluido" },
  { icon: "🧼", name: "Limpieza diaria" },
  { icon: "🚿", name: "Agua caliente" },
  { icon: "🧺", name: "Lavandería" },
  { icon: "🛏", name: "Servicio de habitación" },
  { icon: "🍳", name: "Desayuno incluido" },
  { icon: "🧼", name: "Limpieza diaria" },
  { icon: "🚿", name: "Agua caliente" },
  { icon: "🧺", name: "Lavandería" },
];

export function Amenities() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: false, inViewThreshold: 0.7 },
    [
      AutoScroll({
        speed: 0.8,
        playOnInit: true,
        direction: "forward",
        stopOnInteraction: false,
      }),
      WheelGesturesPlugin({}),
    ]
  );

  return (
    <div className="relative w-full overflow-hidden bg-background">
      <div className="embla " ref={emblaRef}>
        <div className="embla__container mx-auto  flex">
          {AMENITIES.map((amenity, index) => (
            <div key={index} className="embla__slide">
              <div className=" flex items-center justify-center px-6 py-2 no-select">
                <div className="text-2xl">{amenity.icon}</div>
                <span className="ml-2 text-sm">{amenity.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
