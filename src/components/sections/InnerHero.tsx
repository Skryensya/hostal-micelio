"use client";

import React, { useRef } from "react";

import { WavyDivider } from "@/components/composed/WavyDivider";

export function InnerHero({ title }: { title?: string }) {
  const endOfHeroRef = useRef<HTMLDivElement>(null);

  const handleSkipToContent = () => {
    endOfHeroRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Hidden Skip Hero Button */}
      <button
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-text-dark px-4 py-2 rounded-md z-10"
        tabIndex={0}
      >
        Saltar Hero
      </button>

      <div className="bg-room-gradient">
        <div className="h-[200px] container flex items-center">
          {title && (
            <div className="flex flex-col justify-end h-full">
              <h1 className="text-3xl md:text-4xl pb-6 text-text-light ">
                {title}
              </h1>
            </div>
          )}
        </div>
      </div>
      <WavyDivider backgroundClass="bg-surface-1" />
      <div
        ref={endOfHeroRef}
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      ></div>
    </div>
  );
}
