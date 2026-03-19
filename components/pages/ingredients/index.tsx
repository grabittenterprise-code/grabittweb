import { PageWrapper } from "@/components/ui/page-wrapper";
import { Footer } from "@/components/sections/footer";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { IngredientsEditorial } from "@/components/pages/ingredients/ingredients-editorial";
import { IngredientsHero } from "@/components/pages/ingredients/ingredients-hero";
import { IngredientsPrinciples } from "@/components/pages/ingredients/ingredients-principles";

export function IngredientsPage() {
  return (
    <PageWrapper>
      <IngredientsHero />
      <IngredientsEditorial />
      <IngredientsPrinciples />
      <NewsletterSection />
      <Footer />
    </PageWrapper>
  );
}
