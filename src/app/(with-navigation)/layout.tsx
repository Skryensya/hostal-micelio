import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
// import { ReactLenis } from "lenis/react";
import { GalleryProvider } from "@/components/GalleryProvider";
import { Gallery } from "@/components/Gallery";
import { PostHogProvider } from "@/components/PostHogProvider";

export const metadata: Metadata = {
  title: "Hostal Micelio | Él lugar más acogedor de Villarrica",
  description: "Conoce el lugar más acogedor de Villarrica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostHogProvider>
      <GalleryProvider>
        {/* <ReactLenis root> */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          {children} 
          <Footer />
          <Gallery />
        </ThemeProvider>
        {/* </ReactLenis> */}
      </GalleryProvider>
    </PostHogProvider>
  );
}
