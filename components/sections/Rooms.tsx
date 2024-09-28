import ROOMS from "@/db/ROOMS.json";
import { House } from "lucide-react";
import { HoverCard } from "../composed/HoverCard";

export function Rooms() {
  // create a fancy button per room, with its name and a url of /room/[slug]
  const SELECTIONS = [
    {
      name: "Familiares",
      description: "Habitaciones para adultos",
      imgUrl: "/assets/rooms/laguna-san-rafael/PHOTO_00.jpg",
      link: "/rooms/laguna-san-rafael",
      alt: "View of laguna san rafael Room",
    },
    {
      name: "Individuales",
      description: "Habitaciones para adultos",
      imgUrl: "/assets/rooms/parque-nacional-conguillio/PHOTO_00.jpg",
      link: "/rooms/parque-nacional-conguillio",
      alt: "View of parque nacional conguillio Room",
    },
    {
      name: "Compartidas",
      description: "Habitaciones para niños",
      imgUrl: "/assets/rooms/parque-nacional-huerquehue/PHOTO_00.jpg",
      link: "/rooms/parque-nacional-huerquehue",
      alt: "View of parque nacional huerquehue Room",
    },
  ];
  return (
    <div className="container mx-auto py-20 min-h-96">
      <h2 className="mb-6 text-2xl flex items-center gap-2">
        <House />
        Habitaciones
      </h2>
      <div className="  grid md:grid-cols-12  gap-6 h-full">
        
        <div className="bg-accent-light h-full w-full col-span-4 rounded p-10">
          <div className="py-40 h3">Familiares</div>
        </div>
        <div className="bg-accent-light h-full w-full col-span-4 rounded p-10">
          <div className="py-40 h3">Individuales</div>
        </div>
        <div className="bg-accent-light h-full w-full col-span-4 rounded p-10">
          <div className="py-40 h3">Compartidas</div>
        </div>
      </div>
    </div>
  );
}
