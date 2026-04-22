import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";

type Collection = {
  id: string;
  slug: string;
  name: string;
  fabric: string | null;
  origin: string | null;
  description: string | null;
  image_url: string | null;
  images: string[];
  primary_image_index: number;
  sort_order: number;
};

const Sarees = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [fabric, setFabric] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("collections")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      const normalized = ((data as any[]) ?? []).map((c) => ({
        ...c,
        images: Array.isArray(c.images) ? c.images : [],
        primary_image_index: c.primary_image_index ?? 0,
      })) as Collection[];
      setItems(normalized);
      setLoading(false);
    })();
  }, []);

  const fabrics = useMemo(
    () => Array.from(new Set(items.map((i) => i.fabric).filter(Boolean))) as string[],
    [items]
  );
  const origins = useMemo(
    () => Array.from(new Set(items.map((i) => i.origin).filter(Boolean))) as string[],
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      if (fabric && c.fabric !== fabric) return false;
      if (origin && c.origin !== origin) return false;
      if (!q) return true;
      const hay = [c.name, c.fabric, c.origin, c.description, c.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, fabric, origin]);

  const clearFilters = () => { setQuery(""); setFabric(null); setOrigin(null); };
  const hasFilters = !!query || !!fabric || !!origin;

  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-32 md:pt-44 pb-12 silk-bg">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">⟵ Atelier</Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mt-6 leading-[0.95] text-balance max-w-4xl"
          >
            The full <em className="text-gold-shimmer not-italic">saree library</em>.
          </motion.h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Every weave we represent — laid out in one quiet room. Search by name,
            filter by fabric or origin, then step closer to read each story.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-y border-gold-deep/15">
        <div className="container px-6 md:px-12 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Banarasi, Kanjivaram, Tussar…"
                className="w-full bg-transparent border border-border focus:border-gold outline-none pl-10 pr-10 py-2.5 text-sm transition"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-gold transition shrink-0"
              >
                Clear all
              </button>
            )}
          </div>

          {(fabrics.length > 0 || origins.length > 0) && (
            <div className="flex flex-wrap gap-2 items-center">
              {fabrics.length > 0 && (
                <>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold-deep mr-1">Fabric</span>
                  {fabrics.map((f) => (
                    <Chip key={f} active={fabric === f} onClick={() => setFabric(fabric === f ? null : f)}>
                      {f}
                    </Chip>
                  ))}
                </>
              )}
              {origins.length > 0 && (
                <>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold-deep ml-3 mr-1">Origin</span>
                  {origins.map((o) => (
                    <Chip key={o} active={origin === o} onClick={() => setOrigin(origin === o ? null : o)}>
                      {o}
                    </Chip>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-6 md:px-12">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Unfurling the looms…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              The library is being prepared. Please check back shortly.
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No sarees match your filters.</p>
              <button onClick={clearFilters} className="btn-luxe-outline !py-2 !px-5 !text-xs">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Showing {filtered.length} of {items.length}
              </div>
              <ul className="divide-y divide-gold-deep/15 border-y border-gold-deep/15">
                {filtered.map((c, i) => {
                  const cover = c.images?.[c.primary_image_index] || c.image_url;
                  return (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: Math.min(i * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={`/sarees/${c.slug}`}
                        className="group grid grid-cols-12 gap-6 items-center py-6 md:py-8 px-2 md:px-4 hover:bg-card transition-colors"
                      >
                        <div className="col-span-3 md:col-span-2 aspect-square overflow-hidden bg-secondary">
                          {cover ? (
                            <img
                              src={cover}
                              alt={c.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                              —
                            </div>
                          )}
                        </div>
                        <div className="col-span-9 md:col-span-9 min-w-0">
                          <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold-deep mb-1 md:mb-2">
                            Nº {String(i + 1).padStart(2, "0")} · {c.fabric ?? "Heritage weave"}
                          </div>
                          <h3 className="font-serif text-2xl md:text-4xl group-hover:text-gold transition-colors group-hover:translate-x-2 duration-500 inline-block">
                            {c.name}
                          </h3>
                          {c.origin && (
                            <div className="text-xs md:text-sm text-muted-foreground mt-1">{c.origin}</div>
                          )}
                        </div>
                        <div className="hidden md:flex col-span-1 justify-end text-gold opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                          ⟶
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

function Chip({
  children, active, onClick,
}: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1.5 border transition ${
        active
          ? "bg-gold-deep text-ink-foreground border-gold-deep"
          : "bg-transparent text-foreground/70 border-border hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}

export default Sarees;
