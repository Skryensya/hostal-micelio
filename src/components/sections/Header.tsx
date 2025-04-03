"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { WavyDivider } from "@/components/composed/WavyDivider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/reviews", label: "Reseñas" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header fijo en la parte superior */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-surface-3 shadow-md text-text"
        )}
      >
        <div className="flex flex-col pt-2">
          <div className="py-0 flex items-center justify-between container mx-auto px-4">
            <Link href="/" className="flex items-center">
              <div className="h1 flex leading-6 tracking-tight opacity-90 hover:opacity-100 transition-opacity">
                Hostal Micelio
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-4 z-[120]">
              {/* Navegación para escritorio */}
              <nav className="hidden lg:flex items-center gap-4 text-lg">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <ModeToggle />

              {/* Botón para menú móvil */}
              <div className="lg:hidden flex items-center aspect-square w-10 justify-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          <WavyDivider direction="bottom" backgroundClass="bg-surface-3" />
        </div>
      </div>

      {/* Contenedor para el menú móvil */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={
            isMenuOpen
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.95, y: -20 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`lg:hidden fixed top-20 right-2 md:right-4 w-64 bg-surface-2  rounded-2xl shadow-xl z-50 overflow-hidden ${
            !isMenuOpen ? "pointer-events-none" : ""
          }`}
        >
          <div className="flex flex-col p-4 items-end">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg py-2 text-right"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
