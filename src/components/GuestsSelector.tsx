"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Users, Baby, AlertTriangle, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/useSelectionStore";
import { getRoomColorsByFormat, getRoomGradientColor } from "@/lib/roomColors";
import { Room } from "@/lib/types";
import { useEffect } from "react";
import ROOM_FORMATS from "@/db/ROOM_FORMATS.json";
import Link from "next/link";

// Mapeo de capacidades por formato
const FORMAT_CAPACITIES: Record<string, number> = {
  "HIN": 1, // Individual
  "HDB": 2, // Doble
  "HMA": 2, // Matrimonial
  "HT": 3,  // Triple
  "HCO": 6, // Compartida (máxima capacidad)
};

interface CounterButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  gradientColor?: string;
  selectedFormat?: any;
}

function CounterButton({ onClick, disabled, children, gradientColor, selectedFormat }: CounterButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 rounded-full",
        selectedFormat && [
          `border-2 border-${getRoomColorsByFormat(selectedFormat.id).border}`,
          `hover:bg-${getRoomColorsByFormat(selectedFormat.id).bgHover}`,
        ],
      )}
      style={{
        borderColor: gradientColor ? `${gradientColor}50` : undefined,
        color: gradientColor || undefined,
      }}
    >
      {children}
    </Button>
  );
}

interface GuestCounterProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue: number;
  gradientColor?: string;
  selectedFormat?: any;
}

function GuestCounter({ 
  label, 
  icon, 
  value, 
  onIncrement, 
  onDecrement, 
  minValue, 
  gradientColor, 
  selectedFormat 
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <CounterButton
          onClick={onDecrement}
          disabled={value <= minValue}
          gradientColor={gradientColor}
          selectedFormat={selectedFormat}
        >
          <Minus className="h-3 w-3" />
        </CounterButton>
        <span 
          className="w-8 text-center text-sm font-medium"
          style={{ color: gradientColor || undefined }}
        >
          {value}
        </span>
        <CounterButton
          onClick={onIncrement}
          gradientColor={gradientColor}
          selectedFormat={selectedFormat}
        >
          <Plus className="h-3 w-3" />
        </CounterButton>
      </div>
    </div>
  );
}

interface CapacityWarningProps {
  room: Room;
  totalGuests: number;
  gradientColor?: string;
  onFormatChange?: (formatId: string) => void;
}

