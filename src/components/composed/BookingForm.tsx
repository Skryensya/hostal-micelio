"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { differenceInDays, addDays, startOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Room, Booking } from "@/lib/types";
import ROOMS from "../../../db/ROOMS.json";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  room: Room | null;
  dayNumber: number | null;
  onSave: (booking: Omit<Booking, "id" | "color">) => void;
  onClose: () => void;
  editingBooking?: Booking;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  room,
  dayNumber,
  onSave,
  onClose,
  editingBooking,
}) => {
  const monthStart = startOfMonth(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (editingBooking) {
      return {
        from: addDays(monthStart, editingBooking.startDay - 1),
        to: addDays(monthStart, editingBooking.endDay - 1),
      };
    }
    const startDate = dayNumber
      ? addDays(monthStart, dayNumber - 1)
      : new Date();
    return {
      from: startDate,
      to: startDate,
    };
  });

  const [formData, setFormData] = useState({
    roomSlug: editingBooking?.roomSlug || room?.slug || "",
    guestName: editingBooking?.guestName || "",
    description: editingBooking?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.roomSlug ||
      !formData.guestName ||
      !dateRange?.from ||
      !dateRange?.to
    )
      return;

    const startDay = differenceInDays(dateRange.from, monthStart) + 1;
    const endDay = differenceInDays(dateRange.to, monthStart) + 1;

    onSave({
      roomSlug: formData.roomSlug,
      startDay,
      endDay,
      startDate: dateRange.from,
      endDate: dateRange.to,
      guestName: formData.guestName,
      description: formData.description,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Habitación</Label>
          <select
            value={formData.roomSlug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, roomSlug: e.target.value }))
            }
            className="border-input bg-background ring-offset-background w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Seleccionar</option>
            {ROOMS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guestName">Huésped</Label>
          <Input
            id="guestName"
            value={formData.guestName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, guestName: e.target.value }))
            }
            placeholder="Nombre completo"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fechas</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "d MMM", { locale: es })} -{" "}
                    {format(dateRange.to, "d MMM", { locale: es })}
                  </>
                ) : (
                  format(dateRange.from, "d MMM", { locale: es })
                )
              ) : (
                <span>Seleccionar fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              locale={es}
              disabled={{ before: new Date() }}
              showOutsideDays={false}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Notas adicionales</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Detalles adicionales de la reserva..."
        />
      </div>

      <DrawerFooter className="px-0">
        <div className="flex gap-2">
          <DrawerClose asChild>
            <Button variant="outline" size="small" className="flex-1">
              Cancelar
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            size="small"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Guardar
          </Button>
        </div>
      </DrawerFooter>
    </form>
  );
};
