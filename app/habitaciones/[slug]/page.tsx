import { notFound } from "next/navigation";
// import Image from "next/image";
import ROOMS from "@/db/ROOMS.json";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { Bed, Users, Bath } from "lucide-react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
// import { DateRangePicker } from "@/components/DateRangePicker";
import { Breadcrumb } from "@/components/composed/Breadcrumb";
import { InnerHero } from "@/components/sections/InnerHero";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(ROOMS).map((slug) => ({
    slug,
  }));
}

export default async function RoomPage(props: PageProps) {
  const params = await props.params;
  const room = ROOMS.find((room) => room.slug === params.slug);
  const images = ROOM_IMAGES[params.slug] || [];

  if (!room) {
    notFound();
  }

  return (
    <>
      <InnerHero title={room.name} />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          levels={[
            {
              label: "inicio",
              href: "/",
            },
            {
              label: "Habitaciones",
              href: "/habitaciones",
            },
            {
              label: room.name,
              href: `/habitaciones/${room.slug}`,
            },
          ]}
        />
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
              <ImageCarousel imgs={images} />
            </div>
          </div>

          {/* Right Column - Room Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={20} />
                    <span>{room.capacity} huéspedes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={20} />
                    <span>{room.beds.length} camas</span>
                  </div>
                  {room.hasPrivateToilet && (
                    <div className="flex items-center gap-1">
                      <Bath size={20} />
                      <span>Baño privado</span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-4">
                  Reserva tu estadía
                </h2>
                {/* <DateRangePicker /> */}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-gray-600">{room.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Camas</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {room.beds.map((bed, index) => (
                    <li key={index}>{bed}</li>
                  ))}
                </ul>
              </div>
              {/* 
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Comodidades</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )} */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
