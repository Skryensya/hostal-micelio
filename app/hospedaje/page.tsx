import { Rooms } from "@/components/sections/Rooms";
// import { Amenities } from "@/components/sections/Amenities";

import { InnerHero } from "@/components/sections/InnerHero";
export default function RoomsPage() {
  return (
    <div>
      <InnerHero title="Encuentra tu habitación ideal"></InnerHero>

      <div className="mt-10">{/* <Amenities /> */}</div>
      <Rooms />
    </div>
  );
}
