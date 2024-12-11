"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
// import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BedDouble, BedSingle, ShowerHead, User, Dot, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Room as RoomType } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImageCarousel } from "../ImageCarousel";
import { Button } from "@/components/ui/button";

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
    <div className="text-base px-4">
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
    <div className="flex flex-col h-full w-full group  ">
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-gray-200 aspect-[4/3] lg:aspect-square`}
      >
        <ImageCarousel imgs={images} />
      </div>
      <div className="flex flex-col flex-1  py-2  transition-all">
        <h3 className="font-bold text-base">{name}</h3>
        <div className="flex text-xs items-center">
          <span>{capacity} huespedes</span>
          <Dot size={16} />
          <span>{beds?.length} camas</span>
        </div>
        <p className="text-base mt-1 mb-4 line-clamp-2">{description}</p>
      </div>
    </div>
  );

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isDesktop ? "right" : "bottom"}
    >
      <DrawerTrigger asChild>
        <div className="flex flex-col h-full w-full cursor-pointer">
          <CardContent />
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] lg:w-[700px] lg:h-[100dvh] overflow-hidden lg:ml-auto">
        <div className="container mx-auto h-full flex flex-col">
          <DrawerHeader className="px-4 relative">
            <DrawerClose className="absolute right-4 top-4 z-50 hidden lg:block">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-6 w-6" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-xl font-bold">{name}</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto ">
            <div className="flex flex-col lg:flex-row gap-4 lg:h-[406px]">
              <div className="w-full lg:w-10/12">
                <div className="relative aspect-video lg:aspect-[4/3] w-full">
                  {/* Use ImageCarousel for mobile, static Image for desktop */}
                  {isDesktop ? (
                    <Image
                      src={images[selectedImage]?.src || "/fallback-image.jpg"}
                      alt={images[selectedImage]?.alt || name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className=" w-full rounded-lg overflow-hidden">
                      <ImageCarousel imgs={images} aspectRatio="video" />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail gallery only visible on desktop */}
              {isDesktop && (
                <div className="w-full lg:w-2/12">
                  <ScrollArea className="h-full">
                    <div className="flex lg:flex-col gap-2 pr-3">
                      {/* list of thumbnails */}
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative shrink-0 w-100 aspect-[4/3] cursor-pointer shadow-md
                            ${selectedImage === index ? "opacity-80" : ""}`}
                          onClick={() => handleImageClick(index)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt || name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
            <div className="mt-4">{renderRoomDetails()}</div>
          </div>

          <DrawerFooter className="px-4 border-t flex-row justify-between -mx-4 pb-8 lg:pb-4 pt-4">
            <DrawerClose className="w-full">
              <Button className="w-full" variant={"outline"}>
                Cerrar
              </Button>
            </DrawerClose>
            <Button className="w-full">Reservar</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
