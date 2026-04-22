import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  sort_order: number;
};

const Sarees = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("collections")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      setItems((data as Collection[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-32 md:pt-44 pb-16 silk-bg">
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
            Every weave we represent — laid out in one quiet room. Tap any saree to step closer
            and read its story, its origin, and its care.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6 md:px-12">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Unfurling the looms…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              The library is being prepared. Please check back shortly.
            </div>
          ) : (
            <ul className="divide-y divide-gold-deep/15 border-y border-gold-deep/15">
              {items.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={`/sarees/${c.slug}`}
                    className="group grid grid-cols-12 gap-6 items-center py-6 md:py-8 px-2 md:px-4 hover:bg-card transition-colors"
                  >
                    <div className="col-span-3 md:col-span-2 aspect-square overflow-hidden bg-secondary">
                      {c.image_url ? (
                        <img
                          src={c.image_url}
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
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default Sarees;
