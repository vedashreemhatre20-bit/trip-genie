import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { tripStore, type SavedTrip } from "@/lib/trip-store";
import type { DayPlan, PlanInput } from "@/lib/mock-itinerary";
import { Sunrise, Sun, Moon, Hotel, UtensilsCrossed, MapPin, CloudSun, Users, Bookmark, Share2 } from "lucide-react";

export const Route = createFileRoute("/itinerary")({
  component: ItineraryPage,
  head: () => ({
    meta: [
      { title: "Your itinerary — TripAI" },
      { name: "description", content: "Your AI-generated day-by-day travel plan with hotels, weather and budget." },
      { property: "og:title", content: "Your itinerary — TripAI" },
      { property: "og:description", content: "Your AI-generated day-by-day travel plan with hotels, weather and budget." },
    ],
  }),
});

function ItineraryPage() {
  const [data, setData] = useState<{ input: PlanInput; plan: DayPlan[] } | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => { setData(tripStore.getLast()); }, []);

  if (!data) {
    return (
      <Layout>
        <div className="mx-auto max-w-md py-24 text-center">
          <h1 className="text-2xl font-semibold">No trip yet</h1>
          <p className="mt-2 text-muted-foreground">Let TripAI plan one for you.</p>
          <Link to="/plan" className="mt-6 inline-flex rounded-xl bg-gradient-primary px-5 py-3 font-semibold shadow-glow">Start planning</Link>
        </div>
      </Layout>
    );
  }

  const { input, plan } = data;
  const totalBudget = plan.reduce((s, d) => s + d.hotel.cost + d.restaurant.cost + d.morning.cost + d.afternoon.cost + d.evening.cost, 0);
  const remaining = input.budget - totalBudget;

  const save = () => {
    const trip: SavedTrip = tripStore.save(input, plan);
    setSavedId(trip.id);
  };

  return (
    <Layout>
      <div className="py-6">
        {/* Summary */}
        <div className="glass-strong overflow-hidden rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-gold">AI itinerary</div>
              <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{input.destination}</h1>
              <p className="mt-1 text-muted-foreground">{input.days} days · {input.style} · {input.transport}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm">
                <Bookmark className="h-4 w-4" /> {savedId ? "Saved" : "Save trip"}
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Budget" value={`$${input.budget}`} />
            <Stat label="Estimated" value={`$${totalBudget}`} />
            <Stat label={remaining >= 0 ? "Remaining" : "Over"} value={`$${Math.abs(remaining)}`} tone={remaining >= 0 ? "good" : "warn"} />
            <Stat label="Interests" value={`${input.interests.length}`} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8 space-y-6">
          {plan.map((d) => (
            <article key={d.day} className="glass rounded-3xl p-5 md:p-6">
              <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Day {d.day}</div>
                  <h2 className="text-xl font-bold md:text-2xl">{d.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><CloudSun className="h-4 w-4 text-gold" /> {d.weather.temp}° · {d.weather.condition}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {d.travelKm} km</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {d.crowd} crowd</span>
                </div>
              </header>

              <div className="grid gap-3 md:grid-cols-3">
                <Slot icon={<Sunrise className="h-4 w-4" />} tone="from-amber-400/20" label="Morning" item={d.morning} />
                <Slot icon={<Sun className="h-4 w-4" />} tone="from-sky-400/20" label="Afternoon" item={d.afternoon} />
                <Slot icon={<Moon className="h-4 w-4" />} tone="from-indigo-400/20" label="Evening" item={d.evening} />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Hotel className="h-4 w-4" /> Hotel</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{d.hotel.name}</div>
                      <div className="text-xs text-muted-foreground">★ {d.hotel.rating}</div>
                    </div>
                    <div className="text-sm font-semibold">${d.hotel.cost}</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><UtensilsCrossed className="h-4 w-4" /> Dinner pick</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{d.restaurant.name}</div>
                      <div className="text-xs text-muted-foreground">{d.restaurant.cuisine}</div>
                    </div>
                    <div className="text-sm font-semibold">${d.restaurant.cost}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold ${tone === "warn" ? "text-red-400" : tone === "good" ? "text-gold" : ""}`}>{value}</div>
    </div>
  );
}

function Slot({ icon, label, tone, item }: { icon: React.ReactNode; label: string; tone: string; item: DayPlan["morning"] }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-4 bg-gradient-to-b ${tone} to-transparent`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-2 font-semibold">{item.title}</div>
      <div className="text-xs text-muted-foreground">{item.place}</div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{item.time}</span>
        <span className="font-semibold">${item.cost}</span>
      </div>
    </div>
  );
}
