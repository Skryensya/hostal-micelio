import { InnerHero } from "@/components/sections/InnerHero";
import { Team } from "@/components/sections/Team";

export default function RoomsPage() {
  return (
    <div>
      <InnerHero title="Conoce nuestra historia"></InnerHero>
      <div className="max-w-7xl mx-auto px-4  mt-8">
        <div className="max-w-4xl space-y-6 text-lg">
          <p>
            Lejos del ruido de la ciudad, el Hostal Micelio ofrece un refugio
            acogedor en el centro de Villarrica. Entre sus paredes, los viajeros
            encuentran un espacio cálido para descansar y reconectarse, rodeados
            de la tranquilidad que caracteriza al sur de Chile.
          </p>
          <p>
            El hostal nació como una vitrina para emprendedores y artesanos
            locales, buscando impulsar el desarrollo de toda la comunidad. Como
            el micelio que conecta el bosque, nuestro espacio se fue
            construyendo orgánicamente gracias a los colaboradores que, uno a
            uno, aportaron su grano de arena.
          </p>
          <p>
            Cada persona que se suma contribuye con sus habilidades únicas,
            fortaleciendo el proyecto colectivo y creando un ambiente de buena
            onda donde florecen las conexiones auténticas. Este intercambio
            constante de conocimientos y recursos no solo enriquece la
            experiencia de nuestros huéspedes, sino que también fomenta el
            crecimiento de la comunidad local a través de espacios de
            entretención y colaboración.
          </p>
        </div>
      </div>
      <Team />
    </div>
  );
}
