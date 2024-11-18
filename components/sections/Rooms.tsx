"use client";

import { useState } from "react";
import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";
import { motion, AnimatePresence } from "framer-motion";

export function Rooms() {
  const [filterByToilet, setFilterByToilet] = useState(false);

  // Filter the rooms based on whether they have a private toilet
  const filteredRooms = filterByToilet
    ? ROOMS.filter((room) => room.hasPrivateToilet)
    : ROOMS;

  return (
    <div className="container mx-auto py-20">
      <div className="flex justify-end mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterByToilet}
            onChange={(e) => setFilterByToilet(e.target.checked)}
            className="form-checkbox"
          />
          <span>Only rooms with private toilet</span>
        </label>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {filteredRooms.map((room) => (
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
