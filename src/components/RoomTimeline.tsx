"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  isWithinInterval,
  endOfMonth,
  startOfMonth,
  max,
  min,
} from "date-fns";
import { es } from "date-fns/locale";
import { Booking } from "@/lib/types";
import { BookingModal } from "@/components/composed/BookingModal";
import ROOMS from "../../db/ROOMS.json";
import { cn } from "@/lib/utils";
import { bookingService } from "@/lib/services/bookingService";

// Colores para las reservas
const BOOKING_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
];

interface BookingPopoverProps {
  booking: Booking;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const BookingPopover: React.FC<BookingPopoverProps> = ({
  booking,
  onEdit,
  onDelete,
  children,
}) => {
  const room = ROOMS.find((r) => r.slug === booking.roomSlug);
  const duration =
    Math.floor(
      (booking.endDate.getTime() - booking.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold">{booking.guestName}</h4>
            <div className="text-sm text-gray-500">{room?.name}</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {duration} día{duration > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(booking.startDate, "dd MMM", { locale: es })} -{" "}
              {format(booking.endDate, "dd MMM yyyy", { locale: es })}
            </span>
          </div>

          {booking.description && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-700">{booking.description}</p>
            </div>
          )}

          <div className="flex space-x-2 border-t pt-2">
            <Button variant="outline" onClick={onEdit} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="secondary" onClick={onDelete} className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Borrar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface DragState {
  isSelecting: boolean;
  startDay: Date;
  endDay: Date;
  roomSlug: string;
}

type EditingBooking = {
  id: string;
  color: string;
  guestName: string;
  roomSlug: string;
  startDate: Date;
  endDate: Date;
  description: string;
} | {
  id: "";
  color: "";
  guestName: string;
  roomSlug: string;
  startDate: Date;
  endDate: Date;
  description: string;
};

export default function RoomTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<EditingBooking | undefined>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragState, setDragState] = useState<DragState | null>(null);

  // Calcular el segundo mes
  const secondMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  // Obtener los días para ambos meses
  const getDaysInMonth = (date: Date) => {
    return Array.from(
      {
        length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      },
      (_, i) => ({
        dayNumber: i + 1,
        date: new Date(date.getFullYear(), date.getMonth(), i + 1),
      }),
    );
  };

  const firstMonthDays = getDaysInMonth(currentDate);
  const secondMonthDays = getDaysInMonth(secondMonth);
  const allDays = [...firstMonthDays, ...secondMonthDays];

  const today = new Date();
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Cargar reservas del servicio al iniciar
  useEffect(() => {
    const loadBookings = async () => {
      const savedBookings = await bookingService.getAll();
      setBookings(savedBookings);
    };
    loadBookings();
  }, []);

  // Guardar reservas en el servicio cuando cambien
  useEffect(() => {
    bookingService.save(bookings);
  }, [bookings]);

  // Verificar si hay conflicto de fechas para una habitación
  const checkBookingConflict = (
    roomSlug: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string,
  ): boolean => {
    return bookings.some((booking) => {
      // Ignorar la reserva actual si estamos editando
      if (excludeBookingId && booking.id === excludeBookingId) {
        return false;
      }

      // Verificar si es la misma habitación
      if (booking.roomSlug !== roomSlug) {
        return false;
      }

      // Verificar superposición de fechas
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

  const handleSaveBooking = (bookingData: Omit<Booking, "id" | "color">) => {
    // Verificar conflictos antes de guardar
    const hasConflict = checkBookingConflict(
      bookingData.roomSlug,
      bookingData.startDate,
      bookingData.endDate,
      editingBooking?.id,
    );

    if (hasConflict) {
      return false;
    }

    const updatedBookings = editingBooking?.id
      ? bookings.map((booking) =>
          booking.id === editingBooking.id
            ? { ...booking, ...bookingData }
            : booking,
        )
      : [
          ...bookings,
          {
            ...bookingData,
            id: Math.random().toString(36).substr(2, 9),
            color:
              BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)],
          },
        ];

    setBookings(updatedBookings);
    setEditingBooking(undefined);
    bookingService.save(updatedBookings);
    return true;
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    }
  };

  // Filtrar y ajustar reservas para ambos meses
  const filteredBookings = bookings
    .map((booking) => {
      // Si la reserva no intersecta con ninguno de los dos meses, no la incluimos
      const firstMonthStart = startOfMonth(currentDate);
      const secondMonthEnd = endOfMonth(secondMonth);

      const bookingIntersectsMonths =
        isWithinInterval(firstMonthStart, {
          start: booking.startDate,
          end: booking.endDate,
        }) ||
        isWithinInterval(secondMonthEnd, {
          start: booking.startDate,
          end: booking.endDate,
        }) ||
        isWithinInterval(booking.startDate, {
          start: firstMonthStart,
          end: secondMonthEnd,
        });

      if (!bookingIntersectsMonths) return null;

      // Ajustar las fechas al rango visible
      const adjustedStartDate = max([booking.startDate, firstMonthStart]);
      const adjustedEndDate = min([booking.endDate, secondMonthEnd]);

      return {
        ...booking,
        adjustedStartDate,
        adjustedEndDate,
      };
    })
    .filter(
      (
        booking,
      ): booking is Booking & {
        adjustedStartDate: Date;
        adjustedEndDate: Date;
      } => booking !== null,
    );

  const renderBooking = (
    booking: Booking & { adjustedStartDate: Date; adjustedEndDate: Date },
  ) => {
    // Calcular la posición y ancho basado en las fechas ajustadas
    const daysFromStart = Math.floor(
      (booking.adjustedStartDate.getTime() - firstMonthDays[0].date.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const daysUntilEnd = Math.floor(
      (booking.adjustedEndDate.getTime() - firstMonthDays[0].date.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const width = (daysUntilEnd - daysFromStart + 1) * 40;
    const left = daysFromStart * 40;

    // Determinar si la reserva continúa en meses adyacentes
    const continuesFromPreviousMonth =
      booking.startDate < startOfMonth(currentDate);
    const continuesIntoNextMonth = booking.endDate > endOfMonth(secondMonth);

    return (
      <BookingPopover
        key={booking.id}
        booking={booking}
        onEdit={() => {
          setEditingBooking({
            id: booking.id,
            color: booking.color,
            guestName: booking.guestName,
            roomSlug: booking.roomSlug,
            startDate: booking.startDate,
            endDate: booking.endDate,
            description: booking.description || "",
          });
          setIsModalOpen(true);
        }}
        onDelete={() => handleDeleteBooking(booking.id)}
      >
        <div
          className={cn(
            "absolute top-1 bottom-1",
            booking.color,
            "flex cursor-pointer items-center justify-center rounded-md text-xs font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-md",
            {
              "rounded-l-none": continuesFromPreviousMonth,
              "rounded-r-none": continuesIntoNextMonth,
            },
          )}
          style={{ left: `${left}px`, width: `${width}px` }}
          title={`${booking.guestName} (${format(booking.startDate, "d MMM", { locale: es })} - ${format(booking.endDate, "d MMM", { locale: es })})`}
        >
          <div className="relative w-full px-2">
            <span className="truncate">{booking.guestName}</span>
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
      </BookingPopover>
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleDayMouseDown = (
    day: { dayNumber: number; date: Date },
    roomSlug: string,
    e: React.MouseEvent,
  ) => {
    // No iniciar selección si:
    // 1. Es click derecho
    // 2. Hay un booking en ese día
    // 3. NO se está presionando Shift (modo reserva)
    if (e.button !== 0 || isDateBooked(day.date, roomSlug) || !e.shiftKey) return;

    // Prevenir que el evento llegue al contenedor de scroll
    e.stopPropagation();

    setDragState({
      isSelecting: true,
      startDay: day.date,
      endDay: day.date,
      roomSlug,
    });
  };

  const handleDayMouseEnter = (
    day: { dayNumber: number; date: Date },
    roomSlug: string,
    e: React.MouseEvent,
  ) => {
    // No continuar la selección si NO se presiona Shift
    if (
      !dragState?.isSelecting ||
      roomSlug !== dragState.roomSlug ||
      !e.shiftKey
    )
      return;

    setDragState((prev) =>
      prev
        ? {
            ...prev,
            endDay: day.date,
          }
        : null,
    );
  };

  const handleDayMouseUp = (e: React.MouseEvent) => {
    // No finalizar la selección si NO se presiona Shift
    if (!dragState || !e.shiftKey) return;

    // Ordenar las fechas de inicio y fin
    const startDate = new Date(
      Math.min(dragState.startDay.getTime(), dragState.endDay.getTime()),
    );
    const endDate = new Date(
      Math.max(dragState.startDay.getTime(), dragState.endDay.getTime()),
    );

    // Verificar si hay conflictos en el rango seleccionado
    const hasConflict = checkBookingConflict(
      dragState.roomSlug,
      startDate,
      endDate,
    );

    if (!hasConflict) {
      // Pre-llenar los datos de la reserva
      const newBooking: EditingBooking = {
        id: "",
        color: "",
        guestName: "",
        roomSlug: dragState.roomSlug,
        startDate,
        endDate,
        description: "",
      };
      setEditingBooking(newBooking);
      setIsModalOpen(true);
    }

    setDragState(null);
  };

  const isDateBooked = (date: Date, roomSlug: string) => {
    return filteredBookings.some(
      (booking) =>
        booking.roomSlug === roomSlug &&
        isWithinInterval(date, {
          start: booking.adjustedStartDate,
          end: booking.adjustedEndDate,
        }),
    );
  };

  const getSelectionStyle = (date: Date, roomSlug: string) => {
    if (!dragState || dragState.roomSlug !== roomSlug) return "";

    const isInRange = isWithinInterval(date, {
      start: new Date(
        Math.min(dragState.startDay.getTime(), dragState.endDay.getTime()),
      ),
      end: new Date(
        Math.max(dragState.startDay.getTime(), dragState.endDay.getTime()),
      ),
    });

    return isInRange ? "bg-blue-100 border-blue-200" : "";
  };

  // Modificar el renderizado de los días en el header
  const renderMonthHeader = (date: Date, days: typeof firstMonthDays) => (
    <div className="flex flex-col">
      <div className="h-8 border-b bg-slate-100 px-3 flex items-center justify-center">
        <span className="text-sm font-medium text-slate-600">
          {format(date, "MMMM yyyy", { locale: es })}
        </span>
      </div>
      <div className="flex h-10">
        {days.map(({ dayNumber, date }) => {
          const dayOfWeek = format(date, "EEE", { locale: es });
          const weekend = [0, 6].includes(date.getDay());
          const isCurrentDay = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "flex h-10 w-10 flex-col items-center justify-center border-r border-slate-200 text-xs font-medium",
                weekend ? "bg-slate-200 text-slate-700" : "text-slate-600",
                isCurrentDay && "border-blue-300 bg-blue-100 font-bold text-blue-800"
              )}
            >
              <span className="text-[10px] text-slate-500">{dayOfWeek}</span>
              <span>{dayNumber}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-slate-50 to-slate-100 p-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Cronograma de Habitaciones
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className="h-8 px-2"
            >
              ←
            </Button>
            <span className="min-w-32 text-center font-medium">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 px-2"
            >
              →
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            Mantén presionado Shift + arrastrar para crear una reserva
          </span>
          <Button
            onClick={() => {
              setEditingBooking(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          >
            <div className="flex items-center gap-2">
              Agregar Reserva
              <Plus className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Rooms Column */}
        <div className="w-48 border-r bg-slate-50">
          <div className="flex h-[4.5rem] items-center justify-center border-b bg-slate-100 px-3">
            <span className="text-sm font-medium text-slate-600">
              Habitaciones
            </span>
          </div>
          {ROOMS.map((room) => (
            <div
              key={room.slug}
              className="flex h-10 items-center border-b border-slate-200 bg-white px-3 transition-colors hover:bg-slate-50"
            >
              <div>
                <span className="text-sm font-medium text-slate-700">
                  {room.name}
                </span>
                <div className="text-xs text-slate-500">
                  {room.capacity} persona{room.capacity > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto"
          style={{ userSelect: "none" }}
        >
          <div
            className="relative"
            style={{ width: `${allDays.length * 40}px` }}
          >
            {/* Days Header */}
            <div className="flex">
              {renderMonthHeader(currentDate, firstMonthDays)}
              {renderMonthHeader(secondMonth, secondMonthDays)}
            </div>

            {/* Room Rows */}
            {ROOMS.map((room) => (
              <div key={room.slug} className="relative h-10 border-b border-slate-200">
                <div className="flex h-full">
                  {allDays.map(({ dayNumber, date }) => {
                    const weekend = [0, 6].includes(date.getDay());
                    const isCurrentDay = isToday(date);
                    const selectionClass = getSelectionStyle(date, room.slug);
                    const isBooked = isDateBooked(date, room.slug);

                    return (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "h-full w-10 border-r border-slate-200 transition-colors",
                          weekend ? "bg-slate-100" : "hover:bg-slate-50",
                          isCurrentDay && "border-blue-200 bg-blue-50",
                          selectionClass,
                          isBooked && "cursor-not-allowed bg-gray-100",
                          !isBooked && "cursor-pointer"
                        )}
                        onMouseDown={(e) =>
                          handleDayMouseDown({ dayNumber, date }, room.slug, e)
                        }
                        onMouseEnter={(e) =>
                          handleDayMouseEnter({ dayNumber, date }, room.slug, e)
                        }
                        onMouseUp={handleDayMouseUp}
                      />
                    );
                  })}
                </div>
                {filteredBookings
                  .filter((booking) => booking.roomSlug === room.slug)
                  .map((booking) => renderBooking(booking))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
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
