"use client";

import React, { useRef } from "react";

import { WavyDivider } from "@/components/composed/WavyDivider";

export function InnerHero({ title }) {
  const endOfHeroRef = useRef<HTMLDivElement>(null);

  const handleSkipToContent = () => {
    endOfHeroRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Hidden Skip Hero Button */}
      <button
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-10"
        tabIndex={0}
      >
        Saltar Hero
      </button>

      <div className="bg-room-gradient">
        <div className="h-60 max-h-[40dvh] container flex items-center">
          <div>
            <h1 className="text-4xl">{title}</h1>
          </div>
        </div>
      </div>
      <WavyDivider
        backgroundClassNames={[
          "bg-white/50",
          "bg-surface-light",
          "bg-surface-light",
        ]}
      />
      <div
        ref={endOfHeroRef}
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      ></div>
    </div>
  );
}
