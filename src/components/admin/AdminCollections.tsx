import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, X, Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Collection = {
  id: string; slug: string; name: string;
  fabric: string | null; origin: string | null;
  description: string | null; image_url: string | null;
  sort_order: number; published: boolean;
};

const empty: Partial<Collection> = {
  slug: "", name: "", fabric: "", origin: "", description: "",
  image_url: "", sort_order: 0, published: true,
};

export default function AdminCollections() {
  const [items, setItems] = useState<Collection[]>([]);
  const [editing, setEditing] = useState<Partial<Collection> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("collection-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("collection-images").getPublicUrl(path);
      setEditing((cur) => ({ ...(cur ?? {}), image_url: data.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("collections").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setItems((data as Collection[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.name) {
      toast.error("Slug and name are required");
      return;
    }
    const payload = {
      slug: editing.slug!.trim().toLowerCase(),
      name: editing.name!.trim(),
      fabric: editing.fabric?.trim() || null,
      origin: editing.origin?.trim() || null,
      description: editing.description?.trim() || null,
      image_url: editing.image_url?.trim() || null,
      sort_order: Number(editing.sort_order ?? 0),
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("collections").update(payload).eq("id", editing.id)
      : await supabase.from("collections").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const togglePublished = async (c: Collection) => {
    const { error } = await supabase
      .from("collections").update({ published: !c.published }).eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <AdminHeader
        title="Collections"
        subtitle="Saree weaves shown on the homepage."
        count={items.length}
        action={
          <button onClick={() => setEditing(empty)} className="btn-luxe-primary !py-3 !px-5 !text-sm gap-2">
            <Plus className="h-4 w-4" /> New collection
          </button>
        }
      />
      <div className="px-10 py-8 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No collections yet.</div>
        ) : items.map((c) => (
          <div key={c.id} className="bg-card border border-border p-5 flex gap-5 items-start">
            {c.image_url ? (
              <img src={c.image_url} alt={c.name} className="w-24 h-24 object-cover shrink-0" />
            ) : (
              <div className="w-24 h-24 bg-secondary shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                no image
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="font-serif text-xl">{c.name}</div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold-deep">{c.slug}</span>
                {!c.published && <span className="text-[10px] uppercase tracking-widest text-destructive">draft</span>}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {c.fabric ?? "—"} · {c.origin ?? "—"} · order {c.sort_order}
              </div>
              {c.description && <p className="text-sm mt-2 text-foreground/80 line-clamp-2">{c.description}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => togglePublished(c)} className="p-2 text-muted-foreground hover:text-gold transition" aria-label="Toggle published">
                {c.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => setEditing(c)} className="p-2 text-muted-foreground hover:text-gold-deep transition" aria-label="Edit">
                <Edit3 className="h-4 w-4" />
              </button>
              <button onClick={() => remove(c.id)} className="p-2 text-muted-foreground hover:text-destructive transition" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setEditing(null)}>
          <div className="flex-1 bg-ink/40 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background border-l border-border overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-serif text-2xl">{editing.id ? "Edit collection" : "New collection"}</h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <Input label="Name *" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Input label="Slug *" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="banarasi" />
              <Input label="Fabric" value={editing.fabric ?? ""} onChange={(v) => setEditing({ ...editing, fabric: v })} />
              <Input label="Origin" value={editing.origin ?? ""} onChange={(v) => setEditing({ ...editing, origin: v })} />

              {/* Image upload + preview */}
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Saree image
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-28 h-28 bg-secondary border border-border shrink-0 overflow-hidden flex items-center justify-center">
                    {editing.image_url ? (
                      <img src={editing.image_url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">no image</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="btn-luxe-outline !py-2 !px-4 !text-xs gap-2 disabled:opacity-50"
                    >
                      {uploading ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                      ) : (
                        <><Upload className="h-3.5 w-3.5" /> {editing.image_url ? "Replace image" : "Upload image"}</>
                      )}
                    </button>
                    {editing.image_url && (
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, image_url: "" })}
                        className="block text-[11px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition"
                      >
                        Remove image
                      </button>
                    )}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      JPG / PNG / WebP · max 8 MB. Or paste a direct URL below.
                    </p>
                  </div>
                </div>
              </div>

              <Input label="Image URL (optional)" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} placeholder="https://…" />
              <Input label="Sort order" type="number" value={String(editing.sort_order ?? 0)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Description</label>
                <textarea
                  rows={5}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full bg-transparent border border-border focus:border-gold outline-none p-3 text-sm transition"
                />
              </div>
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.published ?? true}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  className="h-4 w-4 accent-[hsl(var(--gold-deep))]"
                />
                Published (visible on website)
              </label>
              <div className="pt-4 flex gap-3">
                <button onClick={save} className="btn-luxe-primary !py-3 !px-6 !text-sm">Save</button>
                <button onClick={() => setEditing(null)} className="btn-luxe-outline !py-3 !px-6 !text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 transition"
      />
    </div>
  );
}
