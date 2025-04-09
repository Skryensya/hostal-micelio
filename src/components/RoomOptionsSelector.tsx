"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roomOptions = [
  { label: "Individual", price: 30000 },
  { label: "Doble", price: 45000 },
  { label: "Matrimonial", price: 45000 },
  { label: "Matrimonial con baño", price: 55000 },
  { label: "Triple", price: 65000 },
  { label: "Compartida", price: 17000 },
].sort((a, b) => a.price - b.price);

export const RoomOptionsSelector = () => {
  return (
    <div>
      <div className="text-lg font-bold mb-4 font-mono">Formatos</div>
      <div className=" grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-4  ">
        {roomOptions.map((option, index) => (
          <Card
            key={index}
            className="cursor-default transition-all duration-200 h-full w-full bg-primary/40"
          >
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <span className="text-xs font-mono text-text-muted">
                  habitación
                </span>
                <h3 className="!text-base !font-medium font-body mb-2">
                  {option.label}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <Badge variant="outline">Precio</Badge>
                  <span className="font-semibold text-sm">
                    ${option.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
