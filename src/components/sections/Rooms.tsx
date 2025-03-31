"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";

export function Rooms() {
  return (
    <section className="  container mx-auto max-w-screen-lg  py-10">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold mb-8" id="habitaciones">
          Conoce nuestras habitaciones
        </h2>
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
              <RoomCard {...room} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