function CapacityWarning({ room, totalGuests, gradientColor, onFormatChange }: CapacityWarningProps) {
  if (totalGuests <= room.capacity) return null;

  // Encontrar el mejor formato disponible para la cantidad de huéspedes
  const availableFormats = [room.defaultFormat, ...room.alternativeFormats];
  const suitableFormats = availableFormats.filter(formatId => 
    FORMAT_CAPACITIES[formatId] >= totalGuests
  );
  
  // Calcular la capacidad máxima real de la habitación según sus formatos disponibles
  const maxCapacity = Math.max(...availableFormats.map(formatId => FORMAT_CAPACITIES[formatId]));
  
  const bestFormat = suitableFormats.length > 0 
    ? suitableFormats.reduce((best, current) => 
        FORMAT_CAPACITIES[current] < FORMAT_CAPACITIES[best] ? current : best
      )
    : null;

  const bestFormatInfo = bestFormat ? ROOM_FORMATS.find(f => f.id === bestFormat) : null;

  // Mensaje específico para 3 personas
  const getWarningMessage = () => {
    // Si excede la capacidad máxima de cualquier habitación
    if (totalGuests > maxCapacity) {
      const extraGuests = totalGuests - maxCapacity;
      return `Esta habitación tiene capacidad para ${maxCapacity} personas. Puedes continuar con la cotización y te ayudaremos a encontrar la mejor forma de alojar a todo tu grupo de ${totalGuests} personas.`;
    }

    if (totalGuests === 3) {
      const hasTripleFormat = availableFormats.includes("HT");
      const hasSharedFormat = availableFormats.includes("HCO");
      
      if (hasTripleFormat && hasSharedFormat) {
        return `La ${room.name} puede alojar hasta ${maxCapacity} persona${maxCapacity > 1 ? 's' : ''} en formato compartido. 
        Para 3 huéspedes, puedes elegir entre formato Triple (habitación privada) o Compartida (mejor precio).`;
      } else if (hasTripleFormat) {
        return `La ${room.name} puede alojar hasta 3 personas en formato Triple. 
        Para 3 huéspedes, se recomienda usar el formato Triple.`;
      } else if (hasSharedFormat) {
        return `La ${room.name} puede alojar hasta ${maxCapacity} persona${maxCapacity > 1 ? 's' : ''} en formato Compartido. 
        Para 3 huéspedes, se recomienda usar el formato Compartida.`;
      } else {
        return `La ${room.name} tiene una capacidad máxima de ${maxCapacity} persona${maxCapacity > 1 ? 's' : ''} en su formato más amplio. 
        Para 3 huéspedes, necesitarás considerar una habitación adicional o una más grande.`;
      }
    }
    
    if (totalGuests === 1) {
      const hasSharedFormat = availableFormats.includes("HCO");
      if (hasSharedFormat) {
        return `La ${room.name} puede alojar hasta ${maxCapacity} persona${maxCapacity > 1 ? 's' : ''} en formato compartido. 
        Para 1 huésped, se recomienda usar el formato Compartida para un mejor precio.`;
      } else {
        return `La ${room.name} puede alojar hasta ${maxCapacity} persona${maxCapacity > 1 ? 's' : ''} en su formato más amplio. 
        Para 1 huésped, el formato Individual es la opción más económica.`;
      }
    }
    
    return `La ${room.name} tiene una capacidad máxima de ${maxCapacity} persona${maxCapacity > 1 ? 's' : ''} en su formato más amplio. 
    Con ${totalGuests} huéspedes, necesitarás considerar una habitación adicional o una más grande.`;
  };

  // Mostrar opciones de formato para 3 personas
  const showFormatOptions = totalGuests === 3 && 
    availableFormats.includes("HT") && 
    availableFormats.includes("HCO");

  return (
    <div 
      className="mt-3 p-3 rounded-lg border-l-4 text-sm"
      style={{
        backgroundColor: gradientColor ? `${gradientColor}10` : undefined,
        borderLeftColor: gradientColor || "#f59e0b",
      }}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle 
          className="h-4 w-4 mt-0.5 flex-shrink-0" 
          style={{ color: gradientColor || "#f59e0b" }}
        />
        <div className="space-y-2 flex-1">
          <p className="font-medium text-text">
            {totalGuests > maxCapacity ? `Capacidad máxima excedida (${maxCapacity} personas)` :
             showFormatOptions ? "Elige el formato que prefieras" :
             totalGuests === 3 ? "Se recomienda cambiar el formato" : 
             totalGuests === 1 ? "Se recomienda formato Compartida" : 
             "Capacidad excedida"}
          </p>
          <p className="text-text-muted text-xs leading-relaxed">
            {getWarningMessage()}
          </p>
          
          {/* Link to rooms with appropriate format filter - only show if within manageable capacity */}
          {totalGuests > room.capacity && totalGuests <= 3 && !showFormatOptions && (
            <Link 
              href={`/habitaciones?formato=${totalGuests <= 3 ? 'triple' : 'doble'}`}
              className="mt-2 text-xs font-medium flex items-center gap-1 text-blue-600 hover:text-blue-700"
              style={{ color: gradientColor || undefined }}
            >
              <Search className="h-3 w-3" />
              {totalGuests <= 3 
                ? "Ver habitaciones triples disponibles"
                : "Ver habitaciones dobles disponibles"}
            </Link>
          )}
          
          {/* Mostrar opciones de formato para 3 personas */}
          {showFormatOptions && onFormatChange && (
            <div className="mt-2 space-y-2">
              <div className="p-2 rounded bg-white/50 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-text">
                      Formato Triple: habitación privada para 3 personas
                    </span>
                  </div>
                  <Button
                    size="small"
                    variant="outline"
                    className="text-xs h-6 px-2"
                    onClick={() => onFormatChange("HT")}
                    style={{
                      borderColor: gradientColor || undefined,
                      color: gradientColor || undefined,
                    }}
                  >
                    Elegir Triple
                  </Button>
                </div>
              </div>
              <div className="p-2 rounded bg-white/50 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-text">
                      Formato Compartido: mejor precio por persona
                    </span>
                  </div>
                  <Button
                    size="small"
                    variant="outline"
                    className="text-xs h-6 px-2"
                    onClick={() => onFormatChange("HCO")}
                    style={{
                      borderColor: gradientColor || undefined,
                      color: gradientColor || undefined,
                    }}
                  >
                    Elegir Compartido
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Mostrar el botón de cambio de formato normal si no es el caso especial de 3 personas */}
          {bestFormat && bestFormatInfo && onFormatChange && !showFormatOptions && totalGuests <= 3 && (
            <div className="mt-2 p-2 rounded bg-white/50 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-text">
                    {totalGuests === 3 && bestFormat === "HT" 
                      ? "Sugerencia: Cambiar a formato Triple (capacidad: 3 personas)"
                      : totalGuests === 1 && bestFormat === "HCO"
                      ? "Sugerencia: Cambiar a formato Compartida (mejor precio para 1 persona)"
                      : `Sugerencia: Cambiar a formato ${bestFormatInfo.label} (capacidad: ${FORMAT_CAPACITIES[bestFormat]} personas)`
                    }
                  </span>
                </div>
                <Button
                  size="small"
                  variant="outline"
                  className="text-xs h-6 px-2"
                  onClick={() => onFormatChange(bestFormat)}
                  style={{
                    borderColor: gradientColor || undefined,
                    color: gradientColor || undefined,
                  }}
                >
                  Cambiar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface GuestsSelectorProps {
  className?: string;
  room: Room;
}

export function GuestsSelector({ className, room }: GuestsSelectorProps) {
  const { 
    adults, 
    children, 
    incrementAdults, 
    decrementAdults, 
    incrementChildren, 
    decrementChildren,
    selectedFormat,
    setSelectedFormat
  } = useSelectionStore();
  
  const gradientColor = selectedFormat ? getRoomGradientColor(selectedFormat.id) : undefined;
  const totalGuests = adults + children;

  // Función para cambiar manualmente el formato
  const handleFormatChange = (formatId: string) => {
    const format = ROOM_FORMATS.find(f => f.id === formatId);
    if (format) {
      setSelectedFormat(format);
    }
  };

  // Cambio automático de formato basado en la capacidad y número de huéspedes
  useEffect(() => {
    if (!selectedFormat || totalGuests === 0) return;

    const availableFormats = [room.defaultFormat, ...room.alternativeFormats];
    const currentCapacity = FORMAT_CAPACITIES[selectedFormat.id];
    
    // Siempre buscar el formato más pequeño que pueda acomodar a los huéspedes
    const suitableFormats = availableFormats
      .filter(formatId => FORMAT_CAPACITIES[formatId] >= totalGuests)
      .sort((a, b) => FORMAT_CAPACITIES[a] - FORMAT_CAPACITIES[b]);

    // Si hay un formato más pequeño que el actual y puede acomodar a los huéspedes
    const smallestSuitableFormat = suitableFormats[0];
    if (smallestSuitableFormat && 
        FORMAT_CAPACITIES[smallestSuitableFormat] < currentCapacity && 
        FORMAT_CAPACITIES[smallestSuitableFormat] >= totalGuests) {
      const newFormat = ROOM_FORMATS.find(f => f.id === smallestSuitableFormat);
      if (newFormat && newFormat.id !== selectedFormat.id) {
        setSelectedFormat(newFormat);
      }
      return;
    }

    // Si el formato actual no puede acomodar a los huéspedes
    if (totalGuests > currentCapacity) {
      const newFormat = ROOM_FORMATS.find(f => f.id === smallestSuitableFormat);
      if (newFormat && newFormat.id !== selectedFormat.id) {
        setSelectedFormat(newFormat);
      }
    }

  }, [totalGuests, selectedFormat?.id, room.defaultFormat, room.alternativeFormats]);

  return (
    <div className={cn("space-y-3", className)}>
      <GuestCounter
        label="Adultos"
        icon={<Users className="h-4 w-4 text-text-muted" />}
        value={adults}
        onIncrement={incrementAdults}
        onDecrement={decrementAdults}
        minValue={1}
        gradientColor={gradientColor}
        selectedFormat={selectedFormat}
      />

      <GuestCounter
        label="Niños"
        icon={<Baby className="h-4 w-4 text-text-muted" />}
        value={children}
        onIncrement={incrementChildren}
        onDecrement={decrementChildren}
        minValue={0}
        gradientColor={gradientColor}
        selectedFormat={selectedFormat}
      />

      {/* Total de personas */}
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Total de personas:</span>
          <span 
            className="font-semibold"
            style={{ color: gradientColor || undefined }}
          >
            {totalGuests}
          </span>
        </div>
      </div>

      {/* Warning de capacidad */}
      <CapacityWarning 
        room={room} 
        totalGuests={totalGuests} 
        gradientColor={gradientColor}
        onFormatChange={handleFormatChange}
      />

      {/* Enlace de búsqueda de habitaciones alternativas */}
      {totalGuests > room.capacity && totalGuests <= 3 && (() => {
        const availableFormats = [room.defaultFormat, ...room.alternativeFormats];
        const suitableFormats = availableFormats.filter(formatId => 
          FORMAT_CAPACITIES[formatId] >= totalGuests
        );
        
        const bestFormat = suitableFormats.length > 0 
          ? suitableFormats.reduce((best, current) => 
              FORMAT_CAPACITIES[current] < FORMAT_CAPACITIES[best] ? current : best
            )
          : null;

        const bestFormatInfo = bestFormat ? ROOM_FORMATS.find(f => f.id === bestFormat) : null;
        
        if (!bestFormat || !bestFormatInfo) return null;

        return (
          <Link
            href="/habitaciones#habitaciones"
            onClick={() => {
              useSelectionStore.setState({ selectedFormat: bestFormatInfo });
            }}
            className={cn(
              "flex items-center justify-center w-full text-xs py-2 px-3 rounded-md border transition-all duration-200 hover:shadow-sm",
              "text-center no-underline"
            )}
            style={{
              borderColor: gradientColor ? `${gradientColor}50` : undefined,
              color: gradientColor || undefined,
              backgroundColor: gradientColor ? `${gradientColor}05` : undefined,
            }}
          >
            <Search className="h-3 w-3 mr-2" />
            Buscar habitaciones {bestFormatInfo.label.toLowerCase()}
          </Link>
        );
      })()}
    </div>
  );
} 