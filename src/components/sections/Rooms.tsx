"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ROOMS from "@/db/ROOMS.json";
import ROOM_OPTIONS from "@/db/ROOM_OPTIONS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { RoomModal } from "../composed/RoomModal";
import { Gallery } from "@/components/Gallery";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";
import { RoomOption } from "@/lib/types";

// Precompute price map for faster lookups
const PRICE_MAP: Record<string, number> = ROOM_OPTIONS.reduce(
  (map, opt) => ({ ...map, [opt.id]: opt.price }),
  {}
);

export function Rooms() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialRoom = searchParams.get("habitacion");

  const [selectedRoom, setSelectedRoom] = useState<string | null>(initialRoom);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Sync state when URL param changes
  useEffect(() => {
    if (initialRoom !== selectedRoom) {
      setSelectedRoom(initialRoom);
    }
  }, [initialRoom]);

  const setRoomInUrl = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("habitacion", slug);
    } else {
      params.delete("habitacion");
    }
    const query = params.toString();
    // Prevent scroll reset
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleOpenModal = (roomSlug: string) => {
    setSelectedRoom(roomSlug);
    setRoomInUrl(roomSlug);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setRoomInUrl(null);
  };

  const handleSelectOption = (option: RoomOption | null) => {
    setSelectedOption(option?.id || null);
  };

  const filteredRooms = useMemo(() => {
    const roomsToSort = selectedOption
      ? ROOMS.filter(
          (r) =>
            r.defaultFormat === selectedOption ||
            r.alternativeFormats.includes(selectedOption)
        )
      : [...ROOMS];

    return roomsToSort.sort((a, b) => {
      const fmt = selectedOption || a.defaultFormat;
      const priceA = PRICE_MAP[fmt] || 0;
      const priceB = PRICE_MAP[fmt] || 0;
      const totalA = priceA + (a.hasPrivateToilet ? 10000 : 0);
      const totalB = priceB + (b.hasPrivateToilet ? 10000 : 0);
      return totalA - totalB;
    });
  }, [selectedOption]);

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
          onSelect={handleSelectOption}
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
                  onViewDetails={() => handleOpenModal(room.slug)}
                  selectedFormat={selectedOption}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <RoomModal
        open={Boolean(selectedRoom)}
        setOpen={handleCloseModal}
        roomSlug={selectedRoom || ""}
      />
      <Gallery />
    </section>
  );
}
