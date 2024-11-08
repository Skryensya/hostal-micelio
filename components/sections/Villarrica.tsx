import React from "react";
import { MapPin } from "lucide-react";
import { HoverCard } from "@/components/composed/HoverCard";
import ATTRACTIONS from "@/db/ATTRACTIONS.json";
// import { cn } from "@/lib/utils";

export function Villarrica() {
  // showcase tours and things to do in Villarrica, partners and stuff
  return (
    <div className="">
      <div className="container mx-auto  py-10">
        <div className="">
          <h2 className="mb-6 text-2xl flex items-center gap-2">
            <MapPin />
            Conoce Villarrica y Pucón
          </h2>
          <p className="w-max-[80ch]">
            Explora las diversas actividades que Villarrica tiene para ofrecer,
            sumergiéndote en una experiencia única en el centro de la ciudad.
            Disfruta de eventos vibrantes y aprovecha la cercanía a la hermosa
            playa de Pucón, un destino perfecto para disfrutar de tu estancia en
            el sur.
          </p>
        </div>
        <div className="h-full w-full my-10 grid grid-cols-1 md:grid-cols-5 gap-4">
          {ATTRACTIONS.map((attraction) => (
            <HoverCard key={attraction.title} {...attraction} />
          ))}
        </div>
      </div>
    </div>
  );
}
