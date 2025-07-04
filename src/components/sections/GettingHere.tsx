import React from "react";
import { Milestone } from "lucide-react";
import { Button } from "../ui/button";
import { getDirectionsTemplate } from "@/lib/whatsapp_templates/directions";
import Link from "next/link";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/XpovqzcoqBebn7839";
const GOOGLE_MAPS_EMBED_LINK =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7279.0746688457175!2d-72.23123636024849!3d-39.28514831555788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96146225645498eb%3A0x4f5d838949e2c739!2sHostal%20Torre%20Suiza!5e0!3m2!1sen!2scl!4v1727501711581!5m2!1sen!2sc";

export function GettingHere() {
  return (
    <div className="min-h-96 py-10 md:px-4 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="flex items-center gap-2 pb-6 text-2xl">
          <Milestone /> Como llegar
        </h2>
        <div className="grid grid-cols-12 gap-4 md:gap-12">
          <div className="col-span-12 text-lg lg:col-span-5">
            <p className="mb-4">
              El <strong>Hostal Micelio</strong> se encuentra en{" "}
              <a
                href="https://maps.app.goo.gl/5v4wGHi4YDYywrHw9"
                target="_blank"
              >
                Francisco Bilbao 969
              </a>
              , en el corazón de Villarrica. Su ubicación central es uno de sus
              principales atractivos, ya que está a pocos pasos de los
              terminales de transporte y del centro de la ciudad. Esto permite a
              nuestros huéspedes acceder fácilmente a las diversas atracciones y
              servicios que Villarrica tiene para ofrecer.
            </p>
            <p>
              Estar en el centro de la ciudad significa que estás cerca de
              restaurantes, tiendas y actividades culturales, lo que convierte a
              nuestro hostal en el punto de partida ideal para explorar todo lo
              que esta hermosa localidad tiene para ofrecer.
            </p>
            <div className="mt-8 flex flex-col items-center justify-start gap-4 md:flex-row">
              <Link href={GOOGLE_MAPS_LINK} target="_blank">
                <Button>Ver en Google maps</Button>
              </Link>
              <Link
                href={getDirectionsTemplate()}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">Preguntanos</Button>
              </Link>
            </div>
          </div>
          <div className="border-border-light relative col-span-12 overflow-hidden rounded-xl border lg:col-span-7">
            <span className="pointer-events-none absolute inset-0 opacity-[5%]"></span>
            <iframe
              src={GOOGLE_MAPS_EMBED_LINK}
              className="h-[300px] w-full lg:h-[500px]"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
