"use client";

import { es } from "date-fns/locale";
import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/sections/CheckAvailabiliy/components/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LightEffect } from "@/components/ui/LightEffect";
import { useSelectionStore } from "@/store/useSelectionStore";

const formatDateInSpanish = (date: Date | undefined) => {
  return date ? format(date, "d 'de' MMMM", { locale: es }) : "Agregar fecha";
};

const CalendarContent = ({
  dateRange,
  handleSelect,
  showOutsideDays = true,
}: {
  dateRange: DateRange | undefined;
  handleSelect: (range: DateRange | undefined) => void;
  showOutsideDays?: boolean;
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center lg:rounded-standar lg:p-0 lg:rounded-[40px] overflow-hidden">
      <LightEffect />
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={handleSelect}
        className="flex flex-col lg:flex-row"
        locale={es}
        showOutsideDays={showOutsideDays}
      />
    </div>
  );
};

interface DateRangePickerProps {
  onSelect?: (from: Date, to: Date) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onSelect,
  className,
}) => {
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
      if (onSelect) {
        onSelect(range?.from, range?.to);
      }
    },
    [setDateRange, onSelect]
  );

  const weekdays = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  const DateButton = () => {
    return (
      <div
        ref={dateButtonRef}
        className={cn(
          "transition-all duration-300 flex flex-col lg:flex-row rounded-standar w-full",
          activeButton ? "hover:bg-neutral-100/50" : ""
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start rounded-standar px-6 py-3  min-w-[170px]",
            activeButton === "from" ? "bg-neutral-50/50" : "",
            activeButton ? "" : "hover:bg-neutral-100/10"
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
            "flex flex-col items-start rounded-standar px-6  py-3  min-w-[200px] ",
            activeButton === "to" ? "bg-primary/10 pr-8" : "",
            activeButton ? "" : "hover:bg-primary/50"
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

  const getDayName = (day: string) => {
    return (
      day.slice(0, 3).charAt(0).toUpperCase() + day.slice(0, 3).slice(1) + "."
    );
  };

  return (
    <div>
      <div
        className={cn("items-center w-full gap-2 hidden lg:flex", className)}
      >
        <Popover>
          <PopoverTrigger>
            <DateButton />
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 rounded-standar border-none  bg-surface-2-light dark:bg-surface-2-dark"
            align="start"
          >
            <CalendarContent
              dateRange={dateRange}
              handleSelect={handleSelect}
              showOutsideDays={true}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="block lg:hidden">
        <div className="bg-transparent rounded-standar lg:border-none lg:rounded-none">
          <div className="rounded-full bg-surface-2-light dark:bg-surface-2-dark lg:hidden flex justify-center items-center px-1 z-30  m-4">
            {weekdays.map((day, index) => (
              <div
                key={index}
                className="rounded-full w-full text-[0.8rem] text-text-light dark:text-text-dark font-medium text-center"
                aria-label={day}
              >
                {getDayName(day)}
              </div>
            ))}
          </div>
          <CalendarContent
            dateRange={dateRange}
            handleSelect={handleSelect}
            showOutsideDays={false}
          />
        </div>
      </div>
    </div>
  );
};
