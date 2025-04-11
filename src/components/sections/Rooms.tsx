"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { RoomModal } from "../composed/RoomModal";
import { useState } from "react";
import { Gallery } from "@/components/Gallery";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";
import { RoomOption } from "@/lib/types";
import ROOM_OPTIONS from "@/db/ROOM_OPTIONS.json";

export function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOpenModal = (roomSlug: string) => {
    setSelectedRoom(roomSlug);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleSelectOption = (option: RoomOption) => {
    setSelectedOption(option.id);
  };

  const filteredRooms = selectedOption
    ? ROOMS.filter(
        (room) =>
          room.defaultFormat === selectedOption ||
          room.alternativeFormats.includes(selectedOption)
      ).sort((a, b) => {
        // First sort by format (default format first)
        if (
          a.defaultFormat === selectedOption &&
          b.defaultFormat === selectedOption
        ) {
          // If both have the format as default, sort by price
          const aPrice =
            ROOM_OPTIONS.find((opt) => opt.id === selectedOption)?.price || 0;
          const bPrice =
            ROOM_OPTIONS.find((opt) => opt.id === selectedOption)?.price || 0;
          const aTotal = aPrice + (a.hasPrivateToilet ? 10000 : 0);
          const bTotal = bPrice + (b.hasPrivateToilet ? 10000 : 0);
          return aTotal - bTotal;
        }
        if (a.defaultFormat === selectedOption) {
          return -1;
        }
        if (b.defaultFormat === selectedOption) {
          return 1;
        }
        // If neither has the format as default, sort by price
        const aPrice =
          ROOM_OPTIONS.find((opt) => opt.id === selectedOption)?.price || 0;
        const bPrice =
          ROOM_OPTIONS.find((opt) => opt.id === selectedOption)?.price || 0;
        const aTotal = aPrice + (a.hasPrivateToilet ? 10000 : 0);
        const bTotal = bPrice + (b.hasPrivateToilet ? 10000 : 0);
        return aTotal - bTotal;
      })
    : ROOMS.sort((a, b) => {
        const aPrice =
          ROOM_OPTIONS.find((opt) => opt.id === a.defaultFormat)?.price || 0;
        const bPrice =
          ROOM_OPTIONS.find((opt) => opt.id === b.defaultFormat)?.price || 0;
        const aTotal = aPrice + (a.hasPrivateToilet ? 10000 : 0);
        const bTotal = bPrice + (b.hasPrivateToilet ? 10000 : 0);
        return aTotal - bTotal;
      });

  return (
    <section className="container mx-auto py-10">
      <div className=" ">
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
          El precio se basa en la cantidad de personas, y a partir de eso buscamos el formato de habitación, o múltiples habitaciones, que mejor se adapte a tus necesidades. Esto nos permite ofrecer una experiencia más justa y personalizada. Siempre que haya disponibilidad, estaremos encantados de encontrar la mejor opción para ti.
          </p>
          <p>
            Por ejemplo, si viajas solo y ya no quedan habitaciones simples,
            haremos lo posible por ofrecerte una más amplia al precio de una
            simple. Queremos que disfrutes de una estadía cómoda, flexible y
            hecha a tu medida en Hostal Micelio.
          </p>
          <p>
            Todas nuestras habitaciones incluyen desayuno, acceso a las duchas,
            toallas limpias y jabón. Todo lo esencial para que te sientas como
            en casa desde el primer día.
          </p>
        </div>
      </div>

      <div className=" h-full">
        <RoomOptionsSelector
          onSelect={handleSelectOption}
          filteredRoomsCount={filteredRooms.length}
        />
        <div
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
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
        open={selectedRoom !== null}
        setOpen={handleCloseModal}
        roomSlug={selectedRoom || ""}
      />
      <Gallery />
    </section>
  );
}
