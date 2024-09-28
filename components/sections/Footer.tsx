import React from "react";
import Image from "next/image";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"; // Import Lucide icons
import CONTACT_INFO from "@/db/CONTACT_INFO.json";

const Footer = () => {
  return (
    <footer className="bg-surface-dark mt-20 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Level 1: Logo and Links */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Image
              src="/assets/LOGO_COLOR.png"
              alt="Hostal Micelio Logo"
              className="h-[100px] mr-4"
              width={100} // Add width for the Image component
              height={100} // Add height for the Image component
            />
            <nav className="flex space-x-6">
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
          <div className="text-right  flex flex-col items-end space-y-2">
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
        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
          <p className="text-sm">
            &copy; 2024 Hostal Micelio. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            <span>Siguenos en</span>
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
  );
};

export { Footer };
