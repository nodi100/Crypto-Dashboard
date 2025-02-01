import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSideStore } from "@/store/useStore";
import "./globals.css";

import Navbar from "@/components/Navbar";
import StoreInitializer from "@/components/StoreInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Monitor and convert cryptocurrencies in real-time",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverState = await getServerSideStore();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreInitializer serverState={serverState} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
