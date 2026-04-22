import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Apple-style multilingual welcome splash.
 * 15 greetings cycle while a "Welcome to Megh Balika" line fades in.
 * Shows once per browser session.
 */

const GREETINGS = [
  { script: "नमस्ते", lang: "Hindi" },
  { script: "নমস্কাৰ", lang: "Assamese" },
  { script: "নমস্কার", lang: "Bengali" },
  { script: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", lang: "Punjabi" },
  { script: "வணக்கம்", lang: "Tamil" },
  { script: "నమస్కారం", lang: "Telugu" },
  { script: "ನಮಸ್ಕಾರ", lang: "Kannada" },
  { script: "നമസ്കാരം", lang: "Malayalam" },
  { script: "નમસ્તે", lang: "Gujarati" },
  { script: "નमस्कार", lang: "Marathi" },
  { script: "ଓଡ଼ିଆରେ ନମସ୍କାର", lang: "Odia" },
  { script: "السلام علیکم", lang: "Urdu" },
  { script: "Hello", lang: "English" },
  { script: "Bonjour", lang: "French" },
  { script: "你好", lang: "Mandarin" },
];

const SESSION_KEY = "megh:namaskar:seen";

export default function NamaskarSplash() {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage may be unavailable; show anyway
    }
    setShow(true);
    document.body.style.overflow = "hidden";

    const tick = setInterval(() => {
      setIdx((i) => (i + 1) % GREETINGS.length);
    }, 600);

    const closeTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, GREETINGS.length * 600 + 600); // ~9.6s total

    return () => {
      clearInterval(tick);
      clearTimeout(closeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  const current = GREETINGS[idx];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="namaskar-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-ink-foreground"
        >
          {/* Soft gold cloud */}
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 35%, hsl(41 65% 52% / 0.25) 0%, transparent 55%)",
            }}
          />

          {/* Folded hands (hand-drawn unicode + soft glow) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-10"
          >
            <div className="absolute inset-0 blur-3xl bg-gold/30 rounded-full scale-150" />
            <div className="relative text-7xl md:text-8xl select-none animate-[pulse-gold_3s_ease-in-out_infinite]">
              🙏
            </div>
          </motion.div>

          {/* Cycling greeting */}
          <div className="h-20 md:h-24 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.script + idx}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="font-serif text-4xl md:text-6xl text-gold-light tracking-wide">
                  {current.script}
                </div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-ink-foreground/40 mt-2">
                  {current.lang}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Welcome lockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="text-[10px] uppercase tracking-[0.5em] text-gold-deep mb-3">
              Welcome to
            </div>
            <div className="font-serif text-2xl md:text-3xl tracking-[0.25em]">
              MEGH<span className="text-gold-shimmer mx-1">·</span>BALIKA
            </div>
          </motion.div>

          {/* Skip button */}
          <button
            onClick={() => { setShow(false); document.body.style.overflow = ""; }}
            className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-ink-foreground/50 hover:text-gold transition"
          >
            Skip ⟶
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
