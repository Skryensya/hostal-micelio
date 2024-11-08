"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
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

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  setDateRange: (range: DateRange | undefined) => void; // New prop for state setter
}

export function DateRangePicker({
  className,
  setDateRange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "dd/MM/yyyy", { locale: es }) : "__________";
  };

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      setDate(range);
      setDateRange(range); // Call the passed setState function
    },
    [setDateRange]
  );

  React.useEffect(() => {
    handleSelect(date);
  }, [date, handleSelect]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-from"
            variant={"outline"}
            className={cn(
              "w-full md:w-fit justify-start text-left font-normal",
              !date?.from && "text-neutral-500 dark:text-neutral-400 "
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(date?.from)} - {formatDate(date?.to)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect} // Use handleSelect instead of setDate
            numberOfMonths={2}
            className="flex flex-col sm:flex-row"
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
