"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { Booking } from "@/lib/types";
import { BookingModal } from "@/components/composed/BookingModal";
import ROOMS from "../../db/ROOMS.json";
import { cn } from "@/lib/utils";

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
  const duration = booking.endDay - booking.startDay + 1;
  const monthStart = startOfMonth(new Date());
  const startDate = addDays(monthStart, booking.startDay - 1);
  const endDate = addDays(monthStart, booking.endDay - 1);

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
              {format(startDate, "dd MMM", { locale: es })} -{" "}
              {format(endDate, "dd MMM yyyy", { locale: es })}
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

export default function RoomTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = Array.from(
    { length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );
  const today = new Date();
  const todayDayNumber = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
    ? today.getDate()
    : -1;

  // Scroll to today's date only when viewing current month
  useEffect(() => {
    if (scrollRef.current) {
      const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                           today.getFullYear() === currentDate.getFullYear();
      
      if (isCurrentMonth) {
        const scrollPosition = (todayDayNumber - 1) * 40;
        scrollRef.current.scrollLeft = Math.max(0, scrollPosition - scrollRef.current.clientWidth / 2);
      } else {
        scrollRef.current.scrollLeft = 0;
      }
    }
  }, [currentDate, todayDayNumber]);

  // Cargar reservas del localStorage al iniciar
  useEffect(() => {
    const savedBookings = localStorage.getItem("roomBookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Guardar reservas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("roomBookings", JSON.stringify(bookings));
  }, [bookings]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleSaveBooking = (bookingData: Omit<Booking, "id" | "color">) => {
    if (editingBooking) {
      // Actualizar reserva existente
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingBooking.id
            ? { ...booking, ...bookingData }
            : booking,
        ),
      );
    } else {
      // Crear nueva reserva
      const newBooking: Booking = {
        ...bookingData,
        id: Math.random().toString(36).substr(2, 9),
        color:
          BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)],
      };
      setBookings((prev) => [...prev, newBooking]);
    }
    setEditingBooking(undefined);
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    }
  };

  // Filtrar reservas para el mes actual
  const filteredBookings = bookings.filter(booking => {
    // Obtener el último día del mes actual
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // La reserva pertenece a este mes si:
    // 1. El día de inicio está dentro del rango del mes (1 a último día)
    // 2. El día de fin está dentro del rango del mes (1 a último día)
    return booking.startDay >= 1 && booking.startDay <= lastDayOfMonth &&
           booking.endDay >= 1 && booking.endDay <= lastDayOfMonth;
  });

  const renderBooking = (booking: Booking) => {
    const width = (booking.endDay - booking.startDay + 1) * 40;
    const left = (booking.startDay - 1) * 40;

    return (
      <BookingPopover
        key={booking.id}
        booking={booking}
        onEdit={() => {
          setEditingBooking(booking);
          setIsModalOpen(true);
        }}
        onDelete={() => handleDeleteBooking(booking.id)}
      >
        <div
          className={`absolute top-1 bottom-1 ${booking.color} flex cursor-pointer items-center justify-center rounded-md text-xs font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-md`}
          style={{ left: `${left}px`, width: `${width}px` }}
          title={booking.guestName}
        >
          <span className="truncate px-2">{booking.guestName}</span>
        </div>
      </BookingPopover>
    );
  };

  // Función para obtener el día de la semana en español
  const getDayOfWeek = (dayNumber: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return daysOfWeek[date.getDay()];
  };

  // Función para verificar si es fin de semana
  const isWeekend = (dayNumber: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

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

      <div className="flex">
        {/* Rooms Column */}
        <div className="w-48 border-r bg-slate-50">
          <div className="flex h-12 items-center border-b bg-slate-100 px-3">
            <span className="text-sm font-medium text-slate-600">
              Habitaciones
            </span>
          </div>
          {ROOMS.map((room) => (
            <div
              key={room.slug}
              className="flex h-12 items-center border-b border-slate-200 bg-white px-3 transition-colors hover:bg-slate-50"
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
          className="flex-1 cursor-grab overflow-x-auto active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ userSelect: "none" }}
        >
          <div className="relative" style={{ width: `${days.length * 40}px` }}>
            {/* Days Header */}
            <div className="h-12 border-b bg-slate-100 flex">
              {days.map((day) => {
                const dayOfWeek = getDayOfWeek(day);
                const weekend = isWeekend(day);
                const isToday = day === todayDayNumber;

                return (
                  <div
                    key={day}
                    className={cn(
                      "w-10 h-12 border-r border-slate-200 flex flex-col items-center justify-center text-xs font-medium",
                      weekend ? "bg-slate-200 text-slate-700" : "text-slate-600",
                      isToday && "bg-blue-100 text-blue-800 font-bold border-blue-300"
                    )}
                  >
                    <span className="text-[10px] text-slate-500">{dayOfWeek}</span>
                    <span>{day}</span>
                  </div>
                );
              })}
            </div>

            {/* Room Rows */}
            {ROOMS.map((room) => (
              <div key={room.slug} className="relative h-12 border-b border-slate-200">
                <div className="flex h-full">
                  {days.map((day) => {
                    const weekend = isWeekend(day);
                    const isToday = day === todayDayNumber;
                    return (
                      <div
                        key={day}
                        className={cn(
                          "w-10 h-full border-r border-slate-200 transition-colors",
                          weekend ? "bg-slate-100" : "hover:bg-slate-50",
                          isToday && "bg-blue-50 border-blue-200"
                        )}
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
        editingBooking={editingBooking}
      />
    </div>
  );
}
