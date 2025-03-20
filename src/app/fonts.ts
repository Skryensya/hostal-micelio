import { Poppins, Baloo_Bhaijaan_2, Nunito_Sans } from "next/font/google";

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

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: false, // Disable automatic fallback adjustment
});
