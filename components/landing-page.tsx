import { ExperienceSection } from "@/components/sections/experience-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { IngredientSpotlight } from "@/components/sections/ingredient-spotlight";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { SocialProof } from "@/components/sections/social-proof";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyGrabitt } from "@/components/sections/why-grabitt";
import { SiteShell } from "@/components/layouts/site-shell";

export function LandingPage() {
  return (
    <SiteShell>
      <HeroSection />
      <SocialProof />
      <WhyGrabitt />
      <ProductShowcase />
      <IngredientSpotlight />
      <TestimonialsSection />
      <ExperienceSection />
      <FaqSection />
      <NewsletterSection />
      <Footer />
    </SiteShell>
  );
}
