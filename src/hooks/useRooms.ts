import { useQuery } from '@tanstack/react-query';
import { Room } from '@/lib/types';

// Simulate async data loading (in real app, this would be an API call)
const fetchRooms = async (): Promise<Room[]> => {
  // Import data asynchronously
  const [roomsData, roomFormats] = await Promise.all([
    import('@/db/ROOMS.json'),
    import('@/db/ROOM_FORMATS.json')
  ]);
  
  return roomsData.default as Room[];
};

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    staleTime: 10 * 60 * 1000, // 10 minutes - rooms don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Preload room formats
const fetchRoomFormats = async () => {
  const roomFormats = await import('@/db/ROOM_FORMATS.json');
  return roomFormats.default;
};

export const useRoomFormats = () => {
  return useQuery({
    queryKey: ['room-formats'],
    queryFn: fetchRoomFormats,
    staleTime: 60 * 60 * 1000, // 1 hour - formats rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};