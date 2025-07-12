"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import { BOOKING_COLORS } from "@/lib/roomColors";
// import { BOOKING_COLORS } from "@/lib/roomColors";

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
              <div className="text-xs text-[hsl(317.8,52.9%,10%,0.6)]">
                {room?.name}
              </div>
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
                  if (
                    confirm(
                      "¿Estás seguro de que quieres eliminar esta reserva?",
                    )
                  ) {
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
  color: string;
}

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

export default function RoomTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<
    EditingBooking | undefined
  >();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dragBooking, setDragBooking] = useState<{
    roomSlug: string;
    startDate: Date;
    endDate: Date;
    color: string;
  } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragState, setDragState] = useState<DragState | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

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

  // Verificar si hay conflicto de fechas para una habitación
  const checkBookingConflict = useCallback((
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

      // Nueva lógica: permitir checkout y checkin el mismo día
      // Si la fecha de inicio de la nueva reserva es igual a la fecha de fin de una existente, permitir
      // Si la fecha de fin de la nueva reserva es igual a la fecha de inicio de una existente, permitir
      if (
        startDate.getTime() === booking.endDate.getTime() ||
        endDate.getTime() === booking.startDate.getTime()
      ) {
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
  }, [bookings]);

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
        setDragBooking(null);
        setIsModalOpen(false);
      }
      return success;
    } else {
      // Crear nuevo booking
      bookingService.add(bookingData);
      setEditingBooking(undefined);
      setDragBooking(null);
      setIsModalOpen(false);
      return true;
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      bookingService.delete(bookingId);
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

    // Ajustar el ancho y posición para ocupar medio día al inicio y al final
    const cellWidth = 40; // Ancho de una celda de día
    const gap = 2; // Espacio entre reservas que comparten día

    // Determinar si hay otra reserva que empieza o termina en el mismo día
    const hasCheckoutSameDay = bookings.some(
      (b) =>
        b.id !== booking.id &&
        b.roomSlug === booking.roomSlug &&
        b.startDate.getTime() === booking.endDate.getTime(),
    );

    const hasCheckinSameDay = bookings.some(
      (b) =>
        b.id !== booking.id &&
        b.roomSlug === booking.roomSlug &&
        b.endDate.getTime() === booking.startDate.getTime(),
    );

    // Calcular el ancho y posición base (empezando desde la mitad del primer día)
    let width = (daysUntilEnd - daysFromStart + 1) * cellWidth;
    let left = daysFromStart * cellWidth;

    // Siempre ajustar para empezar a la mitad del día, excepto si continúa desde un mes anterior no visible
    const continuesFromPreviousMonth =
      booking.startDate < startOfMonth(currentDate);
    const continuesIntoNextMonth = booking.endDate > endOfMonth(secondMonth);

    if (!continuesFromPreviousMonth) {
      left += cellWidth / 2;
      width -= cellWidth / 2;
    }

    // Siempre ajustar para terminar a la mitad del día, excepto si continúa hacia un mes siguiente no visible
    if (!continuesIntoNextMonth) {
      width -= cellWidth / 2;
    }

    // Añadir gaps si hay reservas adyacentes
    if (hasCheckinSameDay && !continuesFromPreviousMonth) {
      left += gap / 2;
      width -= gap / 2;
    }
    if (hasCheckoutSameDay && !continuesIntoNextMonth) {
      width -= gap / 2;
    }

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
          style={{
            left: `${left}px`,
            width: `${width}px`,
            borderRadius: "4px",
          }}
        >
          <BookingChip
            booking={booking}
            showDates={false}
            continuesFromPreviousMonth={continuesFromPreviousMonth}
            continuesIntoNextMonth={continuesIntoNextMonth}
            hasCheckoutSameDay={hasCheckoutSameDay}
            hasCheckinSameDay={hasCheckinSameDay}
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

  const isDateBooked = (
    date: Date,
    roomSlug: string,
    isDragEndpoint: boolean = false,
  ) => {
    // Si es un punto de inicio/fin del drag, permitir fechas que tienen checkout/checkin
    if (isDragEndpoint) {
      const hasCheckout = bookings.some(
        (booking) =>
          booking.roomSlug === roomSlug &&
          booking.endDate.getTime() === date.getTime(),
      );
      const hasCheckin = bookings.some(
        (booking) =>
          booking.roomSlug === roomSlug &&
          booking.startDate.getTime() === date.getTime(),
      );

      if (hasCheckout || hasCheckin) {
        return false;
      }
    }

    return bookings.some(
      (booking) =>
        booking.roomSlug === roomSlug &&
        isWithinInterval(date, {
          start: booking.startDate,
          end: booking.endDate,
        }),
    );
  };

  const handleDayMouseDown = (
    day: { dayNumber: number; date: Date },
    roomSlug: string,
    e: React.MouseEvent,
  ) => {
    // No iniciar selección si:
    // 1. Es click derecho
    // 2. NO se está presionando Shift (modo reserva)
    if (e.button !== 0 || !e.shiftKey) return;

    // Verificar si el día está ocupado, permitiendo días con checkin/checkout
    if (isDateBooked(day.date, roomSlug, true)) return;

    // Prevenir que el evento llegue al contenedor de scroll
    e.stopPropagation();

    // Seleccionar un color aleatorio para el ghost booking
    const randomColor =
      BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)];

    setDragState({
      isSelecting: true,
      startDay: day.date,
      endDay: day.date,
      roomSlug,
      color: randomColor,
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

    // Si la celda actual está ocupada y no es un día de checkin/checkout, no actualizamos
    if (isDateBooked(day.date, roomSlug, true)) return;

    // Permitir que el drag vaya en cualquier dirección
    setDragState((prev) =>
      prev
        ? {
            ...prev,
            endDay: day.date,
          }
        : null,
    );
  };

  const handleDayMouseUp = () => {
    // Solo detenemos el auto-scroll
    stopAutoScroll();
  };

  const getSelectionStyle = (date: Date, roomSlug: string) => {
    if (!dragState || dragState.roomSlug !== roomSlug) return "";

    const dragStartTime = dragState.startDay.getTime();
    const dragEndTime = dragState.endDay.getTime();

    const isInRange = isWithinInterval(date, {
      start: new Date(Math.min(dragStartTime, dragEndTime)),
      end: new Date(Math.max(dragStartTime, dragEndTime)),
    });

    if (!isInRange) return "";

    // Solo retornamos una clase para el cursor
    return "cursor-grabbing";
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
          }),
      );
      return isOccupied ? count + 1 : count;
    }, 0);
  };

  // Modificar el renderizado de los días en el header
  const renderMonthHeader = (
    date: Date,
    days: typeof firstMonthDays,
    isSecondMonth: boolean,
  ) => (
    <div
      className={cn(
        "relative flex flex-col",
        isSecondMonth
          ? [
              "bg-[hsl(284,37%,95%)]",
              "before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:bg-[hsl(284,40%,65%)]",
            ]
          : "bg-[hsl(284,57%,98%)]",
      )}
    >
      <div className="flex h-8 items-center justify-center border-b bg-[hsl(284,40%,88%)] px-3">
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
          const occupancyColor =
            occupiedRooms === totalRooms
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
                "border-b-border group relative flex h-10 w-10 flex-col items-center justify-center border-r border-b-1 text-xs font-medium",
                weekend ? "bg-[hsl(284,40%,92%)]" : "",
                isCurrentDay && [
                  "border-[hsl(314,80%,71%)]",
                  "bg-[hsl(314,80%,71%,0.15)]",
                  "font-bold",
                  "ring-2",
                  "ring-[hsl(314,80%,71%)]",
                  "ring-offset-2",
                  "ring-offset-[hsl(284,57%,98%)]",
                  "z-10",
                ],
              )}
            >
              <div
                className={cn(
                  "absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded-md border border-[hsl(284,40%,85%)] bg-[hsl(284,57%,98%)] px-2 py-1 text-[10px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100",
                  "before:absolute before:bottom-0 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:border-r before:border-b before:border-[hsl(284,40%,85%)] before:bg-[hsl(284,57%,98%)] before:content-['']",
                  occupancyColor,
                )}
              >
                {occupancyText}
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  isCurrentDay
                    ? "text-[hsl(314,80%,71%)]"
                    : "text-[hsl(317.8,52.9%,10%,0.6)]",
                )}
              >
                {dayOfWeek}
              </span>
              <span
                className={cn(
                  isCurrentDay
                    ? "text-[hsl(314,80%,71%)]"
                    : "text-[hsl(317.8,52.9%,10%)]",
                )}
              >
                {dayNumber}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Agregar efecto para manejar el keyup de Shift
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" && dragState) {
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
          // Pre-llenar los datos de la reserva con las fechas ordenadas
          const newBooking = {
            roomSlug: dragState.roomSlug,
            startDate,
            endDate,
            color: dragState.color,
          };
          setDragBooking(newBooking);
          setIsModalOpen(true);
        }

        setDragState(null);
        stopAutoScroll();
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [dragState, checkBookingConflict]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-[hsl(317.8,52.9%,10%)] mb-10">
        Cronograma de Habitaciones
      </h2>
      <div className="rounded-standard mx-auto w-full overflow-hidden border bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-[hsl(284,57%,98%)] to-[hsl(284,37%,95%)] p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                              <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8"
                >
                  ←
                </Button>
              <div className="flex gap-2">
                <div className="flex min-w-24 flex-col items-center">
                  <span className="text-xs text-[hsl(317.8,52.9%,10%,0.6)]">
                    {format(currentDate, "yyyy")}
                  </span>
                  <span className="font-medium capitalize">
                    {format(currentDate, "MMMM", { locale: es })}
                  </span>
                </div>
                <div className="flex min-w-24 flex-col items-center">
                  <span className="text-xs text-[hsl(317.8,52.9%,10%,0.6)]">
                    {format(secondMonth, "yyyy")}
                  </span>
                  <span className="font-medium capitalize">
                    {format(secondMonth, "MMMM", { locale: es })}
                  </span>
                </div>
              </div>
                              <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8"
                >
                  →
                </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
              <span className="text-xl font-medium text-[hsl(317.8,52.9%,10%)]">
                Habitaciones
              </span>
            </div>
            {ROOMS.map((room) => (
              <div
                key={room.slug}
                className="flex h-10 items-center border-b border-[hsl(0,0%,82%)] bg-[hsl(284,57%,98%)] px-3 transition-colors hover:bg-[hsl(284,37%,95%)]"
              >
                <div>
                  <span className="text-lg font-bold text-[hsl(317.8,52.9%,10%)]">
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
                <div
                  key={room.slug}
                  className="relative h-10 border-b border-[hsl(0,0%,82%)]"
                >
                  <div className="flex h-full">
                    {allDays.map(({ dayNumber, date }, index) => {
                      const weekend = [0, 6].includes(date.getDay());
                      const isCurrentDay = isToday(date);
                      const selectionClass = getSelectionStyle(date, room.slug);
                      const isBooked = isDateBooked(date, room.slug, false);
                      const isSecondMonth = index >= firstMonthDays.length;
                      const isFirstDayOfSecondMonth =
                        index === firstMonthDays.length;

                      return (
                        <div
                          key={date.toISOString()}
                          className={cn(
                            "relative h-full w-10 border-r border-[hsl(0,0%,82%)] transition-colors",
                            weekend
                              ? "bg-[hsl(284,40%,92%)]"
                              : isSecondMonth
                                ? "bg-[hsl(284,37%,95%)]"
                                : "bg-[hsl(284,57%,98%)] hover:bg-[hsl(284,37%,95%)]",
                            isCurrentDay &&
                              "border-[hsl(314,80%,71%)] bg-[hsl(314,80%,71%,0.1)]",
                            isFirstDayOfSecondMonth &&
                              "before:absolute before:top-0 before:bottom-0 before:left-0 before:z-10 before:w-[2px] before:bg-[hsl(284,40%,65%)]",
                            selectionClass,
                            isBooked && "cursor-not-allowed",
                            !isBooked && "cursor-pointer",
                          )}
                          onMouseDown={(e) =>
                            handleDayMouseDown(
                              { dayNumber, date },
                              room.slug,
                              e,
                            )
                          }
                          onMouseEnter={(e) =>
                            handleDayMouseEnter(
                              { dayNumber, date },
                              room.slug,
                              e,
                            )
                          }
                          onMouseUp={handleDayMouseUp}
                        />
                      );
                    })}
                  </div>
                  {filteredBookings
                    .filter((booking) => booking.roomSlug === room.slug)
                    .map((booking) => renderBooking(booking))}

                  {/* Render ghost booking during drag */}
                  {dragState?.isSelecting &&
                    dragState.roomSlug === room.slug && (
                      <div
                        className="absolute top-1 bottom-1 transition-all duration-75"
                        style={{
                          left: `${
                            Math.floor(
                              (Math.min(
                                dragState.startDay.getTime(),
                                dragState.endDay.getTime(),
                              ) -
                                firstMonthDays[0].date.getTime()) /
                                (1000 * 60 * 60 * 24),
                            ) *
                              40 +
                            20
                          }px`,
                          width: `${
                            (Math.abs(
                              dragState.endDay.getTime() -
                                dragState.startDay.getTime(),
                            ) /
                              (1000 * 60 * 60 * 24)) *
                            40
                          }px`,
                          pointerEvents: "none",
                        }}
                      >
                        <BookingChip
                          booking={{
                            id: "ghost",
                            guestName: "Nueva Reserva",
                            roomSlug: dragState.roomSlug,
                            startDate: new Date(
                              Math.min(
                                dragState.startDay.getTime(),
                                dragState.endDay.getTime(),
                              ),
                            ),
                            endDate: new Date(
                              Math.max(
                                dragState.startDay.getTime(),
                                dragState.endDay.getTime(),
                              ),
                            ),
                            startDay: 1,
                            endDay: 1,
                            color: dragState.color,
                            notes: "",
                          }}
                          showDates={false}
                          isGhost={true}
                          continuesFromPreviousMonth={false}
                          continuesIntoNextMonth={false}
                          hasCheckinSameDay={false}
                          hasCheckoutSameDay={false}
                        />
                      </div>
                    )}
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
            setDragBooking(null);
          }}
          onSave={handleSaveBooking}
          editingBooking={editingBooking as Booking}
          dragBooking={dragBooking}
          checkBookingConflict={checkBookingConflict}
        />
      </div>
      <div className="pt-4 pb-16 text-center text-sm text-[hsl(317.8,52.9%,10%,0.6)]">
        Mantén presionado Shift + arrastrar para crear una reserva
      </div>
    </div>
  );
}
