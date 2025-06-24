import { Booking } from "@/lib/types";

const STORAGE_KEY = 'hostal_micelio_bookings';

// Evento personalizado para sincronización
const BOOKING_CHANGE_EVENT = 'BOOKING_CHANGE';

class BookingService {
  private bookings: Booking[] = [];

  constructor() {
    // Cargar bookings iniciales del localStorage
    this.loadFromStorage();
    
    // Escuchar cambios de otros componentes/ventanas
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.loadFromStorage();
        this.notifyChange();
      }
    });
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir las fechas de string a Date
        this.bookings = parsed.map((booking: Booking) => ({
          ...booking,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate)
        }));
      }
    } catch (error) {
      console.error('Error loading bookings from storage:', error);
      this.bookings = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookings));
      // Notificar a otros componentes del cambio
      this.notifyChange();
    } catch (error) {
      console.error('Error saving bookings to storage:', error);
    }
  }

  private notifyChange() {
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent(BOOKING_CHANGE_EVENT, {
      detail: { bookings: this.bookings }
    }));
  }

  getAll(): Booking[] {
    return this.bookings;
  }

  save(bookings: Booking[]) {
    this.bookings = bookings;
    this.saveToStorage();
  }

  add(booking: Omit<Booking, "id">): Booking {
    const newBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.bookings.push(newBooking);
    this.saveToStorage();
    return newBooking;
  }

  update(booking: Booking) {
    const index = this.bookings.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      this.bookings[index] = booking;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  delete(id: string) {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookings.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  subscribe(callback: (bookings: Booking[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail.bookings);
    };
    
    window.addEventListener(BOOKING_CHANGE_EVENT, handler);
    
    // Retornar función para desuscribirse
    return () => {
      window.removeEventListener(BOOKING_CHANGE_EVENT, handler);
    };
  }
}

// Exportar una única instancia del servicio
export const bookingService = new BookingService(); 