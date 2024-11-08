"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MinusIcon, PlusIcon, UserRound, Baby } from "lucide-react"; // Import icons

interface GuestSelectorProps {
  setSelectionFunction: (selection: {
    adults: number;
    children: number;
  }) => void;
}

export function GuestSelector({ setSelectionFunction }: GuestSelectorProps) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [open, setOpen] = useState(false);
  const childrenRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter(parseInt(value === "" ? "0" : value, 10));
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextInput?: React.RefObject<HTMLInputElement>
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (nextInput?.current) {
        nextInput.current.focus();
      } else {
        setOpen(false); // Close the popover on the last input
      }
    }
  };

  // Update selection function whenever any state changes
  useEffect(() => {
    setSelectionFunction({ adults, children });
  }, [adults, children, setSelectionFunction]);

  const adultsLabel = adults === 1 ? "adulto" : "adultos";
  const childrenLabel = children === 1 ? "niño" : "niños";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[200px] w-full md:w-fit">
          <span>
            {adults} {adultsLabel}
          </span>
          <span className="px-2">|</span>
          <span>
            {children} {childrenLabel}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] rounded-2xl">
        <div className="space-y-4">
 
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
                <input
                  type="text"
                  value={adults}
                  onChange={(e) => handleInputChange(e, setAdults)}
                  onKeyDown={(e) => handleKeyPress(e, childrenRef)}
                  style={{ border: "none", textAlign: "center", width: "40px" }}
                />
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
                <input
                  ref={childrenRef}
                  type="text"
                  value={children}
                  onChange={(e) => handleInputChange(e, setChildren)}
                  onKeyDown={(e) => handleKeyPress(e)}
                  style={{ border: "none", textAlign: "center", width: "40px" }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => incrementCount(setChildren)}
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
