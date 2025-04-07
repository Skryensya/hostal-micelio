import { Binoculars } from "lucide-react";
import { HoverCard } from "../composed/_HoverCard";

export function Offers() {
  // create a fancy button per room, with its name and a url of /room/[slug]

  return (
    <div className="container mx-auto py-10 min-h-96">
      <h2 className="mb-6 text-2xl flex items-center gap-2 z-90">
        <Binoculars className="h-8 w-8" />
        Podrás encontrar
      </h2>
      <div className="relative isolate overflow-hidden rounded-[30px]">
        <div className="overflow-hidden rounded-[30px] ">
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

const SELECTIONS = [
  {
    title: "Hospedaje",
    description: "Explora las habitaciones del Hostal Micelio",
    imgUrl:
      "/assets/images/_webp/rooms/huerquehue/00.webp",
    blurUrl:
      "/assets/images/_thumbnails/rooms/huerquehue/00.webp",
    color: "#6c513e",
    link: "/habitaciones",
    alt: "View of laguna san rafael Room",
  },
  {
    title: "Larga estadía",
    description: "¡En temporada baja puedes quedarte por más tiempo!",
    imgUrl:
      "/assets/images/_webp/rooms/conguillio/00.webp",
    blurUrl:
      "/assets/images/_thumbnails/rooms/conguillio/00.webp",
    color: "#6c513e",
    link: "/larga-estadía",
    alt: "View of parque nacional conguillio Room",
  },
  {
    title: "Eventos",
    description: "Descubre nuestros eventos temáticos",
    imgUrl:
      "/assets/images/_webp/rooms/huerquehue/00.webp",
    blurUrl:
      "/assets/images/_thumbnails/rooms/huerquehue/00.webp",
    color: "#6c513e",
    link: "/eventos",
    alt: "View of parque nacional huerquehue Room",
  },
];
