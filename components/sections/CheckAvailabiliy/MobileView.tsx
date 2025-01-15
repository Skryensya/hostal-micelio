"use client";

import React from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
// import { GuestSelector } from "@/components/GuestSelector";
// import { RoomSelector } from "@/components/RoomSelector";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { StayingTypeSelector } from "./StayingTypeSelector";

export const MobileView: React.FC = () => {
  return (
    <div className=" md:hidden flex justify-center items-center my-10">
      <Drawer>
        <DrawerTrigger>
          <div className={cn(buttonVariants({ variant: "outline" }))}>
            Open Drawer
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>cotiza tu estadía</DrawerTitle>
            <DrawerDescription>
              Selecciona las opciones que mejor se adapten a tus necesidades
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 pt-2 px-4 h-full">
            <StayingTypeSelector />
            <DateRangePicker />
            {/* <GuestSelector />
            <RoomSelector /> */}
          </div>
          <DrawerFooter>
            <DrawerClose>
              <div className={cn(buttonVariants({ variant: "outline" }))}>
                Close
              </div>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
