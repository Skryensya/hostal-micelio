import { useQuery } from '@tanstack/react-query';

// Base fetch function
const fetchData = async (endpoint: string) => {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
};

// Query keys
export const queryKeys = {
  attractions: ['attractions'] as const,
  contactInfo: ['contactInfo'] as const,
  rooms: ['rooms'] as const,
  roomAmenities: ['roomAmenities'] as const,
  roomFormats: ['roomFormats'] as const,
  roomImages: ['roomImages'] as const,
  reviews: ['reviews'] as const,
  team: ['team'] as const,
  bedTypes: ['bedTypes'] as const,
};

// Hook definitions
export const useAttractions = () => {
  return useQuery({
    queryKey: queryKeys.attractions,
    queryFn: () => fetchData('attractions'),
  });
};

export const useContactInfo = () => {
  return useQuery({
    queryKey: queryKeys.contactInfo,
    queryFn: () => fetchData('contact-info'),
  });
};

export const useRooms = () => {
  return useQuery({
    queryKey: queryKeys.rooms,
    queryFn: () => fetchData('rooms'),
  });
};

export const useRoomAmenities = () => {
  return useQuery({
    queryKey: queryKeys.roomAmenities,
    queryFn: () => fetchData('room-amenities'),
  });
};

export const useRoomFormats = () => {
  return useQuery({
    queryKey: queryKeys.roomFormats,
    queryFn: () => fetchData('room-formats'),
  });
};

export const useRoomImages = () => {
  return useQuery({
    queryKey: queryKeys.roomImages,
    queryFn: () => fetchData('room-images'),
  });
};

export const useReviews = () => {
  return useQuery({
    queryKey: queryKeys.reviews,
    queryFn: () => fetchData('reviews'),
  });
};

export const useTeam = () => {
  return useQuery({
    queryKey: queryKeys.team,
    queryFn: () => fetchData('team'),
  });
};

export const useBedTypes = () => {
  return useQuery({
    queryKey: queryKeys.bedTypes,
    queryFn: () => fetchData('bed-types'),
  });
};