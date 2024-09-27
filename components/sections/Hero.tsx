import React from "react";
import Image from "next/image";
// import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <div className="h-[100dvh] pt-32 border-b border-b-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-6/12">
          <Image
            src="/assets/LOGO_COLOR.png"
            alt="Hero"
            className=" object-cover  "
            priority
            unoptimized
            width={100}
            height={100}
          />
        </div>
        <div className="py-20 w-full text-center bg-red-500">
          <h1>Conoce el hostal micelio</h1>
        </div>
      </div>
    </div>
  );
}
