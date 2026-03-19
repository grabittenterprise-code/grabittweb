import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/context/providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"]
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"]
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "GRABITT | Natural Inner Beauty",
  description:
    "Ultra-dark premium skincare by GRABITT. A cinematic single-product experience built around a matte black face wash bottle."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${serif.variable} ${sans.variable} ${playfair.variable} bg-background text-white antialiased`}
      >
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
