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

  // Case 1: Una imagen → Banner a ancho completo con altura fija.
  if (imgs.length === 1) {
    return (
      <button
        onClick={() => openGallery(imgs, 0)}
        className="relative w-full h-[250px] md:h-[300px] rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Image
          src={imgs[0].src}
          alt={imgs[0].alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </button>
    );
  }

  // Case 2: Dos imágenes → Split view: imagen principal a la izquierda (2/3) y segunda imagen a la derecha (1/3).
  if (imgs.length === 2) {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => openGallery(imgs, 0)}
          className="relative w-2/3 h-[250px] md:h-[300px] rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Image
            src={imgs[0].src}
            alt={imgs[0].alt}
            fill
            className="object-cover"
            sizes="66vw"
          />
        </button>
        <button
          onClick={() => openGallery(imgs, 1)}
          className="relative w-1/3 h-[250px] md:h-[300px] rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Image
            src={imgs[1].src}
            alt={imgs[1].alt}
            fill
            className="object-cover"
            sizes="33vw"
          />
        </button>
      </div>
    );
  }

  // Case 3: Tres imágenes → Grid de dos columnas: imagen principal a la izquierda y dos imágenes apiladas a la derecha.
  if (imgs.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 h-[250px] md:h-[300px]">
        <button
          onClick={() => openGallery(imgs, 0)}
          className="relative w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Image
            src={imgs[0].src}
            alt={imgs[0].alt}
            fill
            className="object-cover"
            sizes="66vw"
          />
        </button>
        <div className="flex flex-col gap-1 h-full">
          <button
            onClick={() => openGallery(imgs, 1)}
            className="relative w-full flex-1 rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={imgs[1].src}
              alt={imgs[1].alt}
              fill
              className="object-cover"
              sizes="33vw"
            />
          </button>
          <button
            onClick={() => openGallery(imgs, 2)}
            className="relative w-full flex-1 rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={imgs[2].src}
              alt={imgs[2].alt}
              fill
              className="object-cover"
              sizes="33vw"
            />
          </button>
        </div>
      </div>
    );
  }

  // Case 4: Exactamente cuatro imágenes →
  // Layout: columna principal (75% ancho) y columna de miniaturas apiladas verticalmente (25% ancho).
  if (imgs.length === 4) {
    return (
      <div className="grid grid-cols-[3fr_1fr] gap-1 h-[250px] md:h-[300px]">
        {/* Imagen principal */}
        <button
          onClick={() => openGallery(imgs, 0)}
          className="relative w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Image
            src={imgs[0].src}
            alt={imgs[0].alt}
            fill
            className="object-cover"
            sizes="75vw"
          />
        </button>
        {/* Columna de 3 miniaturas */}
        <div className="grid grid-rows-3 gap-1 h-full">
          {imgs.slice(1, 4).map((img, index) => (
            <button
              key={index}
              onClick={() => openGallery(imgs, index + 1)}
              className="relative w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Case 5: Más de cuatro imágenes →
  // Usa el mismo layout que para 4 imágenes, pero la última miniatura muestra un overlay con el contador de imágenes restantes.
  const mainImage = imgs[0];
  const thumbnails = imgs.slice(1, 4);
  const remainingCount = imgs.length - 4;

  return (
    <div className="grid grid-cols-[3fr_1fr] gap-1 h-[250px] md:h-[300px]">
      {/* Imagen principal */}
      <button
        onClick={() => openGallery(imgs, 0)}
        className="relative w-full h-[250px] md:h-[300px] rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Image
          src={mainImage.src}
          alt={mainImage.alt}
          fill
          className="object-cover"
          sizes="75vw"
        />
      </button>
      {/* Miniaturas */}
      <div className="grid grid-rows-3 gap-1 h-full">
        {thumbnails.map((img, i) => (
          <button
            key={i}
            onClick={() => openGallery(imgs, i + 1)}
            className="relative w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="25vw"
            />
            {i === thumbnails.length - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
