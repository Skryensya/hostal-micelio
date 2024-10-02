import { House } from "lucide-react";
import { HoverCard } from "../composed/HoverCard";

export function Rooms() {
  // create a fancy button per room, with its name and a url of /room/[slug]
  const SELECTIONS = [
    {
      title: "Familiares",
      description: "Habitaciones para adultos",
      imgUrl: "/assets/rooms/parque-nacional-huerquehue/PHOTO_00.jpg",
      link: "/rooms/parque-nacional-huerquehue",
      alt: "View of laguna san rafael Room",
    },
    {
      title: "Individuales",
      description: "Habitaciones para adultos",
      imgUrl: "/assets/rooms/parque-nacional-huerquehue/PHOTO_00.jpg",
      link: "/rooms/parque-nacional-huerquehue",
      alt: "View of parque nacional conguillio Room",
    },
    {
      title: "Compartidas",
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
      <div className="  grid md:grid-cols-3  gap-6 h-full">
        {SELECTIONS.map((selection) => (
          <HoverCard key={selection.title} {...selection} />
        ))}
      </div>
    </div>
  );
}
