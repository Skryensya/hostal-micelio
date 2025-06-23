import { Suspense } from 'react';
import { Rooms } from "@/components/sections/Rooms";

export default function Habitaciones() {
  return (
    <main className="pt-32">
      <Suspense fallback={<div>Loading...</div>}>
        <Rooms />
      </Suspense>
    </main>
  );
}
