"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{ before: today }}
      className={cn(
        "p-5 bg-primary-light-10 rounded-[40px] border border-primary-light-30",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-8 sm:space-x-8 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: " font-bold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-10 w-10 flex items-center justify-center bg-transparent p-2  hover:opacity-100"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "  ",
        head_row: "flex  rounded-full bg-primary-light-20 ",
        head_cell: "rounded-full w-10 text-[0.8rem] text-black font-medium",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary-light-30 [&:has([aria-selected].day-outside)]:bg-primary-light-10 [&:has([aria-selected].day-range-end)]:rounded-r-full ",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full "
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-primary-light-30  "
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary-light text-text-dark hover:bg-primary-light  focus:bg-primary-light   !rounded-none",
        day_today:
          " border-b-4 border-b-primary-light-30 !rounded-none text-text-light",
        day_outside:
          "day-outside text-gray-900 opacity-50 aria-selected:bg-neutral-100/50 aria-selected:text-gray-900 aria-selected:opacity-30",
        day_disabled: "text-gray-900 opacity-50",
        day_range_middle:
          "aria-selected:bg-transparent aria-selected:text-black",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
