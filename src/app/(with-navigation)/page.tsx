import React, { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
// import { Offers } from "@/components/sections/Offers";
import { GettingHere } from "@/components/sections/GettingHere";
import { Rooms } from "@/components/sections/Rooms";
import { Reviews } from "@/components/sections/Reviews";
import { RoomCardSkeleton } from "@/components/composed/RoomCardSkeleton";
// import { ButtonShowcase } from "@/components/sections/ButtonShowcase";

export default function Home() {
  return (
    <main className="">
      <Hero />

      <Suspense 
        fallback={
          <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-8">
              {[...Array(3)].map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          </section>
        }
      >
        <Rooms />
      </Suspense>
      {/* <ButtonShowcase /> */}
      {/* <Offers /> */}

      {/* <Villarrica /> */}
      {/* <Amenities /> */}
      {/* <Events /> */}
      {/* <Team /> */}
      {/* <Menu /> */}
      <Reviews />
      <GettingHere />
    </main>
  );
}
