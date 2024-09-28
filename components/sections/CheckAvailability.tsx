"use client";
import React, { useState } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { GuestSelector } from "@/components/GuestSelector";
import { Button } from "../ui/button";
import { checkAvailabilityTemplate } from "@/lib/whatsapp_templates/availability";

export function CheckAvailability() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectionFunction, setSelectionFunction] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });

  const handleWhatsAppClick = () => {
    const whatsappLink = checkAvailabilityTemplate(
      dateRange,
      selectionFunction
    );
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="container mx-auto py-2">
      <div className=" flex justify-between border border-border-light rounded-lg p-4 bg-surface-light dark:bg-surface-dark bg-white ">
        <div className="flex items-center justify-center gap-4 ">
          <span className="font-bold">Fecha:</span>
          <DateRangePicker setDateRange={setDateRange} />
          <span className="font-bold">Huéspedes:</span>
          <GuestSelector setSelectionFunction={setSelectionFunction} />
        </div>
        <div>
          <Button onClick={handleWhatsAppClick}>
            Consultar disponibilidad
          </Button>
        </div>
      </div>
    </div>
  );
}
