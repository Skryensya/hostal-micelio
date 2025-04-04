"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LightEffect } from "@/components/ui/LightEffect";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-standar font-medium outline-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-text",
        secondary: "bg-secondary text-text",
        link: "text-text font-medium border-none hover:underline !shadow-none visited:text-text-70 hover:text-primary",
        outline: "border border-border text-text bg-transparent",
        ghost: "bg-white/20 text-text",
      },
      size: {
        default: "h-12 rounded-standar px-6 py-4 text-base",
        small: "h-8 rounded-standar px-4 py-2 text-sm",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { noLight?: boolean }
>(
  (
    { className, variant, size, asChild = false, noLight = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
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
