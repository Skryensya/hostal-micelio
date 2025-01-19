"use client";

import React, { useState } from "react";
import { DateRangePicker } from "@/components/sections/CheckAvailabiliy/components/DateRangePicker";
import { GuestSelector } from "@/components/sections/CheckAvailabiliy/components/GuestSelector";
// import { RoomSelector } from "@/components/RoomSelector";
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
import { StayingTypeSelector } from "./components/StayingTypeSelector";
import { SectionButton } from "./components/SectionButton";
import { useSelectionStore } from "@/store/useSelectionStore";

type OpenSection = "dates" | "guests" | "rooms" | null;

const formatDateInSpanish = (from: Date | undefined, to: Date | undefined) => {
  return from && to
    ? `${format(from, "d 'de' MMM", { locale: es })} - ${format(
        to,
        "d 'de' MMM",
        { locale: es }
      )}`
    : "Agregar fecha";
};

export const MobileView: React.FC = () => {
  const { dateRange } = useSelectionStore();
  const [openSection, setOpenSection] = useState<OpenSection>("guests");
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(
    "Agregar fechas"
  );

  // useEffect
  React.useEffect(() => {
    if (dateRange) {
      setSelectedDateLabel(formatDateInSpanish(dateRange.from, dateRange.to));
    }
  }, [dateRange]);

 

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
            <ButtonWrapper>
              <SectionButton
                title="¿Quiénes te acompañan?"
                description=""
                onClick={() => setOpenSection("guests")}
                isSelected={openSection === "guests"}
              >
                {openSection === "guests" && <GuestSelector />}
              </SectionButton>
            </ButtonWrapper>
            <ButtonWrapper>
              <SectionButton
                title="¿Cuando viajas?"
                description={selectedDateLabel}
                onClick={() => setOpenSection("dates")}
                isSelected={openSection === "dates"}
              >
                {openSection === "dates" && (
                  <DateRangePicker
                    onSelect={(from, to) => {
                      handleSelectDate(from, to);
                    }}
                  />
                )}
              </SectionButton>
            </ButtonWrapper>

            {/* <ButtonWrapper>
              {openSection === "rooms" ? (
                <RoomSelector />
              ) : (
                <SectionButton
                  title="Habitaciones"
                  description=""
                  onClick={() => setOpenSection("rooms")}
                />
              )}
            </ButtonWrapper> */}
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

const ButtonWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="rounded-standar border border-border-light dark:border-border-dark transition-all duration-300 bg-surface-light dark:bg-surface-2-dark">
      {children}
    </div>
  );
};
