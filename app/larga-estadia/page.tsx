import { Breadcrumb } from "@/components/composed/Breadcrumb";

import { InnerHero } from "@/components/sections/InnerHero";
export default function RoomsPage() {
  return (
    <div>
      <InnerHero title="¿Estas buscando donde alojarte por tiempo prolongado?"></InnerHero>
      <Breadcrumb
        levels={[
          { label: "Inicio", href: "/" },
          { label: "Larga estadia", href: "/larga-estadia" },
        ]}
      />
    </div>
  );
}
