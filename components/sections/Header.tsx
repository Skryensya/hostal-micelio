"use client";
import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { Flower } from "lucide-react";
import { cn } from "@/lib/utils";
import { WavyDivider } from "../composed/WavyDivider";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // Icon for burger menu

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Framer Motion variants for height and opacity animation
  const menuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.5 },
        opacity: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.5 },
        opacity: { duration: 0.5, staggerChildren: 0.1, staggerDirection: -1 },
      },
    },
  };

  const linkVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <header
      id="header"
      className={cn(
        "py-2 sticky bg-surface-light top-0 border-b border-border-light z-50 transition-all"
      )}
    >
      <div className="flex flex-col">
        <div className="py-0 flex items-center justify-between container mx-auto">
          <Link href={"/"} className="flex items-center gap-4">
            <div className="h1 !font-extralight flex">
              Hostal Micelio <Flower size={20} />
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Burger Menu for mobile */}
            <div className="lg:hidden flex items-center order-2 md:order-1">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Regular menu for desktop */}
            <nav className="hidden lg:flex items-center gap-4">
              <Link href={"/habitaciones"}>Habitaciones</Link>
              <Link href={"#about"}>Nosotros</Link>
              <Link href={"#contact"}>Contactanos</Link>
              <Link href={"#"}>Consulta Precios</Link>
            </nav>

            <ModeToggle />
          </div>
        </div>

        <motion.nav
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={menuVariants}
          className={
            "lg:hidden  bg-surface-light overflow-hidden top-full z-40"
          }
        >
          <div className="p-4 w-full flex flex-col items-end gap-4">
            <motion.div variants={linkVariants}>
              <Link href={"/habitaciones"}>Habitaciones</Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link href={"#about"}>Nosotros</Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link href={"#contact"}>Contactanos</Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link href={"#"}>Consulta Precios</Link>
            </motion.div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile menu with animation */}
      {/* <WavyDivider
        direction="bottom"
        backgroundClassNames={[
          "bg-surface-light",
          "bg-white/50",
          "bg-transparent",
        ]}
      /> */}
    </header>
  );
}
