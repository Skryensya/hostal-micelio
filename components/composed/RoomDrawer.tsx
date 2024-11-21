"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ShowerHead, User } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Room as RoomType } from "@/lib/types";
import { RoomImageShowcase } from "@/components/composed/RoomGallery";
import { Button } from "@/components/ui/button";

export function RoomDrawer({
  room,
  isOpen,
  closeFn,
}: {
  room: Partial<RoomType>;
  isOpen: boolean;
  closeFn: () => void;
}) {
  const { slug, name, description, beds, capacity, hasPrivateToilet } = room;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const renderBedIcon = (bedType: string) => {
    switch (bedType) {
      case "B01":
        return <ShowerHead size={20} />;
      case "B02":
        return <User size={20} />;
      default:
        return null;
    }
  };

  const renderRoomDetails = () => (
    <div className="text-base">
      <div className="flex text-sm items-center mb-2">
        <User size={20} />
        <span className="ml-2">Capacidad: {capacity} huéspedes</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {beds?.map((bed, index) => (
          <div key={index} className="flex items-center gap-1">
            {renderBedIcon(bed)}
            <span>{bed === "B01" ? "Cama 2 plazas" : "Cama 1.5 plazas"}</span>
          </div>
        ))}
      </div>
      {hasPrivateToilet && (
        <div className="flex items-center mb-4" title="Baño privado">
          <ShowerHead size={20} />
          <span className="ml-2">Baño privado</span>
        </div>
      )}
      <p>{description}</p>
    </div>
  );

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={closeFn}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent
          className={`bg-surface-light lg:w-[65%] lg:max-w-[750px] lg:h-[100dvh] overflow-hidden ml-auto border-none  rounded-t-3xl lg:rounded-none lg:rounded-l-3xl px-4 lg:px-8`}
        >
          <DrawerHeader>
            <DrawerTitle className="text-xl -ml-4 -mb-2">{name}</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="space-y-4 overflow-hidden h-full">
            <RoomImageShowcase slug={slug} />

            <ScrollArea className="h-[20dvh]">{renderRoomDetails()}</ScrollArea>
          </DrawerDescription>
          <DrawerFooter className="pt-2 flex  flex-row w-full  ">
            <DrawerClose asChild>
              <Button
                variant="secondary"
                className="btn btn-outline  flex-1"
                onClick={closeFn}
              >
                Volver
              </Button>
            </DrawerClose>
            <Button className="btn btn-outline flex-1 bg-primary-light">
              Seleccionar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
