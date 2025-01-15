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
  const [numberOfMonths, setNumberOfMonths] = React.useState(3); // Default to 3 months for mobile

  // Memoized variable to check if it's mobile
  const isMobile = React.useMemo(() => {
    // Check if window is defined
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false; // Default to false if window is not available
  }, []);

  // Adjust number of months dynamically based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNumberOfMonths(2); // Show 4 months for desktop
      } else {
        setNumberOfMonths(3); // Show 3 months for mobile
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadMoreMonths = () => {
    setNumberOfMonths((prev) => prev + 1);
  };

  const weekdays = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center w-full rounded-standar border border-primary-light-30 overflow-hidden lg:rounded-none lg:border-none relative">
      <div className="rounded-full bg-surface-2-light dark:bg-surface-2-dark absolute inset-4 bottom-auto lg:hidden flex justify-center items-center px-1 z-30">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="rounded-full w-full text-[0.8rem] text-text-light dark:text-text-dark font-medium text-center"
            aria-label={day}
          >
            {day.slice(0, 2)}
          </div>
        ))}
      </div>
      <div
        className={cn(
          "w-full overflow-y-auto flex flex-col lg:flex-row lg:overflow-y-hidden",
          isMobile ? "max-h-[55vh]" : ""
        )}
        style={{ maxHeight: "55vh" }}
      >
        <DayPicker
          showOutsideDays={showOutsideDays}
          disabled={{ before: today }}
          className={cn(
            "p-5 bg-transparent rounded-standar lg:border lg:border-primary-light-30",
            className
          )}
          classNames={{
            months: cn(
              "flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-4",
              isMobile ? "overflow-visible" : ""
            ),
            month: cn(
              "space-y-4 flex flex-col justify-center items-center",
              isMobile ? "block" : ""
            ),
            caption:
              "flex justify-start lg:justify-center pt-1 relative items-center",
            caption_label:
              " font-bold text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark w-full mx-3 lg:border-none",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-10 w-10 flex items-center justify-center bg-transparent p-2 hover:opacity-100"
            ),
            nav_button_previous: "hidden lg:block",
            nav_button_next: "hidden lg:block",
            table: "w-full h-full justify-center items-center",
            head_row: "rounded-full bg-primary-light-20 hidden lg:flex",
            head_cell:
              "rounded-full w-full text-[0.8rem] text-text-light dark:text-text-dark font-medium",
            row: "flex w-full mt-2",
            cell: cn(
              "relative w-full p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary-light-30 [&:has([aria-selected].day-outside)]:bg-primary-light-10 [&:has([aria-selected].day-range-end)]:rounded-r-full aspect-square",
              props.mode === "range"
                ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
                : "[&:has([aria-selected])]:rounded-full "
            ),
            day: cn(
              buttonVariants({ variant: "link" }),
              "h-full w-full min-w-10 min-h-10 p-0 font-normal aria-selected:opacity-100 hover:bg-primary-light-30 hover:underline-none"
            ),
            day_range_start: "day-range-start",
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary-light text-text-dark hover:bg-primary-light focus:bg-primary-light   !rounded-none",
            day_today:
              " border-b-4 border-b-primary-light-30 !rounded-none text-text-light",
            day_outside:
              "day-outside text-gray-900 opacity-50 aria-selected:bg-neutral-100/50 aria-selected:text-gray-900 aria-selected:opacity-30",
            day_disabled: "text-gray-900 opacity-50 cursor-not-allowed",
            day_range_middle:
              "aria-selected:bg-transparent aria-selected:text-black",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: () => <PreviousButton />,
            IconRight: () => <NextButton />,
          }}
          numberOfMonths={numberOfMonths}
          {...props}
        />
      </div>
      {isMobile && numberOfMonths < 12 && (
        <button
          onClick={loadMoreMonths}
          className="mt-4 p-2 text-sm bg-primary-light rounded-full"
        >
          Load More Months
        </button>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

const PreviousButton = () => (
  <ChevronLeftIcon className="h-4 w-4 hidden md:block" />
);

const NextButton = () => (
  <ChevronRightIcon className="h-4 w-4 hidden md:block" />
);

export { Calendar };
