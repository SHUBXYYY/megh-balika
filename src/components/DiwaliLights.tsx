import { motion } from "framer-motion";
import { OFFER_ENDS_AT, useCountdown, formatCountdown } from "@/lib/diwaliOffer";
import { useLocation } from "react-router-dom";

const BULB_COLORS = [
  "#e0362b", // red
  "#f5a623", // amber
  "#ffd700", // gold
  "#2fae5f", // green
  "#2f7fd1", // blue
  "#d63fa0", // pink
  "#f0731f", // orange
];

const BULBS = 22;
const WIDTH = 1440;
const DROOP = 16; // max sag of the garland at mid-width

// Wire and bulbs share the same curve so the lights hang on the string.
const wireY = (i: number, n: number) =>
  6 + DROOP * Math.sin((i / (n - 1)) * Math.PI);

const wirePoints = Array.from(
  { length: 80 },
  (_, k) => {
    const t = (k / 79) * (WIDTH);
    const i = (k / 79) * (BULBS - 1);
    return `${t.toFixed(1)},${wireY(i, BULBS).toFixed(1)}`;
  }
).join(" ");

/**
 * Site-wide Diwali decoration: a garland of twinkling multicolour strip
 * lights across the top of every page, with a live countdown to
 * 11 November 2026. Hidden on /admin and /auth; removed automatically
 * after the campaign ends.
 */
export default function DiwaliLights() {
  const { pathname } = useLocation();
  const countdown = useCountdown();

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;
  if (new Date() >= OFFER_ENDS_AT || countdown.ended) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${WIDTH} 42`}
        className="w-full h-9 drop-shadow-[0_2px_6px_rgba(255,180,60,0.35)]"
        preserveAspectRatio="xMidYMin slice"
      >
        <polyline points={wirePoints} fill="none" stroke="rgba(60,40,20,0.6)" strokeWidth="1.5" />
        {Array.from({ length: BULBS }, (_, i) => {
          const x = (WIDTH / (BULBS - 1)) * i;
          const y = wireY(i, BULBS);
          const color = BULB_COLORS[i % BULB_COLORS.length];
          return (
            <g key={i} className="diwali-bulb" style={{ animationDelay: `${(i % 7) * 0.35}s` }}>
              <line x1={x} y1={y} x2={x} y2={y + 5} stroke="rgba(60,40,20,0.6)" strokeWidth="1" />
              <circle cx={x} cy={y + 8} r="5" fill={color} opacity="0.3" />
              <circle cx={x} cy={y + 8} r="2.8" fill={color} />
            </g>
          );
        })}
      </svg>

      <motion.div
        className="pointer-events-auto absolute left-1/2 top-1 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gold-deep/40 bg-ink/85 px-3 py-1 backdrop-blur-sm shadow-luxe"
        initial={{ opacity: 0, y: -8, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-gold-light">Diwali Dhamaka · 20% Off</span>
        <span className="hidden sm:inline h-3 w-px bg-gold-deep/40" aria-hidden="true" />
        <span
          className="font-mono text-[10px] tabular-nums text-gold"
          role="timer"
          aria-label="Time left in the Diwali offer"
        >
          {formatCountdown(countdown)}
        </span>
      </motion.div>
    </div>
  );
}
