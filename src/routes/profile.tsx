import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { User, Mail, Globe, Bell, LogOut } from "lucide-react";

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

function ProfilePage() {
  return (
    <Layout>
      <div className="py-6">
        <div className="glass-strong flex items-center gap-4 rounded-3xl p-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
            <User className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold">Guest Traveler</h1>
            <p className="text-sm text-muted-foreground">Sign in to sync trips across devices</p>
          </div>
          <button className="ml-auto hidden rounded-xl bg-gradient-gold px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.05_265)] md:inline-flex">Sign in</button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Row icon={<Mail className="h-4 w-4" />} title="Email preferences" desc="Weekly travel picks & AI suggestions" />
          <Row icon={<Globe className="h-4 w-4" />} title="Language & currency" desc="English · USD" />
          <Row icon={<Bell className="h-4 w-4" />} title="Notifications" desc="Weather alerts, trip reminders" />
          <Row icon={<LogOut className="h-4 w-4" />} title="Sign out" desc="Clear local session" />
        </div>

        <div className="mt-8 glass rounded-2xl p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Heads up:</strong> Auth, live AI, Google Maps and real weather need Lovable Cloud + connectors enabled. Ask me to wire them up next.
        </div>
      </div>
    </Layout>
  );
}

function Row({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button className="glass hover:bg-accent/40 flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5">{icon}</div>
      <div className="min-w-0">
        <div className="truncate font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}
