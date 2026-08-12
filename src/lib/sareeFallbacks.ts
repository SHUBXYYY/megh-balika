import banarasi from "@/assets/collection-banarasi.jpg";
import tussar from "@/assets/collection-tussar.jpg";
import kantha from "@/assets/collection-kantha.jpg";
import batik from "@/assets/collection-batik.jpg";
import silkHero from "@/assets/silk-hero.jpg";

export type SareeItem = {
  id: string;
  slug: string;
  name: string;
  fabric: string | null;
  origin: string | null;
  description: string | null;
  image_url: string | null;
  images: string[];
  primary_image_index: number;
};

/** lowercase, strip punctuation, collapse separators to single "-" */
export const normalizeSlug = (s: string) =>
  decodeURIComponent(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** keyword tokens used to match a route slug to a category */
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  kantha: ["kantha", "katha", "kantha-stitch", "kantha-work"],
  banarasi: ["banarasi", "benarasi", "banaras", "zari", "brocade"],
  tussar: ["tussar", "tussah", "gachi", "gachi-tussar"],
  batik: ["batik", "wax", "hand-batik"],
  jamdani: ["jamdani", "dhakai"],
  silk: ["silk", "bishnupuri", "bhisnupuri", "bishnupur", "katan", "bangalore", "pure-silk"],
};

/** Static, always-available fallbacks so category routes never 404 */
export const STATIC_SAREES: SareeItem[] = [
  {
    id: "static-banarasi",
    slug: "banarasi",
    name: "Banarasi Silk Sarees",
    fabric: "Pure silk & zari",
    origin: "Banaras, Uttar Pradesh",
    description:
      "Royal brocades woven with silver-gilt zari motifs — the empress of Indian silk. Available for international wholesale with full catalogue, swatches and pricing on request.",
    image_url: banarasi,
    images: [banarasi],
    primary_image_index: 0,
  },
  {
    id: "static-tussar",
    slug: "tussar",
    name: "Tussar Silk Sarees",
    fabric: "Wild tussar silk",
    origin: "Bhagalpur & Shantiniketan",
    description:
      "Sun-warm wild silk with a tactile, textured hand-feel. Earthy, effortless and perfect for resort and premium retail lines.",
    image_url: tussar,
    images: [tussar],
    primary_image_index: 0,
  },
  {
    id: "static-kantha",
    slug: "kantha-stitch",
    name: "Kantha Stitch Sarees",
    fabric: "Hand kantha embroidery",
    origin: "Bengal",
    description:
      "Generations of running stitches retell folktales across cotton and silk. Each piece hand-embroidered by our artisan clusters in West Bengal.",
    image_url: kantha,
    images: [kantha],
    primary_image_index: 0,
  },
  {
    id: "static-batik",
    slug: "batik",
    name: "Batik Sarees",
    fabric: "Wax-resist hand batik",
    origin: "Shantiniketan",
    description:
      "Dye and wax converse — each piece an unrepeatable studio composition in hand-painted batik.",
    image_url: batik,
    images: [batik],
    primary_image_index: 0,
  },
  {
    id: "static-silk",
    slug: "silk",
    name: "Pure Silk Sarees",
    fabric: "Pure silk",
    origin: "Bishnupur & Bangalore",
    description:
      "Bishnupuri, Katan and Bangalore silks with a natural sheen and graceful drape — our core export line.",
    image_url: silkHero,
    images: [silkHero],
    primary_image_index: 0,
  },
];

/** Score how well a DB row matches a requested slug. Higher = better. */
export function scoreMatch(row: SareeItem, requested: string): number {
  const req = normalizeSlug(requested);
  const rowSlug = normalizeSlug(row.slug);
  if (rowSlug === req) return 100;

  const hay = normalizeSlug([row.slug, row.name, row.fabric, row.origin].filter(Boolean).join(" "));
  let score = 0;
  if (hay.includes(req)) score += 40;

  const reqTokens = req.split("-").filter((t) => t.length > 2);
  for (const t of reqTokens) if (hay.includes(t)) score += 12;

  // category keyword bridging (e.g. "kantha" ↔ "katha")
  for (const [, words] of Object.entries(CATEGORY_KEYWORDS)) {
    const reqHit = words.some((w) => req.includes(normalizeSlug(w)));
    const rowHit = words.some((w) => hay.includes(normalizeSlug(w)));
    if (reqHit && rowHit) score += 25;
  }
  return score;
}

/** Best static fallback for a slug, or a generic one so we never 404. */
export function staticFallbackFor(requested: string): SareeItem {
  const req = normalizeSlug(requested);
  let best = STATIC_SAREES[0];
  let bestScore = -1;
  for (const s of STATIC_SAREES) {
    const sc = scoreMatch(s, req);
    if (sc > bestScore) {
      bestScore = sc;
      best = s;
    }
  }
  if (bestScore >= 12) return best;
  return {
    ...STATIC_SAREES[4],
    slug: req || "sarees",
    name: req
      ? req.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Sarees"
      : "Handloom Sarees",
    description:
      "Explore this weave from our Kolkata atelier. Full catalogue, swatches and wholesale pricing available on request.",
  };
}

/** Resolve a route slug to a primary item plus related items. Never returns null. */
export function resolveSaree(
  requested: string,
  rows: SareeItem[]
): { item: SareeItem; related: SareeItem[]; isFallback: boolean } {
  const scored = rows
    .map((r) => ({ r, s: scoreMatch(r, requested) }))
    .filter((x) => x.s >= 12)
    .sort((a, b) => b.s - a.s);

  if (scored.length > 0) {
    return {
      item: scored[0].r,
      related: scored.slice(1).map((x) => x.r),
      isFallback: false,
    };
  }
  return {
    item: staticFallbackFor(requested),
    related: rows.slice(0, 6),
    isFallback: true,
  };
}
