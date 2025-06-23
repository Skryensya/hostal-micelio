"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ROOMS from "@/db/ROOMS.json";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import RoomCard from "../composed/RoomCard";
import { RoomCardSkeleton } from "../composed/RoomCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { RoomOptionsSelector } from "@/components/RoomOptionsSelector";
import { Room } from "@/lib/types";
import { useSelectionStore } from "@/store/useSelectionStore";

// Mapping for URL format parameters to format IDs
const FORMAT_URL_MAP: Record<string, string> = {
  triple: "HT",
  doble: "HDB",
  matrimonial: "HMA",
  individual: "HIN",
  compartida: "HCO",
};

// Precompute price map for faster lookups
const PRICE_MAP: Record<string, number> = ROOM_FORMATS.reduce(
  (map, opt) => ({ ...map, [opt.id]: opt.price }),
  {},
);

// Type assertion for ROOMS data
const typedRooms = ROOMS as Room[];

export function Rooms() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedFormat, setSelectedFormat } = useSelectionStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Set initial format from URL parameter only on first load
  useEffect(() => {
    if (!initialLoad) return;

    const formatParam = searchParams.get("formato");
    if (formatParam && FORMAT_URL_MAP[formatParam]) {
      const formatId = FORMAT_URL_MAP[formatParam];
      const format = ROOM_FORMATS.find((f) => f.id === formatId);
      if (format && (!selectedFormat || selectedFormat.id !== formatId)) {
        setSelectedFormat(format);
      }
    }
    setInitialLoad(false);
  }, [searchParams, setSelectedFormat, selectedFormat, initialLoad]);

  const handleViewRoom = (roomSlug: string) => {
    router.push(`/habitaciones/${roomSlug}`);
  };

  // Handle smooth transition when filter changes
  useEffect(() => {
    if (selectedFormat !== undefined) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [selectedFormat]);

  const filteredRooms = useMemo(() => {
    const roomsToSort = selectedFormat
      ? typedRooms.filter(
          (r) =>
            r.defaultFormat === selectedFormat.id ||
            r.alternativeFormats.includes(selectedFormat.id),
        )
      : [...typedRooms];

    // Siempre ordenar por precio de menor a mayor
    return roomsToSort.sort((a, b) => {
      // Calcular precio para habitación A
      const formatA = selectedFormat?.id || a.defaultFormat;
      const priceA = PRICE_MAP[formatA] || 0;
      const totalA = priceA + (a.hasPrivateToilet ? 10000 : 0);

      // Calcular precio para habitación B
      const formatB = selectedFormat?.id || b.defaultFormat;
      const priceB = PRICE_MAP[formatB] || 0;
      const totalB = priceB + (b.hasPrivateToilet ? 10000 : 0);

      // Ordenar de menor a mayor precio
      return totalA - totalB;
    });
  }, [selectedFormat]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h2 className="mb-8 text-2xl font-bold" id="habitaciones">
          Conoce nuestras habitaciones
        </h2>
        <div className="max-w-[80ch] space-y-4 text-pretty">
          <p>
            En Hostal Micelio contamos con 9 habitaciones listas para recibirte,
            en distintos formatos pensados para que encuentres el ideal según
            cómo viajes: solo, en pareja o en grupo.
          </p>
          <p>
            El precio se basa en la cantidad de personas, y a partir de eso
            buscamos el formato de habitación, o múltiples habitaciones, que
            mejor se adapte a tus necesidades. Esto nos permite ofrecer una
            experiencia más justa y personalizada. Siempre que haya
            disponibilidad, estaremos encantados de encontrar la mejor opción
            para ti.
          </p>
          <p>
            Por ejemplo, si viajas solo y ya no quedan habitaciones simples,
            haremos lo posible por ofrecerte una más amplia al precio de una
            simple. Queremos que disfrutes de una estadía cómoda, flexible y
            hecha a tu medida en Hostal Micelio.
          </p>
        </div>
      </div>

      <div>
        <RoomOptionsSelector
          onSelect={() => {}}
          filteredRoomsCount={filteredRooms.length}
        />
        <div className="flex flex-col gap-8" aria-labelledby="habitaciones">
          {filteredRooms.length === 0 ? (
            // Show skeletons only when no data
            <>
              {[...Array(3)].map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <div
              className={`transition-opacity duration-200 ${isTransitioning ? "opacity-60" : "opacity-100"}`}
            >
              <AnimatePresence mode="wait">
                {filteredRooms.map((room) => (
                  <motion.div
                    key={room.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                      layout: { duration: 0.3, ease: "easeInOut" },
                    }}
                    className="mb-8 last:mb-0"
                  >
                    <RoomCard
                      {...room}
                      onViewDetails={() => handleViewRoom(room.slug)}
                      selectedFormat={selectedFormat?.id || null}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
