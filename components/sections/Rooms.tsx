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
      <h2 className="mb-6 text-2xl flex items-center gap-2 z-90">
        <House />
        Habitaciones
      </h2>
      <div className="relative isolate overflow-hidden rounded-[60px]">
        <div className="overflow-hidden rounded-[60px] ">
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 h-full">
            {SELECTIONS.map((selection) => (
              <HoverCard key={selection.title} {...selection} />
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="absolute bottom-1/2 left-0 translate-x-[-45%] translate-y-[50%] z-[100]  h-20 bg-surface-light aspect-square  rounded-full "></div>
          <div className="absolute bottom-1/2 right-0 translate-x-[45%] translate-y-[50%] z-[1000]  h-20 bg-surface-light aspect-square rounded-full "></div>
        </div>
        <div className="block md:hidden">
          <div className="absolute left-1/2 top-0 translate-y-[-75%] translate-x-[-50%] z-[100]  h-20 bg-surface-light aspect-square  rounded-full "></div>
          <div className="absolute left-1/2 bottom-0 translate-y-[75%] translate-x-[-50%] z-[100]  h-20 bg-surface-light aspect-square rounded-full "></div>
        </div>
      </div>
    </div>
  );
}
