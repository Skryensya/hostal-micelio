"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";

export function Rooms() {
  return (
    <div className="max-w-screen-lg mx-auto py-10">
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-bold mb-6">Conoce nuestras habitaciones</h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-surface-3-light-50 dark:bg-surface-3-dark-50 rounded-3xl">
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
    </div>
  );
}
