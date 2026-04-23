import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Row = { id: string; key: string; value: string; description: string | null };

export default function AdminContent() {
  const [rows, setRows] = useState<Row[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content").select("*").order("key");
    if (error) toast.error(error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (row: Row) => {
    const newVal = edits[row.key] ?? row.value;
    if (newVal === row.value) return;
    setSaving((s) => ({ ...s, [row.key]: true }));
    const { error } = await supabase
      .from("site_content").update({ value: newVal }).eq("id", row.id);
    setSaving((s) => ({ ...s, [row.key]: false }));
    if (error) { toast.error(error.message); return; }
    toast.success(`Saved "${row.key}"`);
    setEdits((e) => { const c = { ...e }; delete c[row.key]; return c; });
    load();
  };

  return (
    <div>
      <AdminHeader
        title="Site content"
        subtitle="Edit hero text, contact details, and other site copy. Changes are live immediately."
        count={rows.length}
      />
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-4 max-w-4xl">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : rows.map((r) => {
          const current = edits[r.key] ?? r.value;
          const dirty = current !== r.value;
          const isLong = r.value.length > 80 || r.key.includes("intro") || r.key.includes("tagline");
          return (
            <div key={r.id} className="bg-card border border-border p-5">
              <div className="flex justify-between items-baseline mb-1 gap-3 flex-wrap">
                <code className="text-xs uppercase tracking-[0.25em] text-gold-deep">{r.key}</code>
                {dirty && <span className="text-[10px] uppercase tracking-widest text-gold">unsaved</span>}
              </div>
              {r.description && <p className="text-xs text-muted-foreground mb-3">{r.description}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                {isLong ? (
                  <textarea
                    rows={3}
                    value={current}
                    onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                    className="flex-1 bg-background border border-border focus:border-gold outline-none p-3 text-sm transition resize-y"
                  />
                ) : (
                  <input
                    value={current}
                    onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                    className="flex-1 bg-background border border-border focus:border-gold outline-none px-3 py-2 text-sm transition"
                  />
                )}
                <button
                  onClick={() => save(r)}
                  disabled={!dirty || saving[r.key]}
                  className="btn-luxe-primary !py-2 !px-4 !text-xs gap-2 disabled:opacity-30 disabled:cursor-not-allowed self-start"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving[r.key] ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
