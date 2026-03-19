import { PageWrapper } from "@/components/ui/page-wrapper";
import { Footer } from "@/components/sections/footer";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ProductBenefits } from "@/components/pages/product/product-benefits";
import { ProductHero } from "@/components/pages/product/product-hero";
import { ProductRitual } from "@/components/pages/product/product-ritual";

export function ProductPage() {
  return (
    <PageWrapper>
      <ProductHero />
      <ProductBenefits />
      <ProductRitual />
      <NewsletterSection />
      <Footer />
    </PageWrapper>
  );
}
