"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ROOM_OPTIONS from "@/db/ROOM_OPTIONS.json";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RoomOption } from "@/lib/types";
// Sort the options by price
const roomOptions = ROOM_OPTIONS.sort((a, b) => a.price - b.price);

export const RoomOptionsSelector = ({
  onSelect,
}: {
  onSelect: (option: RoomOption) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<RoomOption | null>(null);

  useEffect(() => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  }, [selectedOption, onSelect]);

  return (
    <div>
      <div className="text-lg font-bold mb-4 font-mono">Formatos</div>
      <div className=" grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-4  ">
        {roomOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={cn(
              "cursor-default transition-all duration-200 h-full w-full bg-primary/40",
              selectedOption === option && "bg-primary/80"
            )}
          >
            <Card className="cursor-default transition-all duration-200 h-full w-full bg-primary/40">
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <span className="text-xs font-mono text-text-muted">
                    habitación
                  </span>
                  <h3 className="!text-base !font-medium font-body mb-2">
                    {option.label}
                  </h3>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <Badge variant="outline">Precio</Badge>
                    <span className="font-semibold text-sm">
                      ${option.price.toLocaleString("es-CL")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};
