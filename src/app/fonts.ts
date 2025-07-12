import { K2D, Nunito, Croissant_One } from "next/font/google";

export const k2d = K2D({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-k2d",
  weight: ["400", "500", "600", "700"], // Removed 800 - not commonly used
  preload: true,
});

export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700"], // Removed 800 - not commonly used
  adjustFontFallback: false, // Disable automatic fallback adjustment
  preload: false, // Only preload primary fonts
});

export const croissantOne = Croissant_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-croissant-one",
  weight: ["400"],
  preload: true, // Preload heading font
});
