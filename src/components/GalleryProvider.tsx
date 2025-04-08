"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { ImageType } from "@/components/ImagesShowcaseGrid";

type GalleryContextType = {
  isOpen: boolean;
  currentImage: number;
  images: ImageType[];
  openGallery: (images: ImageType[], startIndex?: number) => void;
  closeGallery: () => void;
  nextImage: () => void;
  prevImage: () => void;
  goToImage: (index: number) => void;
};

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<ImageType[]>([]);

  const openGallery = useCallback((newImages: ImageType[], startIndex = 0) => {
    setImages(newImages);
    setCurrentImage(startIndex);
    setIsOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setIsOpen(false);
    setImages([]);
    setCurrentImage(0);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentImage(index);
    }
  }, [images.length]);

  return (
    <GalleryContext.Provider
      value={{
        isOpen,
        currentImage,
        images,
        openGallery,
        closeGallery,
        nextImage,
        prevImage,
        goToImage,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}
