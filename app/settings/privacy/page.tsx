import { SettingsPageShell } from "@/components/settings/settings-page-shell";

export default function PrivacyPage() {
  return (
    <SettingsPageShell title="Privacy Center" description="Manage your data preferences and account-level privacy controls.">
      <div className="space-y-3">
        {[
          "Download my account data",
          "Control personalized recommendations",
          "Manage connected devices",
          "Delete account request",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-white/15 bg-black/30 p-4 text-sm text-white/85">
            {item}
          </div>
        ))}
      </div>
    </SettingsPageShell>
  );
}

