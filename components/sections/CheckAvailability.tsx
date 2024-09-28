"use client";
import React, { useState } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { GuestSelector } from "@/components/GuestSelector";
import { Button } from "../ui/button";

const generateWhatsAppLink = (dateRange, guests) => {
  //   const phoneNumber = "56975999319";
  const phoneNumber = "56998120052";
  const { adults, children, pets } = guests;

  let message = "Hola, estoy consultando disponibilidad para ";

  const guestParts = [];
  if (adults > 0)
    guestParts.push(`_*${adults} adulto${adults > 1 ? "s" : ""}*_`);
  if (children > 0)
    guestParts.push(`_*${children} niño${children > 1 ? "s" : ""}*_`);
  if (pets > 0) guestParts.push(`_*${pets} mascota${pets > 1 ? "s" : ""}*_`);

  message +=
    guestParts.length > 1
      ? guestParts.slice(0, -1).join(", ") + " y " + guestParts.slice(-1)
      : guestParts[0];

  if (dateRange?.from) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedFromDate = dateRange.from.toLocaleDateString(
      "es-ES",
      options
    );
    message += `, para el día *${formattedFromDate}*`;

    if (dateRange.to && dateRange.to > dateRange.from) {
      const formattedToDate = dateRange.to.toLocaleDateString("es-ES", options);
      message += ` hasta el *${formattedToDate}*`;

      const nights = Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const days = nights + 1;
      message += ` (*${days}* día${days > 1 ? "s" : ""} / *${nights}* noche${
        nights > 1 ? "s" : ""
      })`;
    }
  }

  message += " ¿tienen habitaciones disponibles?";

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export function CheckAvailability() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectionFunction, setSelectionFunction] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });

  const handleWhatsAppClick = () => {
    const whatsappLink = generateWhatsAppLink(dateRange, selectionFunction);
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
