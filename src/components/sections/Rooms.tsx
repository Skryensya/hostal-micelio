"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { RoomModal } from "../composed/RoomModal";
import { useState, useRef, useEffect } from "react";
import { Gallery } from "@/components/Gallery";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";
import { RoomOption } from "@/lib/types";

export function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Ref para el contenedor de la lista de habitaciones
  const gridRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = (roomSlug: string) => {
    setSelectedRoom(roomSlug);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleSelectOption = (option: RoomOption) => {
    setSelectedOption(option.id);
  };

  // Efecto para hacer scroll hasta el inicio de la lista si estás en desktop
  // y si el contenedor de la lista está fuera de la vista (más arriba en la página)
  useEffect(() => {
    // Solo en desktop (por ejemplo, ancho >= 1024px)
    if (
      typeof window !== "undefined" &&
      window.innerWidth >= 1024 &&
      gridRef.current
    ) {
      const gridTop = gridRef.current.getBoundingClientRect().top;
      // Si gridTop es negativo, significa que la parte superior de la lista ya está fuera del viewport
      if (gridTop < 0) {
        gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [selectedOption]);

  // Separamos las habitaciones en activas e inactivas
  const selectedRooms = selectedOption
    ? ROOMS.filter((room) => room.roomOptions.includes(selectedOption))
    : ROOMS;
  const unselectedRooms = selectedOption
    ? ROOMS.filter((room) => !room.roomOptions.includes(selectedOption))
    : [];

  // Primero se muestran las seleccionadas y luego las no seleccionadas
  const orderedRooms = [...selectedRooms, ...unselectedRooms];

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold mb-8" id="habitaciones">
          Conoce nuestras habitaciones
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-center h-full">
        <div className="lg:min-h-[500px] lg:w-[500px]">
          <div className="lg:sticky lg:top-20 lg:mb-6">
            <RoomOptionsSelector onSelect={handleSelectOption} />
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-2"
          aria-labelledby="habitaciones"
        >
          <AnimatePresence>
            {orderedRooms.map((room) => {
              // Determinamos si la habitación es activa o inactiva
              const isActive =
                !selectedOption || room.roomOptions.includes(selectedOption);
              return (
                <motion.div
                  key={room.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${!isActive ? "!opacity-80 grayscale" : ""}`}
                >
                  <RoomCard
                    {...room}
                    onViewDetails={() => handleOpenModal(room.slug)}
                  />
                </motion.div>
              );
            })}
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
