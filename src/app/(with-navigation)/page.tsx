import React from "react";
import { Hero } from "@/components/sections/Hero";
// import { Offers } from "@/components/sections/Offers";
import { GettingHere } from "@/components/sections/GettingHere";
import { CheckAvailability } from "@/components/sections/CheckAvailabiliy";
import { Reviews } from "@/components/sections/Reviews";
import { Rooms } from "@/components/sections/Rooms";
// import { ButtonShowcase } from "@/components/sections/ButtonShowcase";

export default function Home() {
  return (
    <main className="">
      <Hero />

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
