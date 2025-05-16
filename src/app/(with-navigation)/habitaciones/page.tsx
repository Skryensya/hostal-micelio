import { CheckAvailability } from "@/components/sections/CheckAvailabiliy";
import { Rooms } from "@/components/sections/Rooms";

export default function Habitaciones() {
  return (
    <main className="pt-32">
      <CheckAvailability />
      <Rooms />
    </main>
  );
}
