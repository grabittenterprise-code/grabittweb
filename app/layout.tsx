import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/context/providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "./globals.css";

const siteUrl = "https://www.grabitt.company";

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
  metadataBase: new URL(siteUrl),
  title: "GRABITT | Natural Inner Beauty",
  description:
    "Ultra-dark premium skincare by GRABITT. A cinematic single-product experience built around a matte black face wash bottle.",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "GRABITT",
    "Grabitt face wash",
    "natural face wash",
    "premium skincare",
    "botanical cleanser",
    "luxury face wash",
    "hydrating cleanser",
    "skin barrier face wash"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "GRABITT | Natural Inner Beauty",
    description:
      "A premium face wash designed to deeply cleanse your skin while preserving natural hydration.",
    url: siteUrl,
    siteName: "GRABITT",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "GRABITT | Natural Inner Beauty",
    description:
      "A premium face wash designed to deeply cleanse your skin while preserving natural hydration."
  }
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
