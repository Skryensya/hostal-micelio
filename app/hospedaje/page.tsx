import { Rooms } from "@/components/sections/Rooms";
import { Amenities } from "@/components/sections/Amenities";
export default function RoomsPage() {
  return (
    <div>
      <section className="container mx-auto py-20 min-h-96">
        <h1>Eligue tus habitaciones</h1>
        <p className="text-lg ">
          Selecciona tus habitaciones favoritas para disfrutar de nuestro
          servicio.
        </p>
        <ul className="flex ">
          <li>Individuales</li>
          <li>Familiares</li>
          <li>Compartidas</li>
        </ul>
      </section>
      <Amenities />
      <Rooms />
    </div>
  );
}
