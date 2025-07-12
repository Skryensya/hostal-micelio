import type { Metadata } from "next";
import "@/styles/main.scss";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PostHogProvider } from "@/components/PostHogProvider";

import { k2d, nunito, croissantOne } from "@/app/fonts";
// import { ReactLenis } from "lenis/react";

export const metadata: Metadata = {
  title: "Hostal Micelio | Él lugar más acogedor de Villarrica",
  description: "Conoce el lugar más acogedor de Villarrica",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isGrayscale = false;

  return (
    <html
      lang="es"
      suppressHydrationWarning
      style={{ filter: isGrayscale ? "grayscale(100%)" : "none" }}
    >
      <body
        className={`${croissantOne.variable} ${k2d.variable} ${nunito.variable} bg-surface-1 min-h-screen overflow-x-hidden scroll-smooth font-sans antialiased`}
      >
        {/* <ReactLenis root> */}
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </PostHogProvider>
        {/* </ReactLenis> */}
      </body>
    </html>
  );
}
