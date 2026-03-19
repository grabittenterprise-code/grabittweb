import { reviewStats } from "@/lib/site-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Body, Display, Eyebrow } from "@/components/ui/type";

export function ReviewsHero() {
  return (
    <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
      <div className="section-wrap">
        <TwoCol className="items-end">
          <Reveal>
            <Eyebrow>Reviews</Eyebrow>
            <Display>
              Trusted by
              <span className="block text-white/55">the minimalists.</span>
            </Display>
            <Body className="mt-6 max-w-xl">
              Real routines, real results. A premium cleanse praised for its texture, calm finish,
              and the way it looks on the shelf.
            </Body>
          </Reveal>
          <Reveal>
            <div className="grid gap-4">
              {reviewStats.map((stat) => (
                <div key={stat.label} className="label-block rounded-2xl px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/55">{stat.label}</p>
                  <p className="mt-3 text-3xl text-white/90">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/55">{stat.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </TwoCol>
      </div>
    </SectionShell>
  );
}
