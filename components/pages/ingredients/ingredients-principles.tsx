import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";

const principles = [
  {
    title: "Minimal Load",
    copy: "Only the ingredients that earn a place in the routine."
  },
  {
    title: "Ritual Texture",
    copy: "Cushioned glide that rinses clean without squeak."
  },
  {
    title: "Daily Harmony",
    copy: "Built to layer with actives and protect the barrier."
  }
];

export function IngredientsPrinciples() {
  return (
    <SectionShell>
      <div className="section-wrap">
        <Reveal>
          <div className="label-block rounded-[3rem] p-10 sm:p-12">
            <TwoCol className="items-start">
              <div>
                <Eyebrow>Formulation Principles</Eyebrow>
                <h3 className="text-3xl leading-tight text-white sm:text-4xl">
                  Precision beats clutter.
                </h3>
                <Body className="mt-4">
                  A focused ingredient deck means better performance and a calmer skin response.
                </Body>
              </div>
              <div className="space-y-4">
                {principles.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4"
                  >
                    <p className="text-sm uppercase tracking-[0.28em] text-white/70">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/60">{item.copy}</p>
                  </div>
                ))}
              </div>
            </TwoCol>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
