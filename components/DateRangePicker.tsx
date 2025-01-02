"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectionStore } from "@/store/useSelectionStore";

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useSelectionStore();

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "dd/MM/yyyy", { locale: es }) : "__________";
  };

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
    },
    [setDateRange]
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-from"
            variant={"outline"}
            className={cn(
              "w-full md:w-fit justify-start text-left font-normal",
              !dateRange?.from && "text-neutral-500 dark:text-neutral-400 "
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(dateRange?.from)} - {formatDate(dateRange?.to)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
