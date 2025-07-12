// import { auth } from "@/lib/auth";
// import { SessionProvider } from "@/components/SessionProvider";
import "@/styles/main.scss";
import { k2d, nunito, croissantOne } from "@/app/fonts";
import QueryClientProvider from "@/components/QueryClientProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hostal Micelio",
  description: "El lugar más acogedor de Villarrica",
  other: {
    'font-display': 'swap',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${croissantOne.variable} ${k2d.variable} ${nunito.variable} font-sans antialiased min-h-screen bg-surface-1 text-text overflow-x-hidden scroll-smooth`}>
        <QueryClientProvider>
          {/* <SessionProvider session={session}> */}
            {children}
          {/* </SessionProvider> */}
        </QueryClientProvider>
      </body>
    </html>
  );
} 