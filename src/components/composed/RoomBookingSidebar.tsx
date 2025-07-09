"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Room } from "@/lib/types";
import { DatesSelector } from "@/components/DatesSelector";
import { GuestsSelector } from "@/components/GuestsSelector";
import { getRoomColorsByFormat, getRoomGradientColor } from "@/lib/roomColors";
import { getWhatsAppBookingLink } from "@/lib/whatsapp_templates/booking";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { differenceInDays } from "date-fns";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BookingChip } from "@/components/composed/BookingChip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TiltContainer from "@/components/ui/TiltContainer";
import { getRoomGradientColorRgb } from "@/lib/roomColors";

// Precompute price map for faster lookups
const PRICE_MAP: Record<string, number> = ROOM_FORMATS.reduce(
  (map, opt) => ({ ...map, [opt.id]: opt.price }),
  {},
);

interface RoomBookingSidebarProps {
  room: Room;
  className?: string;
}

export function RoomBookingSidebar({
  room,
  className,
}: RoomBookingSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedFormat, dateRange, adults, children, setSelectedFormat } =
    useSelectionStore();

  // Get available room types for this room
  const availableRoomTypes = [room.defaultFormat, ...room.alternativeFormats];
  const availableFormats = ROOM_FORMATS.filter((f) =>
    availableRoomTypes.includes(f.id),
  );

  // Auto-select best format based on guest count
  useEffect(() => {
    const totalGuests = adults + children;

    // Find best format based on guest count
    let bestFormat = availableFormats.find((f) => f.id === room.defaultFormat);

    if (totalGuests <= 1) {
      // Individual or shared for 1 person
      bestFormat =
        availableFormats.find((f) => f.id === "HIN") ||
        availableFormats.find((f) => f.id === "HCO") ||
        bestFormat;
    } else if (totalGuests === 2) {
      // Couple - prefer matrimonial, then double
      bestFormat =
        availableFormats.find((f) => f.id === "HMA") ||
        availableFormats.find((f) => f.id === "HDB") ||
        bestFormat;
    } else if (totalGuests === 3) {
      // Triple or shared
      bestFormat =
        availableFormats.find((f) => f.id === "HT") ||
        availableFormats.find((f) => f.id === "HCO") ||
        bestFormat;
    } else {
      // More than 3 - prefer shared
      bestFormat = availableFormats.find((f) => f.id === "HCO") || bestFormat;
    }

    if (
      bestFormat &&
      (!selectedFormat || selectedFormat.id !== bestFormat.id)
    ) {
      setSelectedFormat(bestFormat);
    }
  }, [
    adults,
    children,
    availableFormats,
    room.defaultFormat,
    selectedFormat,
    setSelectedFormat,
  ]);

  // Use selected format if available and valid for this room, otherwise use default format
  const format =
    selectedFormat && availableRoomTypes.includes(selectedFormat.id)
      ? selectedFormat
      : ROOM_FORMATS.find((f) => f.id === room.defaultFormat);

  const basePrice = format ? PRICE_MAP[format.id] || 0 : 0;
  const totalGuests = adults + children;

  // Calcular precio según el formato y número de personas
  const pricePerNight =
    format?.id === "HCO"
      ? basePrice * totalGuests // Precio por persona en habitación compartida
      : basePrice + (room.hasPrivateToilet ? 10000 : 0); // Precio fijo para otros formatos

  // Calculate number of nights
  const numberOfNights =
    dateRange?.from && dateRange?.to
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
        distributionSuggestion = `Necesitaríamos una habitación adicional para ${remainingGuests} persona${needsPlural ? "s" : ""} más.`;
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
      distributionSuggestion,
    });
  };

  const gradientColor = format ? getRoomGradientColor(format.id) : undefined;

  const RoomTypeSelector = () => (
    <div className="mb-1">
      <Select
        value={selectedFormat?.id || room.defaultFormat}
        onValueChange={(value) => {
          const newFormat = ROOM_FORMATS.find((f) => f.id === value);
          if (newFormat) setSelectedFormat(newFormat);
        }}
      >
        <SelectTrigger
          className={cn(
            "w-full !p-4 rounded-xl border-2 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-md",
            format && getRoomColorsByFormat(format.id).border,
          )}
          style={{
            borderColor: gradientColor ? `${gradientColor}70` : undefined,
            background: gradientColor
              ? `linear-gradient(135deg, ${gradientColor}08 0%, white 50%)`
              : undefined,
          }}
        >
          <div className="flex items-center gap-3">
            <SelectValue placeholder="Selecciona el tipo de habitación" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-2 shadow-lg">
          {availableFormats.map((roomFormat) => {
            const formatGradientColor = getRoomGradientColor(roomFormat.id);
            const isSelected = roomFormat.id === selectedFormat?.id;

            return (
              <SelectItem
                key={roomFormat.id}
                value={roomFormat.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:rounded-lg",
                  isSelected && "bg-opacity-10",
                )}
                style={{
                  backgroundColor: isSelected
                    ? `${formatGradientColor}15`
                    : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Color indicator for each option */}
                  <div
                    className="h-3 w-3 rounded-full border"
                    style={{
                      backgroundColor: `${formatGradientColor}90`,
                      borderColor: formatGradientColor,
                    }}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      isSelected &&
                        getRoomColorsByFormat(roomFormat.id).textHover,
                    )}
                  >
                    {roomFormat.label}
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );

  const BookingContent = () => (
    <div className="space-y-4">
      {/* Huéspedes - Primero */}
      <div>
        <h3
          className={cn(
            "mb-2 text-sm font-semibold",
            format && getRoomColorsByFormat(format.id).textHover,
          )}
        >
          Huéspedes
        </h3>
        <GuestsSelector room={room} />
      </div>

      {/* Fechas - Segundo */}
      <div>
        <h3
          className={cn(
            "mb-2 text-sm font-semibold",
            format && getRoomColorsByFormat(format.id).textHover,
          )}
        >
          Fechas
        </h3>
        <DatesSelector
          dateRange={dateRange}
          onDateRangeChange={(range) =>
            useSelectionStore.setState({ dateRange: range })
          }
          className={cn(
            "rounded-xl",
            format && getRoomColorsByFormat(format.id).borderSelected,
          )}
        />
      </div>

      {/* Precio */}
      {format && (
        <div
          className={cn(
            "border-t pt-3",
            format && getRoomColorsByFormat(format.id).border,
          )}
        >
          <div className="space-y-1.5">
            {format.id === "HCO" ? (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Precio por cama:</span>
                  <span
                    className={cn(
                      "font-medium",
                      format && getRoomColorsByFormat(format.id).text,
                    )}
                  >
                    ${basePrice.toLocaleString("es-CL")} CLP
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Número de camas:</span>
                  <span
                    className={cn(
                      "font-medium",
                      format && getRoomColorsByFormat(format.id).text,
                    )}
                  >
                    {totalGuests}
                  </span>
                </div>
                <div
                  className={cn(
                    "flex justify-between border-t pt-1.5 text-xs font-medium",
                    format && getRoomColorsByFormat(format.id).border,
                  )}
                >
                  <span className="text-gray-600">Subtotal por noche:</span>
                  <span
                    className={cn(
                      format && getRoomColorsByFormat(format.id).text,
                    )}
                  >
                    ${pricePerNight.toLocaleString("es-CL")} CLP
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Precio por noche:</span>
                <span
                  className={cn(
                    "font-medium",
                    format && getRoomColorsByFormat(format.id).text,
                  )}
                >
                  ${pricePerNight.toLocaleString("es-CL")} CLP
                </span>
              </div>
            )}

            {numberOfNights > 0 && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Noches:</span>
                  <span
                    className={cn(
                      "font-medium",
                      format && getRoomColorsByFormat(format.id).text,
                    )}
                  >
                    {numberOfNights}
                  </span>
                </div>
                <div
                  className={cn(
                    "border-t pt-1.5",
                    format && getRoomColorsByFormat(format.id).border,
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={cn(
                        "font-bold text-sm",
                        format && getRoomColorsByFormat(format.id).textHover,
                      )}
                    >
                      Total:
                    </span>
                    <div className="text-right">
                      {format.id === "HCO" && (
                        <div className="mb-0.5 text-xs text-gray-500">
                          {totalGuests} {totalGuests === 1 ? "cama" : "camas"} ×{" "}
                          {numberOfNights}{" "}
                          {numberOfNights === 1 ? "noche" : "noches"} × $
                          {basePrice.toLocaleString("es-CL")}
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-base font-bold",
                          format && getRoomColorsByFormat(format.id).textHover,
                        )}
                      >
                        ${totalForNights.toLocaleString("es-CL")} CLP
                      </span>
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
      notes: "",
    };

    return (
      <Button
        className={cn(
          "w-full overflow-hidden rounded-2xl py-5 text-base shadow-md transition-all duration-200 hover:shadow-lg",
          format && [
            getRoomColorsByFormat(format.id).bgSelected,
            getRoomColorsByFormat(format.id).textHover,
          ],
          className,
        )}
        style={{
          backgroundColor: gradientColor ? `${gradientColor}` : undefined,
          color: format ? "white" : undefined,
        }}
        onClick={() => {
          const whatsappLink = getWhatsAppLink();
          window.open(whatsappLink, "_blank");
        }}
        disabled={!dateRange?.from || !dateRange?.to || !format}
      >
        <BookingChip booking={booking} showDates={true} />
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden flex-col gap-4 md:flex", className)}>
        <RoomTypeSelector />
        <TiltContainer
          tiltIntensity={5}
          inverted={false}
          transitionSpeed={0.15}
          resetSpeed={0.8}
          disableShadow={false}
          shineEffect={true}
          shadowColor={format ? getRoomGradientColorRgb(format.id) : undefined}
        >
          <div
            className={cn(
              "bg-surface-1 relative overflow-hidden rounded-2xl border-2 px-6 py-5 shadow-lg transition-all duration-500",
              format && getRoomColorsByFormat(format.id).border,
            )}
            style={{
              borderColor: gradientColor ? `${gradientColor}70` : undefined,
            }}
          >
            {/* Gradient corner detail - matching RoomOptionsSelector */}
            <div
              className={cn(
                "pointer-events-none absolute top-0 left-0 h-52 w-52 transition-all duration-500",
                "opacity-20",
              )}
              style={{
                background: gradientColor
                  ? `radial-gradient(circle at top left, ${gradientColor} 0%, transparent 70%)`
                  : undefined,
              }}
            />

            {/* Color accent bar - matching RoomOptionsSelector */}
            <div
              className={cn(
                "absolute top-0 right-0 left-0 h-2 rounded-t-2xl transition-all duration-500",
                format && getRoomColorsByFormat(format.id).bg,
              )}
            />

            <h2
              className={cn(
                "relative z-10 mb-4 text-lg font-bold",
                format && getRoomColorsByFormat(format.id).textHover,
              )}
            >
              Resumen de reserva
            </h2>
            <div className="relative z-10">
              <BookingContent />
            </div>
            <div className="relative z-10 mt-6">
              <BookingButton />
            </div>
          </div>
        </TiltContainer>
      </div>

      {/* Mobile Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-transform duration-300 md:hidden",
          format && getRoomColorsByFormat(format.id).bg,
          isModalOpen ? "translate-y-0" : "translate-y-full",
        )}
        style={{
          background: gradientColor
            ? `linear-gradient(135deg, ${gradientColor}15 0%, ${gradientColor}08 100%)`
            : undefined,
        }}
      >
        {/* Modal Header */}
        <div
          className={cn(
            "fixed top-0 right-0 left-0 z-10 rounded-b-2xl border-b-2 px-4 py-4",
            format && [
              getRoomColorsByFormat(format.id).bg,
              getRoomColorsByFormat(format.id).border,
            ],
          )}
        >
          <div className="flex items-center justify-between">
            <h2
              className={cn(
                "text-xl font-bold",
                format && getRoomColorsByFormat(format.id).textHover,
              )}
            >
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
          <RoomTypeSelector />
          <BookingContent />
        </div>

        {/* Modal Footer */}
        <div
          className={cn(
            "fixed right-0 bottom-0 left-0 rounded-t-2xl border-t-2 p-4",
            format && [
              getRoomColorsByFormat(format.id).bg,
              getRoomColorsByFormat(format.id).border,
            ],
          )}
        >
          <BookingButton />
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 bg-gradient-to-t from-white to-white/95 p-4 md:hidden",
          !isModalOpen && "border-t shadow-lg",
        )}
      >
        <Button
          className={cn(
            "w-full rounded-2xl py-6 text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl",
            format && [
              getRoomColorsByFormat(format.id).bgSelected,
              getRoomColorsByFormat(format.id).textHover,
              getRoomColorsByFormat(format.id).borderSelected,
            ],
          )}
          style={{
            backgroundColor: gradientColor ? `${gradientColor}` : undefined,
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
