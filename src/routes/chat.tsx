import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic } from "lucide-react";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "AI Chat — TripAI" },
      { name: "description", content: "Ask TripAI anything: hidden gems, weekend plans, best food nearby." },
      { property: "og:title", content: "AI Chat — TripAI" },
      { property: "og:description", content: "Ask TripAI anything: hidden gems, weekend plans, best food nearby." },
    ],
  }),
});

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Plan my Goa trip",
  "Weekend under $500",
  "Best food near me",
  "Hidden places in Kyoto",
];

const canned = (q: string) => {
  const s = q.toLowerCase();
  if (s.includes("goa")) return "Here's a 3-day Goa plan: sunrise at Arambol, café-hopping in Assagao, sunset at Chapora fort. Add water sports on day 2 and a jungle spice-farm day trip on day 3.";
  if (s.includes("weekend")) return "Great — a $500 weekend: 2 nights in a scenic town 2h from you, one signature dinner, one hidden trail, one lazy morning café. Want me to lock in a destination?";
  if (s.includes("food")) return "Try neighborhood bistros with 4.5★+ and under 500 reviews — they're the local favorites. I can pull 3 within walking distance if you share your city.";
  if (s.includes("hidden") || s.includes("kyoto")) return "In Kyoto: Ohara valley temples, Kurama-to-Kibune hike, Fushimi sake district at dusk, and Kamishichiken for a quieter geisha quarter. Want a 4-day plan?";
  return "I can craft a personalized plan. Tell me your destination, days, budget and vibe — or tap Plan a trip and I'll build a full itinerary for you.";
};

function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  );
}

function ChatPageContent() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hey! I'm TripAI ✨ Where are we going, or what should I plan?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 900));
    setMsgs((m) => [...m, { role: "ai", text: canned(q) }]);
    setTyping(false);
  };

  return (
    <Layout>
      <div className="mx-auto flex max-w-3xl flex-col py-4" style={{ minHeight: "calc(100vh - 180px)" }}>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">TripAI</div>
            <div className="text-xs text-muted-foreground">Online · answers in seconds</div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-gradient-primary text-white shadow-glow rounded-br-sm"
                  : "glass rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <Dot delay="0" /><Dot delay=".15s" /><Dot delay=".3s" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {msgs.length <= 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full glass px-3.5 py-1.5 text-xs hover:text-foreground text-muted-foreground">
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="glass-strong flex items-center gap-2 rounded-2xl px-3 py-2"
        >
          <button type="button" className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:text-foreground">
            <Mic className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TripAI anything…"
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Layout>
  );
}

function Dot({ delay }: { delay: string }) {
  return <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: delay }} />;
}
