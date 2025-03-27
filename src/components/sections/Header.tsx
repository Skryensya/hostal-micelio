"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
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
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [headerVisible, setHeaderVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScroll = useRef(0);

  // Actualizar la dirección del scroll y actualizar "hasScrolled"
  useEffect(() => {
    return scrollY.onChange((y) => {
      setHasScrolled(y > 0);

      if (y > lastScroll.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScroll.current = y;
    });
  }, [scrollY]);

  // Actualizar el estado de visibilidad del header sticky
  useEffect(() => {
    return scrollY.onChange((y) => {
      if (y === 0) {
        // Cuando llegamos a 0, cerramos el header abruptamente
        setHeaderVisible(false);
      } else if (y >= 500) {
        // Cuando se pasa de 500, si se sube, se muestra; si baja, se oculta.
        setHeaderVisible(scrollDirection === "up");
      }
      // Para y < 500, se mantiene el estado previo (puede quedarse visible si ya lo estaba)
    });
  }, [scrollY, scrollDirection]);

  // Variants para el header sticky (dinámico)
  const stickyVariants = {
    hidden: { y: -150 },
    visible: { y: 0 },
  };

  return (
    <>
      {/* Header Estático: visible cuando scroll < 500 */}
      <motion.div
        className={cn("bg-surface-light dark:bg-surface-dark")}
        initial={false}
      >
        <HeaderContent />
      </motion.div>

      {/* Header Dinámico: solo se renderiza si se hizo scroll */}
      {hasScrolled && (
        <motion.div
          className={cn(
            "fixed left-0 right-0 top-0 z-50 shadow-md bg-surface-light dark:bg-surface-dark"
          )}
          variants={stickyVariants}
          initial="hidden"
          animate={headerVisible ? "visible" : "hidden"}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </motion.div>
      )}
    </>
  );
}

function HeaderContent({
  isMenuOpen = true,
  setIsMenuOpen = () => {},
}: {
  isMenuOpen?: boolean;
  setIsMenuOpen?: (value: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col pt-2">
        <div className="py-0 flex items-center justify-between container mx-auto">
          <Link href="/" className="flex items-center gap-4">
            <div className="h1 flex leading-6 tracking-tight opacity-90 hover:opacity-100 transition-opacity">
              Hostal Micelio
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

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

        {/* Menú móvil desplegable */}
        <motion.nav
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={{
            open: {
              height: "auto",
            },
            closed: {
              height: 0,
            },
          }}
        >
          <div className="lg:hidden bg-surface-2-light dark:bg-surface-2-dark overflow-hidden top-full z-40">
            <div className="p-4 w-full flex flex-col items-end gap-4">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>
      <WavyDivider
        direction="bottom"
        backgroundClassNames={[
          "bg-surface-light dark:bg-surface-dark",
          "bg-surface-light dark:bg-surface-dark",
          "bg-white/50 dark:bg-white/20",
        ]}
      />
    </>
  );
}
