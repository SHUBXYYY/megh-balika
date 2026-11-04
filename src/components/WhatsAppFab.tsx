import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSiteContent, SITE_DEFAULTS } from "@/hooks/useSiteContent";

const PAGE_MESSAGES: Record<string, string> = {
  "/": "Namaste! I'm exploring Megh Balika and would love to know more about your sarees.",
  "/export": "Hello Megh Balika — I'm interested in wholesale export. Could you share your catalogue and MOQ details?",
  "/book": "Hello Megh Balika — I'd like to schedule an atelier tour / virtual meeting.",
  "/contact": "Hello Megh Balika — I have an enquiry I'd like to discuss.",
  "/about": "Hello Megh Balika — I just read about your atelier and would like to connect.",
};

const formatNumber = (digits: string) => `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;

export default function WhatsAppFab() {
  const { pathname } = useLocation();
  const { get } = useSiteContent();
  const [open, setOpen] = useState(false);

  // Don't show on admin or auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const primary = get("whatsapp_number", SITE_DEFAULTS.whatsapp_number);
  const alt = get("whatsapp_number_alt", SITE_DEFAULTS.whatsapp_number_alt);
  const fallback = get("whatsapp_default_message", SITE_DEFAULTS.whatsapp_default_message);
  const msg = PAGE_MESSAGES[pathname] ?? fallback;

  const numbers = [
    { digits: primary, label: "Enquiries" },
    { digits: alt, label: "Direct line" },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[4.5rem] left-0 w-64 rounded-sm bg-card p-4 shadow-luxe border border-gold-deep/30"
            role="dialog"
            aria-label="Choose a WhatsApp number"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Chat with us</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {numbers.map(({ digits, label }) => (
                <a
                  key={digits}
                  href={`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-sm border border-gold-deep/30 px-3 py-2.5 transition-colors hover:bg-secondary"
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                  <div className="font-serif text-base text-foreground">{formatNumber(digits)}</div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-luxe"
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-sm bg-ink px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-ink-foreground opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          Chat with us
        </span>
      </motion.button>
    </div>
  );
}
