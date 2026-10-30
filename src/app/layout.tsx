import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bolera | Har Ek Maal ₹99 Flat Store • Ultra-Luxury Boutique",
  description:
    "Welcome to Bolera. An exclusive flat-rate lifestyle & jewelry store where every single item is universally priced at flat ₹99 (Benchmark Retail MRP ₹349). Fastly shipped within 12 hours with Cash on Delivery across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-cream-100 text-charcoal-850 font-sans antialiased min-h-screen selection:bg-gold-400/30 selection:text-charcoal-900">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
