import { useEffect, useState } from "react";

export default function HFSignalStatus() {
  const [signal, setSignal] = useState<string>("");
  useEffect(() => {
    const fetchSignal = () => {
      fetch("/api/hf_signal")
        .then((r) => r.json())
        .then((d) => setSignal(d.signal || ""));
    };
    fetchSignal();
    const interval = setInterval(fetchSignal, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-black text-yellow-400 p-4 rounded-2xl">
      <h2 className="text-xl mb-2">High-Frequency Signal (GPU)</h2>
      <div className="text-2xl font-bold">{signal || "Loading..."}</div>
    </div>
  );
}
