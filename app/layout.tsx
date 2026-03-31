import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import AgeVerification from "./components/AgeVerification";
import LenisProvider from "@/components/LenisProvider";
import { CartProvider } from "@/components/CartProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EVERLACE",
  description: "Emotional companion technology designed for meaningful connection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <CartProvider>
          <LenisProvider />
          <AgeVerification />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
