import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "megh_session_id";
const SUGGESTIONS = [
  "Difference between Banarasi and Kanjivaram?",
  "MOQ for boutique orders?",
  "Tell me about Kantha embroidery",
  "How do you ship to Europe?",
];

export default function SareeExpert() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Namaskar 🙏 I'm **Megh** — your saree expert from the Megh Balika atelier.\n\nAsk me about weaves, fabrics, MOQs, export, or just say hi. Happy to help in English, Hindi, or Hinglish.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { setSessionId(stored); return; }
    supabase.from("chat_sessions").insert({ visitor_label: navigator.userAgent.slice(0, 100) }).select().single()
      .then(({ data }) => {
        if (data?.id) { localStorage.setItem(STORAGE_KEY, data.id); setSessionId(data.id); }
      });
  }, []);

  // Autoscroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const persistMessage = (role: "user" | "assistant", content: string) => {
    if (!sessionId) return;
    supabase.from("chat_messages").insert({ session_id: sessionId, role, content });
  };

  const send = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    const newUser: Msg = { role: "user", content: userText };
    const next = [...messages, newUser];
    setMessages(next);
    persistMessage("user", userText);
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/saree-expert`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (resp.status === 429) { toast.error("Many guests right now — please try again shortly."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted. Please add credits in Settings → Workspace → Usage."); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("stream failed");

      // Add empty assistant message we'll fill
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistantText += c;
              setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m));
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
      if (assistantText) persistMessage("assistant", assistantText);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-4 bg-ink text-ink-foreground shadow-luxe hover:shadow-gold transition-all duration-500 group"
        aria-label="Open AI Saree Expert"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
        </span>
        <Sparkles className="h-4 w-4 text-gold" strokeWidth={1.5} />
        <span className="font-serif text-sm tracking-wider">Ask Megh</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:p-6 bg-ink/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-[440px] h-[85vh] md:h-[640px] bg-background shadow-luxe flex flex-col border-t md:border border-gold-deep/30"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border flex items-center gap-4 bg-ink text-ink-foreground">
                <div className="h-11 w-11 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-ink" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-lg leading-tight">Megh</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-ink-foreground/60">AI Saree Expert · Online</div>
                </div>
                <button onClick={() => setOpen(false)} className="text-ink-foreground/70 hover:text-gold transition" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 ${m.role === "user"
                      ? "bg-gold-deep text-ink-foreground"
                      : "bg-card border border-border"
                      }`}>
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-strong:text-gold-deep">
                        <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border px-4 py-3 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "200ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs px-3 py-2 border border-gold-deep/30 hover:border-gold hover:bg-gold/5 transition text-foreground/80"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="border-t border-border p-4 flex items-center gap-2 bg-card"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about weaves, MOQ, export…"
                  maxLength={1000}
                  className="flex-1 bg-transparent border-b border-border focus:border-gold outline-none px-2 py-2 text-sm placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="h-10 w-10 flex items-center justify-center bg-gold-deep text-ink-foreground hover:bg-gold transition disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
