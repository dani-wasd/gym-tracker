import type { Metadata } from "next";
import { Big_Shoulders, Big_Shoulders_Stencil, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const stencil = Big_Shoulders_Stencil({
  variable: "--font-big-shoulders-stencil",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Plan your training days, log your workouts, and let friends see whether you showed up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${stencil.variable} ${mono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
