"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { WavyDivider } from "@/components/composed/WavyDivider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  // { href: "/", label: "Inicio" },
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#como-llegar", label: "Como llegar" },
  { href: "#reviews", label: "Reseñas" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Variable que controla si el header se oculta en scroll o no
  const hideOnScroll = false; // Cambiar a false para mantener el header siempre visible
  // Estado que controla la visibilidad del header.
  const [showHeader, setShowHeader] = useState(true);
  // Referencia para guardar la posición del scroll.
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Solo agregar el listener si hideOnScroll está habilitado
    if (!hideOnScroll) return;

    const handleScroll = () => {
      // Si el usuario hace scroll hacia arriba, mostramos el header
      if (window.scrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      // Si se desplaza hacia abajo, lo ocultamos
      else if (window.scrollY > lastScrollY.current) {
        setShowHeader(false);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideOnScroll]);

  return (
    <>
      {/* Header fijo en la parte superior con animación */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-surface-3 shadow-md text-text transition-transform duration-300",
          // Si hideOnScroll está deshabilitado o showHeader es true, se muestra el header
          !hideOnScroll || showHeader ? "translate-y-0" : "-translate-y-[150%]"
        )}
      >
        <div className="pt-2">
          <div className="py-0 flex items-center justify-between max-w-7xl mx-auto px-4">
            <Link href="/" className="flex items-center">
              <div className="h1 flex leading-6 tracking-tight opacity-100 transition-opacity">
                Hostal Micelio
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-4 z-[120]">
              {/* Navegación para escritorio */}
              <nav className="hidden lg:flex items-center gap-4 text-lg font-semibold">
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
          className={`lg:hidden fixed top-20 right-2 md:right-4 w-64 bg-surface-2 rounded-2xl shadow-xl z-50 overflow-hidden ${
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
