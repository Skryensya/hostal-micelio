import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Booking } from "@/lib/types";

interface MobileBookingCardProps {
  booking: Booking;
  onClick?: () => void;
}

function getLighterColor(color: string, opacity: number = 0.15): string {
  // Si el color es un nombre de color CSS, retornarlo con opacity
  if (!color.startsWith('#')) {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  }
  
  // Si es un hex, convertirlo a RGB y aplicar opacity
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function MobileBookingCard({ booking, onClick }: MobileBookingCardProps) {
  const duration = Math.floor(
    (booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const lighterColor = getLighterColor(booking.color);

  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
      style={{
        borderLeft: `4px solid ${booking.color}`,
        backgroundColor: lighterColor,
      }}
    >
      <div className="mb-2 text-lg font-medium text-[hsl(317.8,52.9%,10%)]">
        {booking.guestName}
      </div>
      
      <div className="flex items-center gap-4 text-sm text-[hsl(317.8,52.9%,10%,0.8)]">
        <div>
          {format(booking.startDate, "d MMM", { locale: es })} -{" "}
          {format(booking.endDate, "d MMM yyyy", { locale: es })}
        </div>
        <div className="flex items-center gap-1">
          <span>•</span>
          <span>{duration} {duration === 1 ? "noche" : "noches"}</span>
        </div>
      </div>
    </div>
  );
} 