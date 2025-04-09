"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { RoomModal } from "../composed/RoomModal";
import { useState } from "react";
import { Gallery } from "@/components/Gallery";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";

export function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleOpenModal = (roomSlug: string) => {
    setSelectedRoom(roomSlug);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  return (
    // pattern-bg
    <section className="container mx-auto py-10 ">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold mb-8" id="habitaciones">
          Conoce nuestras habitaciones
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-center h-full">
        <div className="lg:min-h-[500px] lg:w-[500px]">
          <div className="lg:sticky lg:top-20 lg:mb-6">
            <RoomOptionsSelector />
          </div>
        </div>

        <div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-2  "
          aria-labelledby="habitaciones"
        >
          <AnimatePresence>
            {ROOMS.map((room) => (
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
