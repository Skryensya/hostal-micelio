import CONTACT_INFO from "@/db/CONTACT_INFO.json";

export const getDirectionsTemplate = () => {
  let phoneNumber = CONTACT_INFO.phone.trim();
  phoneNumber = phoneNumber.replace("+", "");

  const message = `Hola! ¿Me podrían decir cómo llegar a *Hostal Micelio*?`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
