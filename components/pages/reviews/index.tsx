import { PageWrapper } from "@/components/ui/page-wrapper";
import { Footer } from "@/components/sections/footer";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ReviewsHero } from "@/components/pages/reviews/reviews-hero";
import { ReviewsTrust } from "@/components/pages/reviews/reviews-trust";
import { ReviewsWall } from "@/components/pages/reviews/reviews-wall";

export function ReviewsPage() {
  return (
    <PageWrapper>
      <ReviewsHero />
      <ReviewsWall />
      <ReviewsTrust />
      <NewsletterSection />
      <Footer />
    </PageWrapper>
  );
}
