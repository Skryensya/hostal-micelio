"use client";

import RoomTimeline from "@/components/RoomTimeline";
import MobileRoomTimeline from "@/components/MobileRoomTimeline";

export default function page() {
  return (
    <div className="mt-20 p-4">
      <div className="md:hidden">
        <MobileRoomTimeline />
      </div>
      <div className="hidden md:block">
        <RoomTimeline />
      </div>
    </div>
  );
}
