"use client";

import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";

export function Rooms() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
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
