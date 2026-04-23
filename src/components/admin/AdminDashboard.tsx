import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Calendar, MessageSquare, MailOpen, LayoutGrid, Package, ArrowRight,
} from "lucide-react";
import AdminHeader from "./AdminHeader";

type Stats = {
  leads: number; bookingsPending: number; inquiriesNew: number;
  chats: number; collections: number; collectionsDraft: number;
  products: number; productsDraft: number;
};

export default function AdminDashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<{ kind: string; label: string; meta: string; at: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const [leads, appts, inqs, chats, cols, prods, recentLeads, recentInq] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id, status", { count: "exact" }).eq("status", "pending"),
        supabase.from("inquiries").select("id, status", { count: "exact" }).eq("status", "new"),
        supabase.from("chat_sessions").select("id", { count: "exact", head: true }),
        supabase.from("collections").select("id, published"),
        supabase.from("products").select("id, published"),
        supabase.from("leads").select("full_name, email, source, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("inquiries").select("full_name, subject, created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      const colsArr = (cols.data as any[]) ?? [];
      const prodsArr = (prods.data as any[]) ?? [];

      setS({
        leads: leads.count ?? 0,
        bookingsPending: appts.count ?? 0,
        inquiriesNew: inqs.count ?? 0,
        chats: chats.count ?? 0,
        collections: colsArr.length,
        collectionsDraft: colsArr.filter((c) => !c.published).length,
        products: prodsArr.length,
        productsDraft: prodsArr.filter((p) => !p.published).length,
      });

      const items = [
        ...((recentLeads.data as any[]) ?? []).map((l) => ({
          kind: "lead", label: l.full_name, meta: `${l.email} · ${l.source}`, at: l.created_at,
        })),
        ...((recentInq.data as any[]) ?? []).map((i) => ({
          kind: "inquiry", label: i.full_name, meta: i.subject ?? "Contact form", at: i.created_at,
        })),
      ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 6);
      setRecent(items);
    };
    load();
  }, []);

  const cards = [
    { to: "leads", label: "Leads", value: s?.leads, icon: Users, accent: "from-gold/20 to-gold-deep/10" },
    { to: "bookings", label: "Pending bookings", value: s?.bookingsPending, icon: Calendar, accent: "from-gold-deep/20 to-gold/10" },
    { to: "inquiries", label: "New inquiries", value: s?.inquiriesNew, icon: MailOpen, accent: "from-destructive/15 to-gold/5" },
    { to: "chats", label: "Chat sessions", value: s?.chats, icon: MessageSquare, accent: "from-gold/15 to-gold-deep/5" },
    { to: "collections", label: "Collections", value: s?.collections, sub: s?.collectionsDraft ? `${s.collectionsDraft} draft` : undefined, icon: LayoutGrid, accent: "from-gold-deep/15 to-gold/5" },
    { to: "products", label: "Products", value: s?.products, sub: s?.productsDraft ? `${s.productsDraft} draft` : undefined, icon: Package, accent: "from-gold/15 to-gold-deep/10" },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Aapki atelier ki ek nazar mein."
      />
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((c) => (
            <Link key={c.to} to={c.to}
              className={`group relative overflow-hidden border border-border bg-gradient-to-br ${c.accent} hover:border-gold transition-all p-4 sm:p-5`}>
              <div className="flex items-start justify-between mb-3">
                <c.icon className="h-5 w-5 text-gold-deep" strokeWidth={1.4} />
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl">
                {s ? c.value ?? 0 : <span className="opacity-30">—</span>}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">{c.label}</div>
              {c.sub && <div className="text-[10px] uppercase tracking-widest text-destructive mt-1">{c.sub}</div>}
            </Link>
          ))}
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Recent activity</div>
          {recent.length === 0 ? (
            <div className="bg-card border border-border p-6 text-sm text-muted-foreground text-center">Abhi koi activity nahi.</div>
          ) : (
            <div className="bg-card border border-border divide-y divide-border">
              {recent.map((r, i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-sm font-serif">
                      <span className="text-[10px] uppercase tracking-widest text-gold-deep mr-2">{r.kind}</span>
                      {r.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{r.meta}</div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(r.at).toLocaleString()}
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
