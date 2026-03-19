import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";

const trustQuotes = [
  "“The texture alone feels like a studio facial.”",
  "“The bottle is a design object that performs.”",
  "“Clean, calm, and never stripped.”"
];

export function ReviewsTrust() {
  return (
    <SectionShell className="overflow-hidden">
      <div className="section-wrap">
        <Reveal>
          <div className="label-block rounded-[3rem] p-10 sm:p-12">
            <TwoCol className="items-start">
              <div>
                <Eyebrow>Press Notes</Eyebrow>
                <h3 className="text-3xl leading-tight text-white sm:text-4xl">
                  A quiet cult favorite.
                </h3>
                <Body className="mt-4">
                  Editorial and clinical language share one tone: minimal, precise, calm.
                </Body>
              </div>
              <div className="space-y-4">
                {trustQuotes.map((quote) => (
                  <p
                    key={quote}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm leading-7 text-white/70"
                  >
                    {quote}
                  </p>
                ))}
              </div>
            </TwoCol>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
