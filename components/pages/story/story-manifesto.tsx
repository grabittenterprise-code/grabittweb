import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";

export function StoryManifesto() {
  return (
    <SectionShell className="overflow-hidden">
      <div className="section-wrap">
        <Reveal>
          <div className="label-block rounded-[3rem] p-10 sm:p-12">
            <TwoCol className="items-start">
              <div>
                <Eyebrow>Manifesto</Eyebrow>
                <h3 className="text-3xl leading-tight text-white sm:text-4xl">
                  Make the everyday feel ceremonial.
                </h3>
                <Body className="mt-4">
                  We design for people who keep things simple, but demand quality in every detail.
                  The object matters as much as the formula.
                </Body>
              </div>
              <div className="space-y-4">
                {[
                  "Designed for calm, not clutter.",
                  "Quietly bold, never loud.",
                  "A ritual you return to."
                ].map((line) => (
                  <p
                    key={line}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm leading-7 text-white/65"
                  >
                    {line}
                  </p>
                ))}
                <Link href="/product" className="luxury-button luxury-button-primary w-full">
                  Explore the Product
                </Link>
              </div>
            </TwoCol>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
