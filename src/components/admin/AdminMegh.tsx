import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Aaj kitne naye leads aaye?",
  "Kaunse bookings pending hain?",
  "Pichle hafte chat sessions ka summary do",
  "Kya koi collection draft mein hai?",
];

export default function AdminMegh() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Namaste! Main Megh — aapki atelier ki concierge. Leads, bookings, chats, ya collections ke baare mein kuch bhi puchiye. Hinglish chalega 🙏",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-megh", {
        body: { messages: next },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const reply = (data as any)?.reply ?? "Sorry, kuch gadbad ho gayi.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      toast.error(e.message ?? "Megh se baat nahi ho payi");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Maaf kijiye, abhi reply nahi de payi. Thodi der baad try karein." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-gold to-gold-deep text-ink shadow-2xl shadow-gold-deep/30 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open Megh assistant"
      >
        <Sparkles className="h-6 w-6" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-40 w-[min(420px,calc(100vw-2rem))] h-[min(620px,calc(100vh-8rem))] bg-background border border-gold-deep/30 shadow-2xl flex flex-col"
          >
            <div className="px-5 py-4 border-b border-border bg-ink text-ink-foreground flex items-center justify-between">
              <div>
                <div className="font-serif text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" /> Megh · Admin concierge
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep mt-0.5">
                  Hinglish · live snapshot
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-foreground/60 hover:text-gold transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "ml-auto bg-gold-deep text-ink-foreground"
                      : "bg-card border border-border text-foreground/90"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="bg-card border border-border px-3.5 py-2.5 text-sm inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Megh soch rahi hai…
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1.5 border border-border hover:border-gold hover:text-gold transition text-foreground/70"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Megh se kuch puchiye…"
                className="flex-1 bg-transparent border border-border focus:border-gold outline-none px-3 py-2 text-sm transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="btn-luxe-primary !py-2 !px-4 !text-xs disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
