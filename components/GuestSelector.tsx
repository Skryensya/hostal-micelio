"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MinusIcon, PlusIcon, UserRound, Baby, Dog } from "lucide-react"; // Import icons

interface GuestSelectorProps {
  setSelectionFunction: (selection: {
    adults: number;
    children: number;
    pets: number;
  }) => void;
}

export function GuestSelector({ setSelectionFunction }: GuestSelectorProps) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0); // Change pets to a number
  const [open, setOpen] = useState(false);

  const incrementCount = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setter((prev) => prev + 1);
  };

  const decrementCount = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setter((prev) => Math.max(0, prev - 1));
  };

  // Update selection function whenever any state changes
  useEffect(() => {
    setSelectionFunction({ adults, children, pets });
  }, [adults, children, pets, setSelectionFunction]);

  const adultsLabel = adults === 1 ? "adulto" : "adultos";
  const childrenLabel = children === 1 ? "niño" : "niños";
  const petsLabel = pets === 1 ? "mascota" : "mascotas";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[280px]">
          <span>
            {adults} {adultsLabel}
          </span>
          <span className="px-2">|</span>
          <span>
            {children} {childrenLabel}
          </span>
          <span className="px-2">|</span>
          <span>
            {pets} {petsLabel}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="font-semibold text-lg h3">Huéspedes</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <UserRound className="mr-2 h-4 w-4" /> Adultos
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => decrementCount(setAdults)}
                  disabled={adults <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementCount(setAdults)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Baby className="mr-2 h-4 w-4" /> Niños
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => decrementCount(setChildren)}
                  disabled={children === 0}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementCount(setChildren)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Dog className="mr-2 h-4 w-4" /> Mascotas
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => decrementCount(setPets)}
                  disabled={pets === 0}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{pets}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementCount(setPets)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
