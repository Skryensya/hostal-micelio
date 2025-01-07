"use client";
import React, { useState } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { GuestSelector } from "@/components/GuestSelector";
import { Button } from "../ui/button";
import { useSelectionStore } from "@/store/useSelectionStore";
import { cn } from "@/lib/utils";

export function CheckAvailability() {
  const [selectedTab, setSelectedTab] = useState("hospedaje");

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const getWhatsAppLink = useSelectionStore((state) => state.getWhatsAppLink);

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppLink(), "_blank");
  };

  // const isLargaEstadia = selectedTab === "largaEstadia";
  // const isHospedaje = selectedTab === "hospedaje";

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto flex justify-center w-4/12">
        <button
          className={cn(
            ` w-fit cursor-pointer px-2 py-2 text-lg`,
            selectedTab === "hospedaje" ? "font-bold" : ""
          )}
          onClick={() => handleTabChange("hospedaje")}
        >
          Hospedaje
        </button>
        <button
          className={cn(
            `w-fit cursor-pointer px-2 py-2 text-lg`,
            selectedTab === "largaEstadia" ? "font-bold" : ""
          )}
          onClick={() => handleTabChange("largaEstadia")}
        >
          Larga estadía
        </button>
      </div>

      <div className="">
        <div className="flex flex-col items-center gap-y-4 md:flex-row flex-shrink rounded-[40px] md:rounded-full shadow-xl shadow-primary-light-10 p-1 bg-primary-light-30">
          <DateRangePicker />
          <GuestSelector />
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
