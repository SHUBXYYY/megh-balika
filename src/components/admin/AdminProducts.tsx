import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit3, X, Eye, EyeOff, Upload, Loader2,
  Star, ArrowLeft, ArrowRight,
} from "lucide-react";
import AdminHeader from "./AdminHeader";

type Product = {
  id: string; slug: string; name: string;
  sku: string | null; description: string | null;
  fabric: string | null; color: string | null; origin: string | null;
  price_inr: number | null; stock: number;
  collection_id: string | null;
  images: string[]; primary_image_index: number;
  sort_order: number; published: boolean;
};

type CollectionLite = { id: string; name: string };

const empty: Partial<Product> = {
  slug: "", name: "", sku: "", description: "",
  fabric: "", color: "", origin: "",
  price_inr: null, stock: 0, collection_id: null,
  images: [], primary_image_index: 0,
  sort_order: 0, published: true,
};

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [collections, setCollections] = useState<CollectionLite[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: prods, error: pe }, { data: cols }] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("collections").select("id, name").order("name"),
    ]);
    if (pe) toast.error(pe.message);
    const normalized = ((prods as any[]) ?? []).map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
      primary_image_index: p.primary_image_index ?? 0,
    })) as Product[];
    setItems(normalized);
    setCollections((cols as CollectionLite[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList) => {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    try {
      for (const file of list) {
        if (!file.type.startsWith("image/")) { toast.error(`${file.name}: not an image`); continue; }
        if (file.size > 8 * 1024 * 1024) { toast.error(`${file.name}: over 8 MB`); continue; }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("collection-images").upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
        const { data } = supabase.storage.from("collection-images").getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
      if (newUrls.length) {
        setEditing((cur) => ({
          ...(cur ?? {}),
          images: [...(cur?.images ?? []), ...newUrls],
          primary_image_index: cur?.primary_image_index ?? 0,
        }));
        toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded`);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.name) { toast.error("Slug and name are required"); return; }
    const images = editing.images ?? [];
    const primaryIdx = Math.max(0, Math.min(editing.primary_image_index ?? 0, Math.max(0, images.length - 1)));
    const payload = {
      slug: editing.slug!.trim().toLowerCase(),
      name: editing.name!.trim(),
      sku: editing.sku?.trim() || null,
      description: editing.description?.trim() || null,
      fabric: editing.fabric?.trim() || null,
      color: editing.color?.trim() || null,
      origin: editing.origin?.trim() || null,
      price_inr: editing.price_inr === null || editing.price_inr === undefined || (editing.price_inr as any) === ""
        ? null : Number(editing.price_inr),
      stock: Number(editing.stock ?? 0),
      collection_id: editing.collection_id || null,
      images, primary_image_index: primaryIdx,
      sort_order: Number(editing.sort_order ?? 0),
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const togglePublished = async (p: Product) => {
    const { error } = await supabase.from("products").update({ published: !p.published }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    setEditing((cur) => {
      if (!cur) return cur;
      const arr = [...(cur.images ?? [])];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return cur;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      let p = cur.primary_image_index ?? 0;
      if (p === idx) p = j; else if (p === j) p = idx;
      return { ...cur, images: arr, primary_image_index: p };
    });
  };
  const removeImage = (idx: number) => {
    setEditing((cur) => {
      if (!cur) return cur;
      const arr = [...(cur.images ?? [])];
      arr.splice(idx, 1);
      let p = cur.primary_image_index ?? 0;
      if (arr.length === 0) p = 0;
      else if (idx < p) p = p - 1;
      else if (idx === p) p = 0;
      return { ...cur, images: arr, primary_image_index: p };
    });
  };
  const setPrimary = (idx: number) => setEditing((cur) => cur ? { ...cur, primary_image_index: idx } : cur);

  return (
    <div>
      <AdminHeader
        title="Products"
        subtitle="Individual saree pieces. Linked to a collection, with stock & price."
        count={items.length}
        action={
          <button onClick={() => setEditing(empty)} className="btn-luxe-primary !py-2.5 !px-4 sm:!py-3 sm:!px-5 !text-xs sm:!text-sm gap-2">
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No products yet.</div>
        ) : items.map((p) => {
          const cover = p.images?.[p.primary_image_index];
          return (
            <div key={p.id} className="bg-card border border-border p-4 sm:p-5 flex gap-4 items-start">
              {cover ? (
                <img src={cover} alt={p.name} className="w-16 h-16 sm:w-24 sm:h-24 object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-secondary shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                  no image
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <div className="font-serif text-base sm:text-xl truncate">{p.name}</div>
                  {p.sku && <span className="text-[10px] uppercase tracking-[0.25em] text-gold-deep">{p.sku}</span>}
                  {!p.published && <span className="text-[10px] uppercase tracking-widest text-destructive">draft</span>}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {p.fabric ?? "—"} · {p.color ?? "—"} · stock {p.stock}
                  {p.price_inr != null && <> · ₹{Number(p.price_inr).toLocaleString("en-IN")}</>}
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 shrink-0">
                <button onClick={() => togglePublished(p)} className="p-2 text-muted-foreground hover:text-gold transition" aria-label="Toggle published">
                  {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing(p)} className="p-2 text-muted-foreground hover:text-gold-deep transition" aria-label="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => remove(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setEditing(null)}>
          <div className="flex-1 bg-ink/40 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-background border-l border-border overflow-y-auto">
            <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background z-10">
              <h3 className="font-serif text-xl sm:text-2xl">{editing.id ? "Edit product" : "New product"}</h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Name *" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
                <Input label="Slug *" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="ruby-banarasi-01" />
                <Input label="SKU" value={editing.sku ?? ""} onChange={(v) => setEditing({ ...editing, sku: v })} />
                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Collection</label>
                  <select
                    value={editing.collection_id ?? ""}
                    onChange={(e) => setEditing({ ...editing, collection_id: e.target.value || null })}
                    className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 transition"
                  >
                    <option value="">— None —</option>
                    {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <Input label="Fabric" value={editing.fabric ?? ""} onChange={(v) => setEditing({ ...editing, fabric: v })} />
                <Input label="Colour" value={editing.color ?? ""} onChange={(v) => setEditing({ ...editing, color: v })} />
                <Input label="Origin" value={editing.origin ?? ""} onChange={(v) => setEditing({ ...editing, origin: v })} />
                <Input label="Price (INR)" type="number" value={editing.price_inr == null ? "" : String(editing.price_inr)}
                  onChange={(v) => setEditing({ ...editing, price_inr: v === "" ? null : (Number(v) as any) })} />
                <Input label="Stock" type="number" value={String(editing.stock ?? 0)}
                  onChange={(v) => setEditing({ ...editing, stock: Number(v) })} />
                <Input label="Sort order" type="number" value={String(editing.sort_order ?? 0)}
                  onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Photo gallery · {editing.images?.length ?? 0} image{(editing.images?.length ?? 0) === 1 ? "" : "s"}
                </label>
                {(editing.images?.length ?? 0) > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {(editing.images ?? []).map((url, idx) => {
                      const isPrimary = idx === (editing.primary_image_index ?? 0);
                      return (
                        <div key={url + idx}
                          className={`relative group border-2 transition ${isPrimary ? "border-gold" : "border-border"}`}>
                          <img src={url} alt="" className="w-full aspect-square object-cover" />
                          {isPrimary && (
                            <div className="absolute top-1 left-1 bg-gold text-ink text-[9px] uppercase tracking-widest px-1.5 py-0.5 font-medium">
                              Primary
                            </div>
                          )}
                          <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                            {!isPrimary && (
                              <button type="button" onClick={() => setPrimary(idx)}
                                className="text-[10px] uppercase tracking-widest text-gold-light hover:text-gold inline-flex items-center gap-1">
                                <Star className="h-3 w-3" /> Make primary
                              </button>
                            )}
                            <div className="flex gap-1">
                              <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0}
                                className="p-1 text-ink-foreground/80 hover:text-gold disabled:opacity-30">
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                              <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === (editing.images!.length - 1)}
                                className="p-1 text-ink-foreground/80 hover:text-gold disabled:opacity-30">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                              <button type="button" onClick={() => removeImage(idx)}
                                className="p-1 text-ink-foreground/80 hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="btn-luxe-outline !py-2 !px-4 !text-xs gap-2 disabled:opacity-50">
                  {uploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                    : <><Upload className="h-3.5 w-3.5" /> Upload photos</>}
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Description</label>
                <textarea rows={5} value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full bg-transparent border border-border focus:border-gold outline-none p-3 text-sm transition" />
              </div>
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.published ?? true}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  className="h-4 w-4 accent-[hsl(var(--gold-deep))]" />
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
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 transition"
      />
    </div>
  );
}
