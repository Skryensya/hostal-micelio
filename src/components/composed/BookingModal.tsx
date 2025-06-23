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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, "id" | "color">) => boolean;
  editingBooking?: Booking;
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
  checkBookingConflict,
}: BookingModalProps) {
  const [guestName, setGuestName] = useState("");
  const [roomSlug, setRoomSlug] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingBooking) {
      setGuestName(editingBooking.guestName);
      setRoomSlug(editingBooking.roomSlug);
      setDateRange({
        from: editingBooking.startDate,
        to: editingBooking.endDate
      });
    } else {
      setGuestName("");
      setRoomSlug("");
      setDateRange(undefined);
    }
    setError(null);
  }, [editingBooking, isOpen]);

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
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="border-neutral-200 bg-white p-5 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-[hsl(317.8,52.9%,10%)]">
            {editingBooking ? "Editar Reserva" : "Nueva Reserva"}
          </DialogTitle>
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
