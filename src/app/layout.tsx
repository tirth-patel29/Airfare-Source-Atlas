import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Airfare Source Atlas — SIH26056 India Airfare Data Source Registry",
  description:
    "A structured registry of airline and flight-booking data sources supporting the SIH26056 real-time airfare price index initiative for India.",
  keywords: [
    "airfare",
    "source registry",
    "India",
    "airlines",
    "OTA",
    "metasearch",
    "SIH26056",
    "price index",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#f5f5f7] text-[#1d1d1f] min-h-screen">
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
