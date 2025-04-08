import { Breadcrumb } from "@/components/composed/_Breadcrumb";

import { InnerHero } from "@/components/sections/InnerHero";
export default function RoomsPage() {
  return (
    <div>
      <InnerHero title="¡Conoce nuestros eventos!"></InnerHero>
      <Breadcrumb
        levels={[
          { label: "Inicio", href: "/" },
          { label: "Eventos", href: "/eventos" },
        ]}
      />
    </div>
  );
}
