import { Reveal } from "@/components/ui/reveal";
import { metrics } from "@/lib/site-data";

export function SocialProof() {
  return (
    <section className="section-space">
      <div className="section-wrap">
        <Reveal className="glass-panel rounded-[2rem] px-6 py-8 sm:px-10">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div key={metric.label} className="metric-divider relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/68">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-serif text-3xl text-white">{metric.value}</p>
                    <p className="text-sm uppercase tracking-[0.26em] text-white/45">{metric.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
