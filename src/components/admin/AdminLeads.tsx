import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Lead = {
  id: string; source: string; full_name: string; company: string | null;
  email: string; country: string | null; order_volume: string | null;
  phone: string | null; message: string | null; created_at: string;
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead deleted");
    load();
  };

  const exportCsv = () => {
    if (leads.length === 0) { toast.info("No leads to export"); return; }
    const headers = ["Date","Source","Name","Company","Email","Country","Volume","Phone","Message"];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g,'""')}"`;
    const rows = leads.map((l) => [
      new Date(l.created_at).toISOString(), l.source, l.full_name,
      l.company, l.email, l.country, l.order_volume, l.phone, l.message,
    ].map(esc).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `meghbalika-leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminHeader
        title="Leads"
        subtitle="Wholesale buyers, catalogue requests, contact-form enquiries."
        count={leads.length}
        action={
          <button onClick={exportCsv} className="btn-luxe-outline !py-3 !px-5 !text-sm gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />
      <div className="px-10 py-8 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No leads yet.</div>
        ) : leads.map((l) => (
          <div key={l.id} className="bg-card border border-border p-5 group">
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="font-serif text-xl">
                  {l.full_name}
                  {l.company && <span className="text-muted-foreground"> · {l.company}</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-1 break-all">
                  <a href={`mailto:${l.email}`} className="link-edit">{l.email}</a>
                  {" · "}{l.country ?? "—"}{" · "}{l.order_volume ?? "—"}
                  {l.phone && <> · <a href={`tel:${l.phone}`} className="link-edit">{l.phone}</a></>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-xs uppercase tracking-widest text-gold-deep">
                  {new Date(l.created_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] px-2 py-0.5 bg-gold/15 text-gold-deep">
                    {l.source}
                  </span>
                  <button
                    onClick={() => remove(l.id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition"
                    aria-label="Delete lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {l.message && <p className="mt-3 text-sm text-foreground/80 italic">"{l.message}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
