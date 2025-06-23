"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ROOMS from "@/db/ROOMS.json";
import { Room } from "@/lib/types";

type RoomStatus = "available" | "occupied" | "maintenance";

interface RoomWithStatus extends Room {
  status: RoomStatus;
  occupiedDates?: {
    checkIn: string;
    checkOut: string;
    guestName?: string;
  }[];
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomWithStatus[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/_dashboard/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Initialize rooms with status
    const initialRooms = (ROOMS as Room[]).map(room => ({
      ...room,
      status: "available" as RoomStatus,
      occupiedDates: []
    }));
    setRooms(initialRooms);
  }, []);

  const moveRoom = (roomSlug: string, newStatus: RoomStatus) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.slug === roomSlug ? { ...room, status: newStatus } : room
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest('[data-status]');
    if (dropZone) {
      dropZone.classList.add('bg-opacity-70');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest('[data-status]');
    if (dropZone) {
      dropZone.classList.remove('bg-opacity-70');
    }
  };

  const handleDrop = (e: React.DragEvent, newStatus: RoomStatus) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest('[data-status]');
    if (dropZone) {
      dropZone.classList.remove('bg-opacity-70');
    }
    
    const roomSlug = e.dataTransfer.getData("roomSlug");
    if (roomSlug) {
      moveRoom(roomSlug, newStatus);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Room Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Column */}
        <div 
          className="bg-green-50 p-4 rounded-lg transition-colors duration-200"
          data-status="available"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "available")}
        >
          <h2 className="font-semibold mb-4 text-green-700">Available</h2>
          <div className="space-y-4">
            {rooms
              .filter(room => room.status === "available")
              .map(room => (
                <div
                  key={room.slug}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("roomSlug", room.slug);
                  }}
                >
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.description}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => moveRoom(room.slug, "occupied")}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Mark Occupied
                    </button>
                    <button
                      onClick={() => moveRoom(room.slug, "maintenance")}
                      className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Maintenance
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Occupied Column */}
        <div 
          className="bg-blue-50 p-4 rounded-lg transition-colors duration-200"
          data-status="occupied"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "occupied")}
        >
          <h2 className="font-semibold mb-4 text-blue-700">Occupied</h2>
          <div className="space-y-4">
            {rooms
              .filter(room => room.status === "occupied")
              .map(room => (
                <div
                  key={room.slug}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("roomSlug", room.slug);
                  }}
                >
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.description}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => moveRoom(room.slug, "available")}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Mark Available
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Maintenance Column */}
        <div 
          className="bg-yellow-50 p-4 rounded-lg transition-colors duration-200"
          data-status="maintenance"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "maintenance")}
        >
          <h2 className="font-semibold mb-4 text-yellow-700">Maintenance</h2>
          <div className="space-y-4">
            {rooms
              .filter(room => room.status === "maintenance")
              .map(room => (
                <div
                  key={room.slug}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("roomSlug", room.slug);
                  }}
                >
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.description}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => moveRoom(room.slug, "available")}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Mark Available
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 