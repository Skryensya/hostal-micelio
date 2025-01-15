"use client";

import React, { useState } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { GuestSelector } from "@/components/GuestSelector";
import { RoomSelector } from "@/components/RoomSelector";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { StayingTypeSelector } from "./StayingTypeSelector";

type OpenSection = "dates" | "guests" | "rooms" | null;

const formatDateInSpanish = (from: Date | undefined, to: Date | undefined) => {
  return from && to
    ? `${format(from, "d 'de' MMMM", { locale: es })} - ${format(
        to,
        "d 'de' MMMM",
        { locale: es }
      )}`
    : "Agregar fecha";
};

export const MobileView: React.FC = () => {
  const [openSection, setOpenSection] = useState<OpenSection>("dates");
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(
    "Agregar fechas"
  );

  const handleSelectDate = (from: Date | undefined, to: Date | undefined) => {
    setSelectedDateLabel(formatDateInSpanish(from, to));
  };

  return (
    <div className="md:hidden flex justify-center items-center my-10">
      <Dialog>
        <DialogTrigger asChild>
          <div className={cn(buttonVariants({ variant: "outline" }))}>
            Open Dialog
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="h-fit">
            <DialogTitle className="hidden">Cotiza tu estadía</DialogTitle>
            <StayingTypeSelector />
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2 px-4 h-full">
            {openSection === "dates" ? (
              <DateRangePicker
                onSelect={(from, to) => {
                  handleSelectDate(from, to);
                }}
              />
            ) : (
              <SectionButton
                title="Cuando"
                description={selectedDateLabel}
                onClick={() => setOpenSection("dates")}
              />
            )}
            {openSection === "guests" ? (
              <GuestSelector />
            ) : (
              <SectionButton
                title="Quiénes"
                description=""
                onClick={() => setOpenSection("guests")}
              />
            )}
            {openSection === "rooms" ? (
              <RoomSelector />
            ) : (
              <SectionButton
                title="Habitaciones"
                description=""
                onClick={() => setOpenSection("rooms")}
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <div className={cn(buttonVariants({ variant: "outline" }))}>
                Close
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SectionButton: React.FC<{
  title: string;
  description: string;
  onClick: () => void;
}> = ({ title, description, onClick }) => {
  return (
    <div
      className={cn(buttonVariants({ variant: "outline" }))}
      onClick={onClick}
    >
      {title}
      <p className="text-sm text-primary-light-30 dark:text-primary-dark-30">
        {description}
      </p>
    </div>
  );
};
