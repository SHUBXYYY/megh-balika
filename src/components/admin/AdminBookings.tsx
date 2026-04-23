import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Appt = {
  id: string; full_name: string; company: string | null; email: string;
  country: string | null; scheduled_at: string; notes: string | null; status: string;
  created_at: string;
};

export default function AdminBookings() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments").select("*").order("scheduled_at", { ascending: false });
    if (error) toast.error(error.message);
    setAppts((data as Appt[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked ${status}`);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const filtered = filter === "all" ? appts : appts.filter((a) => a.status === filter);

  return (
    <div>
      <AdminHeader
        title="Bookings"
        subtitle="Atelier tours, virtual showings, business calls."
        count={appts.length}
      />
      <div className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 flex gap-1 sm:gap-2 border-b border-border overflow-x-auto">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] px-2.5 sm:px-3 py-2 transition whitespace-nowrap ${
              filter === f
                ? "bg-gold/15 text-gold-deep"
                : "text-muted-foreground hover:text-foreground"
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
          <div className="text-center py-20 text-muted-foreground">No bookings.</div>
        ) : filtered.map((a) => (
          <div key={a.id} className="bg-card border border-border p-4 sm:p-5 group">
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="font-serif text-lg sm:text-xl">
                  {a.full_name}
                  {a.company && <span className="text-muted-foreground"> · {a.company}</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-1 break-all">
                  <a href={`mailto:${a.email}`} className="link-edit">{a.email}</a> · {a.country ?? "—"}
                </div>
                <div className="text-sm mt-2 text-gold-deep">
                  📅 {new Date(a.scheduled_at).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <span className={`text-[10px] uppercase tracking-[0.25em] px-2 py-1 ${
                  a.status === "confirmed" ? "bg-gold/20 text-gold-deep"
                  : a.status === "cancelled" ? "bg-destructive/15 text-destructive"
                  : "bg-secondary text-foreground/70"
                }`}>{a.status}</span>
                <div className="flex gap-3 text-xs items-center">
                  {a.status !== "confirmed" &&
                    <button onClick={() => update(a.id, "confirmed")} className="link-edit text-gold-deep">Confirm</button>}
                  {a.status !== "cancelled" &&
                    <button onClick={() => update(a.id, "cancelled")} className="link-edit text-destructive">Cancel</button>}
                  <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {a.notes && <p className="mt-3 text-sm italic text-foreground/80">"{a.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
