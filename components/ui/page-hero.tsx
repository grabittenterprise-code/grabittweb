import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
};

export function PageHero({ eyebrow, title, copy }: PageHeroProps) {
  return (
    <section className="section-space pt-32 sm:pt-36">
      <div className="section-wrap">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} copy={copy} />
        </Reveal>
      </div>
    </section>
  );
}
