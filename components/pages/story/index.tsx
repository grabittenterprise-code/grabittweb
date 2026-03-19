import { PageWrapper } from "@/components/ui/page-wrapper";
import { Footer } from "@/components/sections/footer";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { StoryHero } from "@/components/pages/story/story-hero";
import { StoryManifesto } from "@/components/pages/story/story-manifesto";
import { StoryTimeline } from "@/components/pages/story/story-timeline";

export function StoryPage() {
  return (
    <PageWrapper>
      <StoryHero />
      <StoryTimeline />
      <StoryManifesto />
      <NewsletterSection />
      <Footer />
    </PageWrapper>
  );
}
