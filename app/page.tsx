import React from "react";
// import { cn } from "@/lib/utils";

import { Hero } from "@/components/sections/Hero";
// import { Villarrica } from "@/components/sections/Villarrica";
// import { Amenities } from "@/components/sections/Amenities";
// import { Events } from "@/components/sections/Events";
import { Offers } from "@/components/sections/Offers";
// import { Team } from "@/components/sections/Team";
// import { Menu } from "@/components/sections/Menu";
import { GettingHere } from "@/components/sections/GettingHere";
import { CheckAvailability } from "@/components/sections/CheckAvailability";
import { WavyDivider } from "@/components/composed/WavyDivider";
import { Reviews } from "@/components/sections/Reviews";
import { ButtonShowcase } from "@/components/sections/ButtonShowcase";
export default function Home() {
  return (
    <main className="">
      <Hero />
      <WavyDivider
        backgroundClassNames={[
          "bg-white/50 dark:bg-white/20",
          "bg-surface-light dark:bg-surface-dark",
          "bg-surface-light dark:bg-surface-dark",
        ]}
      />
      <CheckAvailability></CheckAvailability>
      <ButtonShowcase />
      <Offers />

      {/* <Villarrica /> */}
      {/* <Amenities /> */}
      {/* <Events /> */}
      {/* <Team /> */}
      {/* <Menu /> */}
      <GettingHere />
      <Reviews />
    </main>
  );
}
