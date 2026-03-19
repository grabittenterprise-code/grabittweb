import Link from "next/link";
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  Languages,
  MapPin,
  Shield,
  Store,
  UserRound,
} from "lucide-react";

import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";

type SettingItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const accountSettings: SettingItem[] = [
  { label: "Edit Profile", href: "/settings/edit-profile", icon: UserRound },
  { label: "Saved Cards", href: "/settings/saved-cards", icon: CreditCard },
  { label: "Saved Addresses", href: "/settings/saved-addresses", icon: MapPin },
  { label: "Select Language", href: "/settings/language", icon: Languages },
  { label: "Notification Settings", href: "/settings/notifications", icon: Bell },
  { label: "Privacy Center", href: "/settings/privacy", icon: Shield },
];

const earnWithGrabitt: SettingItem[] = [{ label: "Sell with GRABITT", href: "/settings/sell", icon: Store }];

const feedback: SettingItem[] = [
  { label: "Terms, Policies and Licenses", href: "/settings/terms", icon: FileText },
];

function SettingsSection({ title, items }: { title: string; items: SettingItem[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-2xl text-white/95">{title}</h2>
      </div>
      <div>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-4 border-b border-white/10 px-5 py-4 transition hover:bg-white/[0.04] last:border-b-0"
            >
              <Icon className="h-5 w-5 text-[#8ba9ff]" />
              <span className="flex-1 text-base text-white/90">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-white/45 transition group-hover:text-white/75" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <PageWrapper>
      <SectionShell className="pt-28 sm:pt-32 lg:pt-36">
        <div className="section-wrap mx-auto max-w-3xl">
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-sm uppercase tracking-[0.28em] text-white/55">Try GRABITT in your language</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["English", "Hindi", "Tamil", "Telugu", "Kannada"].map((lang) => (
                <Link
                  key={lang}
                  href="/settings/language"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                >
                  {lang}
                </Link>
              ))}
              <Link href="/settings/language" className="px-2 text-sm font-semibold text-[#8ba9ff]">
                +8 more
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <SettingsSection title="Account Settings" items={accountSettings} />
            <SettingsSection title="Earn with GRABITT" items={earnWithGrabitt} />
            <SettingsSection title="Feedback & Information" items={feedback} />
          </div>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
