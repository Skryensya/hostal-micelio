"use client";

// import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomSelector() {
  return (
    <a
      href="#habitaciones"
      className={cn(
        "relative transition-all duration-300 flex rounded-standard hover:bg-primary-light-20"
      )}
    >
      <div
        className={cn(
          "flex  items-center justify-between rounded-standard pl-6 pr-4 py-3  min-w-[300px]"
        )}
        onClick={() => {}}
      >
        <div className="flex flex-col items-start">
          <div className="flex items-center font-bold text-sm">
            Habitaciones
          </div>
          <div>Encuentra tu mejor opción</div>
        </div>

        <div className="flex items-center">
          <div
            className={cn(
              buttonVariants({
                variant: "primary",
                size: "icon",
              })
            )}
          >
            <SendHorizontal className="h-5 w-5" />
          </div>
        </div>
      </div>
    </a>
  );
}
