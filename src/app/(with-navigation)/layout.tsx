import type { Metadata } from "next";
import "@/styles/main.scss";
import { ThemeProvider } from "@/components/ThemeProvider";

import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { balooBhaijaan2, nunito, croissantOne } from "@/app/fonts";
import { ReactLenis } from "lenis/react";

export const metadata: Metadata = {
  title: "Hostal Micelio | Él lugar más acogedor de Villarrica",
  description: "Conoce el lugar más acogedor de Villarrica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isGrayscale = false;

  return (
    <html
      lang="es"
      suppressHydrationWarning
      style={{ filter: isGrayscale ? "grayscale(100%)" : "none" }}
    >
      <body
        className={`${croissantOne.variable} ${balooBhaijaan2.variable} ${nunito.variable} font-sans antialiased min-h-screen bg-surface-1 text-text overflow-x-hidden scroll-smooth`}
      >
        <ReactLenis root>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
