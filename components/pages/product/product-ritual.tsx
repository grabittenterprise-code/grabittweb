import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";

const ritualSteps = [
  {
    title: "Warm Water",
    copy: "Activate the gel with a splash of warm water."
  },
  {
    title: "60-Second Massage",
    copy: "Work in circular motions to dissolve buildup."
  },
  {
    title: "Cool Rinse",
    copy: "Finish cool to seal hydration and calm skin."
  }
];

export function ProductRitual() {
  return (
    <SectionShell className="relative overflow-hidden">
      <div className="section-wrap">
        <Reveal>
          <div className="label-block rounded-[3rem] p-10 sm:p-12">
            <TwoCol className="items-start">
              <div>
                <Eyebrow>The Ritual</Eyebrow>
                <h3 className="text-3xl leading-tight text-white sm:text-4xl">
                  Minimal steps, measured calm.
                </h3>
                <Body className="mt-4">
                  A clinical cleanse with a luxury finish. Simple, repeatable, and always gentle.
                </Body>
              </div>
              <div className="space-y-4">
                {ritualSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4"
                  >
                    <p className="text-xs uppercase tracking-[0.38em] text-white/55">
                      0{index + 1} — {step.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/60">{step.copy}</p>
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
