import { House } from "lucide-react";
import { HoverCard } from "../composed/HoverCard";

export function Offers() {
  // create a fancy button per room, with its name and a url of /room/[slug]
  const SELECTIONS = [
    {
      title: "Hospedaje",
      description: "Explora las habitaciones del Hostal Micelio",
      imgUrl: "/assets/rooms/parque-nacional-huerquehue/PHOTO_00.jpg",
      link: "/hospedaje",
      alt: "View of laguna san rafael Room",
    },
    {
      title: "Larga estadía",
      description: "¡En temporada baja puedes quedarte por más tiempo!",
      imgUrl: "/assets/rooms/parque-nacional-huerquehue/PHOTO_00.jpg",
      link: "/larga-estadía",
      alt: "View of parque nacional conguillio Room",
    },
    {
      title: "Eventos",
      description: "Descubre nuestros eventos temáticos",
      imgUrl: "/assets/rooms/parque-nacional-huerquehue/PHOTO_00.jpg",
      link: "/eventos",
      alt: "View of parque nacional huerquehue Room",
    },
  ];
  return (
    <div className="container mx-auto py-20 min-h-96">
      <h2 className="mb-6 text-2xl flex items-center gap-2 z-90">
        <House />
        Podrás encontrar
      </h2>
      <div className="relative isolate overflow-hidden rounded-[60px]">
        <div className="overflow-hidden rounded-[60px] ">
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 h-full">
            {SELECTIONS.map((selection) => (
              <HoverCard key={selection.title} {...selection} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
