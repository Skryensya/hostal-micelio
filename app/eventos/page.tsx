import { Rooms } from "@/components/sections/Rooms";
import { Amenities } from "@/components/sections/Amenities";

import { InnerHero } from "@/components/sections/InnerHero";
export default function RoomsPage() {
  return (
    <div>
      <InnerHero title="¡Conoce nuestros eventos!"></InnerHero>
      <div className="container text-2xl text-rose-400 font-bold italic">
        [AUN EN DESARROLLO]
      </div>
      <div className="mt-10">
        <Amenities />
      </div>
      <Rooms />
    </div>
  );
}
