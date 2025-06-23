"use client";

import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { Booking } from "@/lib/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, "id" | "color">) => void;
  editingBooking?: Booking;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBooking,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {editingBooking ? "Editar Reserva" : "Nueva Reserva"}
          </DialogTitle>
        </DialogHeader>

        <BookingForm
          room={null}
          dayNumber={null}
          onSave={onSave}
          onClose={onClose}
          editingBooking={editingBooking}
        />
      </DialogContent>
    </Dialog>
  );
}; 