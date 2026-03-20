import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

const siteUrl = "https://www.grabitt.company";

export const metadata: Metadata = {
  title: "GRABITT Face Wash for Deep Cleansing and Hydration",
  description:
    "Shop GRABITT premium natural face wash for deep cleansing, hydration, and skin-barrier-friendly care. Explore our botanical cleanser and skincare experience.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "GRABITT Face Wash for Deep Cleansing and Hydration",
    description:
      "Shop GRABITT premium natural face wash for deep cleansing, hydration, and skin-barrier-friendly care.",
    url: siteUrl
  },
  twitter: {
    title: "GRABITT Face Wash for Deep Cleansing and Hydration",
    description:
      "Shop GRABITT premium natural face wash for deep cleansing, hydration, and skin-barrier-friendly care."
  }
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GRABITT",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "GRABITT Face Wash",
    brand: {
      "@type": "Brand",
      name: "GRABITT"
    },
    description:
      "Premium botanical face wash designed for deep cleansing while preserving hydration and supporting the skin barrier.",
    category: "Skincare",
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/shop`,
      priceCurrency: "INR",
      price: "200",
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <LandingPage />
    </>
  );
}
