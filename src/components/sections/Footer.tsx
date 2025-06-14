import React from "react";
import Image from "next/legacy/image";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"; // Import Lucide icons
import CONTACT_INFO from "@/db/CONTACT_INFO.json";
import { WavyDivider } from "../composed/WavyDivider";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="mt-20">
      <WavyDivider backgroundClass="bg-surface-3" />
      <footer className="bg-surface-3 font-semibold py-8 relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Level 1: Logo and Links */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex flex-col md:flex-row  gap-x-4 items-center space-y-4">
              <div className="hidden md:block">
                <Image
                  src="/assets/logos/LOGO_COLOR.png"
                  alt="Hostal Micelio Logo"
                  className="h-[100px] md:mr-4"
                  width={100}
                  height={100}
                />
              </div>
              <div className="block md:hidden">
                <Image
                  src="/assets/logos/LOGO_COLOR.png"
                  alt="Hostal Micelio Logo"
                  className="h-[150px] md:mr-4"
                  width={150}
                  height={150}
                />
              </div>
              <nav className="flex  flex-row flex-wrap  items-center text-balance gap-4 ">
                <a href="#about" className="hover:text-text-muted">
                  Acerca de
                </a>
                <a href="#rooms" className="hover:text-text-muted">
                  Habitaciones
                </a>
                <a href="#services" className="hover:text-text-muted">
                  Servicios
                </a>
                <a href="#contact" className="hover:text-text-muted">
                  Contacto
                </a>
              </nav>
            </div>
            <div className="text-right  flex flex-col items-end space-y-2 mt-8 md:mt-0">
              {/* CONTACT_INFO */}
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="hover:text-text-muted flex gap-2 items-center underline"
              >
                {CONTACT_INFO.prettyPhone}
                <Phone className="h-5" />
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-text-muted flex gap-2 items-center underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.email}
                <Mail className="h-5" />
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-text-muted flex gap-2 items-center underline "
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.address}
                <MapPin className="h-5" />
              </a>
            </div>
          </div>

          {/* Level 2: Socials and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-border-dark pt-4  gap-4 md:pt-4">
            <p className="text-sm order-1">
              &copy; {currentYear} Hostal Micelio. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-4 md:order-2">
              <span>Siguenos</span>
              <a
                href="https://facebook.com"
                className="hover:text-text-muted"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-text-muted"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { Footer };
