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
import { BookingChip } from "@/components/composed/BookingChip";

// Colores para las reservas
const BOOKING_COLORS = [
  "bg-[hsl(314,80%,71%)]", // primary
  "bg-[hsl(177,100%,31%)]", // accent
  "bg-[hsl(22,85%,57%)]", // secondary
  "bg-[hsl(280,21.1%,36%)]", // surface-inverted
  "bg-[hsl(284,40%,74%)]", // surface-3
  "bg-[#59578e]", // hostal color
  "bg-[#561944]", // hostal color
  "bg-[#F3D39E]", // hostal color
  "bg-[#EE7934]", // hostal color
  "bg-[#a0618d]", // to-transform
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
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{booking.guestName}</h4>
              <div className="text-xs text-[hsl(317.8,52.9%,10%,0.6)]">{room?.name}</div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[hsl(317.8,52.9%,10%,0.8)] hover:text-[hsl(317.8,52.9%,10%)]"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600/80 hover:text-red-600"
                onClick={() => {
                  if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[hsl(317.8,52.9%,10%,0.8)]">
            <Calendar className="h-3 w-3" />
            <span>
              {format(booking.startDate, "dd MMM", { locale: es })} -{" "}
              {format(booking.endDate, "dd MMM yyyy", { locale: es })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[hsl(317.8,52.9%,10%,0.8)]">
            <Clock className="h-3 w-3" />
            <span>
              {duration} día{duration > 1 ? "s" : ""}
            </span>
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
  notes: string;
} | {
  id: "";
  color: "";
  guestName: string;
  roomSlug: string;
  startDate: Date;
  endDate: Date;
  notes: string;
};

export default function RoomTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<EditingBooking | undefined>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragState, setDragState] = useState<DragState | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar el intervalo de auto-scroll cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Función para manejar el auto-scroll
  const handleAutoScroll = (e: React.MouseEvent) => {
    if (!scrollRef.current || !dragState?.isSelecting) return;

    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const scrollSpeed = 15; // píxeles por intervalo
    const scrollThreshold = 100; // distancia desde el borde para activar el auto-scroll

    // Limpiar el intervalo existente
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }

    // Si el mouse está cerca del borde derecho
    if (mouseX > containerRect.width - scrollThreshold) {
      scrollIntervalRef.current = setInterval(() => {
        container.scrollLeft += scrollSpeed;
      }, 50);
    }
    // Si el mouse está cerca del borde izquierdo
    else if (mouseX < scrollThreshold) {
      scrollIntervalRef.current = setInterval(() => {
        container.scrollLeft -= scrollSpeed;
      }, 50);
    }
  };

  // Detener el auto-scroll cuando se suelta el mouse
  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

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
            notes: booking.notes || "",
          });
          setIsModalOpen(true);
        }}
        onDelete={() => handleDeleteBooking(booking.id)}
      >
        <div
          className="absolute top-1 bottom-1"
          style={{ left: `${left}px`, width: `${width}px` }}
        >
          <BookingChip
            booking={booking}
            showDates={false}
            continuesFromPreviousMonth={continuesFromPreviousMonth}
            continuesIntoNextMonth={continuesIntoNextMonth}
          />
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

    handleAutoScroll(e);

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
    // Detener el auto-scroll
    stopAutoScroll();

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
        notes: "",
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

  // Función para contar habitaciones ocupadas por día
  const getOccupiedRoomsCount = (date: Date) => {
    return ROOMS.reduce((count, room) => {
      const isOccupied = filteredBookings.some(
        (booking) =>
          booking.roomSlug === room.slug &&
          isWithinInterval(date, {
            start: booking.adjustedStartDate,
            end: booking.adjustedEndDate,
          })
      );
      return isOccupied ? count + 1 : count;
    }, 0);
  };

  // Modificar el renderizado de los días en el header
  const renderMonthHeader = (date: Date, days: typeof firstMonthDays, isSecondMonth: boolean) => (
    <div className={cn(
      "flex flex-col relative",
      isSecondMonth ? [
        "bg-[hsl(284,37%,95%)]",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-[hsl(284,40%,85%)]"
      ] : "bg-[hsl(284,57%,98%)]"
    )}>
      <div className="h-8 border-b bg-[hsl(284,40%,88%)] px-3 flex items-center justify-center">
        <span className="text-sm font-medium text-[hsl(317.8,52.9%,10%)]">
          {format(date, "MMMM yyyy", { locale: es })}
        </span>
      </div>
      <div className="flex h-10">
        {days.map(({ dayNumber, date }) => {
          const dayOfWeek = format(date, "EEE", { locale: es });
          const weekend = [0, 6].includes(date.getDay());
          const isCurrentDay = isToday(date);
          const occupiedRooms = getOccupiedRoomsCount(date);
          const totalRooms = ROOMS.length;
          const occupancyText = `${occupiedRooms}/${totalRooms}`;
          const occupancyColor = occupiedRooms === totalRooms 
            ? "text-red-500"
            : occupiedRooms > totalRooms / 2 
              ? "text-orange-500"
              : occupiedRooms > 0
                ? "text-green-500"
                : "text-[hsl(317.8,52.9%,10%,0.6)]";

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "flex h-10 w-10 flex-col items-center justify-center border-r border-[hsl(0,0%,82%)] text-xs font-medium relative group",
                weekend ? "bg-[hsl(284,40%,92%)]" : "",
                isCurrentDay && [
                  "border-[hsl(314,80%,71%)]",
                  "bg-[hsl(314,80%,71%,0.15)]",
                  "font-bold",
                  "ring-2",
                  "ring-[hsl(314,80%,71%)]",
                  "ring-offset-2",
                  "ring-offset-[hsl(284,57%,98%)]",
                  "z-10"
                ]
              )}
            >
              <div className={cn(
                "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[hsl(284,57%,98%)] border border-[hsl(284,40%,85%)] rounded-md text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20",
                "before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:w-2 before:h-2 before:bg-[hsl(284,57%,98%)] before:border-r before:border-b before:border-[hsl(284,40%,85%)]",
                occupancyColor
              )}>
                {occupancyText}
              </div>
              <span className={cn(
                "text-[10px]",
                isCurrentDay ? "text-[hsl(314,80%,71%)]" : "text-[hsl(317.8,52.9%,10%,0.6)]"
              )}>
                {dayOfWeek}
              </span>
              <span className={cn(
                isCurrentDay ? "text-[hsl(314,80%,71%)]" : "text-[hsl(317.8,52.9%,10%)]"
              )}>
                {dayNumber}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full overflow-hidden bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-[hsl(284,57%,98%)] to-[hsl(284,37%,95%)] p-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[hsl(317.8,52.9%,10%)]">
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
          <span className="text-sm text-[hsl(317.8,52.9%,10%,0.6)]">
            Mantén presionado Shift + arrastrar para crear una reserva
          </span>
          <Button
            onClick={() => {
              setEditingBooking(undefined);
              setIsModalOpen(true);
            }}
            className="bg-[hsl(314,80%,71%)] text-white shadow-sm hover:bg-[hsl(314,80%,61%)]"
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
        <div className="w-48 border-r bg-[hsl(284,57%,98%)]">
          <div className="flex h-[4.5rem] items-center justify-center border-b bg-[hsl(284,40%,88%)] px-3">
            <span className="text-sm font-medium text-[hsl(317.8,52.9%,10%)]">
              Habitaciones
            </span>
          </div>
          {ROOMS.map((room) => (
            <div
              key={room.slug}
              className="flex h-10 items-center border-b border-[hsl(0,0%,82%)] bg-[hsl(284,57%,98%)] px-3 transition-colors hover:bg-[hsl(284,37%,95%)]"
            >
              <div>
                <span className="text-sm font-medium text-[hsl(317.8,52.9%,10%)]">
                  {room.name}
                </span>
                 
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto"
          style={{ userSelect: "none" }}
          onMouseLeave={stopAutoScroll}
        >
          <div
            className="relative"
            style={{ width: `${allDays.length * 40}px` }}
          >
            {/* Days Header */}
            <div className="flex">
              {renderMonthHeader(currentDate, firstMonthDays, false)}
              {renderMonthHeader(secondMonth, secondMonthDays, true)}
            </div>

            {/* Room Rows */}
            {ROOMS.map((room) => (
              <div key={room.slug} className="relative h-10 border-b border-[hsl(0,0%,82%)]">
                <div className="flex h-full">
                  {allDays.map(({ dayNumber, date }, index) => {
                    const weekend = [0, 6].includes(date.getDay());
                    const isCurrentDay = isToday(date);
                    const selectionClass = getSelectionStyle(date, room.slug);
                    const isBooked = isDateBooked(date, room.slug);
                    const isSecondMonth = index >= firstMonthDays.length;
                    const isFirstDayOfSecondMonth = index === firstMonthDays.length;

                    return (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "h-full w-10 border-r border-[hsl(0,0%,82%)] transition-colors relative",
                          weekend ? "bg-[hsl(284,40%,92%)]" : isSecondMonth ? "bg-[hsl(284,37%,95%)]" : "bg-[hsl(284,57%,98%)] hover:bg-[hsl(284,37%,95%)]",
                          isCurrentDay && "border-[hsl(314,80%,71%)] bg-[hsl(314,80%,71%,0.1)]",
                          isFirstDayOfSecondMonth && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-[hsl(284,40%,85%)]",
                          selectionClass,
                          isBooked && "cursor-not-allowed bg-[hsl(0,0%,92%)]",
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
