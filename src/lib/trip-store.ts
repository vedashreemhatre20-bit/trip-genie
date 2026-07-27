import type { DayPlan, PlanInput } from "./mock-itinerary";

const KEY = "tripai:last";
const SAVED_KEY = "tripai:saved";

export type SavedTrip = { id: string; input: PlanInput; plan: DayPlan[]; createdAt: number };

export const tripStore = {
  setLast(input: PlanInput, plan: DayPlan[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify({ input, plan }));
  },
  getLast(): { input: PlanInput; plan: DayPlan[] } | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  save(input: PlanInput, plan: DayPlan[]): SavedTrip {
    const trip: SavedTrip = { id: crypto.randomUUID(), input, plan, createdAt: Date.now() };
    const all = tripStore.list();
    all.unshift(trip);
    localStorage.setItem(SAVED_KEY, JSON.stringify(all));
    return trip;
  },
  list(): SavedTrip[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  },
  remove(id: string) {
    const all = tripStore.list().filter((t) => t.id !== id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(all));
  },
};
