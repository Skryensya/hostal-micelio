import { Poppins, Baloo_Bhaijaan_2 } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const balooBhaijaan2 = Baloo_Bhaijaan_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo-bhaijaan-2",
  weight: ["400", "500", "600", "700", "800"],
});
