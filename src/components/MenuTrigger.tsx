import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { SAREE_CATEGORIES } from "@/lib/sareeCategories";

interface Props {
  onOpen: () => void;
}

export default function MenuTrigger({ onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-2 md:gap-3"
    >
      {/* Collections dropdown */}
      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className="group flex items-center gap-2 px-3 md:px-4 py-3 bg-background/60 backdrop-blur-md border border-gold-deep/30 hover:border-gold transition-all duration-500"
        >
          <span className="font-serif text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] text-foreground/70 group-hover:text-gold transition-colors">
            Collections
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-foreground/70 group-hover:text-gold transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <nav
          aria-label="Saree collections"
          className={`absolute right-0 top-full pt-2 w-[15rem] md:w-[17rem] origin-top-right transition-all duration-300 ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <ul className="bg-background/95 backdrop-blur-md border border-gold-deep/30 shadow-xl divide-y divide-gold-deep/10">
            {SAREE_CATEGORIES.map((c) => (
              <li key={c.href}>
                <a
                  href={c.href}
                  onClick={(e) => {
                    // keep SPA behaviour while remaining a real crawlable <a href>
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    setOpen(false);
                  }}
                  className="group block px-4 py-3 hover:bg-card transition-colors"
                >
                  <span className="font-serif text-base text-foreground group-hover:text-gold transition-colors">
                    {c.label}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                    {c.blurb}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/sarees"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-gold-deep hover:text-gold hover:bg-card transition-colors"
              >
                View full library ⟶
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Menu button */}
      <button
        onClick={onOpen}
        aria-label="Open menu"
        className="group flex items-center gap-3 px-4 py-3 bg-background/60 backdrop-blur-md border border-gold-deep/30 hover:border-gold transition-all duration-500"
      >
        <span className="font-serif text-xs uppercase tracking-[0.3em] text-foreground/70 group-hover:text-gold transition-colors hidden sm:inline">
          Menu
        </span>
        <span className="flex flex-col gap-1.5">
          <span className="block h-px w-6 bg-foreground/80 group-hover:bg-gold transition-all duration-500 group-hover:w-7" />
          <span className="block h-px w-4 bg-foreground/80 group-hover:bg-gold transition-all duration-500 group-hover:w-7 ml-auto" />
          <span className="block h-px w-6 bg-foreground/80 group-hover:bg-gold transition-all duration-500 group-hover:w-7" />
        </span>
      </button>
    </motion.header>
  );
}
