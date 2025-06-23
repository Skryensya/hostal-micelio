"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayButton,
  DayPicker,
  type DayPickerProps,
  getDefaultClassNames,
} from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { baseColors } from "@/lib/roomColors";
import { es } from "date-fns/locale";

const roomColorClasses = {
  HCO: {
    text: "text-emerald-800",
    hover: "hover:bg-emerald-200",
    focus: "focus:bg-emerald-200",
    focusBorder: "focus:border-emerald-600",
    selected: "bg-emerald-200",
    selectedText: "text-emerald-800",
    rangeStart: "bg-emerald-600",
    rangeStartText: "text-emerald-50",
    rangeStartHover: "hover:bg-emerald-700",
    rangeMiddle: "bg-emerald-200",
    rangeMiddleText: "text-emerald-800",
    rangeEnd: "bg-emerald-600",
    rangeEndText: "text-emerald-50",
    rangeEndHover: "hover:bg-emerald-700",
    today: "bg-emerald-500/50",
    todayText: "text-emerald-800",
    bg: "bg-emerald-50",
  },
  HIN: {
    text: "text-blue-800",
    hover: "hover:bg-blue-200",
    focus: "focus:bg-blue-200",
    focusBorder: "focus:border-blue-600",
    selected: "bg-blue-200",
    selectedText: "text-blue-800",
    rangeStart: "bg-blue-600",
    rangeStartText: "text-blue-50",
    rangeStartHover: "hover:bg-blue-700",
    rangeMiddle: "bg-blue-200",
    rangeMiddleText: "text-blue-800",
    rangeEnd: "bg-blue-600",
    rangeEndText: "text-blue-50",
    rangeEndHover: "hover:bg-blue-700",
    today: "bg-blue-500/50",
    todayText: "text-blue-800",
    bg: "bg-blue-50",
  },
  HDB: {
    text: "text-purple-800",
    hover: "hover:bg-purple-200",
    focus: "focus:bg-purple-200",
    focusBorder: "focus:border-purple-600",
    selected: "bg-purple-200",
    selectedText: "text-purple-800",
    rangeStart: "bg-purple-600",
    rangeStartText: "text-purple-50",
    rangeStartHover: "hover:bg-purple-700",
    rangeMiddle: "bg-purple-200",
    rangeMiddleText: "text-purple-800",
    rangeEnd: "bg-purple-600",
    rangeEndText: "text-purple-50",
    rangeEndHover: "hover:bg-purple-700",
    today: "bg-purple-500/50",
    todayText: "text-purple-800",
    bg: "bg-purple-50",
  },
  HMA: {
    text: "text-rose-800",
    hover: "hover:bg-rose-200",
    focus: "focus:bg-rose-200",
    focusBorder: "focus:border-rose-600",
    selected: "bg-rose-200",
    selectedText: "text-rose-800",
    rangeStart: "bg-rose-600",
    rangeStartText: "text-rose-50",
    rangeStartHover: "hover:bg-rose-700",
    rangeMiddle: "bg-rose-200",
    rangeMiddleText: "text-rose-800",
    rangeEnd: "bg-rose-600",
    rangeEndText: "text-rose-50",
    rangeEndHover: "hover:bg-rose-700",
    today: "bg-rose-500/50",
    todayText: "text-rose-800",
    bg: "bg-rose-50",
  },
  HT: {
    text: "text-amber-800",
    hover: "hover:bg-amber-200",
    focus: "focus:bg-amber-200",
    focusBorder: "focus:border-amber-600",
    selected: "bg-amber-200",
    selectedText: "text-amber-800",
    rangeStart: "bg-amber-600",
    rangeStartText: "text-amber-50",
    rangeStartHover: "hover:bg-amber-700",
    rangeMiddle: "bg-amber-200",
    rangeMiddleText: "text-amber-800",
    rangeEnd: "bg-amber-600",
    rangeEndText: "text-amber-50",
    rangeEndHover: "hover:bg-amber-700",
    today: "bg-amber-500/50",
    todayText: "text-amber-800",
    bg: "bg-amber-50",
  },
} as const;

type CalendarProps = DayPickerProps & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  roomType?: keyof typeof baseColors;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  roomType,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const colorClasses = roomType ? roomColorClasses[roomType] : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background p-3",
        "group/calendar [--cell-size:--spacing(8)]",
        "[[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      locale={es}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("es-CL", { month: "long" }),
        formatYearDropdown: (date) =>
          date.toLocaleString("es-CL", { year: "numeric" }),
        formatCaption: (date) =>
          date.toLocaleString("es-CL", { month: "long", year: "numeric" }),
        ...formatters,
      }}
      disabled={{ before: today }}
      modifiers={{ today: today }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col w-full gap-3", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          colorClasses?.text,
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          colorClasses?.text,
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative has-focus:border-neutral-950 border border-neutral-200 shadow-xs has-focus:ring-neutral-950/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-neutral-500 [&>svg]:size-3.5",
          colorClasses?.text,
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-neutral-500 rounded-md flex-1 font-normal text-xs select-none",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-xs select-none text-neutral-500",
          defaultClassNames.week_number,
        ),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          "[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day,
        ),
        range_start: cn(
          colorClasses?.rangeStart || "bg-neutral-500",
          "rounded-full",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          colorClasses?.rangeMiddle || "bg-neutral-100",
          "rounded-full",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          colorClasses?.rangeEnd || "bg-neutral-500",
          "rounded-full",
          defaultClassNames.range_end,
        ),
        today: cn(
          colorClasses?.today || "bg-neutral-500",
          "rounded-full",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-neutral-500 aria-selected:text-neutral-500",
          defaultClassNames.outside,
        ),
        disabled: cn("text-neutral-500 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: ({ className, day, modifiers, ...props }) => {
          const ref = React.useRef<HTMLButtonElement>(null);
          React.useEffect(() => {
            if (modifiers.focused) ref.current?.focus();
          }, [modifiers.focused]);

          return (
            <Button
              ref={ref}
              variant="ghost"
              size="icon"
              data-day={day.date.toLocaleDateString()}
              data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
              }
              data-range-start={modifiers.range_start}
              data-range-end={modifiers.range_end}
              data-range-middle={modifiers.range_middle}
              data-today={modifiers.today}
              className={cn(
                "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
                "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
                colorClasses && [
                  colorClasses.hover,
                  colorClasses.focus,
                  colorClasses.focusBorder,
                  `data-[selected-single=true]:${colorClasses.selected}`,
                  `data-[selected-single=true]:${colorClasses.selectedText}`,
                  `data-[range-start=true]:${colorClasses.rangeStart}`,
                  `data-[range-start=true]:${colorClasses.rangeStartText}`,
                  `data-[range-start=true]:${colorClasses.rangeStartHover}`,
                  `data-[range-end=true]:${colorClasses.rangeEnd}`,
                  `data-[range-end=true]:${colorClasses.rangeEndText}`,
                  `data-[range-end=true]:${colorClasses.rangeEndHover}`,
                  `data-[range-middle=true]:${colorClasses.rangeMiddle}`,
                  `data-[range-middle=true]:${colorClasses.rangeMiddleText}`,
                  `data-[today=true]:${colorClasses.today}`,
                  `data-[today=true]:${colorClasses.todayText}`,
                ],
                "data-[range-end=true]:rounded-full",
                "data-[range-middle=true]:rounded-full",
                "data-[range-start=true]:rounded-full",
                "[&>span]:text-xs [&>span]:opacity-70",
                defaultClassNames.day,
                className,
              )}
              {...props}
            />
          );
        },
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
