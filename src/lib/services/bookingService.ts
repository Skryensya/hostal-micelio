import { Booking } from "@/lib/types";

const STORAGE_KEY = "roomBookings";

// Interfaz para el servicio de reservas
export interface IBookingService {
  getAll(): Promise<Booking[]>;
  save(bookings: Booking[]): Promise<void>;
}

// Implementación con localStorage
class LocalStorageBookingService implements IBookingService {
  async getAll(): Promise<Booking[]> {
    if (typeof window === "undefined") return [];
    
    const savedBookings = localStorage.getItem(STORAGE_KEY);
    if (!savedBookings) return [];

    // Convertir las fechas de string a Date al cargar
    return JSON.parse(savedBookings, (key, value) => {
      if (key === "startDate" || key === "endDate") {
        return new Date(value);
      }
      return value;
    });
  }

  async save(bookings: Booking[]): Promise<void> {
    if (typeof window === "undefined") return;
    
    // Asegurarse de que las fechas sean serializadas correctamente
    const bookingsToSave = bookings.map(booking => ({
      ...booking,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString()
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingsToSave));
  }
}

// En el futuro, podríamos tener una implementación con base de datos
// class DatabaseBookingService implements IBookingService {
//   async getAll(): Promise<Booking[]> {
//     // Implementar llamada a la API/DB
//   }
//
//   async save(bookings: Booking[]): Promise<void> {
//     // Implementar llamada a la API/DB
//   }
// }

// Exportar la implementación actual
export const bookingService: IBookingService = new LocalStorageBookingService(); 