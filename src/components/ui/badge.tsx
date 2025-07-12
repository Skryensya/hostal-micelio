import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm md:px-1.5 md:pb-0.5 md:pt-1 md:!text-[11px] md:!leading-4 w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 [a&]:hover:bg-neutral-900/90",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 [a&]:hover:bg-neutral-100/90",
        destructive:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-500/90",
        outline:
          "text-neutral-950 border border-neutral-200 [a&]:hover:bg-neutral-100 [a&]:hover:text-neutral-900",
        "gender-male":
          "bg-[#bfdbfe] text-[#1d4ed8] border border-[#60a5fa]",
        "gender-female":
          "bg-[#fbcfe8] text-[#be185d] border border-[#f472b6]",
        mixed:
          "bg-[#e5e7eb] text-[#4b5563] border border-[#9ca3af]",
        breakfast:
          "bg-[#fed7aa] text-[#c2410c] border border-[#fb923c]",
        "private-bathroom":
          "bg-[#bbf7d0] text-[#047857] border border-[#4ade80]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  style,
  color,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { 
    asChild?: boolean;
    color?: string;
  }) {
  const Comp = asChild ? Slot : "span"

  // Si se proporciona color, generar estilos dinámicos
  const dynamicStyle = color
    ? {
        backgroundColor: `${color}25`, // Fondo claro
        color: `color-mix(in srgb, ${color} 80%, black 20%)`, // Texto más oscuro
        border: `1px solid ${color}60`, // Borde intermedio
        ...style,
      }
    : style;

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant: color ? undefined : variant }), className)}
      style={dynamicStyle}
      {...props}
    />
  )
}

// Utilidades para colores de badges
const getGenderColor = (gender: "male" | "female" | "mixed") => {
  const colors = {
    male: "#2563eb",
    female: "#e11d48", 
    mixed: "#6b7280"
  };
  return colors[gender];
};

const getAmenityColor = (amenity: "breakfast" | "private-bathroom") => {
  const colors = {
    breakfast: "#ff6b35",
    "private-bathroom": "#00d084"
  };
  return colors[amenity];
};

export { Badge, badgeVariants, getGenderColor, getAmenityColor }
