import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, MessageCircle, Bookmark, User } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/plan", label: "Plan", icon: Sparkles },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen pb-28 md:pb-10">
      {/* Top nav */}
      <header className="sticky top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Trip<span className="text-gradient">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 md:flex">
          {tabs.map((t) => {
            const active = pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active ? "bg-gradient-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/plan"
          className="hidden rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.05_265)] shadow-glow md:inline-flex"
        >
          Plan a trip
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-5 md:px-8">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden">
        <div className="glass-strong flex items-center justify-around rounded-2xl px-2 py-2">
          {tabs.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] transition-all ${
                  active ? "bg-gradient-primary text-white" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
