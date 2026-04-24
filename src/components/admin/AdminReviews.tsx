import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, Trash2, CheckCircle2, X as XIcon, Sparkles } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Review = {
  id: string;
  reviewer_name: string;
  reviewer_email: string | null;
  rating: number;
  title: string | null;
  comment: string;
  category: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
};

const FILTERS = ["all", "pending", "approved", "featured"] as const;
type F = typeof FILTERS[number];

export default function AdminReviews() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<F>("pending");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Review[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(approved ? "Approved & live" : "Hidden from public");
    load();
  };

  const setFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase.from("reviews").update({ featured, approved: featured ? true : undefined }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const filtered = items.filter((r) => {
    if (filter === "all") return true;
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    if (filter === "featured") return r.featured;
    return true;
  });

  const avg = items.filter((i) => i.approved).reduce((s, i) => s + i.rating, 0) / Math.max(1, items.filter((i) => i.approved).length);

  return (
    <div>
      <AdminHeader
        title="Reviews"
        subtitle="Moderate ratings from customers. Approved reviews show on the public /reviews page."
        count={items.length}
        action={
          <div className="text-right">
            <div className="font-serif text-2xl text-gold-deep">{avg ? avg.toFixed(1) : "—"} <Star className="inline h-4 w-4 fill-gold text-gold" /></div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg rating</div>
          </div>
        }
      />
      <div className="px-5 sm:px-8 lg:px-10 py-4 flex gap-1 sm:gap-2 border-b border-border overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] px-2.5 sm:px-3 py-2 transition whitespace-nowrap ${
              filter === f ? "bg-gold/15 text-gold-deep" : "text-muted-foreground hover:text-foreground"
            }`}
          >{f}</button>
        ))}
      </div>
      <div className="px-5 sm:px-8 lg:px-10 py-6 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No reviews here.</div>
        ) : filtered.map((r) => (
          <div key={r.id} className="bg-card border border-border p-4 sm:p-5">
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="font-serif text-lg">{r.reviewer_name}</div>
                  <Stars n={r.rating} />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.category}</span>
                  {r.featured && (
                    <span className="text-[10px] uppercase tracking-widest text-gold-deep inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> featured
                    </span>
                  )}
                </div>
                {r.title && <div className="font-serif mt-1">{r.title}</div>}
                <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">{r.comment}</p>
                {r.reviewer_email && (
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 break-all">
                    {r.reviewer_email}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[10px] uppercase tracking-[0.25em] px-2 py-1 ${
                  r.approved ? "bg-gold/20 text-gold-deep" : "bg-destructive/15 text-destructive"
                }`}>{r.approved ? "live" : "pending"}</span>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-3 justify-end text-xs flex-wrap">
              {!r.approved ? (
                <button onClick={() => setApproved(r.id, true)} className="link-edit text-gold-deep inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </button>
              ) : (
                <button onClick={() => setApproved(r.id, false)} className="link-edit text-foreground/70 inline-flex items-center gap-1">
                  <XIcon className="h-3.5 w-3.5" /> Hide
                </button>
              )}
              <button onClick={() => setFeatured(r.id, !r.featured)} className="link-edit text-foreground/70 inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> {r.featured ? "Unfeature" : "Feature"}
              </button>
              <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= n ? "fill-gold text-gold" : "text-muted-foreground/40"}`} strokeWidth={1.4} />
      ))}
    </span>
  );
}
