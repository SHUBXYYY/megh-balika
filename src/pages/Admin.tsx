import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, MessageSquare, Calendar, LogOut, ShieldAlert } from "lucide-react";

type Lead = {
  id: string; source: string; full_name: string; company: string | null;
  email: string; country: string | null; order_volume: string | null;
  message: string | null; created_at: string;
};
type Appt = {
  id: string; full_name: string; company: string | null; email: string;
  country: string | null; scheduled_at: string; notes: string | null; status: string;
};
type Session = { id: string; visitor_label: string | null; created_at: string };
type Message = { id: string; session_id: string; role: string; content: string; created_at: string };

const Admin = () => {
  const [tab, setTab] = useState<"leads" | "chats" | "bookings">("leads");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = roles?.some((r) => r.role === "admin") ?? false;
      setIsAdmin(admin);
      if (admin) loadAll();
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate("/auth");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const loadAll = async () => {
    const [l, a, s] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("appointments").select("*").order("scheduled_at", { ascending: false }),
      supabase.from("chat_sessions").select("*").order("created_at", { ascending: false }),
    ]);
    if (l.data) setLeads(l.data as Lead[]);
    if (a.data) setAppts(a.data as Appt[]);
    if (s.data) setSessions(s.data as Session[]);
  };

  const openSession = async (id: string) => {
    setActiveSession(id);
    const { data } = await supabase.from("chat_messages").select("*").eq("session_id", id).order("created_at");
    setMessages((data as Message[]) ?? []);
  };

  const promoteSelf = async () => {
    if (!userId) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) { toast.error("Could not self-promote (likely already admin or restricted)."); return; }
    toast.success("You are now admin. Reloading…");
    setTimeout(() => location.reload(), 800);
  };

  const updateAppt = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    toast.success("Updated");
    loadAll();
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-gold mx-auto mb-4" strokeWidth={1.2} />
          <h1 className="font-serif text-3xl mb-3">Admin access only</h1>
          <p className="text-muted-foreground mb-6">
            Your account isn't set as admin yet. If this is the first admin account, click below to grant yourself admin.
            Otherwise, ask an existing admin to add you.
          </p>
          <button onClick={promoteSelf} className="btn-luxe-primary">Make me admin</button>
          <div className="mt-4">
            <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted-foreground link-edit">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-serif text-lg tracking-[0.2em]">
            MEGH<span className="text-gold-shimmer mx-1">·</span>BALIKA
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-deep">Atelier dashboard</span>
            <button onClick={() => supabase.auth.signOut()} className="text-muted-foreground hover:text-gold flex items-center gap-2 text-sm">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container px-6 py-10">
        <div className="grid grid-cols-3 gap-px bg-gold-deep/20 mb-10">
          {[
            { id: "leads", label: "Leads", icon: Users, count: leads.length },
            { id: "chats", label: "Chats", icon: MessageSquare, count: sessions.length },
            { id: "bookings", label: "Bookings", icon: Calendar, count: appts.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`bg-card p-6 text-left transition ${tab === t.id ? "bg-gold/10" : "hover:bg-secondary"}`}
            >
              <t.icon className="h-5 w-5 text-gold mb-3" strokeWidth={1.2} />
              <div className="font-serif text-3xl">{t.count}</div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-1">{t.label}</div>
            </button>
          ))}
        </div>

        {tab === "leads" && (
          <div className="space-y-3">
            {leads.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No leads yet.</div>
            ) : leads.map((l) => (
              <div key={l.id} className="bg-card border border-border p-5">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-serif text-xl">{l.full_name}{l.company && <span className="text-muted-foreground"> · {l.company}</span>}</div>
                    <div className="text-sm text-muted-foreground mt-1">{l.email} · {l.country ?? "—"} · {l.order_volume ?? "—"}</div>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gold-deep">
                    {new Date(l.created_at).toLocaleString()} · {l.source}
                  </div>
                </div>
                {l.message && <p className="mt-3 text-sm text-foreground/80 italic">"{l.message}"</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "chats" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-2">Sessions</div>
              {sessions.length === 0 && <div className="text-muted-foreground text-sm">No chats yet.</div>}
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openSession(s.id)}
                  className={`w-full text-left p-4 border transition ${activeSession === s.id ? "border-gold bg-gold/10" : "border-border hover:border-gold-deep"}`}
                >
                  <div className="font-serif text-sm truncate">{s.visitor_label ?? "Guest"}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 bg-card border border-border min-h-[400px] p-5 space-y-3">
              {!activeSession ? (
                <div className="text-muted-foreground text-center py-20">Select a session to view conversation</div>
              ) : messages.length === 0 ? (
                <div className="text-muted-foreground text-center py-20">No messages in this session.</div>
              ) : messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2 text-sm ${m.role === "user" ? "bg-gold-deep text-ink-foreground" : "bg-background border border-border"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div className="space-y-3">
            {appts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No bookings yet.</div>
            ) : appts.map((a) => (
              <div key={a.id} className="bg-card border border-border p-5">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-serif text-xl">{a.full_name}{a.company && <span className="text-muted-foreground"> · {a.company}</span>}</div>
                    <div className="text-sm text-muted-foreground mt-1">{a.email} · {a.country ?? "—"}</div>
                    <div className="text-sm mt-2 text-gold-deep">📅 {new Date(a.scheduled_at).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs uppercase tracking-widest px-2 py-1 ${a.status === "confirmed" ? "bg-gold/20 text-gold-deep" : a.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-secondary"}`}>
                      {a.status}
                    </span>
                    <div className="flex gap-2 text-xs">
                      <button onClick={() => updateAppt(a.id, "confirmed")} className="link-edit text-gold-deep">Confirm</button>
                      <button onClick={() => updateAppt(a.id, "cancelled")} className="link-edit text-destructive">Cancel</button>
                    </div>
                  </div>
                </div>
                {a.notes && <p className="mt-3 text-sm italic text-foreground/80">"{a.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
