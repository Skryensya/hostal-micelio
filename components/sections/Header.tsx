"use client";
import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { Flower } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // Icon for burger menu

// Centralized configuration for all links
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  // { href: "/eventos", label: "Eventos" },
  // { href: "/larga-estadia", label: "Larga estadía" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/reviews", label: "Reseñas" },
];

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
        "py-2 sticky bg-surface-light-80 dark:bg-surface-dark-80 top-0 z-50 transition-all border-b-2 border-border-light dark:border-border-dark backdrop-blur-xl"
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

            {/* Menu visible in desktop */}
            <nav className="hidden lg:flex items-center gap-4 text-lg">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <ModeToggle />
          </div>
        </div>

        {/* Mobile menu with Framer Motion */}
        <motion.nav
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={menuVariants}
        >
          <div
            className={
              "lg:hidden bg-surface-2-light dark:bg-surface-2-dark overflow-hidden top-full z-40"
            }
          >
            <div className="p-4 w-full flex flex-col items-end gap-4">
              {NAV_LINKS.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  <Link href={link.href}>{link.label}</Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
