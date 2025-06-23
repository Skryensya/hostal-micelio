"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/useSelectionStore";

export const StayingTypeSelector: React.FC = () => {
  const { selectedTab, setSelectedTab } = useSelectionStore(); // Use the store

  return (
    <div className="mx-auto flex items-center justify-center  w-8/12 lg:w-4/12 !mt-0 rounded-standard lg:rounded-none px-2  ">
      <button
        className={cn(
          `w-fit cursor-pointer px-2 py-2 text-lg`,
          selectedTab === "hospedaje"
            ? "font-extrabold"
            : "font-thin opacity-70"
        )}
        onClick={() => setSelectedTab("hospedaje")}
      >
        Hospedaje
      </button>
      <button
        className={cn(
          `w-fit cursor-pointer px-2 py-2 text-lg whitespace-nowrap `,
          selectedTab === "larga-estadia"
            ? "font-extrabold"
            : "font-thin opacity-70"
        )}
        onClick={() => setSelectedTab("larga-estadia")}
      >
        Larga estadía
      </button>
    </div>
  );
};
