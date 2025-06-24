"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Booking } from "@/lib/types";
import ROOMS from "../../../db/ROOMS.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { DatesSelector } from "@/components/DatesSelector";
import { DateRange } from "react-day-picker";
import { BOOKING_COLORS, BookingColor } from "@/lib/roomColors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, "id">) => boolean;
  editingBooking?: Booking;
  dragBooking?: {
    roomSlug: string;
    startDate: Date;
    endDate: Date;
  } | null;
  checkBookingConflict: (
    roomSlug: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string,
  ) => boolean;
}

export function BookingModal({
  isOpen,
  onClose,
  onSave,
  editingBooking,
  dragBooking,
  checkBookingConflict,
}: BookingModalProps) {
  const [guestName, setGuestName] = useState("");
  const [roomSlug, setRoomSlug] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedColor, setSelectedColor] = useState<BookingColor>(BOOKING_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (editingBooking) {
      setGuestName(editingBooking.guestName);
      setRoomSlug(editingBooking.roomSlug);
      setDateRange({
        from: editingBooking.startDate,
        to: editingBooking.endDate
      });
      // Mantener el color original al editar
      setSelectedColor(editingBooking.color as BookingColor);
    } else if (dragBooking) {
      setGuestName("");
      setRoomSlug(dragBooking.roomSlug);
      setDateRange({
        from: dragBooking.startDate,
        to: dragBooking.endDate
      });
      // Seleccionar un color aleatorio para la nueva reserva por drag
      const randomColor = BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)];
      setSelectedColor(randomColor);
    } else {
      setGuestName("");
      setRoomSlug("");
      setDateRange(undefined);
      // Seleccionar un color aleatorio solo al crear
      const randomColor = BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)];
      setSelectedColor(randomColor);
    }
    setError(null);
  }, [editingBooking, dragBooking, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!roomSlug) {
      setError("Debes seleccionar una habitación");
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      setError("Debes seleccionar las fechas de la reserva");
      return;
    }

    // Verificar conflictos
    const hasConflict = checkBookingConflict(
      roomSlug,
      dateRange.from,
      dateRange.to,
      editingBooking?.id,
    );
    if (hasConflict) {
      setError("La habitación ya está reservada para las fechas seleccionadas");
      return;
    }

    // Intentar guardar
    const success = onSave({
      guestName: guestName.trim() || "Reservado",
      roomSlug,
      startDate: dateRange.from,
      endDate: dateRange.to,
      notes: "",
      color: selectedColor,
    });

    if (success) {
      onClose();
    }
  };

  const getModalTitle = () => {
    if (editingBooking) return "Editar Reserva";
    return "Crear Reserva";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="border-neutral-200 bg-white p-5 sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg font-medium text-[hsl(317.8,52.9%,10%)]">
              {getModalTitle()}
            </DialogTitle>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="h-4 w-4 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-2 transition-all"
                  style={{ backgroundColor: selectedColor }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-6 gap-2">
                  {BOOKING_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "h-8 w-8 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                        selectedColor === color && "ring-2 ring-offset-2"
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-[hsl(317.8,52.9%,10%,0.8)]">
              Fechas
            </Label>
            <DatesSelector
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="room"
              className="text-sm text-[hsl(317.8,52.9%,10%,0.8)]"
            >
              Habitación
            </Label>
            <Select value={roomSlug} onValueChange={setRoomSlug}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Selecciona una habitación" />
              </SelectTrigger>
              <SelectContent>
                {ROOMS.map((room) => (
                  <SelectItem key={room.slug} value={room.slug}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="guestName"
              className="text-sm text-[hsl(317.8,52.9%,10%,0.8)]"
            >
              Huésped{" "}
              <span className="text-[hsl(317.8,52.9%,10%,0.6)]">
                (opcional)
              </span>
            </Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Nombre completo o dejar vacío"
              className="h-9"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-2.5">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-9 bg-[hsl(314,80%,71%)] text-white hover:bg-[hsl(314,80%,61%)]"
            >
              {editingBooking ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
