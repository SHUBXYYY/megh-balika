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

  // Gentle sagging curve across the full width.
  const width = 1440;
  const sag = 14;
  const path = `M 0 4 Q ${width / 4} ${4 + sag} ${width / 2} ${4 + sag / 2} T ${width} 4`;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${width} 44`}
        className="w-full h-9 drop-shadow-[0_2px_6px_rgba(255,180,60,0.35)]"
        preserveAspectRatio="xMidYMin slice"
      >
        <path d={path} fill="none" stroke="rgba(60,40,20,0.55)" strokeWidth="1.5" />
        {Array.from({ length: BULBS }, (_, i) => {
          const x = (width / (BULBS - 1)) * i;
          // Sample the quadratic-ish curve visually: alternate droop offsets.
          const droop =
            i === 0 || i === BULBS - 1
              ? 6
              : 10 + 8 * Math.sin((i / (BULBS - 1)) * Math.PI * 2);
          const color = BULB_COLORS[i % BULB_COLORS.length];
          return (
            <g key={i} className="diwali-bulb" style={{ animationDelay: `${(i % 7) * 0.35}s` }}>
              <line x1={x} y1={9} x2={x} y2={droop} stroke="rgba(60,40,20,0.55)" strokeWidth="1" />
              <circle cx={x} cy={droop + 4} r="4" fill={color} opacity="0.25" className="diwali-bulb-glow" />
              <circle cx={x} cy={droop + 4} r="2.6" fill={color} />
            </g>
          );
        })}
      </svg>

      <motion.div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-8 flex items-center gap-2 rounded-full border border-gold-deep/40 bg-ink/85 px-4 py-1.5 backdrop-blur-sm shadow-luxe"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <span className="text-[11px] uppercase tracking-[0.2em] text-gold">Diwali Dhamaka · 20% Off</span>
        <span className="h-3 w-px bg-gold-deep/40" aria-hidden="true" />
        <span
          className="font-mono text-[11px] tabular-nums text-gold-foreground"
          role="timer"
          aria-label="Time left in the Diwali offer"
        >
          {formatCountdown(countdown)}
        </span>
      </motion.div>
    </div>
  );
}
