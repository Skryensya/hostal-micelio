import { useState, useCallback } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import imagesData from "@/db/ROOM_IMAGES.json";

export function RoomImageShowcase({ slug }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = imagesData[slug] || [];

  const handleImageClick = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  return (
    <>
      <div className="flex gap-4 w-full">
        {/* Main image container */}
        <div className="w-10/12 flex flex-col">
          <div className="relative aspect-[4/3] w-full h-[300px]">
            <Image
              src={images[selectedImage]?.src}
              alt={images[selectedImage]?.alt || name}
           
              objectFit="contain"
              className="bg-white/50 rounded-xl"
            />
          </div>
        </div>

        {/* Sidebar scroll area */}
        <div className="w-2/12 h-full flex flex-col">
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col gap-2 pr-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-[7/5] w-full overflow-hidden cursor-pointer border-2 rounded-xl ${
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
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
