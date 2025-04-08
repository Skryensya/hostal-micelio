"use client";

import type React from "react";
import { useState } from "react";
import { Bed, Home, Info, User, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Diccionario para obtener los detalles de cada cama
const bedTypes: Record<
  string,
  { name: string; size: string; capacity: number; icon: React.ReactNode }
> = {
  B01: {
    name: "Cama Matrimonial",
    size: "matrimonial",
    capacity: 2,
    icon: <Users className="w-4 h-4" />,
  },
  B02: {
    name: "Cama Individual",
    size: "1,5",
    capacity: 1,
    icon: <User className="w-4 h-4" />,
  },
  B03: {
    name: "Cama Litera",
    size: "literas",
    capacity: 1,
    icon: <Bed className="w-4 h-4" />,
  },
};

interface RoomConfigurationToggleProps {
  beds: string[]; // Ejemplo: ["B01", "B02", "B03", "B02"]
}

interface OptionCardProps {
  optionId: string;
  selectedOption: string;
  onClick: () => void;
  label: string;
  capacity: number;
  tooltipContent: string;
  icon?: React.ReactNode;
  count?: number;
}



export const RoomConfigurationToggle: React.FC<
  RoomConfigurationToggleProps
> = ({ beds }) => {
  // "full" representa la opción de usar la habitación completa.
  const [selectedOption, setSelectedOption] = useState<string>("full");

  // Capacidad total sumando cada cama (incluyendo duplicados)
  const fullCapacity = beds.reduce(
    (total, bedId) => total + (bedTypes[bedId]?.capacity || 0),
    0
  );

  // Agrupamos la cantidad de cada tipo de cama
  const bedCount: Record<string, number> = {};
  beds.forEach((bedId) => {
    if (bedTypes[bedId]) {
      bedCount[bedId] = (bedCount[bedId] || 0) + 1;
    }
  });

  // Obtenemos los IDs únicos para las opciones individuales (sin duplicados)
  const uniqueBedIds = Array.from(new Set(beds));

  // Texto del tooltip para la opción "Habitación completa"
  const fullTooltipText = uniqueBedIds
    .map((bedId) => {
      const count = bedCount[bedId];
      const bed = bedTypes[bedId];
      return `${bed.name}${count > 1 ? ` (${count}x)` : ""} (Capacidad: ${
        bed.capacity * count
      })`;
    })
    .join(", ");

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <h2 className="!text-base !font-medium font-body mb-1">Configuraciones disponibles</h2>

        <div className="flex w-full gap-2 mb-2">
          {/* Opción: Habitación completa */}
          <OptionCard
            optionId="full"
            selectedOption={selectedOption}
            onClick={() => setSelectedOption("full")}
            label="Habitación completa"
            capacity={fullCapacity}
            tooltipContent={fullTooltipText}
            icon={<Home className="w-3 h-3" />}
          />

          {/* Opciones: Arrendar individualmente cada cama (sin duplicados) */}
          {uniqueBedIds.map((bedId) => {
            const bed = bedTypes[bedId];
            const count = bedCount[bedId];

            // Texto del tooltip para cada cama individual
            const bedTooltipText = `${bed.name} (Tamaño: ${bed.size})`;

            return (
              <OptionCard
                key={bedId}
                optionId={bedId}
                selectedOption={selectedOption}
                onClick={() => setSelectedOption(bedId)}
                label={bed.name}
                capacity={bed.capacity}
                tooltipContent={bedTooltipText}
                icon={bed.icon}
                count={count}
              />
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};


// Componente reutilizable para cada opción como tarjeta
const OptionCard: React.FC<OptionCardProps> = ({
  optionId,
  selectedOption,
  onClick,
  label,
  capacity,
  tooltipContent,
  icon,
  count,
}) => {
  const isActive = optionId === selectedOption;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 h-full w-full border ${
        isActive
          ? "ring-2 ring-primary shadow-md"
          : "hover:shadow-md hover:border-primary/50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="!text-base !font-medium font-body">{label}</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center mt-auto pt-2">
            <Badge
              variant={isActive ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              {icon || <Users className="w-3 h-3" />}
              <span>
                {capacity} {capacity === 1 ? "persona" : "personas"}
              </span>
            </Badge>

            {count && count > 1 && (
              <Badge variant="secondary" className="ml-2">
                x{count}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};