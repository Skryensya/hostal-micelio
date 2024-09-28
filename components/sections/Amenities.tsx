"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  BedSingle,
  Egg,
  Sparkle,
  ShowerHead,
  WashingMachine,
  Bike,
  Wine,
  Heart,
  Star,
} from "lucide-react"; // Add relevant icons

const AMENITIES = [
  { icon: <BedSingle className="w-5 h-5" />, name: "Servicio de habitación" },
  {
    icon: <Egg className="w-5 h-5" />,
    name: "Desayuno incluido",
    extraCost: false,
  },
  {
    icon: <Sparkle className="w-5 h-5" />,
    name: "Limpieza diaria",
    extraCost: false,
  },
  {
    icon: <ShowerHead className="w-5 h-5" />,
    name: "Agua caliente",
    extraCost: false,
  },
  {
    icon: <WashingMachine className="w-5 h-5" />,
    name: "Lavandería (precio extra)",
    extraCost: 5000,
  },
  {
    icon: <Bike className="w-5 h-5" />,
    name: "Arriendo de bicicletas de paseo",
    extraCost: 5000,
  },

  {
    icon: <Star className="w-5 h-5" />,
    name: "Operador turístico",
    extraCost: false,
  },
  {
    icon: <Wine className="w-5 h-5" />,
    name: "Venta de bebidas alcohólicas",
    extraCost: false,
  },
  {
    icon: <Heart className="w-5 h-5" />,
    name: "Terapias complementarias",
    extraCost: false,
  },
  {
    icon: <Star className="w-5 h-5" />,
    name: "Eventos temáticos",
    extraCost: false,
  },
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
    <div className="relative w-full overflow-hidden">
      <div className="embla " ref={emblaRef}>
        <div className="embla__container mx-auto  flex">
          {AMENITIES.map((amenity, index) => (
            <div key={index} className="embla__slide">
              <div className=" flex items-center justify-center px-6 py-2 no-select">
                <div className="text-2xl">{amenity.icon}</div>
                <span className="ml-2 text-base">{amenity.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
