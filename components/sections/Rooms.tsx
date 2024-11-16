"use client";

import { useState } from "react";
import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <div key={room.slug} className="">
            <RoomCard {...room} />
          </div>
        ))}
      </div>
    </div>
  );
}
