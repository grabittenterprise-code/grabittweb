import { productHighlights } from "@/lib/site-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { ThreeCol, TwoCol } from "@/components/ui/packaging-grid";
import { Body, Eyebrow } from "@/components/ui/type";
import { LabelBlock } from "@/components/ui/label-block";

export function ProductBenefits() {
  return (
    <SectionShell>
      <div className="section-wrap">
        <Reveal>
          <TwoCol className="items-end">
            <div>
              <Eyebrow>Performance</Eyebrow>
              <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                Editorially precise.
              </h2>
            </div>
            <Body>
              Subtle, clinical, and luxurious. Every element is tuned for a clean, composed
              experience with zero visual noise.
            </Body>
          </TwoCol>
        </Reveal>
        <ThreeCol className="mt-12">
          {productHighlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <LabelBlock
                label={`0${index + 1}`}
                title={item.title}
                copy={item.copy}
                className="h-full"
              />
            </Reveal>
          ))}
        </ThreeCol>
      </div>
    </SectionShell>
  );
}
