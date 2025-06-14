"use client";

import { useState } from "react";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { RoomOption, Room } from "@/lib/types";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Users, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const getRoomIcon = (id: string) => {
  switch (id) {
    case "HCO":
      return (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-xs">1+</span>
        </div>
      );
    case "HIN":
      return (
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="text-xs">1</span>
        </div>
      );
    case "HDB":
      return (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-xs">2</span>
        </div>
      );
    case "HMA":
      return (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-xs">2</span>
        </div>
      );
    case "HT":
      return (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-xs">3</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-xs">1+</span>
        </div>
      );
  }
};

const getCapacityByFormatId = (id: string): number => {
  switch (id) {
    case "HCO":
      return 1;
    case "HIN":
      return 1;
    case "HDB":
      return 2;
    case "HMA":
      return 2;
    case "HT":
      return 3;
    default:
      return 1;
  }
};

interface RoomFormatSelectorProps {
  room: Room;
  onFormatChange?: (format: RoomOption) => void;
  inline?: boolean;
}

export const RoomFormatSelector = ({
  room,
  onFormatChange,
  inline = false,
}: RoomFormatSelectorProps) => {
  const { selectedFormat, setSelectedFormat } = useSelectionStore();
  const [isOpen, setIsOpen] = useState(false);

  // Get available formats for this room
  const availableFormats = ROOM_FORMATS.filter(
    (format) =>
      format.id === room.defaultFormat ||
      room.alternativeFormats.includes(format.id)
  ).sort((a, b) => a.price - b.price);

  // If there's only one format available and we're in inline mode, return the single format display
  if (availableFormats.length <= 1 && inline) {
    const singleFormat = availableFormats[0];
    return (
      <div className="flex items-center gap-2">
        {getRoomIcon(singleFormat.id)}
        <span className="text-sm">{singleFormat.label}</span>
      </div>
    );
  }

  // If there's only one format and not inline, don't show anything
  if (availableFormats.length <= 1) {
    return null;
  }

  const handleFormatSelect = (format: RoomOption) => {
    setSelectedFormat(format);
    setIsOpen(false);
    onFormatChange?.(format);
  };

  const currentFormat =
    selectedFormat && availableFormats.find((f) => f.id === selectedFormat.id)
      ? selectedFormat
      : availableFormats[0];

  return (
    <div className={cn("relative", !inline && "mb-6")}>
      {!inline && (
        <label className="block text-sm font-medium text-text-muted mb-2">
          Selecciona formato de habitación
        </label>
      )}
      <div className="relative bg-surface-1/50 rounded-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border border-primary/30 rounded-lg bg-background text-text hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <div className="flex items-center gap-2">
            {getRoomIcon(currentFormat.id)}
            <span>Habitación {currentFormat.label}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-primary/30 rounded-lg shadow-lg z-50 bg-white">
            {availableFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-primary/10 first:rounded-t-lg last:rounded-b-lg transition-colors",
                  currentFormat.id === format.id && "bg-primary/20"
                )}
              >
                <div className="flex justify-between items-center gap-2 w-full">
                  <span className="text-left">Habitación {format.label}</span>
                  <span className="text-xs text-text-muted flex gap-1">
                    {getRoomIcon(format.id)}
                    {getCapacityByFormatId(format.id) === 1
                      ? "persona"
                      : "personas"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
