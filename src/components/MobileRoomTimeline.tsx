"use client";

import { useState, useEffect } from "react";
import {
  isWithinInterval,
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/composed/BookingModal";
import { MobileBookingCard } from "@/components/composed/MobileBookingCard";
import { Booking } from "@/lib/types";
import ROOMS from "../../db/ROOMS.json";
import { bookingService } from "@/lib/services/bookingService";
import { cn } from "@/lib/utils";

type EditingBooking =
  | {
      id: string;
      color: string;
      guestName: string;
      roomSlug: string;
      startDate: Date;
      endDate: Date;
      notes: string;
    }
  | {
      id: "";
      color: "";
      guestName: string;
      roomSlug: string;
      startDate: Date;
      endDate: Date;
      notes: string;
    };

export default function MobileRoomTimeline() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<
    EditingBooking | undefined
  >();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  // Verificar si todos los días del mes están ocupados
  const areAllDaysBooked = (roomSlug: string) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    let currentDate = monthStart;

    while (currentDate <= monthEnd) {
      const hasConflict = checkBookingConflict(
        roomSlug,
        currentDate,
        currentDate,
      );
      if (!hasConflict) {
        return false;
      }
      currentDate = addDays(currentDate, 1);
    }
    return true;
  };

  // Cargar reservas iniciales y suscribirse a cambios
  useEffect(() => {
    // Cargar reservas iniciales
    setBookings(bookingService.getAll());

    // Suscribirse a cambios
    const unsubscribe = bookingService.subscribe((updatedBookings) => {
      setBookings(updatedBookings);
    });

    // Limpieza al desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSaveBooking = (bookingData: Omit<Booking, "id">) => {
    const hasConflict = checkBookingConflict(
      bookingData.roomSlug,
      bookingData.startDate,
      bookingData.endDate,
      editingBooking?.id,
    );

    if (hasConflict) {
      return false;
    }

    if (editingBooking?.id) {
      // Actualizar booking existente
      const success = bookingService.update({
        ...bookingData,
        id: editingBooking.id,
      });
      if (success) {
        setEditingBooking(undefined);
        setIsModalOpen(false);
      }
      return success;
    } else {
      // Crear nuevo booking
      bookingService.add(bookingData);
      setEditingBooking(undefined);
      setIsModalOpen(false);
      return true;
    }
  };

  //   const handleDeleteBooking = (id: string) => {
  //     if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
  //       bookingService.delete(id);
  //     }
  //   };

  const checkBookingConflict = (
    roomSlug: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string,
  ): boolean => {
    return bookings.some((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) {
        return false;
      }
      if (booking.roomSlug !== roomSlug) {
        return false;
      }

      // Nueva lógica: permitir checkout y checkin el mismo día
      if (
        startDate.getTime() === booking.endDate.getTime() ||
        endDate.getTime() === booking.startDate.getTime()
      ) {
        return false;
      }

      return (
        isWithinInterval(startDate, {
          start: booking.startDate,
          end: booking.endDate,
        }) ||
        isWithinInterval(endDate, {
          start: booking.startDate,
          end: booking.endDate,
        }) ||
        isWithinInterval(booking.startDate, { start: startDate, end: endDate })
      );
    });
  };

  const handleOpenNewBookingModal = (preselectedRoom?: string) => {
    setEditingBooking({
      id: "",
      color: "",
      guestName: "",
      roomSlug: preselectedRoom || ROOMS[0].slug,
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      notes: "",
    });
    setIsModalOpen(true);
  };

  // Obtener las reservas activas para una habitación en el mes actual
  const getActiveBookings = (roomSlug: string) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    return bookings
      .filter(
        (booking) =>
          booking.roomSlug === roomSlug &&
          (isWithinInterval(booking.startDate, {
            start: monthStart,
            end: monthEnd,
          }) ||
            isWithinInterval(booking.endDate, {
              start: monthStart,
              end: monthEnd,
            }) ||
            (booking.startDate <= monthStart && booking.endDate >= monthEnd)),
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const roomWidth = container.offsetWidth;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / roomWidth);
    setActiveRoomIndex(newIndex);
  };

  return (
    <div className="mx-auto w-full bg-white border rounded-standard overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gradient-to-r from-[hsl(284,57%,98%)] to-[hsl(284,37%,95%)] p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex min-w-24 flex-col items-center">
              <span className="text-sm text-[hsl(317.8,52.9%,10%,0.6)]">
                {format(currentMonth, "yyyy")}
              </span>
              <span className="font-medium capitalize">
                {format(currentMonth, "MMMM", { locale: es })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {!areAllDaysBooked(ROOMS[activeRoomIndex].slug) && (
          <Button
            onClick={() =>
              handleOpenNewBookingModal(ROOMS[activeRoomIndex].slug)
            }
            className="bg-[hsl(314,80%,71%)] text-white shadow-sm hover:bg-[hsl(314,80%,61%)]"
            size="small"
          >
            <span className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Reservar
            </span>
          </Button>
        )}
      </div>

      <div className="relative">
        <div
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
          onScroll={handleScroll}
        >
          {ROOMS.map((room) => {
            const activeBookings = getActiveBookings(room.slug);

            return (
              <div key={room.slug} className="w-full flex-none snap-center">
                <div className="flex flex-col p-4">
                  <div className="mb-6">
                    <h3 className="text-base font-medium text-[hsl(317.8,52.9%,10%)]">
                      {room.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-[hsl(317.8,52.9%,10%,0.6)]">
                        {activeBookings.length}{" "}
                        {activeBookings.length === 1 ? "reserva" : "reservas"}{" "}
                        este mes
                      </p>
                    </div>
                  </div>

                  {activeBookings.length > 0 ? (
                    <div className="space-y-3">
                      {activeBookings.map((booking) => (
                        <MobileBookingCard
                          key={booking.id}
                          booking={booking}
                          onClick={() => {
                            setEditingBooking({
                              id: booking.id,
                              color: booking.color,
                              guestName: booking.guestName,
                              roomSlug: booking.roomSlug,
                              startDate: booking.startDate,
                              endDate: booking.endDate,
                              notes: booking.notes || "",
                            });
                            setIsModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-100/10 p-4">
                      <div className="mb-2 text-lg font-medium">
                        Sin reservas
                      </div>
                      <div className="text-sm">No hay reservas este mes</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-4 flex justify-center gap-1">
        {ROOMS.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all",
              index === activeRoomIndex
                ? "w-3 bg-[hsl(314,80%,71%)]"
                : "bg-[hsl(284,40%,92%)]",
            )}
          />
        ))}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBooking(undefined);
        }}
        onSave={handleSaveBooking}
        editingBooking={editingBooking as Booking}
        checkBookingConflict={checkBookingConflict}
      />
    </div>
  );
}
