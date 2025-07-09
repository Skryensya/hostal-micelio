"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LightEffect } from "@/components/ui/LightEffect";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-standard font-medium outline-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-text",
        secondary: "bg-secondary text-text",
        link: "text-text font-medium border-none hover:underline !shadow-none visited:text-text/70 hover:text-inverted",
        outline: "border border-border text-text bg-transparent",
        ghost: "bg-white/20 text-text",
        // Room button variants
        "room-card": "rounded-4xl px-6 py-3 text-base font-semibold shadow-sm hover:scale-[1.02] hover:shadow-md md:w-auto md:rounded-full md:px-4 md:py-2 md:text-sm md:shadow-sm md:hover:scale-[1.03] md:hover:shadow-lg md:hover:shadow-black/5",
        "room-option": "rounded-lg px-3 py-2.5 text-sm font-medium shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-12 rounded-standard px-6 py-4 text-base",
        small: "h-8 rounded-standard px-4 py-2 text-sm",
        icon: "h-10 w-10",
        // Room button sizes
        "room-card": "w-full justify-center gap-2",
        "room-option": "w-full",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  accentColor?: string;
  isSelected?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { noLight?: boolean }
>(
  (
    { className, variant, size, asChild = false, noLight = false, accentColor, isSelected = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Generate dynamic styles based on variant and accent color
    const getDynamicStyles = () => {
      if (!accentColor) return {};

      const styles: React.CSSProperties = {};

      if (variant === "room-card") {
        styles.backgroundColor = `color-mix(in srgb, ${accentColor} 20%, white 80%)`;
        styles.border = `1px solid color-mix(in srgb, ${accentColor} 30%, white 70%)`;
        styles.color = accentColor;
      } else if (variant === "room-option") {
        if (isSelected) {
          styles.backgroundColor = `${accentColor}CC`; // 80% opacity
          styles.color = "white";
        } else {
          styles.backgroundColor = `${accentColor}30`; // 20% opacity
          styles.color = "currentColor";
        }
      }

      return styles;
    };

    // Handle hover effects for room buttons
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (accentColor && variant === "room-card") {
        // Only darken on desktop hover
        if (window.innerWidth >= 768) {
          e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${accentColor} 35%, black 10%, white 55%)`;
        }
      } else if (accentColor && variant === "room-option" && !isSelected) {
        e.currentTarget.style.backgroundColor = `${accentColor}50`;
      }
      
      // Call original onMouseEnter if provided
      if (props.onMouseEnter) {
        props.onMouseEnter(e);
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (accentColor && variant === "room-card") {
        // Reset to original color on desktop
        if (window.innerWidth >= 768) {
          e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${accentColor} 20%, white 80%)`;
        }
      } else if (accentColor && variant === "room-option" && !isSelected) {
        e.currentTarget.style.backgroundColor = `${accentColor}30`;
      }
      
      // Call original onMouseLeave if provided
      if (props.onMouseLeave) {
        props.onMouseLeave(e);
      }
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className })
        )}
        style={{
          ...props.style,
          ...getDynamicStyles(),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        {...props}
      >
        <div className="z-30 pointer-events-none relative">
          {props.children}
        </div>
        {!noLight && <LightEffect />}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
