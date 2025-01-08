"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="link"
      size="icon"
      title={
        theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      }
    >
      <Moon className=" dark:hidden text-text-light" />
      <Sun className="dark:block hidden text-text-dark" />
      <span className="sr-only h-0 w-0">Toggle theme</span>
    </Button>
  );
}
