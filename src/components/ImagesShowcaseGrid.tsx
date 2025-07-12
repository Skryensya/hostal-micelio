"use client";

import Image from "next/image";
import { useGallery } from "./GalleryProvider";

export type ImageType = {
  src: string;
  alt: string;
};

export function ImagesShowcaseGrid({ imgs }: { imgs: ImageType[] }) {
  const { openGallery } = useGallery();

  if (!imgs || imgs.length === 0) return null;

  // Caso único: banner full-width
  if (imgs.length === 1) {
    return (
      <button
        onClick={() => openGallery(imgs, 0)}
        className="relative h-[250px] w-full overflow-hidden rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none md:h-[400px] select-none"
      >
        <Image
          src={imgs[0].src}
          alt={imgs[0].alt}
          fill
          className="cursor-pointer object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 66vw"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </button>
    );
  }

  // Para 2 o más imágenes, usamos siempre grid:
  const mainImage = imgs[0];
  const thumbnails = imgs.slice(1, 4); // hasta 3 miniaturas
  const thumbsCount = thumbnails.length;
  const remainingCount = imgs.length - 1 - thumbsCount;

  // Definimos dinámicamente columnas y filas:
  const gridCols = thumbsCount === 1 ? "2fr 1fr" : "3fr 1fr";
  const gridRows = thumbsCount === 1 ? "1fr" : `repeat(${thumbsCount}, 1fr)`;

  // Ajustamos el atributo sizes para cada caso (responsive based on container width)
  const mainSizes = thumbsCount === 1 
    ? "(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw" 
    : "(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 55vw";
  const thumbSizes = thumbsCount === 1 
    ? "(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 25vw" 
    : "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw";

  return (
    <div
      className="grid h-[250px] gap-2 select-none md:h-[400px]"
      style={{ gridTemplateColumns: gridCols, gridTemplateRows: gridRows }}
    >
      {/* Imagen principal */}
      <button
        onClick={() => openGallery(imgs, 0)}
        className="relative h-full w-full overflow-hidden rounded-2xl select-none focus:ring-2 focus:ring-blue-500 focus:outline-none select-none"
        style={{
          gridColumn: "1",
          gridRow: thumbsCount > 1 ? `span ${thumbsCount}` : "1",
        }}
      >
        <Image
          src={mainImage.src}
          alt={mainImage.alt}
          fill
          className="cursor-pointer object-cover"
          sizes={mainSizes}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </button>

      {/* Miniaturas */}
      {thumbnails.map((img, i) => (
        <button
          key={i}
          onClick={() => openGallery(imgs, i + 1)}
          className="relative h-full w-full overflow-hidden rounded-2xl select-none focus:ring-2 focus:ring-blue-500 focus:outline-none select-none"
          style={{
            gridColumn: "2",
            gridRow: String(i + 1),
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="cursor-pointer object-cover"
            sizes={thumbSizes}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Overlay de “+N” en la última miniatura si hay más */}
          {i === thumbsCount - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-xl font-semibold text-white">
                +{remainingCount}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
