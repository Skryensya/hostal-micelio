"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/useSelectionStore";

export const StayingTypeSelector: React.FC = () => {
  const { selectedTab, setSelectedTab } = useSelectionStore(); // Use the store

  return (
    <div className="mx-auto flex justify-center w-4/12">
      <button
        className={cn(
          `w-fit cursor-pointer px-2 py-2 text-lg`,
          selectedTab === "hospedaje" ? "font-bold" : ""
        )}
        onClick={() => setSelectedTab("hospedaje")}
      >
        Hospedaje
      </button>
      <button
        className={cn(
          `w-fit cursor-pointer px-2 py-2 text-lg whitespace-nowrap `,
          selectedTab === "larga-estadia" ? "font-bold" : ""
        )}
        onClick={() => setSelectedTab("larga-estadia")}
      >
        Larga estadía
      </button>
    </div>
  );
};
