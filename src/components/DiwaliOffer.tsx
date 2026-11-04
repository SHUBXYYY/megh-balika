import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import diwaliOffer from "@/assets/diwali-offer.png.asset.json";
import { useSiteContent, SITE_DEFAULTS } from "@/hooks/useSiteContent";

// Brochure runs until 10 November 2026, end of day IST. After that it is
// removed from the site automatically — no manual step needed.
const OFFER_ENDS_AT = new Date("2026-11-10T18:30:00Z");
const SESSION_KEY = "diwali-offer-dismissed-v1";

const formatNumber = (digits: string) => `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;

export default function DiwaliOffer() {
  const { pathname } = useLocation();
  const { get } = useSiteContent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;
    if (new Date() >= OFFER_ENDS_AT) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  const primary = get("whatsapp_number", SITE_DEFAULTS.whatsapp_number);
  const alt = get("whatsapp_number_alt", SITE_DEFAULTS.whatsapp_number_alt);
  const msg = "Namaste! I saw the Diwali Dhamaka offer — I'd like to pre-book sarees at 20% off.";

  const numbers = [
    { digits: primary, label: "WhatsApp enquiry" },
    { digits: alt, label: "Direct line" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 backdrop-blur-sm px-4 py-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Diwali offer"
        >
          <motion.div
            className="relative max-w-md w-full"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close offer"
              className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-luxe hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <img
              src={diwaliOffer.url}
              alt="Diwali Dhamaka — 20% off pre-order booking at Megh Balika"
              className="w-full rounded-sm shadow-luxe"
              loading="eager"
            />

            <div className="mt-4 grid grid-cols-1 gap-2">
              {numbers.map(({ digits, label }) => (
                <a
                  key={digits}
                  href={`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-sm border border-gold-deep/40 bg-card px-4 py-3 transition-colors hover:bg-secondary"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
                  <span className="font-serif text-lg text-gold-deep">{formatNumber(digits)}</span>
                </a>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Offer valid until 10 November 2026
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
