import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";

const assurances = [
  {
    title: "Concierge Support",
    copy: "Personal routine guidance from our studio team."
  },
  {
    title: "Clean Packaging",
    copy: "Recyclable boxes and minimal shipping footprint."
  },
  {
    title: "Limited Runs",
    copy: "Small-batch production for controlled quality."
  }
];

export function ShopAssurance() {
  return (
    <SectionShell className="overflow-hidden">
      <div className="section-wrap">
        <Reveal>
          <div className="label-block rounded-[3rem] p-10 sm:p-12">
            <TwoCol className="items-start">
              <div>
                <Eyebrow>Assurance</Eyebrow>
                <h3 className="text-3xl leading-tight text-white sm:text-4xl">
                  Luxury that feels considered.
                </h3>
                <Body className="mt-4">
                  Every order comes with a clean unboxing experience and responsive support.
                </Body>
              </div>
              <div className="space-y-4">
                {assurances.map((item) => (
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
