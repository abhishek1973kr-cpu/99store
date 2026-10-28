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
  title: "ATELIER 99 | Royal Ladies & Gents Ornaments Vault (MRP ₹349 • Wholesale ₹99)",
  description:
    "An exclusive jewelry vault featuring 25 curated Ladies & Gents Royal Ornaments with minimum 5 high-resolution perspectives per article. Original MRP ₹349 offered at a special wholesale price of ₹99.",
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
