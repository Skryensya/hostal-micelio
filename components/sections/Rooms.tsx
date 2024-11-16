import ROOMS from "@/db/ROOMS.json";
import RoomCard from "../composed/RoomCard";

export function Rooms() {
  // create a fancy button per room, with its name and a url of /room/[slug]
  return (
    <div className="container mx-auto py-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4  gap-4 ">
        {ROOMS.map((room) => (
          <div key={room.slug} className="">
            <RoomCard {...room} />
          </div>
        ))}
      </div>
    </div>
  );
}
