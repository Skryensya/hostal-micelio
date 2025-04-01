import { Rooms } from "@/components/sections/Rooms";
import { Breadcrumb } from "@/components/composed/Breadcrumb"; 

import { InnerHero } from "@/components/sections/InnerHero";
export default function RoomsPage() {
  return (
    <div>
      <InnerHero title="Encuentra tu habitación ideal" />

      <Breadcrumb
        levels={[
          { label: "Inicio", href: "/" },
          { label: "Habitaciones", href: "/habitaciones" },
        ]}
      /> 

      <div className="mt-10">{/* <Amenities /> */}</div>
      <Rooms />
    </div>
  );
}
