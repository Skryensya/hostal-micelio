import React from "react";
// import { cn } from "@/lib/utils";
import RoomCard from "@/components/composed/RoomCard";
import DATOS from "@/DATOS.json";

export function Rooms() {
  return (
    <div className="container mx-auto  py-10">
      {DATOS.habitaciones.map((room) => (
        <RoomCard
          key={room.nombre}
          title={room.nombre}
          description={room.descripcion}
          price={room.precio}
          floor={room.piso}
          beds={room.camas}
        />
      ))}
    </div>
  );
}
