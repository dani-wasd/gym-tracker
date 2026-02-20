import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "A gym app to track your personal workouts, keep your friends in check, making sure everyone is consistent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black" data-new-gr-c-s-check-loaded="14.1274.0" data-gr-ext-installed="" data-new-gr-c-s-loaded="14.1274.0">
        {children}
      </body>
    </html>
  );
}
