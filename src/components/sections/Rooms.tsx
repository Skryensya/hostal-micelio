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

// Fixed height container to prevent CLS
const RoomSlotContainer = ({
  children,
  isEmpty,
}: {
  children: React.ReactNode;
  isEmpty: boolean;
}) => (
  <div
    className="transition-all duration-300 ease-out"
    style={{
      minHeight: isEmpty ? "0px" : "fit-content",
      opacity: isEmpty ? 0 : 1,
      transform: isEmpty ? "scale(0.98)" : "scale(1)",
    }}
  >
    {children}
  </div>
);

// Optimized room slot component with cross-fade animation
const RoomSlot = ({
  currentRoom,
  nextRoom,
  index,
  onViewDetails,
  selectedFormat,
  showCurrent,
  previousSelectedFormat,
  isFirstLoad,
}: {
  currentRoom: Room | null;
  nextRoom: Room | null;
  index: number;
  onViewDetails: (slug: string) => void;
  selectedFormat: string | null;
  showCurrent: boolean;
  previousSelectedFormat: string | null;
  isFirstLoad: boolean;
}) => {
  const room = showCurrent ? currentRoom : nextRoom;
  const isEmpty = !room;

  return (
    <RoomSlotContainer isEmpty={isEmpty}>
      <AnimatePresence mode="wait">
        {room && (
          <motion.div
            key={`${room.slug}-${showCurrent ? "current" : "next"}-${showCurrent ? previousSelectedFormat : selectedFormat}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
            }}
            transition={{
              duration: isFirstLoad ? 0.4 : 0.2, // Faster for subsequent loads
              ease: [0.25, 0.1, 0.25, 1],
              delay: isFirstLoad ? index * 0.1 : index * 0.03, // Shorter delay for subsequent loads
            }}
          >
            <RoomCard
              {...room}
              onViewDetails={() => onViewDetails(room.slug)}
              selectedFormat={showCurrent ? previousSelectedFormat : selectedFormat}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </RoomSlotContainer>
  );
};

export function Rooms() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedFormat, setSelectedFormat } = useSelectionStore();
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track very first load
  const [maxSlots, setMaxSlots] = useState(0);
  const [currentRooms, setCurrentRooms] = useState<Room[]>([]);
  const [nextRooms, setNextRooms] = useState<Room[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCurrent, setShowCurrent] = useState(true);
  const [allRoomsCache, setAllRoomsCache] = useState<Record<string, Room[]>>(
    {},
  );
  const [previousSelectedFormat, setPreviousSelectedFormat] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(0);

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

  // Pre-calculate all room lists on mount for optimal performance
  useEffect(() => {
    const calculateAllRoomLists = () => {
      const cache: Record<string, Room[]> = {};

      // Cache for "all rooms" (no filter)
      cache["all"] = [...typedRooms].sort((a, b) => {
        const priceA = PRICE_MAP[a.defaultFormat] || 0;
        const totalA = priceA + (a.hasPrivateToilet ? 10000 : 0);
        const priceB = PRICE_MAP[b.defaultFormat] || 0;
        const totalB = priceB + (b.hasPrivateToilet ? 10000 : 0);
        return totalA - totalB;
      });

      // Cache for each room format
      ROOM_FORMATS.forEach((format) => {
        const roomsToSort = typedRooms.filter(
          (r) =>
            r.defaultFormat === format.id ||
            r.alternativeFormats.includes(format.id),
        );

        cache[format.id] = roomsToSort.sort((a, b) => {
          const priceA = PRICE_MAP[format.id] || 0;
          const totalA = priceA + (a.hasPrivateToilet ? 10000 : 0);
          const priceB = PRICE_MAP[format.id] || 0;
          const totalB = priceB + (b.hasPrivateToilet ? 10000 : 0);
          return totalA - totalB;
        });
      });

      setAllRoomsCache(cache);
    };

    calculateAllRoomLists();
  }, []);

  // Get filtered rooms from cache
  const filteredRooms = useMemo(() => {
    const formatKey = selectedFormat?.id || "all";
    return allRoomsCache[formatKey] || [];
  }, [selectedFormat, allRoomsCache]);

  // Update displayed count only when transition completes
  useEffect(() => {
    if (!isTransitioning && displayedCount !== filteredRooms.length) {
      setDisplayedCount(filteredRooms.length);
    }
  }, [isTransitioning, filteredRooms.length, displayedCount]);

  // Track maximum number of slots needed
  useEffect(() => {
    if (displayedCount > maxSlots) {
      setMaxSlots(displayedCount);
    }
  }, [displayedCount, maxSlots]);

  // Set initial rooms from cache
  useEffect(() => {
    if (initialLoad && filteredRooms.length > 0) {
      setCurrentRooms(filteredRooms);
      setDisplayedCount(filteredRooms.length);
      // Mark first load as complete once rooms are loaded
      setIsFirstLoad(false);
    }
  }, [initialLoad, filteredRooms]);

  // Handle smooth cross-fade transition between room lists
  useEffect(() => {
    if (
      !initialLoad &&
      JSON.stringify(currentRooms) !== JSON.stringify(filteredRooms)
    ) {
      // Store previous format before transition
      setPreviousSelectedFormat(selectedFormat?.id || null);
      
      setIsTransitioning(true);
      setNextRooms(filteredRooms);

      // Start fade out of current list
      setShowCurrent(false);

      // After fade out completes, switch to next list and fade in
      const fadeOutDuration = isFirstLoad ? 300 : 150; // Faster for subsequent loads
      const fadeInDuration = isFirstLoad ? 400 : 200; // Faster for subsequent loads
      
      setTimeout(() => {
        setCurrentRooms(filteredRooms);
        setShowCurrent(true);

        // Complete transition after fade in
        setTimeout(() => {
          setIsTransitioning(false);
          setNextRooms([]);
        }, fadeInDuration);
      }, fadeOutDuration);
    }
  }, [filteredRooms, currentRooms, initialLoad, selectedFormat?.id, isFirstLoad]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <RoomOptionsSelector
          onSelect={() => {}}
          filteredRoomsCount={displayedCount}
        />
        <div className="flex flex-col gap-2" aria-labelledby="habitaciones">
          {isFirstLoad && Object.keys(allRoomsCache).length === 0 ? (
            // Show skeletons only on very first load
            <>
              {[...Array(3)].map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from(
                {
                  length: Math.max(
                    maxSlots,
                    Math.max(currentRooms.length, nextRooms.length),
                  ),
                },
                (_, index) => (
                  <RoomSlot
                    key={index}
                    currentRoom={currentRooms[index] || null}
                    nextRoom={nextRooms[index] || null}
                    index={index}
                    onViewDetails={handleViewRoom}
                    selectedFormat={selectedFormat?.id || null}
                    showCurrent={showCurrent}
                    previousSelectedFormat={previousSelectedFormat}
                    isFirstLoad={isFirstLoad}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
