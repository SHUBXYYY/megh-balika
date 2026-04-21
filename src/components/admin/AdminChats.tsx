import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Session = { id: string; visitor_label: string | null; created_at: string };
type Message = { id: string; session_id: string; role: string; content: string; created_at: string };

export default function AdminChats() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const loadSessions = async () => {
    setLoadingSessions(true);
    const { data, error } = await supabase
      .from("chat_sessions").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setSessions((data as Session[]) ?? []);
    setLoadingSessions(false);
  };

  useEffect(() => { loadSessions(); }, []);

  const open = async (id: string) => {
    setActive(id);
    setLoadingMsgs(true);
    const { data } = await supabase
      .from("chat_messages").select("*").eq("session_id", id).order("created_at");
    setMessages((data as Message[]) ?? []);
    setLoadingMsgs(false);
  };

  const removeSession = async (id: string) => {
    if (!confirm("Delete session and all messages?")) return;
    await supabase.from("chat_messages").delete().eq("session_id", id);
    const { error } = await supabase.from("chat_sessions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    if (active === id) { setActive(null); setMessages([]); }
    loadSessions();
  };

  return (
    <div>
      <AdminHeader
        title="Chat sessions"
        subtitle="Conversations with Megh — your AI saree expert."
        count={sessions.length}
      />
      <div className="grid lg:grid-cols-[320px,1fr] gap-px bg-border min-h-[calc(100vh-200px)]">
        <div className="bg-card overflow-y-auto">
          {loadingSessions ? (
            <div className="text-muted-foreground text-sm p-6">Loading…</div>
          ) : sessions.length === 0 ? (
            <div className="text-muted-foreground text-sm p-6">No chats yet.</div>
          ) : sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => open(s.id)}
              className={`w-full text-left p-4 border-b border-border transition group flex justify-between items-start gap-2 ${
                active === s.id ? "bg-gold/10 border-l-2 border-l-gold" : "hover:bg-secondary/50"
              }`}
            >
              <div className="min-w-0">
                <div className="font-serif text-sm truncate">{s.visitor_label ?? "Guest visitor"}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  {new Date(s.created_at).toLocaleString()}
                </div>
              </div>
              <span
                onClick={(e) => { e.stopPropagation(); removeSession(s.id); }}
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="bg-background overflow-y-auto p-6 lg:p-10">
          {!active ? (
            <div className="text-muted-foreground text-center py-20">
              Select a session to view the conversation
            </div>
          ) : loadingMsgs ? (
            <div className="text-muted-foreground text-center py-20">Loading messages…</div>
          ) : messages.length === 0 ? (
            <div className="text-muted-foreground text-center py-20">Empty session.</div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-gold-deep text-ink-foreground"
                      : "bg-card border border-border"
                  }`}>
                    <div className="text-[10px] uppercase tracking-[0.25em] mb-1 opacity-60">
                      {m.role === "user" ? "Visitor" : "Megh"}
                    </div>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
