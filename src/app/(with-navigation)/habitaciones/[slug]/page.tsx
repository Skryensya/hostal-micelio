"use client";

import { notFound } from "next/navigation";
import ROOMS from "@/db/ROOMS.json";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import { RoomAmenities } from "@/components/composed/RoomAmenities";
import { RoomBeds } from "@/components/composed/RoomBeds";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import { useSelectionStore } from "@/store/useSelectionStore";
import { ImagesShowcaseGrid } from "@/components/ImagesShowcaseGrid";
import { Room, RoomImage } from "@/lib/types";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format as formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { checkAvailabilityTemplate } from "@/lib/whatsapp_templates/availability";
import { RoomFormatSelector } from "@/components/RoomFormatSelector";

// Precompute price map for faster lookups
const PRICE_MAP: Record<string, number> = ROOM_FORMATS.reduce(
  (map, opt) => ({ ...map, [opt.id]: opt.price }),
  {}
);

// Type assertion for ROOMS data
const typedRooms = ROOMS as Room[];

export default function RoomPage({ params }: { params: { slug: string } }) {
  const { selectedFormat, dateRange, adults, children } = useSelectionStore();
  const room = typedRooms.find((r) => r.slug === params.slug);

  if (!room) {
    notFound();
  }

  const roomImages: RoomImage[] | undefined =
    ROOM_IMAGES[room.slug as keyof typeof ROOM_IMAGES];

  // Use selected format if available and valid for this room, otherwise use default format
  const format =
    selectedFormat &&
    (selectedFormat.id === room.defaultFormat ||
      room.alternativeFormats.includes(selectedFormat.id))
      ? selectedFormat
      : ROOM_FORMATS.find((f) => f.id === room.defaultFormat);

  const price = format ? PRICE_MAP[format.id] || 0 : 0;
  const totalPrice = price + (room.hasPrivateToilet ? 10000 : 0);

  const amenities = format
    ? ROOM_AMENITIES.filter(
        (amenity) => format.amenities.includes(amenity.id) && amenity.featured
      )
    : [];

  const getWhatsAppLink = () => {
    return checkAvailabilityTemplate(dateRange, {
      adults,
      children,
    });
  };

  return (
    <main className="pt-32 pb-10 ">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{room.name}</h1>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="w-full md:w-4/12 order-2 md:order-1">
            <div className="flex flex-col gap-4">
              {/* Resumen de reserva */}
              <div className="bg-surface-2 rounded-lg px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">
                  Resumen de reserva
                </h2>
                <div className="space-y-4">
                  {/* Fechas */}
                  <div>
                    <h3 className="text-sm font-medium text-text-muted mb-2">
                      Fechas
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm">
                        {dateRange?.from ? (
                          <>
                            {formatDate(dateRange.from, "d 'de' MMMM", {
                              locale: es,
                            })}
                            {dateRange.to && (
                              <>
                                {" "}
                                -{" "}
                                {formatDate(dateRange.to, "d 'de' MMMM", {
                                  locale: es,
                                })}
                              </>
                            )}
                          </>
                        ) : (
                          "Selecciona las fechas"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Formato */}
                  <div>
                    <h3 className="text-sm font-medium text-text-muted mb-2">
                      Formato
                    </h3>
                    <RoomFormatSelector room={room} inline />
                  </div>

                  {/* Precio */}
                  <div>
                    <h3 className="text-sm font-medium text-text-muted mb-2">
                      Precio
                    </h3>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm">
                        {totalPrice > 0 ? (
                          <>${totalPrice.toLocaleString("es-CL")} CLP / noche</>
                        ) : (
                          "Selecciona un formato"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Botón de reserva */}
                  <Button
                    className="w-full mt-4"
                    variant="primary"
                    size="default"
                    onClick={() => {
                      const whatsappLink = getWhatsAppLink();
                      window.open(whatsappLink, "_blank");
                    }}
                    disabled={!dateRange?.from || !format}
                  >
                    Reservar ahora
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-6/12 space-y-4">
            <ImagesShowcaseGrid imgs={roomImages} />
            <div>
              <p>{room.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Características</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Capacidad: {room.capacity} personas</li>
                <li>
                  Baño: {room.hasPrivateToilet ? "Privado" : "Compartido"}
                </li>
                <li>Formato: {format?.label}</li>
                <li>Precio base: ${price.toLocaleString("es-CL")} CLP</li>
                {room.hasPrivateToilet && (
                  <li>Suplemento baño privado: $10.000 CLP</li>
                )}
                <li className="font-semibold">
                  Precio total: ${totalPrice.toLocaleString("es-CL")} CLP
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Camas</h2>
              <RoomBeds beds={room.beds} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Amenidades</h2>
              <RoomAmenities amenities={amenities} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
