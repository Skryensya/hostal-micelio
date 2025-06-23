"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MinusIcon, PlusIcon } from "lucide-react"; // Import icons
import { useSelectionStore } from "@/store/useSelectionStore"; // Import the Zustand store
import { cn } from "@/lib/utils";

export function GuestSelector() {
  const {
    adults,
    children,
    setAdults,
    setChildren,
    incrementChildren,
    decrementChildren,
    incrementAdults,
    decrementAdults,
  } = useSelectionStore();
  const [open, setOpen] = useState(false);
  const childrenRef = useRef<HTMLInputElement>(null);
  const adultsRef = useRef<HTMLInputElement>(null); // Unique ref for adults input

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void
  ) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter(parseInt(value === "" ? "0" : value, 10));
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextInput?: React.RefObject<HTMLInputElement | null>
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

  const adultsLabel = adults === 1 ? "adulto" : "adultos";
  const childrenLabel = children === 1 ? "niño" : "niños";

  const PeopleButton = () => {
    return (
      <div
        className={cn(
          "transition-all duration-300 flex rounded-standard hover:bg-primary-light-20 w-full"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start rounded-standard px-6 py-3  min-w-[200px] w-full"
          )}
          onClick={() => {}}
        >
          <div className="flex items-center font-bold text-sm">Quién</div>
          <div>
            <span>
              {adults} {adultsLabel}
            </span>
            <span className="px-2">|</span>
            <span>
              {children} {childrenLabel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CounterInput = ({
    label,
    value,
    onChange,
    onIncrement,
    onDecrement,
    disabledDecrement,
    ref,
  }: {
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onIncrement: () => void;
    onDecrement: () => void;
    disabledDecrement: boolean;
    ref?: React.RefObject<HTMLInputElement | null>;
  }) => {
    const inputId = `${label}-input`; // Unique ID for the input
    return (
      <div className="flex items-center space-x-2  w-11/12 mx-auto">
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={onDecrement}
            disabled={disabledDecrement}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center gap-1 justify-start w-[120px] border-b border-text-light-20 dark:border-text-dark-20 ">
            <label
              htmlFor={inputId}
              className="cursor-pointer order-2"
              onClick={() => ref?.current?.focus()}
            >
              {label}
            </label>
            <input
              id={inputId}
              ref={ref}
              type="number"
              value={value}
              onChange={onChange}
              onKeyDown={(e) => handleKeyPress(e, ref)}
              style={{ border: "none", textAlign: "center", width: "40px" }}
              className="bg-transparent"
            />
          </div>
        </div>
        <div>
          <Button variant="outline" size="icon" onClick={onIncrement}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const GuestSelectorContent = () => {
    return (
      <div className="space-y-8 my-4">
        <div className="flex justify-between items-center w-full">
          <CounterInput
            label="Adultos"
            value={adults}
            onChange={(e) => handleInputChange(e, setAdults)}
            onIncrement={incrementAdults}
            onDecrement={decrementAdults}
            disabledDecrement={adults <= 1}
            ref={adultsRef}
          />
        </div>
        <div className="flex justify-between items-center">
          <CounterInput
            label="Niños"
            value={children}
            onChange={(e) => handleInputChange(e, setChildren)}
            onIncrement={incrementChildren}
            onDecrement={decrementChildren}
            disabledDecrement={children === 0}
            ref={childrenRef}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hidden md:block">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="w-full" onClick={() => setOpen(!open)}>
            <PeopleButton />
          </PopoverTrigger>
          <PopoverContent className="p-0 rounded-standard border-none bg-surface-2-light dark:bg-surface-2-dark w-[300px]">
            <div className="p-6 bg-primary-light-10 rounded-standard border border-primary-light-30 ">
              <GuestSelectorContent />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="block md:hidden">
        <div className="p-4">
          <GuestSelectorContent />
        </div>
      </div>
    </>
  );
}
