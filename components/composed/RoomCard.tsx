"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
// import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { BedDouble, BedSingle, ShowerHead, User, Dot } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Room as RoomType } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";

export default function RoomCard({
  slug,
  name,
  description,
  beds,
  capacity,
  hasPrivateToilet,
}: Partial<RoomType>) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const images = ROOM_IMAGES[slug] || [];

  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  const renderBedIcon = (bedType: string) => {
    switch (bedType) {
      case "B01":
        return <BedDouble size={20} />;
      case "B02":
        return <BedSingle size={20} />;
      default:
        return null;
    }
  };

  const renderRoomDetails = () => (
    <div className="text-base">
      <div className="flex text-sm items-center mb-2">
        <User size={20} />
        <span className="ml-2">Capacidad: {capacity} huespedes</span>
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

  const CardContent = () => (
    <div className="flex flex-col h-full w-full group rounded-xl overflow-hidden  hover:bg-white/50">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[url(https://dummyimage.com/400x400/e288c7/280b1f.jpg&text=+++Sin+imagen+++)] bg-fill">
        <Image
          src={images[0]?.src}
          alt={images[0]?.alt || name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105 "
        />
      </div>
      <div className="flex flex-col flex-1 px-4 py-2  transition-all">
        <h2 className="font-bold text-lg">{name}</h2>
        <div className="flex text-sm items-center">
          <span>{capacity} huespedes</span>
          <Dot size={16} />
          <span>{beds?.length} camas</span>
        </div>
        <p className="text-base mt-1 mb-4 line-clamp-2">{description}</p>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex flex-col h-full w-full  cursor-pointer">
            <CardContent />
          </div>
        </DialogTrigger>
        <DialogContent  className="w-full max-w-[90dvw] lg:max-w-5xl mx-auto max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 overflow-hidden">
            <div className="flex gap-4 w-full h-full max-h-[50vh]">
              <div className="w-10/12 flex flex-col justify-center items-center">
                <div className="relative aspect-[4/3] w-full h-[300px]">
                  <Image
                    src={images[selectedImage]?.src}
                    alt={images[selectedImage]?.alt || name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md bg-gray-100"
                  />
                </div>
                <ScrollArea className="h-[20dvh]">
                  {renderRoomDetails()}
                </ScrollArea>
              </div>
              <ScrollArea className="w-2/12 h-full">
                <div className="flex flex-col gap-2 pr-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-[5/3] overflow-hidden cursor-pointer border-2 rounded-md ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex flex-col h-full w-full   cursor-pointer">
          <CardContent />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{name}</DrawerTitle>
          <DrawerDescription>
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-4 ">
              <Image
                src={images[selectedImage]?.src}
                alt={images[selectedImage]?.alt || name}
                layout="fill"
                objectFit="cover"
                className="rounded-md "
              />
            </div>
            {renderRoomDetails()}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <button className="btn btn-outline">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
