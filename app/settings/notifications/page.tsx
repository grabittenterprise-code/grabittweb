"use client";

import { useEffect, useState } from "react";

import { SettingsPageShell } from "@/components/settings/settings-page-shell";

type Notifications = {
  orderUpdates: boolean;
  shippingAlerts: boolean;
  backInStock: boolean;
  promotions: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notifications>({
    orderUpdates: true,
    shippingAlerts: true,
    backInStock: false,
    promotions: false,
  });
  const [state, setState] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/account/settings");
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.preferences?.notifications) {
        setNotifications(data.preferences.notifications);
      }
    };

    void load();
  }, []);

  const toggleSetting = async (key: keyof Notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    const response = await fetch("/api/account/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: {
          notifications: next,
        },
      }),
    });
    const data = await response.json().catch(() => ({}));
    setState(response.ok ? "Notification settings updated." : data.error ?? "Unable to save settings.");
  };

  return (
    <SettingsPageShell title="Notification Settings" description="Control what updates you receive from GRABITT.">
      <div className="space-y-3">
        {[
          { key: "orderUpdates", label: "Order updates" },
          { key: "shippingAlerts", label: "Shipping alerts" },
          { key: "backInStock", label: "Back-in-stock notifications" },
          { key: "promotions", label: "Promotions and offers" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-xl border border-white/15 bg-black/30 p-4">
            <span className="text-sm text-white/85">{item.label}</span>
            <button
              type="button"
              onClick={() => void toggleSetting(item.key as keyof Notifications)}
              className={`h-6 w-11 rounded-full border border-white/20 px-1 transition ${
                notifications[item.key as keyof Notifications] ? "bg-[#8ba9ff]" : "bg-white/10"
              }`}
            >
              <span className={`block h-4 w-4 rounded-full bg-white transition ${
                notifications[item.key as keyof Notifications] ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>
        ))}
      </div>
      {state ? <p className="mt-4 text-sm text-white/65">{state}</p> : null}
    </SettingsPageShell>
  );
}
