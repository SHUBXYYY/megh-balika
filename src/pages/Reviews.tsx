import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";

type Review = {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  category: string;
  featured: boolean;
  created_at: string;
};

const CATEGORIES = ["service", "product", "website", "overall"] as const;

const schema = z.object({
  reviewer_name: z.string().trim().min(1, "Name required").max(80),
  reviewer_email: z.string().trim().email().max(254).optional().or(z.literal("")),
  rating: z.number().min(1).max(5),
  title: z.string().trim().max(160).optional().or(z.literal("")),
  comment: z.string().trim().min(4, "Tell us a bit more").max(2000),
  category: z.enum(CATEGORIES),
});

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    reviewer_name: "",
    reviewer_email: "",
    rating: 0,
    title: "",
    comment: "",
    category: "service" as typeof CATEGORIES[number],
  });
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    document.title = "Reviews — Megh Balika";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Read what customers say about Megh Balika sarees, service and craftsmanship — and share your own experience.");
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      reviewer_name: parsed.data.reviewer_name,
      reviewer_email: parsed.data.reviewer_email || null,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      comment: parsed.data.comment,
      category: parsed.data.category,
      approved: false,
      featured: false,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Dhanyavaad! Aapka review review ke liye bheja gaya.");
    setForm({ reviewer_name: "", reviewer_email: "", rating: 0, title: "", comment: "", category: "service" });
  };

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.category === filter);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MenuTrigger onClick={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-12 silk-bg relative">
        <div className="max-w-5xl mx-auto relative">
          <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-gold-deep link-edit">
            ← Megh Balika
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mt-4">Voices of our patrons</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Honest words from those who have draped a Megh Balika saree, walked into our atelier, or ordered from across the seas.
          </p>
          {reviews.length > 0 && (
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-serif text-3xl text-gold-deep">{avg.toFixed(1)}</span>
              <Stars n={Math.round(avg)} />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
            </div>
          )}
        </div>
      </section>

      {/* Filters + list */}
      <section className="px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {["all", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`text-[10px] uppercase tracking-[0.25em] px-3 py-2 whitespace-nowrap transition ${
                  filter === c ? "bg-gold/15 text-gold-deep" : "text-muted-foreground hover:text-foreground"
                }`}
              >{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              Abhi koi review nahi. Pehla review aap likhiye ↓
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((r) => (
                <article key={r.id} className={`p-6 border bg-card ${r.featured ? "border-gold" : "border-border"}`}>
                  {r.featured && (
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep mb-2">✦ Featured</div>
                  )}
                  <Stars n={r.rating} />
                  {r.title && <h3 className="font-serif text-xl mt-3">{r.title}</h3>}
                  <p className="text-foreground/80 mt-2 whitespace-pre-wrap text-sm leading-relaxed">{r.comment}</p>
                  <div className="mt-4 text-xs text-muted-foreground border-t border-border pt-3 flex justify-between">
                    <span className="font-serif">{r.reviewer_name}</span>
                    <span className="uppercase tracking-widest text-[10px]">{r.category}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit form */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-secondary/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep">Share your voice</div>
          <h2 className="font-serif text-3xl sm:text-4xl mt-2">Aapka anubhav</h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Your review helps weavers and fellow saree lovers. Reviews appear after a quick check by our atelier.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Your rating</label>
              <div className="mt-2 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })} aria-label={`${i} star`}>
                    <Star className={`h-7 w-7 transition ${i <= form.rating ? "fill-gold text-gold" : "text-muted-foreground/40 hover:text-gold/60"}`} strokeWidth={1.2} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your name *">
                <input className="input-luxe" value={form.reviewer_name} maxLength={80}
                  onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} required />
              </Field>
              <Field label="Email (optional, kept private)">
                <input className="input-luxe" type="email" value={form.reviewer_email} maxLength={254}
                  onChange={(e) => setForm({ ...form, reviewer_email: e.target.value })} />
              </Field>
            </div>

            <Field label="What are you reviewing?">
              <select className="input-luxe" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Headline (optional)">
              <input className="input-luxe" value={form.title} maxLength={160}
                onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="A short title for your review" />
            </Field>

            <Field label="Your review *">
              <textarea className="input-luxe" rows={5} value={form.comment} maxLength={2000}
                onChange={(e) => setForm({ ...form, comment: e.target.value })} required
                placeholder="Tell us about the saree, the service, the craftsmanship…" />
              <div className="text-[10px] text-muted-foreground mt-1 text-right">{form.comment.length}/2000</div>
            </Field>

            <button type="submit" disabled={submitting || form.rating === 0}
              className="btn-luxe-primary inline-flex items-center gap-2 disabled:opacity-50">
              <Send className="h-4 w-4" /> {submitting ? "Sending…" : "Submit review"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= n ? "fill-gold text-gold" : "text-muted-foreground/40"}`} strokeWidth={1.4} />
      ))}
    </span>
  );
}
