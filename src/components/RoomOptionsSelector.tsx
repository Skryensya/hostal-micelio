"use client";

import { Card, CardContent } from "@/components/ui/card";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RoomOption } from "@/lib/types";
import { Users, User, Undo } from "lucide-react";

// Ordena las opciones por precio
const roomOptions = ROOM_FORMATS.sort((a, b) => a.price - b.price);

const getRoomIcon = (id: string) => {
  switch (id) {
    case "HCO":
      return (
        <div className="flex flex-col items-center">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">1+</span>
        </div>
      );
    case "HIN":
      return (
        <div className="flex flex-col items-center">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">1</span>
        </div>
      );
    case "HDB":
      return (
        <div className="flex flex-col items-center">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">2</span>
        </div>
      );
    case "HMA":
      return (
        <div className="flex flex-col items-center">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">2</span>
        </div>
      );
    case "HT":
      return (
        <div className="flex flex-col items-center">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">3</span>
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">1+</span>
        </div>
      );
  }
};

export const RoomOptionsSelector = ({
  onSelect,
  filteredRoomsCount,
}: {
  onSelect: (option: RoomOption) => void;
  filteredRoomsCount: number;
}) => {
  const [selectedOption, setSelectedOption] = useState<RoomOption | null>();

  useEffect(() => {
    // Send the selectedOption to parent, or null when deselected
    onSelect(selectedOption || null);
  }, [selectedOption, onSelect]);

  const handleOptionClick = (option: RoomOption) => {
    // Toggle selection - if clicking the same option, deselect it
    setSelectedOption(option === selectedOption ? null : option);
  };

  const handleReset = () => {
    setSelectedOption(null);
  };

  return (
    <div className="py-10">
      <div className="text-lg font-bold sm:font-mono mb-4">
        ¿Qué tipo de habitación buscas?
      </div>
      <div className="flex flex-col gap-2 sm:gap-4">
        {/* Contenedor de opciones: vertical en móvil y wrap en pantallas grandes */}
        <div className="grid grid-cols-2 grid-flow-row sm:flex  sm:flex-wrap gap-2 ">
          {roomOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={cn(
                "cursor-default transition-all duration-200 w-full sm:w-fit bg-white/50 dark:transparent border border-primary/80 rounded-xl   grow",
                selectedOption === option && "bg-primary/30",
                index === roomOptions.length - 1 &&
                  index % 2 === 0 &&
                  "col-span-2"
              )}
            >
              <Card className="cursor-default transition-all duration-200 w-full bg-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/20 rounded">
                      {getRoomIcon(option.id)}
                    </div>
                    <div className="text-left">
                      <h3 className="!text-base font-body font-semibold">
                        Habitación {option.label}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
        {selectedOption && (
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors duration-200 w-fit h-6 px-4"
            >
              <Undo className="w-4 h-4" />
              <span>Ver todas </span>
            </button>
            <span className="text-sm text-text-muted">
              {filteredRoomsCount} {filteredRoomsCount === 1 ? 'habitación' : 'habitaciones'} encontradas
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
