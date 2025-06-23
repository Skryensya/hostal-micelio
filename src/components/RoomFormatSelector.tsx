"use client";

import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { Room } from "@/lib/types";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRoomGradientColor } from "@/lib/roomColors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFormatSelectorProps {
  room: Room;
  inline?: boolean;
}

export function RoomFormatSelector({ room, inline }: RoomFormatSelectorProps) {
  const { selectedFormat, setSelectedFormat } = useSelectionStore();

  // Get all valid formats for this room
  const validFormats = ROOM_FORMATS.filter(
    (format) =>
      format.id === room.defaultFormat ||
      room.alternativeFormats.includes(format.id)
  );

  const handleFormatChange = (formatId: string) => {
    const format = ROOM_FORMATS.find((f) => f.id === formatId);
    setSelectedFormat(format || null);
  };

  // Get the color for the currently selected format
  const currentColor = selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined;

  const getFormatIcon = (id: string, color?: string) => {
    const Icon = id === "HIN" ? User : Users;
    const capacity = id === "HIN" ? "1" : id === "HDB" || id === "HMA" ? "2" : id === "HT" ? "3" : "1+";
    return (
      <div className="flex items-center gap-1" style={{ color }}>
        <Icon className="w-4 h-4" />
        <span className="text-xs">{capacity}</span>
      </div>
    );
  };

  return (
    <Select
      value={selectedFormat?.id}
      onValueChange={handleFormatChange}
    >
      <SelectTrigger 
        className={cn(
          "w-full transition-all duration-200 rounded-xl",
          inline ? "h-9" : "h-10",
          currentColor && "border-2 hover:border-opacity-100"
        )}
        style={{
          borderColor: currentColor ? `${currentColor}90` : undefined,
          background: currentColor ? `linear-gradient(135deg, ${currentColor}08 0%, ${currentColor}03 100%)` : undefined,
          color: currentColor,
        }}
      >
        <SelectValue placeholder="Selecciona un formato">
          {selectedFormat && (
            <div className="flex items-center gap-2">
              {getFormatIcon(selectedFormat.id, currentColor)}
              <span>Habitación {selectedFormat.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl p-1 border-2 overflow-hidden">
        {validFormats.map((format) => {
          const formatColor = getRoomGradientColor(format.id);
          const isSelected = selectedFormat?.id === format.id;
          return (
            <SelectItem 
              key={format.id} 
              value={format.id}
              className={cn(
                "transition-all duration-200 cursor-pointer flex items-center gap-2 rounded-lg mb-1 last:mb-0 py-2 px-3",
                isSelected && "font-medium"
              )}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${formatColor}30 0%, ${formatColor}20 100%)`
                  : `linear-gradient(135deg, ${formatColor}15 0%, ${formatColor}10 100%)`,
                borderLeft: `3px solid ${formatColor}`,
                color: formatColor,
              }}
            >
              {getFormatIcon(format.id, formatColor)}
              <span>Habitación {format.label}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
