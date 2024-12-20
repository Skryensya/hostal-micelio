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
  });

  const handleWhatsAppClick = () => {
    const whatsappLink = checkAvailabilityTemplate(
      dateRange,
      selectionFunction
    );
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="container mx-auto py-8">
      <div className=" flex flex-col gap-4 md:flex-row justify-between rounded-[40px] md:rounded-full py-6 px-6 md:px-12 shadow-xl shadow-primary-light-10 bg-primary-light-30">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-center gap-4 ">
          <div className="w-full flex flex-col md:flex-row   items-start md:items-center md:justify-center gap-1 md:gap-4">
            <div className="font-bold flex">
              Fecha
              <div className="block md:hidden pl-[0.3rem]"> de estadía</div>
            </div>
            <DateRangePicker setDateRange={setDateRange} />
          </div>
          <div className="w-full flex flex-col md:flex-row  items-start md:items-center md:justify-center  gap-1 md:gap-4">
            <span className="font-bold">Huéspedes</span>
            <GuestSelector setSelectionFunction={setSelectionFunction} />
          </div>
        </div>
        <div>
          <Button
            onClick={handleWhatsAppClick}
            className="bg-primary-light w-full md:w-fit"
          >
            Consultar disponibilidad
          </Button>
        </div>
      </div>
    </div>
  );
}
