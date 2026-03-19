import { Suspense } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Footer } from "@/components/sections/footer";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ShopAssurance } from "@/components/pages/shop/shop-assurance";
import { ShopGrid } from "@/components/pages/shop/shop-grid";
import { ShopHero } from "@/components/pages/shop/shop-hero";

export function ShopPage() {
  return (
    <PageWrapper>
      <ShopHero />
      <Suspense fallback={null}>
        <ShopGrid />
      </Suspense>
      <ShopAssurance />
      <NewsletterSection />
      <Footer />
    </PageWrapper>
  );
}
