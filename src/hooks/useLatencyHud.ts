import { useEffect, useRef, useState } from "react";
import { writeTelemetry } from "../services/telemetry";

export function useLatencyHud(uidUser: string | null, pingUrl = "/") {
  const [fetchPing, setFetchPing] = useState<number | null>(null);
  const [uiLag, setUiLag] = useState<number | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(performance.now());

  useEffect(() => {
    // UI thread delay estimator
    function loop() {
      const now = performance.now();
      const delta = now - lastRef.current;
      lastRef.current = now;
      // ideal ~16.6ms; lag = extra
      const lag = Math.max(0, delta - 16.6);
      setUiLag(Math.round(lag));
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    let alive = true;
    async function ping() {
      const t0 = performance.now();
      try {
        await fetch(pingUrl, { method: "GET", cache: "no-store" });
        const ms = performance.now() - t0;
        if (!alive) return;
        setFetchPing(Math.round(ms));
        if (uidUser) await writeTelemetry(uidUser, { kind: "FETCH_PING", valueMs: ms, meta: { pingUrl } });
      } catch {
        if (!alive) return;
        setFetchPing(null);
      }
    }
    const iv = setInterval(ping, 5000);
    ping();
    return () => { alive = false; clearInterval(iv); };
  }, [uidUser, pingUrl]);

  useEffect(() => {
    if (!uidUser || uiLag == null) return;
    const iv = setInterval(() => {
      writeTelemetry(uidUser, { kind: "UI_TICK", valueMs: uiLag, meta: {} }).catch(()=>{});
    }, 15000);
    return () => clearInterval(iv);
  }, [uidUser, uiLag]);

  return { fetchPing, uiLag };
}
