import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Body, Display, Eyebrow } from "@/components/ui/type";

export function StoryHero() {
  return (
    <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
      <div className="section-wrap relative">
        <div className="pointer-events-none absolute left-0 top-4 text-[0.6rem] uppercase tracking-[0.7em] text-white/20">
          <span className="vertical-type block">STORY</span>
        </div>
        <TwoCol className="items-end">
          <Reveal>
            <Eyebrow>Our Story</Eyebrow>
            <Display>
              Design-led skincare,
              <span className="block text-white/55">built for daily rituals.</span>
            </Display>
          </Reveal>
          <Reveal>
            <Body>
              GRABITT began as a product design study: build a single object that feels cinematic on
              the counter and quietly powerful on the skin.
            </Body>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Minimal ingredients", "Tactile packaging", "Studio-level results"].map((item) => (
                <div
                  key={item}
                  className="label-block rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/65"
                >
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </TwoCol>
      </div>
    </SectionShell>
  );
}
