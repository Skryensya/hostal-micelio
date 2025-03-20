import React from "react";
import { Hero } from "@/components/sections/Hero";
// import { Offers } from "@/components/sections/Offers";
import { GettingHere } from "@/components/sections/GettingHere";
import { CheckAvailability } from "@/components/sections/CheckAvailabiliy";
import { WavyDivider } from "@/components/composed/WavyDivider";
import { Reviews } from "@/components/sections/Reviews";
import { Rooms } from "@/components/sections/Rooms";
// import { ButtonShowcase } from "@/components/sections/ButtonShowcase";

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
      <CheckAvailability />
      <Rooms />
      {/* <ButtonShowcase /> */}
      {/* <Offers /> */}

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
