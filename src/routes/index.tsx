import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Search, MapPin, Sparkles, TrendingUp, Compass, Sun } from "lucide-react";
import hero from "@/assets/hero-santorini.jpg";
import bali from "@/assets/dest-bali.jpg";
import tokyo from "@/assets/dest-tokyo.jpg";
import swiss from "@/assets/dest-swiss.jpg";
import dubai from "@/assets/dest-dubai.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "TripAI — Your AI travel companion" },
      { name: "description", content: "Discover trending destinations and let AI plan your perfect trip in under a minute." },
      { property: "og:title", content: "TripAI — Your AI travel companion" },
      { property: "og:description", content: "Discover trending destinations and let AI plan your perfect trip in under a minute." },
    ],
  }),
});

const destinations = [
  { name: "Santorini", country: "Greece", img: hero, tag: "Trending", price: "$1,240" },
  { name: "Bali", country: "Indonesia", img: bali, tag: "Nature", price: "$890" },
  { name: "Tokyo", country: "Japan", img: tokyo, tag: "City", price: "$1,540" },
  { name: "Swiss Alps", country: "Switzerland", img: swiss, tag: "Adventure", price: "$2,100" },
  { name: "Dubai", country: "UAE", img: dubai, tag: "Luxury", price: "$1,780" },
];

const categories = [
  { label: "Beaches", icon: Sun, category: "beaches" },
  { label: "Mountains", icon: Compass, category: "mountains" },
  { label: "City breaks", icon: MapPin, category: "city" },
  { label: "Adventure", icon: TrendingUp, category: "adventure" },
];

function Index() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] mt-2">
        <img src={hero} alt="Santorini at golden hour" className="absolute inset-0 h-full w-full object-cover" width={1024} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="relative grid gap-6 px-6 py-14 md:px-14 md:py-24">
          <div className="inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> AI travel, reimagined
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Where should we <span className="text-gradient">wander</span> next?
          </h1>
          <p className="max-w-xl text-muted-foreground md:text-lg">
            Tell TripAI your vibe, budget and days. Get a personalized itinerary with hotels, weather, hidden gems and a live budget — in seconds.
          </p>

          {/* AI search */}
          <Link
            to="/plan"
            className="group relative flex max-w-2xl items-center gap-3 rounded-2xl glass-strong px-4 py-3 shadow-glow"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary">
              <Search className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-muted-foreground">Try "Weekend in Kyoto under $600"</div>
              <div className="truncate text-base font-medium">Ask TripAI to plan your trip →</div>
            </div>
            <span className="hidden rounded-xl bg-gradient-gold px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.05_265)] md:inline-flex animate-pulse-glow">
              Plan now
            </span>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.label}
            to="/plan"
            search={{ category: c.category }}
            className="glass hover:bg-accent/40 flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary">
              <c.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{c.label}</span>
          </Link>
        ))}
      </section>

      {/* Popular */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Trending destinations</h2>
          <span className="text-sm text-muted-foreground">Curated by TripAI</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <article
              key={d.name}
              className="group relative overflow-hidden rounded-2xl glass hover:shadow-glow transition-all"
              style={{ animation: `float 6s ease-in-out ${i * 0.4}s infinite` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={d.img}
                  alt={`${d.name}, ${d.country}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-xs text-gold">{d.tag}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground">{d.country}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">from</div>
                  <div className="font-semibold">{d.price}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* AI suggestions */}
      <section className="mt-10 mb-6 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-gold"><Sparkles className="h-4 w-4" /> AI suggestion</div>
          <h3 className="mt-2 text-xl font-semibold">A 5-day slow-food trip through Lisbon & Sintra</h3>
          <p className="mt-2 text-sm text-muted-foreground">Curated cafés, tram routes and a coastal sunset finish.</p>
          <Link to="/plan" className="mt-4 inline-flex rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold shadow-glow">Plan similar →</Link>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-gold"><Sparkles className="h-4 w-4" /> Weekend under $500</div>
          <h3 className="mt-2 text-xl font-semibold">2 nights in a mountain cabin near you</h3>
          <p className="mt-2 text-sm text-muted-foreground">Weather-aware plan with alternates if it rains.</p>
          <Link to="/plan" className="mt-4 inline-flex rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold shadow-glow">Plan this →</Link>
        </div>
      </section>
    </Layout>
  );
}
