import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Body, Display, Eyebrow } from "@/components/ui/type";

export function IngredientsHero() {
  return (
    <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
      <div className="section-wrap relative">
        <div className="pointer-events-none absolute right-0 top-0 text-[0.6rem] uppercase tracking-[0.7em] text-white/20">
          <span className="vertical-type block">INGREDIENTS</span>
        </div>
        <TwoCol className="items-end">
          <Reveal>
            <Eyebrow>Ingredient Panel</Eyebrow>
            <Display>
              Botanical precision,
              <span className="block text-white/55">engineered calm.</span>
            </Display>
          </Reveal>
          <Reveal>
            <Body>
              Clinical-grade actives and botanical extracts, selected to soothe and hydrate without
              clutter. A clean, readable formula.
            </Body>
            <div className="mt-8 flex flex-wrap gap-3">
              {["No sulfates", "Dermatology tested", "Barrier safe"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </TwoCol>
      </div>
    </SectionShell>
  );
}
