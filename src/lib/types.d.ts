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
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  platform: string;
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
