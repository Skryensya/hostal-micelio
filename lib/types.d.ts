export type Room = {
  name: string; // Nombre de la habitación
  slug: string; // Identificador único
  description: string; // Descripción de la habitación
  floor: number; // Número de piso
  beds: string[]; // Identificadores de las camas
  capacity: number; // Capacidad máxima de personas
  hasPrivateToilet?: boolean; // Indica si tiene baño privado (opcional)
};

export type RoomImage = {
  src: string; // Ruta de la imagen
  alt: string; // Descripción alternativa para accesibilidad
};

export type TeamMember = {
  name: string; // Nombre del miembro del equipo
  subtitle: string; // Rol o título dentro del hostal
  description: string; // Breve descripción de su aporte o personalidad
  picture1: string; // Ruta a la primera imagen del miembro
  picture2: string; // Ruta a la segunda imagen del miembro
};
export type Bed = {
  name: string; // Nombre de la cama
  size: string; // Tamaño de la cama (ej. "matrimonial", "1,5", "literas")
  capacity: number; // Capacidad máxima de personas
};

export type Review = {
  name: string; // Nombre del huesped
  comment: string; // Comentario del huesped
  url: string; // URL de la imagen del huesped
  hue: number; // Color de fondo del avatar
};
