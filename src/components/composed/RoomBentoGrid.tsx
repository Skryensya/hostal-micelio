"use client";

import React, { useMemo } from "react";
import {
  EggFried,
  Home,
  Toilet,
  CookingPot,
  Wifi,
  Mars,
  Venus,
  KeyRound,
  BedDouble,
  BedSingle,
  Users,
  Bath,
  Tag,
} from "lucide-react";
import { BunkBed } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Domain types
 * ---------------------------------------------------------------------------
 */

type Amenity = {
  id: string;
  label: string;
  /** Marks items that should appear first in the grid */
  featured?: boolean;
  /** Allows overriding the default color palette (Tailwind hue) */
  color?: string;
  /** Optional sort key */
  order?: number;
};

interface RoomBentoGridProps {
  amenities: Amenity[];
  beds: string[];
  capacity: number;
  hasPrivateToilet: boolean;
  formatLabel?: string;
  /** Precio por noche en pesos CLP */
  price?: number;
}

/**
 * Icons & static dictionaries
 * ---------------------------------------------------------------------------
 */

const AMENITY_ICONS = {
  breakfast: EggFried,
  "shared-bathroom": Toilet,
  "shared-spaces": Home,
  "private-bathroom": Toilet,
  "shared-kitchen": CookingPot,
  wifi: Wifi,
  "male-only-room": Mars,
  "female-only-room": Venus,
} as const;

type BedId = "B01" | "B02" | "B03";

const BED_ICONS: Record<BedId, React.ComponentType<{ className?: string }>> = {
  B01: BedDouble,
  B02: BedSingle,
  B03: BunkBed,
};

const BED_LABELS: Record<BedId, string> = {
  B01: "Cama matrimonial",
  B02: "Cama individual",
  B03: "Camarote",
};

type ColorSet = {
  bg: string;
  border: string;
  text: string;
  accent: string;
};

/** Quickly build a color palette from a Tailwind hue (e.g. "rose", "cyan") */
function makeColorSet(hue: string): ColorSet {
  return {
    bg: `bg-${hue}-50/50`,
    border: `border-${hue}-200/60`,
    text: `text-${hue}-700`,
    accent: `text-${hue}-500`,
  };
}

const AMENITY_COLORS: Record<string, ColorSet> = {
  breakfast: makeColorSet("orange"),
  "shared-bathroom": makeColorSet("cyan"),
  "shared-spaces": makeColorSet("indigo"),
  "private-bathroom": makeColorSet("blue"),
  "shared-kitchen": makeColorSet("amber"),
  wifi: makeColorSet("purple"),
  "male-only-room": makeColorSet("sky"),
  "female-only-room": makeColorSet("pink"),
};

const BED_COLORS: Record<BedId, ColorSet> = {
  B01: makeColorSet("rose"),
  B02: makeColorSet("blue"),
  B03: makeColorSet("emerald"),
};

/**
 * Component
 * ---------------------------------------------------------------------------
 */

export const RoomBentoGrid: React.FC<RoomBentoGridProps> = ({
  amenities,
  beds,
  capacity,
  hasPrivateToilet,
  formatLabel,
  price,
}) => {
  /**
   * 1️⃣ Normalise beds so that both halves of a bunk (B04) collapse into B03.
   *    This avoids duplicate cards and keeps the count correct.
   */
  const bedCounts = useMemo(() => {
    const counts: Record<BedId, number> = { B01: 0, B02: 0, B03: 0 } as Record<BedId, number>;

    beds.forEach((id) => {
      const canonical = (id === "B04" ? "B03" : id) as BedId;
      counts[canonical] = (counts[canonical] ?? 0) + 1;
    });

    return counts;
  }, [beds]);

  /**
   * 2️⃣ Sort amenities: featured first, then by custom order, finally alphabetically.
   */
  const sortedAmenities = useMemo(() => {
    return [...amenities]
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.order ?? 0) - (b.order ?? 0);
      })
      .slice(0, 8); // grid feels cramped with more than 12 cards
  }, [amenities]);

  /**
   * 3️⃣ Helper to render a single card with a consistent layout.
   */
  const renderBadge = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    colors: ColorSet = makeColorSet("gray"),
    key?: React.Key,
  ) => (
    <Card
      key={key ?? title}
      className={cn(
        "flex items-center gap-3 p-4 border hover:shadow-sm transition-shadow",
        colors.bg,
        colors.border,
      )}
    >
      <div className={cn("p-2 rounded-lg", colors.bg)}>{icon}</div>
      <div className="min-w-0">
        <p className={cn("text-sm font-medium truncate", colors.text)}>{title}</p>
        <p className={cn("text-xs", colors.text, "opacity-70")}>{subtitle}</p>
      </div>
    </Card>
  );

  /**
   * Render
   * -------------------------------------------------------------------------
   */
  return (
    <section aria-labelledby="room-details">
      <h2 id="room-details" className="mb-4 text-2xl font-bold text-gray-900">
        Detalles de la habitación
      </h2>

      {/*
        * Using auto-fit / minmax keeps cards square-ish and fills space naturally
        * across breakpoints without hard‑coding column counts per viewport.
        */}
      <div className="grid auto-rows-[1fr] grid-cols-2 gap-4 md:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] xl:gap-5">
        {/* Capacity */}
        {renderBadge(<Users className="h-5 w-5 text-gray-600" />, "Capacidad", `${capacity} personas`)}

        {/* Bathroom */}
        {renderBadge(
          <span className="relative">
            <Bath className="h-5 w-5 text-cyan-600" />
            {hasPrivateToilet && <KeyRound className="absolute -right-1 -top-1 h-3 w-3 text-yellow-500" />}
          </span>,
          "Baño",
          hasPrivateToilet ? "Privado" : "Compartido",
          makeColorSet("cyan"),
        )}

        {/* Format */}
        {formatLabel &&
          renderBadge(
            <Tag className="h-5 w-5 text-indigo-600" />,
            "Formato",
            formatLabel,
            makeColorSet("indigo"),
          )}

        {/* Price (optional) */}
        {typeof price === "number" &&
          renderBadge(
            <span className="font-semibold text-green-600">$</span>,
            "Precio por noche",
            new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
            }).format(price),
            makeColorSet("green"),
          )}

        {/* Beds */}
        {Object.entries(bedCounts).map(([bedId, count]) => {
          if (!count) return null; // skip 0 entries
          const id = bedId as BedId;
          const Icon = BED_ICONS[id];
          const colors = BED_COLORS[id];
          const label = BED_LABELS[id];

          return renderBadge(
            <Icon className={cn("h-5 w-5", colors.accent)} />,
            count > 1 ? `${count}x ${label}` : label,
            id === "B01" ? "Matrimonial" : id === "B02" ? "Individual" : "Camarote",
            colors,
            id,
          );
        })}

        {/* Amenities */}
        {sortedAmenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity.id as keyof typeof AMENITY_ICONS] ?? (() => <span className="w-5" />);
          const colors = amenity.color ? makeColorSet(amenity.color) : AMENITY_COLORS[amenity.id] ?? makeColorSet("gray");

          return renderBadge(
            <Icon className={cn("h-5 w-5", colors.accent)} />,
            amenity.label,
            "Incluido",
            colors,
            amenity.id,
          );
        })}
      </div>
    </section>
  );
};
