import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { User, Mail, Globe, Bell, LogOut, Check, X, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — TripAI" },
      { name: "description", content: "Your TripAI profile and preferences." },
      { property: "og:title", content: "Profile — TripAI" },
      { property: "og:description", content: "Your TripAI profile and preferences." },
    ],
  }),
});

type Prefs = {
  name: string;
  emailWeekly: boolean;
  emailSuggestions: boolean;
  language: string;
  currency: string;
  notifWeather: boolean;
  notifReminders: boolean;
};

const DEFAULT_PREFS: Prefs = {
  name: "Guest Traveler",
  emailWeekly: true,
  emailSuggestions: true,
  language: "English",
  currency: "USD",
  notifWeather: true,
  notifReminders: true,
};

const PREFS_KEY = "tripai:prefs";

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

function ProfilePageContent() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [openPanel, setOpenPanel] = useState<null | "email" | "locale" | "notif">(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const update = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setPrefs((p) => ({ ...p, [k]: v }));

  const startEditName = () => {
    setNameDraft(prefs.name);
    setEditingName(true);
  };
  const saveName = () => {
    const v = nameDraft.trim() || "Guest Traveler";
    update("name", v);
    setEditingName(false);
    setToast("Name updated");
  };

  const signOut = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("tripai:last");
    localStorage.removeItem("tripai:saved");
    localStorage.removeItem(PREFS_KEY);
    setPrefs(DEFAULT_PREFS);
    setOpenPanel(null);
    setToast("Signed out — local session cleared");
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="glass-strong flex items-center gap-4 rounded-3xl p-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
            <User className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") setEditingName(false);
                  }}
                  className="glass w-full rounded-xl px-3 py-2 text-lg font-bold outline-none focus:ring-2 focus:ring-primary/60"
                  placeholder="Your name"
                />
                <button onClick={saveName} className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow" aria-label="Save name">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingName(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/5" aria-label="Cancel">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-bold">{prefs.name}</h1>
                <button onClick={startEditName} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-white/10" aria-label="Edit name">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">Sign in to sync trips across devices</p>
          </div>
          <button
            onClick={() => setToast("Sign-in requires Lovable Cloud — ask to enable it")}
            className="ml-auto hidden rounded-xl bg-gradient-gold px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.05_265)] md:inline-flex"
          >
            Sign in
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Row
            icon={<Mail className="h-4 w-4" />}
            title="Email preferences"
            desc={
              prefs.emailWeekly && prefs.emailSuggestions
                ? "Weekly picks & AI suggestions"
                : prefs.emailWeekly
                ? "Weekly picks only"
                : prefs.emailSuggestions
                ? "AI suggestions only"
                : "All email off"
            }
            open={openPanel === "email"}
            onClick={() => setOpenPanel(openPanel === "email" ? null : "email")}
          />
          <Row
            icon={<Globe className="h-4 w-4" />}
            title="Language & currency"
            desc={`${prefs.language} · ${prefs.currency}`}
            open={openPanel === "locale"}
            onClick={() => setOpenPanel(openPanel === "locale" ? null : "locale")}
          />
          <Row
            icon={<Bell className="h-4 w-4" />}
            title="Notifications"
            desc={
              prefs.notifWeather && prefs.notifReminders
                ? "Weather alerts & trip reminders"
                : prefs.notifWeather
                ? "Weather alerts only"
                : prefs.notifReminders
                ? "Trip reminders only"
                : "All notifications off"
            }
            open={openPanel === "notif"}
            onClick={() => setOpenPanel(openPanel === "notif" ? null : "notif")}
          />
          <Row
            icon={<LogOut className="h-4 w-4" />}
            title="Sign out"
            desc="Clear local session"
            onClick={() => {
              if (confirm("Sign out and clear saved trips on this device?")) signOut();
            }}
          />
        </div>

        {openPanel === "email" && (
          <Panel title="Email preferences">
            <Toggle
              label="Weekly travel picks"
              desc="Curated destinations each Sunday"
              value={prefs.emailWeekly}
              onChange={(v) => update("emailWeekly", v)}
            />
            <Toggle
              label="AI trip suggestions"
              desc="When our AI spots a deal or match"
              value={prefs.emailSuggestions}
              onChange={(v) => update("emailSuggestions", v)}
            />
          </Panel>
        )}

        {openPanel === "locale" && (
          <Panel title="Language & currency">
            <Select
              label="Language"
              value={prefs.language}
              options={["English", "Español", "Français", "Deutsch", "日本語", "हिन्दी"]}
              onChange={(v) => update("language", v)}
            />
            <Select
              label="Currency"
              value={prefs.currency}
              options={["USD", "EUR", "GBP", "JPY", "INR", "AUD"]}
              onChange={(v) => update("currency", v)}
            />
          </Panel>
        )}

        {openPanel === "notif" && (
          <Panel title="Notifications">
            <Toggle
              label="Weather alerts"
              desc="Storms & disruptions on your trip"
              value={prefs.notifWeather}
              onChange={(v) => update("notifWeather", v)}
            />
            <Toggle
              label="Trip reminders"
              desc="Check-in times & activity nudges"
              value={prefs.notifReminders}
              onChange={(v) => update("notifReminders", v)}
            />
          </Panel>
        )}

        <div className="mt-8 glass rounded-2xl p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Heads up:</strong> Auth, live AI, Google Maps and real weather need Lovable Cloud + connectors enabled. Ask me to wire them up next.
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-10">
          <div className="glass-strong pointer-events-auto rounded-full px-5 py-2.5 text-sm shadow-glow">{toast}</div>
        </div>
      )}
    </Layout>
  );
}

function Row({
  icon,
  title,
  desc,
  onClick,
  open,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
  open?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`glass hover:bg-accent/40 flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors ${
        open ? "ring-1 ring-primary/60" : ""
      }`}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5">{icon}</div>
      <div className="min-w-0">
        <div className="truncate font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong mt-4 rounded-3xl p-5">
      <div className="mb-3 text-sm font-semibold text-muted-foreground">{title}</div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="glass flex items-center gap-4 rounded-2xl px-4 py-3 text-left hover:bg-accent/30"
    >
      <div className="min-w-0 flex-1">
        <div className="font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? "bg-gradient-primary shadow-glow" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <div className="mb-2 text-xs text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              value === opt
                ? "bg-gradient-primary shadow-glow"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
