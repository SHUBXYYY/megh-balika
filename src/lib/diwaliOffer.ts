import { useEffect, useState } from "react";

/**
 * Diwali campaign window: live until 11 November 2026, end of day IST
 * (18:30 UTC). Both the offer popup and the site-wide festive lights
 * switch off automatically after this moment.
 */
export const OFFER_ENDS_AT = new Date("2026-11-11T18:30:00Z");

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const formatCountdown = (c: CountdownParts) =>
  `${pad(c.days)}d ${pad(c.hours)}h ${pad(c.minutes)}m ${pad(c.seconds)}s`;

/** Live ticking countdown to OFFER_ENDS_AT. */
export function useCountdown(): CountdownParts {
  const compute = (): CountdownParts => {
    const diff = OFFER_ENDS_AT.getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    }
    const s = Math.floor(diff / 1000);
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
      ended: false,
    };
  };

  const [parts, setParts] = useState<CountdownParts>(compute);

  useEffect(() => {
    const id = window.setInterval(() => setParts(compute()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return parts;
}
