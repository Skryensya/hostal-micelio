"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  getRoomColorsByFormat,
  getRoomGradientColor,
  baseColors,
} from "@/lib/roomColors";
import { useSelectionStore } from "@/store/useSelectionStore";

interface DatesSelectorProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DatesSelector({
  dateRange,
  onDateRangeChange,
  className,
}: DatesSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { selectedFormat } = useSelectionStore();
  const colors = selectedFormat
    ? getRoomColorsByFormat(selectedFormat.id)
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  const CalendarTrigger = () => (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-xl shadow-sm transition-all duration-200",
        selectedFormat
          ? "border-2 hover:border-opacity-100"
          : "border border-border",
      )}
      style={{
        borderColor: selectedFormat ? `${getRoomGradientColor(selectedFormat.id)}90` : undefined,
        background: selectedFormat 
          ? `linear-gradient(135deg, ${getRoomGradientColor(selectedFormat.id)}08 0%, ${getRoomGradientColor(selectedFormat.id)}03 100%)`
          : undefined,
      }}
    >
      <Button
        variant="ghost"
        className={cn(
          "flex-1 justify-start px-4 py-3 text-left font-normal transition-all duration-200 hover:shadow-sm rounded-none rounded-l-xl",
          selectedFormat && [
            `hover:bg-${baseColors[selectedFormat.id]}-100/60`,
            `active:bg-${baseColors[selectedFormat.id]}-200/40`,
          ],
          !dateRange?.from && "text-muted-foreground",
          dateRange?.from && [colors?.text, "font-medium"],
        )}
        style={{
          color: selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined,
        }}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className={cn("h-4 w-4")} style={{ color: selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined }} />
          <div className="flex flex-col items-start">
            <span className="text-muted-foreground text-xs">Check in</span>
            <span className="text-sm">
              {dateRange?.from
                ? format(dateRange.from, "EEE, d MMM", { locale: es })
                : "Seleccionar fecha"}
            </span>
          </div>
        </div>
      </Button>
      <div
        className={cn(
          "my-2 w-px",
          selectedFormat && `bg-${baseColors[selectedFormat.id]}-300`,
        )}
        style={{
          backgroundColor: selectedFormat ? `${getRoomGradientColor(selectedFormat.id)}50` : undefined,
        }}
      />
      <Button
        variant="ghost"
        className={cn(
          "flex-1 justify-start px-4 py-3 text-left font-normal transition-all duration-200 hover:shadow-sm rounded-none rounded-r-xl",
          selectedFormat && [
            `hover:bg-${baseColors[selectedFormat.id]}-100/60`,
            `active:bg-${baseColors[selectedFormat.id]}-200/40`,
          ],
          !dateRange?.to && "text-muted-foreground",
          dateRange?.to && [colors?.text, "font-medium"],
        )}
        style={{
          color: selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined,
        }}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className={cn("h-4 w-4")} style={{ color: selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined }} />
          <div className="flex flex-col items-start">
            <span className="text-muted-foreground text-xs">Check out</span>
            <span className="text-sm">
              {dateRange?.to
                ? format(dateRange.to, "EEE, d MMM", { locale: es })
                : "Seleccionar fecha"}
            </span>
          </div>
        </div>
      </Button>
    </div>
  );

  const CalendarComponent = ({
    isMobileView = false,
  }: {
    isMobileView?: boolean;
  }) => (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={handleSelect}
      numberOfMonths={1}
      roomType={selectedFormat?.id as "HCO" | "HIN" | "HDB" | "HMA" | "HT"}
      className={cn(
        "w-full [&_.rdp]:p-0",
        "[&_.rdp-caption]:mb-2",
        "[&_.rdp-months]:gap-0",
        "[&_.rdp-table]:mt-2",
        "[&_.rdp-head_th]:p-0 [&_.rdp-head_th]:pb-2 [&_.rdp-head_th]:font-normal",
        "[&_.rdp-button:hover]:bg-transparent",
        "[&_.rdp-day_button:hover]:border-0",
        isMobileView
          ? "[&_.rdp-day]:p-0 [&_.rdp-day_span]:h-[34px] [&_.rdp-day_span]:w-[38px]"
          : "[&_.rdp-day]:p-0 [&_.rdp-day_span]:h-[32px] [&_.rdp-day_span]:w-[32px]",
      )}
    />
  );

  if (isMobile) {
    return (
      <div className={cn("overflow-hidden rounded-xl", className)}>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <div className="w-full">
              <CalendarTrigger />
            </div>
          </DrawerTrigger>
          <DrawerContent className="p-0 rounded-t-xl">
            <DrawerHeader className="px-4 pb-2 text-left">
              <DrawerTitle 
                className={colors?.text}
                style={{
                  color: selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined,
                }}
              >
                Selecciona las fechas
              </DrawerTitle>
            </DrawerHeader>
            <div className="pb-4">
              <CalendarComponent isMobileView />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <CalendarTrigger />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-auto rounded-xl p-0 border-2 overflow-hidden",
            selectedFormat && "border-opacity-90"
          )}
          style={{
            borderColor: selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined,
          }}
          align="start"
        >
          <CalendarComponent />
        </PopoverContent>
      </Popover>
    </div>
  );
}
