export interface Room {
  name: string;
  slug: string;
  description: string;
  floor: number;
  beds: string[];
  capacity: number;
  hasPrivateToilet: boolean;
  defaultFormat: string;
  alternativeFormats: string[];
  gender: string;
}

export interface RoomImage {
  src: string;
  thumbnail: string;
  alt: string;
}

export interface RoomFormat {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
}

export interface RoomAmenity {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Review {
  name: string;
  comment: string;
  url: string;
  hue: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  distance: string;
  type: string;
  image?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  maps: string;
}

export interface RoomOption {
  id: string;
  label: string;
  price: number;
  amenities: string[];
}

export type Booking = {
  id: string;
  guestName: string;
  roomSlug: string;
  startDate: Date;
  endDate: Date;
  startDay: number;
  endDay: number;
  color: string;
  notes?: string;
  description?: string;
};
