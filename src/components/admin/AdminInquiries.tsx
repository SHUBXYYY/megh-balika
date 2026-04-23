import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, MailOpen, CheckCircle2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Inquiry = {
  id: string; full_name: string; email: string; phone: string | null;
  subject: string | null; message: string; status: string; created_at: string;
};

const STATUSES = ["all", "new", "read", "resolved"] as const;
type Status = typeof STATUSES[number];

export default function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Inquiry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked ${status}`);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div>
      <AdminHeader
        title="Inquiries"
        subtitle="Contact form submissions from the website."
        count={items.length}
      />
      <div className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 flex gap-1 sm:gap-2 border-b border-border overflow-x-auto">
        {STATUSES.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] px-2.5 sm:px-3 py-2 transition whitespace-nowrap ${
              filter === f ? "bg-gold/15 text-gold-deep" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No inquiries.</div>
        ) : filtered.map((i) => (
          <div key={i.id} className="bg-card border border-border p-4 sm:p-5 group">
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="font-serif text-lg sm:text-xl">
                  {i.full_name}
                  {i.subject && <span className="text-muted-foreground"> · {i.subject}</span>}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-all">
                  <a href={`mailto:${i.email}`} className="link-edit">{i.email}</a>
                  {i.phone && <> · <a href={`tel:${i.phone}`} className="link-edit">{i.phone}</a></>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] uppercase tracking-[0.25em] px-2 py-1 ${
                  i.status === "resolved" ? "bg-gold/20 text-gold-deep"
                  : i.status === "read" ? "bg-secondary text-foreground/70"
                  : "bg-destructive/15 text-destructive"
                }`}>{i.status}</span>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(i.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-foreground/80 italic whitespace-pre-wrap">"{i.message}"</p>
            <div className="mt-3 flex gap-3 text-xs items-center justify-end">
              {i.status === "new" && (
                <button onClick={() => update(i.id, "read")} className="link-edit text-foreground/70 inline-flex items-center gap-1">
                  <MailOpen className="h-3.5 w-3.5" /> Mark read
                </button>
              )}
              {i.status !== "resolved" && (
                <button onClick={() => update(i.id, "resolved")} className="link-edit text-gold-deep inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                </button>
              )}
              <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
