import React from "react";
import { MapPinHouse } from "lucide-react";
// import { cn } from "@/lib/utils";

export function GettingHere() {
  return (
    <div className="min-h-96">
      <div className="container mx-auto ">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-5">
            <h2 className="flex items-center gap-2 pb-6">
              <MapPinHouse /> Como llegar
            </h2>
            <p className="mb-4">
              El <strong>Hostal Micelio</strong> se encuentra en{" "}
              <a
                href="https://maps.app.goo.gl/5v4wGHi4YDYywrHw9"
                className="text-primary-light underline hover:text-primary-dark"
                target="_blank"
              >
                Francisco Bilbao 969
              </a>
              , en el corazón de Villarrica. Su ubicación
              central es uno de sus principales atractivos, ya que está a pocos
              pasos de los terminales de transporte y del centro de la ciudad.
              Esto permite a nuestros huéspedes acceder fácilmente a las
              diversas atracciones y servicios que Villarrica tiene para
              ofrecer.
            </p>
            <p>
              Estar en el centro de la ciudad significa que estás cerca de
              restaurantes, tiendas y actividades culturales, lo que convierte a
              nuestro hostal en el punto de partida ideal para explorar todo lo
              que esta hermosa localidad tiene para ofrecer.
            </p>
          </div>
          <div className="h-[500px] col-span-7 overflow-hidden rounded-lg border border-border-light">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7279.0746688457175!2d-72.23123636024849!3d-39.28514831555788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96146225645498eb%3A0x4f5d838949e2c739!2sHostal%20Torre%20Suiza!5e0!3m2!1sen!2scl!4v1727501711581!5m2!1sen!2sc"
              className="w-full h-96"
              style={{ border: 0, width: "100%", height: "100%" }}
              // allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}