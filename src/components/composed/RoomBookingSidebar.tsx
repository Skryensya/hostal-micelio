"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Room } from "@/lib/types";
import { RoomFormatSelector } from "@/components/RoomFormatSelector";
import { DatesSelector } from "@/components/DatesSelector";
import { GuestsSelector } from "@/components/GuestsSelector";
import { getRoomColorsByFormat, getRoomGradientColor } from "@/lib/roomColors";
import { getWhatsAppBookingLink } from "@/lib/whatsapp_templates/booking";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { differenceInDays } from "date-fns";
import { useState } from "react";
import { X } from "lucide-react";
import { BookingChip } from "@/components/composed/BookingChip";

// Precompute price map for faster lookups
const PRICE_MAP: Record<string, number> = ROOM_FORMATS.reduce(
  (map, opt) => ({ ...map, [opt.id]: opt.price }),
  {},
);

interface RoomBookingSidebarProps {
  room: Room;
  className?: string;
}

export function RoomBookingSidebar({ room, className }: RoomBookingSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedFormat, dateRange, adults, children } = useSelectionStore();

  // Use selected format if available and valid for this room, otherwise use default format
  const format =
    selectedFormat &&
    (selectedFormat.id === room.defaultFormat ||
      room.alternativeFormats.includes(selectedFormat.id))
      ? selectedFormat
      : ROOM_FORMATS.find((f) => f.id === room.defaultFormat);

  const basePrice = format ? PRICE_MAP[format.id] || 0 : 0;
  const totalGuests = adults + children;
  
  // Calcular precio según el formato y número de personas
  const pricePerNight = format?.id === "HCO" 
    ? basePrice * totalGuests // Precio por persona en habitación compartida
    : basePrice + (room.hasPrivateToilet ? 10000 : 0); // Precio fijo para otros formatos
  
  // Calculate number of nights
  const numberOfNights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;
  
  // Calculate total price for all nights
  const totalForNights = pricePerNight * numberOfNights;

  const getWhatsAppLink = () => {
    const totalGuests = adults + children;
    
    // Calcular sugerencia de distribución si excede la capacidad
    let distributionSuggestion: string | undefined;
    if (totalGuests > room.capacity) {
      const remainingGuests = totalGuests - room.capacity;
      const needsPlural = remainingGuests > 1;
      
      if (format?.id === "HT" || format?.id === "HDB" || format?.id === "HMA") {
        distributionSuggestion = `Necesitaríamos una habitación adicional para ${remainingGuests} persona${needsPlural ? 's' : ''} más.`;
      } else if (format?.id === "HCO") {
        distributionSuggestion = `Podríamos distribuir al grupo en varias habitaciones compartidas o considerar una combinación de formatos.`;
      }
    }

    return getWhatsAppBookingLink({
      room,
      formatLabel: format?.label || "No especificado",
      dateRange,
      numberOfNights,
      adults,
      children,
      pricePerNight,
      totalPrice: totalForNights,
      distributionSuggestion
    });
  };

  const gradientColor = format ? getRoomGradientColor(format.id) : undefined;

  const BookingContent = () => (
    <div className="space-y-4">
      {/* Formato - Primero */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium text-text-muted">
          Formato
        </h3>
        <RoomFormatSelector room={room} inline />
      </div>

      {/* Huéspedes - Segundo */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium text-text-muted">
          Huéspedes
        </h3>
        <GuestsSelector room={room} />
      </div>

      {/* Fechas - Tercero */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium text-text-muted">
          Fechas
        </h3>
        <DatesSelector 
          dateRange={dateRange}
          onDateRangeChange={(range) => useSelectionStore.setState({ dateRange: range })}
          className={cn(
            format && getRoomColorsByFormat(format.id).borderSelected
          )}
        />
      </div>

      {/* Precio */}
      {format && (
        <div className="border-t pt-4">
          <div className="space-y-2">
            {format.id === "HCO" ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Precio por cama:</span>
                  <span className="text-text font-medium">${basePrice.toLocaleString("es-CL")} CLP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Número de camas:</span>
                  <span className="text-text font-medium">{totalGuests}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span className="text-text-muted">Subtotal por noche:</span>
                  <span className="text-text">${pricePerNight.toLocaleString("es-CL")} CLP</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Precio por noche:</span>
                <span className="text-text font-medium">${pricePerNight.toLocaleString("es-CL")} CLP</span>
              </div>
            )}

            {numberOfNights > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Noches:</span>
                  <span className="text-text font-medium">{numberOfNights}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-text font-semibold">Total:</span>
                    <div className="text-right">
                      {format.id === "HCO" && (
                        <div className="text-text-muted text-xs mb-1">
                          {totalGuests} {totalGuests === 1 ? 'cama' : 'camas'} × {numberOfNights} {numberOfNights === 1 ? 'noche' : 'noches'} × ${basePrice.toLocaleString("es-CL")}
                        </div>
                      )}
                      <span className="text-text font-bold text-lg">${totalForNights.toLocaleString("es-CL")} CLP</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const BookingButton = ({ className }: { className?: string }) => {
    const booking = {
      id: "preview",
      guestName: "Vista previa",
      roomSlug: room.slug,
      startDate: dateRange?.from || new Date(),
      endDate: dateRange?.to || new Date(),
      startDay: 1,
      endDay: 1,
      color: "",
      notes: ""
    };

    return (
      <Button
        className={cn(
          "w-full text-base py-6 rounded-full overflow-hidden",
          className
        )}
        onClick={() => {
          const whatsappLink = getWhatsAppLink();
          window.open(whatsappLink, "_blank");
        }}
        disabled={!dateRange?.from || !dateRange?.to || !format}
      >
        <BookingChip
          booking={booking}
          showDates={true}
        />
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex flex-col gap-4", className)}>
        <div className="rounded-lg bg-white px-6 py-4 shadow-sm transition-all duration-200">
          <h2 className="mb-4 text-xl font-semibold text-text">
            Resumen de reserva
          </h2>
          <BookingContent />
          <div className="mt-6">
            <BookingButton />
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      <div className={cn(
        "fixed inset-0 bg-white z-50 md:hidden transition-transform duration-300",
        isModalOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Modal Header */}
        <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              Resumen de reserva
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="h-full overflow-auto px-4 pt-20 pb-32">
          <BookingContent />
        </div>

        {/* Modal Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <BookingButton />
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-white/95 md:hidden",
        !isModalOpen && "shadow-lg border-t"
      )}>
        <Button
          className={cn(
            "w-full text-base py-6 rounded-full",
            format && [
              getRoomColorsByFormat(format.id).bgSelected,
              getRoomColorsByFormat(format.id).textHover,
              getRoomColorsByFormat(format.id).borderSelected,
            ],
          )}
          style={{
            backgroundColor: gradientColor
              ? `${gradientColor}BB`
              : undefined,
            color: format ? "white" : undefined,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Reservar ahora
        </Button>
      </div>
    </>
  );
} 