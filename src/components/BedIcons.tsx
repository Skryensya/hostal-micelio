"use client";

import React, { useMemo } from "react";
// Se importan los iconos necesarios
import { Bed, BedDouble } from "lucide-react";
import TYPES_OF_BEDS from "@/db/TYPES_OF_BEDS.json";
import { BunkBed } from "@/lib/icons";

export interface BedIconsProps {
  beds?: string[];
}

export default function BedIcons({ beds }: BedIconsProps) {
  // Agrupar los IDs de camas para contar la cantidad por tipo
  const groupedBeds = useMemo(() => {
    if (!beds) return {} as Record<string, number>;
    return beds.reduce((acc, bedId) => {
      acc[bedId] = (acc[bedId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [beds]);

  // Calcular los pares de literas:
  // B03 es la litera de abajo y B04 la de arriba. Se necesita al menos una de cada.
  const bunkPairs = useMemo(() => {
    const countB03 = groupedBeds["B03"] || 0;
    const countB04 = groupedBeds["B04"] || 0;
    return Math.min(countB03, countB04);
  }, [groupedBeds]);

  // Filtrar las camas que no sean literas (B03 y B04)
  const nonBunkGroupedBeds = useMemo(() => {
    const result: Record<string, number> = {};
    Object.entries(groupedBeds).forEach(([bedId, count]) => {
      if (bedId !== "B03" && bedId !== "B04") {
        result[bedId] = count;
      }
    });
    return result;
  }, [groupedBeds]);

  // Función para elegir el icono según el tipo de cama
  const getBedIcon = (bedId: string) => {
    const bedInfo = TYPES_OF_BEDS[bedId];
    if (!bedInfo) return Bed; // fallback a icono simple
    if (bedInfo.size === "matrimonial") return BedDouble;
    // Para "1.5 plaza", "1 plaza" o camas chicas se usa el icono simple
    return Bed;
  };

  return (
    <div className="absolute bottom-2 left-2 flex gap-1">
      {bunkPairs > 0 && (
        <div className="flex items-center gap-1" title="Cama litera">
          {/* BunkBed se renderiza sin className */}
          <BunkBed />
          <span className="text-xs font-bold">
            {bunkPairs} {bunkPairs === 1 ? "litera" : "literas"}
          </span>
        </div>
      )}

      {Object.entries(nonBunkGroupedBeds).map(([bedId, count]) => {
        const bedInfo = TYPES_OF_BEDS[bedId];
        if (!bedInfo) return null;
        const Icon = getBedIcon(bedId);
        return (
          <div key={bedId} className="flex items-center gap-1" title={bedInfo.name}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-bold">
              {count} {count === 1 ? "cama" : "camas"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
