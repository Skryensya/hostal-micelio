"use client";

// import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { LightEffect } from "./ui/LightEffect";

export function RoomSelector() {
  return (
    <Link
      href="/habitaciones"
      className={cn(
        "relative transition-all duration-300 flex rounded-standar hover:bg-primary-light-20"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start rounded-standar px-6 py-3  min-w-[300px]"
        )}
        onClick={() => {}}
      >
        <div className="flex items-center font-bold text-sm">Habitaciones</div>
        <div>Encuentra tu mejor opción</div>

        <div className="flex items-center">
          <div
            className={cn(
              buttonVariants({
                variant: "primary",
                size: "icon",
              }),
              "absolute right-0 top-0 -translate-x-1/2 translate-y-1/2"
            )}
          >
            <LightEffect />
            <SendHorizontal className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
