import { useEffect, useState } from "react";
import { startOfDay } from "@/lib/memorization";

const DAY_MS = 86_400_000;

/**
 * Returns a timestamp that stays current enough for day-based calculations.
 * It refreshes at the next local midnight (so the day rolls over while the app
 * is open) and whenever the tab becomes visible again. Reading it during render
 * is pure — the value only changes through state updates.
 */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const msToMidnight = startOfDay(now) + DAY_MS - now + 1000;
    const timer = setTimeout(tick, Math.max(1000, msToMidnight));
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [now]);

  return now;
}
