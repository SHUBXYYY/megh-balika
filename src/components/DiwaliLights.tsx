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

const WIDTH = 1440;

// Two crossing garlands give the site a fuller canopy of strip lights.
const STRANDS = [
  { bulbs: 40, droop: 16, phase: 0, size: 2.8, glow: 5, opacity: 1 },
  { bulbs: 30, droop: 26, phase: 0.5, size: 2.2, glow: 4, opacity: 0.7 },
] as const;

const wireY = (t: number, droop: number, phase: number) =>
  6 + droop * Math.sin((t + phase) * Math.PI);

const wirePoints = (droop: number, phase: number) =>
  Array.from({ length: 96 }, (_, k) => {
    const t = (k / 95) * (WIDTH);
    return `${t.toFixed(1)},${wireY(k / 95, droop, phase).toFixed(1)}`;
  }).join(" ");

/**
 * Site-wide Diwali decoration: two garlands of twinkling multicolour
 * strip lights across the top of every page, with a live countdown to
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
        viewBox={`0 0 ${WIDTH} 52`}
        className="w-full h-11 drop-shadow-[0_2px_8px_rgba(255,180,60,0.4)]"
        preserveAspectRatio="xMidYMin slice"
      >
        {STRANDS.map((s, si) => {
          const bulbX = (i: number, n: number) => (WIDTH / (n - 1)) * i;
          return (
            <g key={si}>
              <polyline
                points={wirePoints(s.droop, s.phase)}
                fill="none"
                stroke="rgba(60,40,20,0.6)"
                strokeWidth="1.5"
              />
              {Array.from({ length: s.bulbs }, (_, i) => {
                const t = i / (s.bulbs - 1);
                const x = bulbX(i, s.bulbs);
                const y = wireY(t, s.droop, s.phase);
                const color = BULB_COLORS[(i + si * 3) % BULB_COLORS.length];
                return (
                  <g key={i} className="diwali-bulb" style={{ animationDelay: `${((i + si * 2) % 9) * 0.28}s` }}>
                    <line x1={x} y1={y} x2={x} y2={y + 5} stroke="rgba(60,40,20,0.6)" strokeWidth="1" />
                    <circle cx={x} cy={y + 8} r={s.glow} fill={color} opacity={0.3 * s.opacity} />
                    <circle cx={x} cy={y + 8} r={s.size} fill={color} />
                  </g>
                );
              })}
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
