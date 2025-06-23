import { format as formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Room } from "@/lib/types";
import CONTACT_INFO from "@/db/CONTACT_INFO.json";

interface BookingTemplateParams {
  room: Room;
  formatLabel: string;
  dateRange: DateRange | undefined;
  numberOfNights: number;
  adults: number;
  children: number;
  pricePerNight: number;
  totalPrice: number;
  distributionSuggestion?: string;
}

export function generateBookingTemplate({
  room,
  formatLabel,
  dateRange,
  numberOfNights,
  adults,
  children,
  pricePerNight,
  totalPrice,
  distributionSuggestion
}: BookingTemplateParams): string {
  const totalGuests = adults + children;
  let message = "¡Hola Hostal Micelio! Les escribo porque me interesa alojarme con ustedes.";

  // Fechas
  if (dateRange?.from) {
    const formattedFromDate = formatDate(dateRange.from, "d 'de' MMMM", { locale: es });
    message += `\n\nEstaba mirando para el *${formattedFromDate}*`;

    if (dateRange.to && dateRange.to > dateRange.from) {
      const formattedToDate = formatDate(dateRange.to, "d 'de' MMMM", { locale: es });
      message += ` hasta el *${formattedToDate}*`;

      const days = numberOfNights + 1;
      message += ` (serían *${numberOfNights}* noches)`;
    }
  }

  message += "\n\nSomos ";
  const guestParts = [];
  if (adults > 0)
    guestParts.push(`_*${adults} adulto${adults > 1 ? "s" : ""}*_`);
  if (children > 0)
    guestParts.push(`_*${children} niño${children > 1 ? "s" : ""}*_`);

  message +=
    guestParts.length > 1
      ? guestParts.slice(0, -1).join(", ") + " y " + guestParts.slice(-1)
      : guestParts[0];

  message += ` y nos gustó mucho la habitación *${room.name}* (${formatLabel})`;

  if (totalGuests > room.capacity) {
    message += "\n\nVi que quizás somos más personas de las que caben normalmente en esa habitación. ¿Nos podrían ayudar a ver cuál sería la mejor forma de acomodarnos?";

    if (distributionSuggestion) {
      message += ` ${distributionSuggestion}`;
    }

    const pricePerNightFormatted = pricePerNight.toLocaleString("es-CL");
    message += `\n\nPor lo que vi, esta habitación está a *$${pricePerNightFormatted} CLP* por noche`;
  } else {
    const pricePerNightFormatted = pricePerNight.toLocaleString("es-CL");
    const totalPriceFormatted = totalPrice.toLocaleString("es-CL");
    message += `.`;
    message += `\n\nVi en la página que el precio es *$${pricePerNightFormatted} CLP* por noche, quedando en total en *$${totalPriceFormatted} CLP*`;
  }

  message += "\n\n¿Me podrían confirmar si tienen disponibilidad? ¡Gracias!";

  return message;
}

export function getWhatsAppBookingLink(params: BookingTemplateParams): string {
  const message = generateBookingTemplate(params);
  return `https://wa.me/${CONTACT_INFO.phone}?text=${encodeURIComponent(message)}`;
}
