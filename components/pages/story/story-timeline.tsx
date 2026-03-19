import { storyTimeline } from "@/lib/site-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Body, Eyebrow } from "@/components/ui/type";

export function StoryTimeline() {
  return (
    <SectionShell>
      <div className="section-wrap">
        <Reveal>
          <TwoCol className="items-end">
            <div>
              <Eyebrow>Timeline</Eyebrow>
              <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                Built with intention.
              </h2>
            </div>
            <Body>
              Every release evolves the ritual. From concept to formulation, the details are
              handled like a product studio.
            </Body>
          </TwoCol>
        </Reveal>
        <div className="mt-12 space-y-6">
          {storyTimeline.map((item, index) => (
            <Reveal key={item.year} delay={index * 0.08}>
              <div className="label-block rounded-[2.6rem] p-8 sm:p-10">
                <div className="grid gap-6 lg:grid-cols-[0.35fr_1fr] lg:items-center">
                  <p className="text-4xl text-white/80">{item.year}</p>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/55">
                      {item.title}
                    </p>
                    <p className="mt-4 text-base leading-7 text-white/65">{item.copy}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
