"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="link" size="icon" className="opacity-0">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
      </Button>
    );
  }

  return (
    <Button
      variant="link"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] dark:block hidden !text-text-dark" />
      <Moon className="h-[1.2rem] w-[1.2rem] dark:hidden !text-text-light" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
