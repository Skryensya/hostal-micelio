"use client";

import { es } from "date-fns/locale";
import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectionStore } from "@/store/useSelectionStore";

const formatDateInSpanish = (date: Date | undefined) => {
  return date ? format(date, "d 'de' MMMM", { locale: es }) : "Agregar fecha";
};

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useSelectionStore();
  const [activeButton, setActiveButton] = useState<"from" | "to" | null>(null);
  const dateButtonRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateButtonRef.current &&
        !dateButtonRef.current.contains(event.target as Node)
      ) {
        setActiveButton(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      if (range?.from) setActiveButton("to");
    },
    [setDateRange]
  );

  const DateButton = () => {
    return (
      <div
        ref={dateButtonRef}
        className={cn(
          "transition-all duration-300 flex rounded-[40px]",
          activeButton ? "hover:bg-primary-light-20" : ""
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start rounded-[40px] px-6 py-3  min-w-[170px]",
            activeButton === "from" ? "bg-white" : "",
            activeButton ? "" : "hover:bg-primary-light-20"
          )}
          onClick={() => {
            setActiveButton("from");
          }}
        >
          <div className="flex items-center font-bold text-sm">Check in</div>
          <div>{formatDateInSpanish(dateRange?.from)}</div>
        </div>
        <div
          className={cn(
            " relative flex flex-col items-start rounded-[40px] px-6  py-3  min-w-[200px] ",
            activeButton === "to" ? "bg-white pr-8" : "",
            activeButton ? "" : "hover:bg-primary-light-20"
          )}
          onClick={() => {
            if (dateRange?.from) {
              setActiveButton("to");
            } else {
              setActiveButton("from");
            }
          }}
        >
          <div className="flex items-center font-bold text-sm">Check out</div>
          <div>{formatDateInSpanish(dateRange?.to)}</div>
          {activeButton === "to" && dateRange?.from && (
            <div
              role="button"
              tabIndex={0}
              className="absolute top-1/2 right-4 rounded-full hover:bg-neutral-200 -translate-y-1/2 p-1"
              onClick={() => {
                setActiveButton(null);
                setDateRange(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Space") {
                  setActiveButton(null);
                  setDateRange(undefined);
                  if (dateButtonRef.current) {
                    const parent = dateButtonRef.current.parentElement;
                    parent?.focus();
                  }
                }
              }}
            >
              <X className="w-5 h-5 " />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger>
          <DateButton />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-[40px] border-none  bg-surface-light "
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="flex flex-col sm:flex-row"
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
