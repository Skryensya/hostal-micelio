import React from "react";
import Image from "next/image";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"; // Import Lucide icons
import CONTACT_INFO from "@/db/CONTACT_INFO.json";
import { WavyDivider } from "../composed/WavyDivider";

const Footer = () => {
  return (
    <div className="mt-20">
      <WavyDivider
        backgroundClassNames={[
          "bg-surface-light",
          "bg-border-light",
          "bg-surface-dark",
        ]}
      />
      <footer className="bg-surface-dark  text-white py-8">
        <div className="container mx-auto px-4">
          {/* Level 1: Logo and Links */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex flex-col md:flex-row items-center space-y-4">
              <Image
                src="/assets/LOGO_COLOR.png"
                alt="Hostal Micelio Logo"
                className="h-[100px] md:mr-4 hidden md:block"
                width={100} // Add width for the Image component
                height={100} // Add height for the Image component
              />
              <Image
                src="/assets/LOGO_COLOR.png"
                alt="Hostal Micelio Logo"
                className="h-[150px]  md:mr-4 block md:hidden"
                width={150} // Add width for the Image component
                height={150} // Add height for the Image component
              />
              <nav className="flex  flex-row flex-wrap  items-center text-balance gap-4 ">
                <a href="#about" className="hover:text-gray-400">
                  Acerca de
                </a>
                <a href="#rooms" className="hover:text-gray-400">
                  Habitaciones
                </a>
                <a href="#services" className="hover:text-gray-400">
                  Servicios
                </a>
                <a href="#contact" className="hover:text-gray-400">
                  Contacto
                </a>
              </nav>
            </div>
            <div className="text-right  flex flex-col items-end space-y-2 mt-8 md:mt-0">
              {/* CONTACT_INFO */}
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="hover:text-gray-400 flex gap-2 items-center underline"
              >
                {CONTACT_INFO.prettyPhone}
                <Phone className="h-5" />
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-gray-400 flex gap-2 items-center underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.email}
                <Mail className="h-5" />
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-gray-400 flex gap-2 items-center underline "
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.address}
                <MapPin className="h-5" />
              </a>
            </div>
          </div>

          {/* Level 2: Socials and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-4  gap-4 md:pt-4">
            <p className="text-sm order-1">
              &copy; 2024 Hostal Micelio. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 md:order-2">
              <span>Siguenos</span>
              <a
                href="https://facebook.com"
                className="hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-gray-400"
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
