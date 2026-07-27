import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { generateItinerary, type PlanInput } from "@/lib/mock-itinerary";
import { tripStore } from "@/lib/trip-store";
import { Sparkles, Wallet, Calendar, Plane, Loader2 } from "lucide-react";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
  head: () => ({
    meta: [
      { title: "AI Planner — TripAI" },
      { name: "description", content: "Tell us your vibe. TripAI builds a full itinerary with hotels, weather and budget." },
      { property: "og:title", content: "AI Planner — TripAI" },
      { property: "og:description", content: "Tell us your vibe. TripAI builds a full itinerary with hotels, weather and budget." },
    ],
  }),
});

const STYLES = ["Relaxed", "Adventure", "Cultural", "Foodie", "Nightlife", "Family"];
const INTERESTS = ["Beaches", "Mountains", "History", "Museums", "Cafés", "Nature", "Shopping", "Nightlife", "Photography", "Hidden gems"];
const TRANSPORT = ["Walking", "Public transit", "Rental car", "Rideshare"];

function PlanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PlanInput>({
    destination: "Lisbon",
    days: 4,
    budget: 1200,
    style: "Cultural",
    interests: ["Cafés", "History", "Photography"],
    transport: "Walking",
  });

  const toggle = (i: string) =>
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));

  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const plan = generateItinerary(form);
    tripStore.setLast(form, plan);
    navigate({ to: "/itinerary" });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl py-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-gold">
          <Sparkles className="h-4 w-4" /> AI Planner
        </div>
        <h1 className="text-3xl font-extrabold md:text-4xl">Design your perfect trip</h1>
        <p className="mt-2 text-muted-foreground">Answer a few things and TripAI will craft it in seconds.</p>

        <div className="mt-8 space-y-5">
          <Field label="Destination" icon={<Plane className="h-4 w-4" />}>
            <input
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
              placeholder="Where to?"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Travel days · ${form.days}`} icon={<Calendar className="h-4 w-4" />}>
              <input
                type="range" min={1} max={14} value={form.days}
                onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                className="w-full accent-[oklch(0.70_0.19_275)]"
              />
            </Field>
            <Field label={`Budget · $${form.budget}`} icon={<Wallet className="h-4 w-4" />}>
              <input
                type="range" min={200} max={10000} step={100} value={form.budget}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                className="w-full accent-[oklch(0.70_0.19_275)]"
              />
            </Field>
          </div>

          <Field label="Travel style">
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <Chip key={s} active={form.style === s} onClick={() => setForm({ ...form, style: s })}>{s}</Chip>
              ))}
            </div>
          </Field>

          <Field label="Interests">
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <Chip key={i} active={form.interests.includes(i)} onClick={() => toggle(i)}>{i}</Chip>
              ))}
            </div>
          </Field>

          <Field label="Transport preference">
            <div className="flex flex-wrap gap-2">
              {TRANSPORT.map((t) => (
                <Chip key={t} active={form.transport === t} onClick={() => setForm({ ...form, transport: t })}>{t}</Chip>
              ))}
            </div>
          </Field>

          <button
            disabled={loading || !form.destination.trim()}
            onClick={submit}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-4 text-base font-semibold shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Crafting your itinerary…</> : <><Sparkles className="h-5 w-5" /> Generate itinerary</>}
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block glass rounded-2xl px-5 py-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      {children}
    </label>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
        active ? "bg-gradient-primary border-transparent text-white shadow-glow" : "border-white/10 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
