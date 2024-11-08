import React from "react";
// import { cn } from "@/lib/utils";

import { Hero } from "@/components/sections/Hero";
import { Villarrica } from "@/components/sections/Villarrica";
import { Amenities } from "@/components/sections/Amenities";
// import { Events } from "@/components/sections/Events";
import { Rooms } from "@/components/sections/Rooms";
import { Team } from "@/components/sections/Team";
// import { Menu } from "@/components/sections/Menu";
import { GettingHere } from "@/components/sections/GettingHere";
import { CheckAvailability } from "@/components/sections/CheckAvailability";
// import { Test } from "@/components/sections/Test";
import { WavyDivider } from "@/components/composed/WavyDivider";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <WavyDivider
        backgroundClassNames={[
          "bg-white/50",
          "bg-surface-light",
          "bg-surface-light",
        ]}
      />
      <CheckAvailability></CheckAvailability>
      <Rooms />
      <Villarrica />
      <Amenities />
      {/* <Events /> */}
      <Team />
      {/* <Menu /> */}
      <GettingHere />
    </main>
  );
}
