import { useEffect, useState } from "react";

function format(msLeft: number) {
  if (msLeft <= 0) return "LIVE";
  const total = Math.floor(msLeft / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Ticking countdown to an ISO timestamp. Returns "--:--:--" before hydration. */
export function useCountdown(iso: string) {
  const [label, setLabel] = useState("--:--:--");

  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () => setLabel(format(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);

  return label;
}

/** Local wall clock, hh:mm:ss. Empty string before hydration. */
export function useLocalClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
