"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import ROOMS from "@/db/ROOMS.json";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";
import { Room } from "@/lib/types";
import { useSelectionStore } from "@/store/useSelectionStore";

// Precompute price map for faster lookups
const PRICE_MAP: Record<string, number> = ROOM_FORMATS.reduce(
  (map, opt) => ({ ...map, [opt.id]: opt.price }),
  {}
);

// Type assertion for ROOMS data
const typedRooms = ROOMS as Room[];

export function Rooms() {
  const router = useRouter();
  const { selectedFormat } = useSelectionStore();

  const handleViewRoom = (roomSlug: string) => {
    router.push(`/habitaciones/${roomSlug}`);
  };

  const filteredRooms = useMemo(() => {
    const roomsToSort = selectedFormat
      ? typedRooms.filter(
          (r) =>
            r.defaultFormat === selectedFormat.id ||
            r.alternativeFormats.includes(selectedFormat.id)
        )
      : [...typedRooms];

    return roomsToSort.sort((a, b) => {
      const fmtA = selectedFormat?.id || a.defaultFormat;
      const fmtB = selectedFormat?.id || b.defaultFormat;
      const priceA = PRICE_MAP[fmtA] || 0;
      const priceB = PRICE_MAP[fmtB] || 0;
      const totalA = priceA + (a.hasPrivateToilet ? 10000 : 0);
      const totalB = priceB + (b.hasPrivateToilet ? 10000 : 0);
      return totalA - totalB;
    });
  }, [selectedFormat]);

  return (
    <section className="container mx-auto py-10">
      <div>
        <h2 className="text-2xl font-bold mb-8" id="habitaciones">
          Conoce nuestras habitaciones
        </h2>
        <div className="max-w-[80ch] space-y-4 text-pretty">
          <p>
            En Hostal Micelio contamos con 9 habitaciones listas para recibirte,
            en distintos formatos pensados para que encuentres el ideal según
            cómo viajes: solo, en pareja o en grupo.
          </p>
          <p>
            El precio se basa en la cantidad de personas, y a partir de eso
            buscamos el formato de habitación, o múltiples habitaciones, que
            mejor se adapte a tus necesidades. Esto nos permite ofrecer una
            experiencia más justa y personalizada. Siempre que haya
            disponibilidad, estaremos encantados de encontrar la mejor opción
            para ti.
          </p>
          <p>
            Por ejemplo, si viajas solo y ya no quedan habitaciones simples,
            haremos lo posible por ofrecerte una más amplia al precio de una
            simple. Queremos que disfrutes de una estadía cómoda, flexible y
            hecha a tu medida en Hostal Micelio.
          </p>
        </div>
      </div>

      <div>
        <RoomOptionsSelector
          onSelect={() => {}}
          filteredRoomsCount={filteredRooms.length}
        />
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          aria-labelledby="habitaciones"
        >
          <AnimatePresence>
            {filteredRooms.map((room) => (
              <motion.div
                key={room.slug}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RoomCard
                  {...room}
                  onViewDetails={() => handleViewRoom(room.slug)}
                  selectedFormat={selectedFormat?.id || null}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
