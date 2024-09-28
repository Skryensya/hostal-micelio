import CONTACT_INFO from "@/db/CONTACT_INFO.json";

export const checkAvailabilityTemplate = (dateRange, guests) => {
  let phoneNumber = CONTACT_INFO.phone.trim();
  phoneNumber = phoneNumber.replace("+", "");

  const { adults, children, pets } = guests;

  let message = "Hola, estoy consultando disponibilidad para ";

  const guestParts = [];
  if (adults > 0)
    guestParts.push(`_*${adults} adulto${adults > 1 ? "s" : ""}*_`);
  if (children > 0)
    guestParts.push(`_*${children} niño${children > 1 ? "s" : ""}*_`);
  if (pets > 0) guestParts.push(`_*${pets} mascota${pets > 1 ? "s" : ""}*_`);

  message +=
    guestParts.length > 1
      ? guestParts.slice(0, -1).join(", ") + " y " + guestParts.slice(-1)
      : guestParts[0];

  if (dateRange?.from) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedFromDate = dateRange.from.toLocaleDateString(
      "es-ES",
      options
    );
    message += `, para el día *${formattedFromDate}*`;

    if (dateRange.to && dateRange.to > dateRange.from) {
      const formattedToDate = dateRange.to.toLocaleDateString("es-ES", options);
      message += ` hasta el *${formattedToDate}*`;

      const nights = Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const days = nights + 1;
      message += ` (*${days}* día${days > 1 ? "s" : ""} / *${nights}* noche${
        nights > 1 ? "s" : ""
      })`;
    }
  }

  message += " ¿tienen habitaciones disponibles?";

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
