export type PlanInput = {
  destination: string;
  days: number;
  budget: number;
  style: string;
  interests: string[];
  transport: string;
};

export type DayPlan = {
  day: number;
  title: string;
  weather: { temp: number; condition: string };
  morning: { title: string; place: string; time: string; cost: number };
  afternoon: { title: string; place: string; time: string; cost: number };
  evening: { title: string; place: string; time: string; cost: number };
  hotel: { name: string; rating: number; cost: number };
  restaurant: { name: string; cuisine: string; cost: number };
  travelKm: number;
  crowd: "Low" | "Medium" | "High";
};

const conditions = ["Sunny", "Partly cloudy", "Clear", "Light breeze", "Golden hour"];
const crowds: DayPlan["crowd"][] = ["Low", "Medium", "High"];

const themes: Record<string, string[]> = {
  default: ["Old Town Walk", "Local Market", "Sunset Viewpoint", "Rooftop Bar", "Boat Ride", "Hidden Alley Cafés"],
};

export function generateItinerary(input: PlanInput): DayPlan[] {
  const pool = themes.default;
  const perDayBudget = input.budget / Math.max(1, input.days);
  return Array.from({ length: input.days }).map((_, i) => {
    const pick = (offset: number) => pool[(i * 3 + offset) % pool.length];
    return {
      day: i + 1,
      title: `Day ${i + 1} · ${input.destination}`,
      weather: { temp: 22 + ((i * 3) % 8), condition: conditions[i % conditions.length] },
      morning: { title: pick(0), place: `${input.destination} Center`, time: "08:30 – 11:30", cost: Math.round(perDayBudget * 0.12) },
      afternoon: { title: pick(1), place: `${input.destination} District`, time: "12:00 – 16:00", cost: Math.round(perDayBudget * 0.18) },
      evening: { title: pick(2), place: `Downtown ${input.destination}`, time: "18:00 – 22:00", cost: Math.round(perDayBudget * 0.2) },
      hotel: { name: `The ${input.destination} House`, rating: 4.7, cost: Math.round(perDayBudget * 0.35) },
      restaurant: { name: `Casa ${input.destination}`, cuisine: "Local · Modern", cost: Math.round(perDayBudget * 0.15) },
      travelKm: 8 + ((i * 5) % 20),
      crowd: crowds[i % 3],
    };
  });
}
