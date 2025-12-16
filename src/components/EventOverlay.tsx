import { useEffect, useState } from "react";
import { subscribeEvents } from "../services/events";

export default function EventOverlay({ symbol }: { symbol: string }) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    return subscribeEvents(symbol, setEvents);
  }, [symbol]);

  return (
    <div className="bg-black border border-white/10 rounded-xl p-3">
      <div className="text-white text-sm mb-2">Upcoming Events</div>
      {events.map(e => (
        <div key={e.ts} className="text-xs text-white/80">
          {new Date(e.ts).toUTCString()} — {e.title}
        </div>
      ))}
    </div>
  );
}
