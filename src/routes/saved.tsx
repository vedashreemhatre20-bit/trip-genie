import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { tripStore, type SavedTrip } from "@/lib/trip-store";
import { Trash2, MapPin } from "lucide-react";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
  head: () => ({
    meta: [
      { title: "Saved trips — TripAI" },
      { name: "description", content: "Your wishlist and trip history." },
      { property: "og:title", content: "Saved trips — TripAI" },
      { property: "og:description", content: "Your wishlist and trip history." },
    ],
  }),
});

function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedPageContent />
    </ProtectedRoute>
  );
}

function SavedPageContent() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  useEffect(() => { setTrips(tripStore.list()); }, []);

  const del = (id: string) => { tripStore.remove(id); setTrips(tripStore.list()); };

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-3xl font-extrabold">Saved trips</h1>
        <p className="mt-1 text-muted-foreground">Your itineraries, wishlist and travel memories.</p>

        {trips.length === 0 ? (
          <div className="mt-10 glass rounded-3xl p-10 text-center">
            <div className="text-lg font-semibold">Nothing saved yet</div>
            <p className="mt-1 text-sm text-muted-foreground">Generate a plan and hit Save trip.</p>
            <Link to="/plan" className="mt-5 inline-flex rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold shadow-glow">Plan a trip</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {trips.map((t) => (
              <article key={t.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</div>
                    <h3 className="mt-1 truncate text-lg font-semibold">{t.input.destination}</h3>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {t.input.days} days · {t.input.style} · ${t.input.budget}
                    </div>
                  </div>
                  <button onClick={() => del(t.id)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.input.interests.slice(0, 5).map((i) => (
                    <span key={i} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted-foreground">{i}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
