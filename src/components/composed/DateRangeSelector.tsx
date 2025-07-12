"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  className?: string;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onDateChange,
  className,
}: DateRangeSelectorProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  // Solo actualizar el estado interno cuando cambien las props
  useEffect(() => {
    if (startDate !== date?.from || endDate !== date?.to) {
      setDate({ from: startDate, to: endDate });
    }
  }, [startDate, endDate, date?.from, date?.to]);

  const handleSelect = useCallback((selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onDateChange(selectedDate.from, selectedDate.to);
    } else {
      onDateChange(undefined, undefined);
    }
  }, [onDateChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d 'de' MMMM", { locale: es })} -{" "}
                  {format(date.to, "d 'de' MMMM, yyyy", { locale: es })}
                </>
              ) : (
                format(date.from, "d 'de' MMMM, yyyy", { locale: es })
              )
            ) : (
              <span>Selecciona las fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate || new Date()}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 