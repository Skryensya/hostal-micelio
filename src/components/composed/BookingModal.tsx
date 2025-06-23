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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeSelector } from "./DateRangeSelector";
import { startOfDay } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, "id" | "color">) => boolean;
  editingBooking?: Booking;
  checkBookingConflict: (roomSlug: string, startDate: Date, endDate: Date, excludeBookingId?: string) => boolean;
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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingBooking) {
      setGuestName(editingBooking.guestName);
      setRoomSlug(editingBooking.roomSlug);
      setStartDate(editingBooking.startDate);
      setEndDate(editingBooking.endDate);
      setDescription(editingBooking.description || "");
    } else {
      setGuestName("");
      setRoomSlug("");
      setStartDate(undefined);
      setEndDate(undefined);
      setDescription("");
    }
    setError(null);
  }, [editingBooking, isOpen]);

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    if (start) setStartDate(startOfDay(start));
    if (end) setEndDate(startOfDay(end));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!guestName.trim()) {
      setError("El nombre del huésped es requerido");
      return;
    }
    if (!roomSlug) {
      setError("Debes seleccionar una habitación");
      return;
    }
    if (!startDate || !endDate) {
      setError("Debes seleccionar las fechas de la reserva");
      return;
    }

    // Verificar conflictos
    const hasConflict = checkBookingConflict(roomSlug, startDate, endDate, editingBooking?.id);
    if (hasConflict) {
      setError("La habitación ya está reservada para las fechas seleccionadas");
      return;
    }

    // Intentar guardar
    const success = onSave({
      guestName,
      roomSlug,
      startDate,
      endDate,
      description: description.trim() || undefined,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingBooking ? "Editar Reserva" : "Nueva Reserva"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Nombre del Huésped</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Habitación</Label>
            <Select value={roomSlug} onValueChange={setRoomSlug}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Fechas</Label>
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas adicionales"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingBooking ? "Guardar Cambios" : "Crear Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 