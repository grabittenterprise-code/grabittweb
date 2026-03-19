import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";

type SettingsPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function SettingsPageShell({ title, description, children }: SettingsPageShellProps) {
  return (
    <PageWrapper>
      <SectionShell className="pt-28 sm:pt-32 lg:pt-36">
        <div className="section-wrap mx-auto max-w-3xl">
          <div className="mb-5 flex items-center justify-between">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 transition hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">Account Settings</p>
            <h1 className="mt-2 text-4xl text-white/95">{title}</h1>
            <p className="mt-2 text-sm text-white/60">{description}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">{children}</div>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
