import { Baloo_Bhaijaan_2, Nunito, Croissant_One } from "next/font/google";

export const balooBhaijaan2 = Baloo_Bhaijaan_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo-bhaijaan-2",
  weight: ["400", "500", "600", "700", "800"],
});

export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: false, // Disable automatic fallback adjustment
});

export const croissantOne = Croissant_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-croissant-one",
  weight: ["400"],
});
