import { SettingsPageShell } from "@/components/settings/settings-page-shell";

export default function TermsPage() {
  return (
    <SettingsPageShell title="Terms, Policies and Licenses" description="Review legal policies and platform usage terms.">
      <div className="space-y-3 text-sm text-white/75">
        <p className="rounded-xl border border-white/15 bg-black/30 p-4">Terms of Service</p>
        <p className="rounded-xl border border-white/15 bg-black/30 p-4">Privacy Policy</p>
        <p className="rounded-xl border border-white/15 bg-black/30 p-4">Refund & Cancellation Policy</p>
        <p className="rounded-xl border border-white/15 bg-black/30 p-4">Open source licenses</p>
      </div>
    </SettingsPageShell>
  );
}

