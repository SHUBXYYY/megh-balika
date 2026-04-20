import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Valid email required").max(254),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  order_volume: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

interface Props {
  source?: string;
  title?: string;
  subtitle?: string;
  embedded?: boolean;
}

export default function CatalogForm({
  source = "catalog",
  title = "Request the export catalogue",
  subtitle = "Pricing, swatches and lead times — delivered within 24 hours.",
  embedded = false,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      source,
      full_name: parsed.data.full_name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      country: parsed.data.country || null,
      order_volume: parsed.data.order_volume || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Received. Our export team will reach out within 24 hours.");
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="font-serif text-5xl text-gold-shimmer mb-4">Dhanyavaad</div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your request is received. Expect our catalogue and pricing in your inbox within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={embedded ? "" : "max-w-3xl mx-auto"}>
      {!embedded && (
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3">— For wholesale buyers</div>
          <h3 className="font-serif text-3xl md:text-5xl mb-3 text-balance">{title}</h3>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
        <Field label="Full name *" name="full_name" error={errors.full_name} required />
        <Field label="Company / boutique" name="company" error={errors.company} />
        <Field label="Email *" name="email" type="email" error={errors.email} required />
        <Field label="Country" name="country" error={errors.country} />
        <Field label="Estimated monthly volume" name="order_volume" placeholder="e.g. 100–250 pieces" error={errors.order_volume} />
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Notes</label>
          <textarea
            name="message"
            rows={4}
            maxLength={4000}
            className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 resize-none transition"
            placeholder="Categories of interest, target markets, custom labelling…"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-6 pt-2">
          <button type="submit" disabled={submitting} className="btn-luxe-primary disabled:opacity-50">
            {submitting ? "Sending…" : "Request catalogue ⟶"}
          </button>
          <span className="text-xs text-muted-foreground">We respond within 24 hours.</span>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, name, type = "text", error, required, placeholder,
}: { label: string; name: string; type?: string; error?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={254}
        className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 transition"
      />
      {error && <div className="text-xs text-destructive mt-1">{error}</div>}
    </div>
  );
}
