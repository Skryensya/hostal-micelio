"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { RoomModal } from "../composed/RoomModal";
import { useState } from "react";
import { Gallery } from "@/components/Gallery";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";
import { RoomOption } from "@/lib/types";

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
        // Si ambos tienen el formato como default, mantén el orden original
        if (
          a.defaultFormat === selectedOption &&
          b.defaultFormat === selectedOption
        ) {
          return 0;
        }
        // Si a tiene el formato como default, va primero
        if (a.defaultFormat === selectedOption) {
          return -1;
        }
        // Si b tiene el formato como default, va primero
        if (b.defaultFormat === selectedOption) {
          return 1;
        }
        // Si ninguno tiene el formato como default, mantén el orden original
        return 0;
      })
    : ROOMS;

  return (
    <section className="container mx-auto py-10">
      <div className=" ">
        <h2 className="text-2xl font-bold mb-8" id="habitaciones">
          Conoce nuestras habitaciones
        </h2>
        <div className="max-w-[80ch] space-y-4 text-pretty">
          <p>
            En Hostal Micelio ofrecemos diferentes formatos de habitación para
            que encuentres el ideal para ti. Nuestro precio se basa en el tipo
            de habitación, no en el número de personas, y estos formatos son
            solo una guía. Siempre estamos dispuestos a llegar a acuerdos
            personalizados para ajustarnos a tus necesidades.
          </p>
          <p>
            Por ejemplo, si viajas solo y todas las habitaciones simples están
            ocupadas, te ofrecemos una habitación más amplia disponible al
            precio de una simple, garantizando tu comodidad y atención.
            ¡Queremos que disfrutes de una experiencia única en Hostal Micelio!
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center h-full">
        <RoomOptionsSelector
          onSelect={handleSelectOption}
          filteredRoomsCount={filteredRooms.length}
        />
        <div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-2"
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
