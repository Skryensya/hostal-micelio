import { format as dateFormat } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Booking } from "@/lib/types";
import ROOMS from "../../../db/ROOMS.json";
import ROOM_FORMATS from "../../../db/ROOM_FORMATS.json";
import { getRoomColorsByFormat } from "@/lib/roomColors";

interface BookingChipProps {
  booking: Booking;
  className?: string;
  showDates?: boolean;
  continuesFromPreviousMonth?: boolean;
  continuesIntoNextMonth?: boolean;
}

export function BookingChip({
  booking,
  className,
  showDates = true,
  continuesFromPreviousMonth,
  continuesIntoNextMonth
}: BookingChipProps) {
  const room = ROOMS.find((r) => r.slug === booking.roomSlug);
  const format = ROOM_FORMATS.find((f) => f.id === room?.defaultFormat);
  const colors = format ? getRoomColorsByFormat(format.id) : undefined;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md",
        colors?.bgSelected,
        {
          "rounded-l-none": continuesFromPreviousMonth,
          "rounded-r-none": continuesIntoNextMonth,
        },
        className
      )}
      title={`${booking.guestName} (${dateFormat(booking.startDate, "d MMM", { locale: es })} - ${dateFormat(booking.endDate, "d MMM", { locale: es })})`}
    >
      <div className="relative w-full px-2 py-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate">{booking.guestName}</span>
          {showDates && (
            <span className="whitespace-nowrap text-white/80 text-[10px]">
              {dateFormat(booking.startDate, "d MMM", { locale: es })} - {dateFormat(booking.endDate, "d MMM", { locale: es })}
            </span>
          )}
        </div>
        {(continuesFromPreviousMonth || continuesIntoNextMonth) && (
          <div className="absolute inset-y-0 flex items-center">
            {continuesFromPreviousMonth && (
              <div className="absolute -left-2 flex h-full items-center">
                <div className="h-2 w-2 rounded-full bg-white/50" />
              </div>
            )}
            {continuesIntoNextMonth && (
              <div className="absolute -right-2 flex h-full items-center">
                <div className="h-2 w-2 rounded-full bg-white/50" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 