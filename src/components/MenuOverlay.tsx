import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", to: "/", subtitle: "The atelier" },
  { label: "Collections", to: "/#collections", subtitle: "Weaves & wonders" },
  { label: "Export Hub", to: "/export", subtitle: "For global buyers" },
  { label: "AI Saree Expert", to: "/#expert", subtitle: "Speak with Megh" },
  { label: "Book a Tour", to: "/book", subtitle: "Virtual showroom" },
  { label: "About", to: "/about", subtitle: "Our heritage" },
  { label: "Certifications", to: "/certifications", subtitle: "Govt. & GI verified" },
  { label: "Contact", to: "/contact", subtitle: "Reach our team" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ open, onClose }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ pointerEvents: "none" }}
          animate={{ pointerEvents: "auto" }}
          exit={{ pointerEvents: "none" }}
        >
          {/* Four interlocking panels */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-1/2 bg-ink"
            initial={{ x: "-100%", y: "-100%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "-100%", y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-1/2"
            style={{ background: "hsl(var(--ink))" }}
            initial={{ x: "100%", y: "-100%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: 0.05 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-ink"
            initial={{ x: "-100%", y: "100%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "-100%", y: "100%" }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-ink"
            initial={{ x: "100%", y: "100%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: "100%" }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: 0.15 }}
          />

          {/* Gold seam accents */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(180deg, transparent, hsl(var(--gold)/0.5), transparent)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold)/0.5), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 h-full w-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-12 py-6 md:py-8">
              <Link to="/" onClick={onClose} className="font-serif text-2xl text-ink-foreground tracking-widest">
                MEGH<span className="text-gold-shimmer">·</span>BALIKA
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="group relative h-12 w-12 flex items-center justify-center text-ink-foreground hover:text-gold transition-colors"
              >
                <span className="absolute h-px w-7 bg-current rotate-45" />
                <span className="absolute h-px w-7 bg-current -rotate-45" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 gap-1 md:gap-2 overflow-y-auto pb-12">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative group"
                >
                  {link.to.startsWith("/#") ? (
                    <a
                      href={link.to}
                      onClick={onClose}
                      className="flex items-baseline justify-between py-3 md:py-4 border-b border-gold/15 hover:border-gold/60 transition-colors"
                    >
                      <span className={`font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight transition-all duration-500 ${hovered === i ? "text-gold pl-4 md:pl-8" : "text-ink-foreground"}`}>
                        {link.label}
                      </span>
                      <span className="hidden md:inline text-xs uppercase tracking-[0.3em] text-ink-foreground/50">{link.subtitle}</span>
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="flex items-baseline justify-between py-3 md:py-4 border-b border-gold/15 hover:border-gold/60 transition-colors"
                    >
                      <span className={`font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight transition-all duration-500 ${hovered === i ? "text-gold pl-4 md:pl-8" : "text-ink-foreground"}`}>
                        {link.label}
                      </span>
                      <span className="hidden md:inline text-xs uppercase tracking-[0.3em] text-ink-foreground/50">{link.subtitle}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="px-6 md:px-16 lg:px-24 pb-8 md:pb-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-ink-foreground/70 text-xs uppercase tracking-widest"
            >
              <div>
                <div className="text-gold mb-2">Atelier</div>
                Kolkata · Banaras · Kanchipuram
              </div>
              <div>
                <div className="text-gold mb-2">Export</div>
                72+ countries
              </div>
              <div>
                <div className="text-gold mb-2">WhatsApp</div>
                +91 · Business
              </div>
              <div>
                <div className="text-gold mb-2">Email</div>
                hello@meghbalika.in
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
