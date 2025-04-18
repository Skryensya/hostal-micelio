"use client";

import React from "react";
import { DateRangePicker } from "@/components/sections/CheckAvailabiliy/components/DateRangePicker";
import { GuestSelector } from "@/components/sections/CheckAvailabiliy/components/GuestSelector";
import { RoomSelector } from "@/components/sections/CheckAvailabiliy/components/RoomSelector";
import { LightEffect } from "@/components/ui/LightEffect";
// import { StayingTypeSelector } from "./components/StayingTypeSelector";

export const DesktopView: React.FC = () => {
  return (
    <div className="container mx-auto py-10 hidden md:block">
      {/* <StayingTypeSelector /> */}
      <div className="flex justify-center items-center">
        <div className="relative flex flex-col items-center gap-y-4 md:flex-row flex-shrink rounded-standar md:rounded-full p-1 bg-primary shadow-lg shadow-primary-inverted/40 text-text-on-light w-fit">
          <DateRangePicker />
          <GuestSelector />
          <RoomSelector />
          <LightEffect />
        </div>
      </div>
    </div>
  );
};
