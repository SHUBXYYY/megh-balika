import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().max(254),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

const SLOTS = ["10:00", "11:30", "14:00", "15:30", "17:00"];

function getNextDays(n: number) {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // skip Sunday
    days.push(d);
    if (days.length >= n) break;
  }
  return days;
}

const Book = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const days = useMemo(() => getNextDays(8), []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !slot) { toast.error("Please choose a date and time."); return; }
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) { toast.error("Please check your details."); return; }
    setSubmitting(true);
    const [hh, mm] = slot.split(":").map(Number);
    const scheduled = new Date(date);
    scheduled.setHours(hh, mm, 0, 0);
    const { error } = await supabase.from("appointments").insert({
      full_name: parsed.data.full_name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      country: parsed.data.country || null,
      scheduled_at: scheduled.toISOString(),
      notes: parsed.data.notes || null,
      status: "pending",
    });
    setSubmitting(false);
    if (error) { toast.error("Could not book. Please try again."); return; }
    setDone(true);
    toast.success("Booked. We've emailed a confirmation.");
  };

  return (
    <main className="bg-background min-h-screen">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-32 md:pt-44 pb-12 silk-bg">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">⟵ Atelier</Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl mt-6 leading-tight text-balance max-w-3xl"
          >
            Book a virtual <em className="text-gold-shimmer not-italic">tour</em>.
          </motion.h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            A 30-minute live walk-through of the atelier, guided by our export team.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-6 md:px-12 max-w-4xl">
          {done ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="font-serif text-6xl text-gold-shimmer mb-4">Confirmed</div>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your tour is booked for {date?.toLocaleDateString()} at {slot} IST. Look out for an email with the meeting link.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-12">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">1 — Choose a date</div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {days.map((d) => {
                    const active = date?.toDateString() === d.toDateString();
                    return (
                      <button
                        type="button"
                        key={d.toISOString()}
                        onClick={() => setDate(d)}
                        className={`p-3 border transition-all ${active ? "border-gold bg-gold/10 text-foreground" : "border-border hover:border-gold-deep"}`}
                      >
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {d.toLocaleDateString("en", { weekday: "short" })}
                        </div>
                        <div className="font-serif text-2xl">{d.getDate()}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {d.toLocaleDateString("en", { month: "short" })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {date && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">2 — Pick a time (IST)</div>
                  <div className="flex flex-wrap gap-2">
                    {SLOTS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSlot(s)}
                        className={`px-5 py-3 border font-serif transition-all ${slot === s ? "border-gold bg-gold/10" : "border-border hover:border-gold-deep"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {slot && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
                  <div className="text-xs uppercase tracking-[0.3em] text-gold-deep">3 — Your details</div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
                    <FormField label="Full name *" name="full_name" required />
                    <FormField label="Company" name="company" />
                    <FormField label="Email *" name="email" type="email" required />
                    <FormField label="Country" name="country" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                      What would you like to see?
                    </label>
                    <textarea
                      name="notes" rows={3} maxLength={2000}
                      className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 resize-none"
                      placeholder="Specific weaves, market focus, sample requirements…"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-luxe-primary disabled:opacity-50">
                    {submitting ? "Booking…" : "Confirm booking ⟶"}
                  </button>
                </motion.div>
              )}
            </form>
          )}
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

function FormField({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</label>
      <input
        name={name} type={type} required={required} maxLength={254}
        className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2"
      />
    </div>
  );
}

export default Book;
