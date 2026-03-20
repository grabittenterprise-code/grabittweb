import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/context/providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "./globals.css";

const siteUrl = "https://www.grabitt.company";
const siteName = "GRABITT";
const defaultTitle = "GRABITT Face Wash | Premium Natural Skincare";
const defaultDescription =
  "GRABITT is a premium skincare brand offering natural face wash and botanical cleansing essentials designed for deep cleansing, hydration, and healthy-looking skin.";

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
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  alternates: {
    canonical: "/"
  },
  keywords: [
    "GRABITT",
    "Grabitt skincare",
    "Grabitt face wash",
    "Grabitt cleanser",
    "natural face wash",
    "premium skincare",
    "botanical cleanser",
    "luxury face wash",
    "hydrating cleanser",
    "skin barrier face wash",
    "face wash for glowing skin",
    "premium face cleanser India"
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
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    sameAs: []
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
