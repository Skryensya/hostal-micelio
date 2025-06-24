import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookingChipProps {
  booking: Booking & { adjustedStartDate?: Date; adjustedEndDate?: Date };
  showDates?: boolean;
  isGhost?: boolean;
  continuesFromPreviousMonth?: boolean;
  continuesIntoNextMonth?: boolean;
  hasCheckoutSameDay?: boolean;
  hasCheckinSameDay?: boolean;
}

export function BookingChip({
  booking,
  showDates = false,
  isGhost = false,
  continuesFromPreviousMonth = false,
  continuesIntoNextMonth = false,
  hasCheckoutSameDay = false,
  hasCheckinSameDay = false,
}: BookingChipProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        isGhost ? "opacity-50" : "",
        continuesFromPreviousMonth ? "rounded-l-none" : "rounded-l-[4px]",
        continuesIntoNextMonth ? "rounded-r-none" : "rounded-r-[4px]",
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${booking.color} 15%, white)`,
        borderLeft: continuesFromPreviousMonth ? "none" : `2px solid color-mix(in srgb, ${booking.color} 70%, black)`,
        borderRight: continuesIntoNextMonth ? "none" : `2px solid color-mix(in srgb, ${booking.color} 70%, black)`,
      }}
    >
      <div
        className={cn(
          "absolute inset-[1px] rounded-[3px] px-2 py-1",
          hasCheckinSameDay && "rounded-l-none border-l border-dashed",
          hasCheckoutSameDay && "rounded-r-none border-r border-dashed",
        )}
        style={{
          borderColor: `color-mix(in srgb, ${booking.color} 70%, black)`,
        }}
      >
        <div 
          className="truncate font-medium"
          style={{ color: `color-mix(in srgb, ${booking.color} 70%, black)` }}
        >
          {booking.guestName}
          {showDates && (
            <>
              <br />
              <span 
                className="text-[10px] opacity-75"
                style={{ color: `color-mix(in srgb, ${booking.color} 70%, black)` }}
              >
                {format(booking.startDate, "d MMM", { locale: es })} -{" "}
                {format(booking.endDate, "d MMM yyyy", { locale: es })}
              </span>
            </>
          )}
        </div>
      </div>
      {continuesFromPreviousMonth && (
        <div
          className="absolute -left-2 top-0 h-full w-2 opacity-25"
          style={{ backgroundColor: `color-mix(in srgb, ${booking.color} 70%, black)` }}
        />
      )}
      {continuesIntoNextMonth && (
        <div
          className="absolute -right-2 top-0 h-full w-2 opacity-25"
          style={{ backgroundColor: `color-mix(in srgb, ${booking.color} 70%, black)` }}
        />
      )}
    </div>
  );
} 