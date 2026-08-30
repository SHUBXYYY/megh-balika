import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bold, ExternalLink, Eye, EyeOff, ImagePlus, Italic, Link2,
  List, ListOrdered, Loader2, Pencil, Plus, Quote, Trash2, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "./AdminHeader";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  image_alt: string | null;
  image_title: string | null;
  category: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type BlogDraft = Omit<BlogRow, "id" | "created_at" | "updated_at" | "published_at"> & {
  id?: string;
  published_at?: string | null;
};

const MAX_META_TITLE = 60;
const MAX_META_DESCRIPTION = 160;

const emptyDraft: BlogDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: null,
  image_alt: "",
  image_title: "",
  category: "",
  meta_title: "",
  meta_description: "",
  published: false,
};

const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180, "Title must be 180 characters or fewer"),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens"),
  excerpt: z.string().trim().max(500, "Excerpt must be 500 characters or fewer"),
  content: z.string().max(100000, "Content is too long"),
  meta_title: z.string().trim().max(MAX_META_TITLE, `Meta title must be ${MAX_META_TITLE} characters or fewer`),
  meta_description: z.string().trim().max(MAX_META_DESCRIPTION, `Meta description must be ${MAX_META_DESCRIPTION} characters or fewer`),
  image_url: z.union([z.string().regex(/^(https?:\/\/|\/)[^\s]+$/, "Use a valid image URL"), z.literal(""), z.null()]),
  image_alt: z.string().max(180, "Image alt text must be 180 characters or fewer"),
  image_title: z.string().max(180, "Image title must be 180 characters or fewer"),
  category: z.string().max(80, "Category must be 80 characters or fewer"),
  published: z.boolean(),
});

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-").replace(/^-|-$/g, "");

export default function AdminBlog() {
  const [items, setItems] = useState<BlogRow[]>([]);
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const featuredInputRef = useRef<HTMLInputElement | null>(null);
  const bodyImageInputRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as BlogRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateDraft = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const openNew = () => {
    setSlugEdited(false);
    setDraft({ ...emptyDraft });
  };

  const edit = (item: BlogRow) => {
    setSlugEdited(true);
    setDraft({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      image_url: item.image_url,
      image_alt: item.image_alt ?? "",
      image_title: item.image_title ?? "",
      category: item.category ?? "",
      meta_title: item.meta_title ?? "",
      meta_description: item.meta_description ?? "",
      published: item.published,
      published_at: item.published_at,
    });
  };

  const uploadImage = async (file: File, forBody = false) => {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Images must be 8 MB or smaller"); return; }
    forBody ? setUploadingBodyImage(true) : setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("collection-images").upload(path, file, { contentType: file.type, upsert: false });
      if (error) { toast.error(error.message); return; }
      const { data } = supabase.storage.from("collection-images").getPublicUrl(path);
      if (forBody) insertAtCursor(`\n\n![${file.name.replace(/\.[^.]+$/, "")}](${data.publicUrl})\n\n`);
      else updateDraft("image_url", data.publicUrl);
      toast.success(forBody ? "Image added to article" : "Featured image uploaded");
    } finally {
      forBody ? setUploadingBodyImage(false) : setUploading(false);
      if (forBody && bodyImageInputRef.current) bodyImageInputRef.current.value = "";
      if (!forBody && featuredInputRef.current) featuredInputRef.current.value = "";
    }
  };

  const insertAtCursor = (value: string, selectionStartOffset = 0, selectionEndOffset = 0) => {
    const textarea = editorRef.current;
    if (!textarea || !draft) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = `${draft.content.slice(0, start)}${value}${draft.content.slice(end)}`;
    updateDraft("content", next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + value.length;
      textarea.setSelectionRange(cursor - selectionStartOffset, cursor + selectionEndOffset);
    });
  };

  const toolbar = (label: string, value: string, icon: React.ReactNode) => (
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-none text-muted-foreground hover:text-gold-deep" onClick={() => insertAtCursor(value)} aria-label={label} title={label}>
      {icon}
    </Button>
  );

  const save = async () => {
    if (!draft) return;
    const parsed = blogSchema.safeParse({ ...draft, image_url: draft.image_url ?? "" });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setSaving(true);
    const payload = {
      title: draft.title.trim(), slug: draft.slug.trim(), excerpt: draft.excerpt.trim(), content: draft.content,
      image_url: draft.image_url || null, image_alt: draft.image_alt.trim() || null, image_title: draft.image_title.trim() || null,
      category: draft.category.trim() || null, meta_title: draft.meta_title.trim() || null,
      meta_description: draft.meta_description.trim() || null, published: draft.published,
    };
    const result = draft.id
      ? await supabase.from("blog_posts").update(payload).eq("id", draft.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (result.error) { toast.error(result.error.message); return; }
    toast.success(draft.published ? "Blog published" : "Draft saved");
    setDraft(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Blog deleted");
    load();
  };

  return (
    <div>
      <AdminHeader title="Blog manager" subtitle="Write, publish, and optimize the journal from one place." count={items.length} action={<Button onClick={openNew} className="btn-luxe-primary rounded-none !h-auto !py-2.5 !px-4 !text-xs gap-2"><Plus className="h-4 w-4" /> New blog</Button>} />
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-3">
        {loading ? <div className="text-center py-20 text-muted-foreground">Loading…</div> : items.length === 0 ? (
          <div className="border border-dashed border-border p-10 text-center text-muted-foreground">No CMS posts yet. Create the first article.</div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 sm:p-5 flex gap-4 items-start">
            {item.image_url ? <img src={item.image_url} alt={item.image_alt ?? item.title} className="w-16 h-16 sm:w-24 sm:h-24 object-cover shrink-0" /> : <div className="w-16 h-16 sm:w-24 sm:h-24 bg-secondary shrink-0 flex items-center justify-center text-gold-deep">✦</div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap"><h2 className="font-serif text-lg sm:text-xl truncate">{item.title}</h2><span className={`text-[10px] uppercase tracking-widest ${item.published ? "text-gold-deep" : "text-muted-foreground"}`}>{item.published ? "published" : "draft"}</span></div>
              <div className="text-xs text-muted-foreground mt-1">/blog/{item.slug} · {item.category || "Uncategorised"}</div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.excerpt || "No excerpt"}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => edit(item)} className="rounded-none text-muted-foreground hover:text-gold-deep" aria-label={`Edit ${item.title}`}><Pencil className="h-4 w-4" /></Button>
              {item.published && <a href={`/blog/${item.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-gold-deep" aria-label={`View ${item.title}`}><ExternalLink className="h-4 w-4" /></a>}
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)} className="rounded-none text-muted-foreground hover:text-destructive" aria-label={`Delete ${item.title}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {draft && <div className="fixed inset-0 z-50 flex" onClick={() => setDraft(null)}>
        <div className="flex-1 bg-ink/40 backdrop-blur-sm" />
        <div className="w-full max-w-3xl bg-background border-l border-border overflow-y-auto" onClick={(event) => event.stopPropagation()}>
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10"><div><div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep">Journal CMS</div><h2 className="font-serif text-xl sm:text-2xl mt-1">{draft.id ? "Edit blog" : "New blog"}</h2></div><Button variant="ghost" size="icon" onClick={() => setDraft(null)} className="rounded-none"><X className="h-5 w-5" /></Button></div>
          <div className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Blog title *" value={draft.title} onChange={(value) => { updateDraft("title", value); if (!slugEdited) updateDraft("slug", slugify(value)); }} className="sm:col-span-2" />
              <Field label="Slug *" value={draft.slug} onChange={(value) => { setSlugEdited(true); updateDraft("slug", slugify(value)); }} placeholder="my-new-journal-post" />
              <Field label="Category" value={draft.category ?? ""} onChange={(value) => updateDraft("category", value)} placeholder="Craft & heritage" />
              <Field label="Excerpt" value={draft.excerpt} onChange={(value) => updateDraft("excerpt", value)} className="sm:col-span-2" />
              <Field label={`Meta title · ${draft.meta_title.length}/${MAX_META_TITLE}`} value={draft.meta_title} onChange={(value) => updateDraft("meta_title", value)} maxLength={MAX_META_TITLE} />
              <Field label={`Meta description · ${draft.meta_description.length}/${MAX_META_DESCRIPTION}`} value={draft.meta_description} onChange={(value) => updateDraft("meta_description", value)} maxLength={MAX_META_DESCRIPTION} multiline />
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Featured image</div>
              <div className="flex gap-4 items-start">
                {draft.image_url ? <img src={draft.image_url} alt={draft.image_alt || "Featured preview"} className="w-24 h-24 object-cover border border-border" /> : <div className="w-24 h-24 bg-secondary flex items-center justify-center text-gold-deep">✦</div>}
                <div className="flex-1 space-y-3"><Field label="Image URL (or upload below)" value={draft.image_url ?? ""} onChange={(value) => updateDraft("image_url", value)} placeholder="https://…" /><div className="flex flex-wrap gap-2"><input ref={featuredInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file); }} /><Button type="button" variant="outline" onClick={() => featuredInputRef.current?.click()} disabled={uploading} className="rounded-none !text-xs gap-2">{uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload image</Button></div></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Image title" value={draft.image_title ?? ""} onChange={(value) => updateDraft("image_title", value)} /><Field label="Image alt text" value={draft.image_alt ?? ""} onChange={(value) => updateDraft("image_alt", value)} /></div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between gap-3 mb-2"><label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Article content</label><span className="text-[10px] text-muted-foreground">Markdown editor</span></div>
              <div className="border border-border bg-card flex flex-wrap gap-1 p-1">{toolbar("Bold", "**bold text**", <Bold className="h-4 w-4" />)}{toolbar("Italic", "*italic text*", <Italic className="h-4 w-4" />)}{toolbar("Heading 2", "\n\n## Heading\n\n", <span className="text-xs font-semibold">H2</span>)}{toolbar("Heading 3", "\n\n### Heading\n\n", <span className="text-xs font-semibold">H3</span>)}{toolbar("Bulleted list", "\n\n- List item\n- List item\n\n", <List className="h-4 w-4" />)}{toolbar("Numbered list", "\n\n1. List item\n2. List item\n\n", <ListOrdered className="h-4 w-4" />)}{toolbar("Quote", "\n\n> Quote\n\n", <Quote className="h-4 w-4" />)}{toolbar("Link", "[link text](https://example.com)", <Link2 className="h-4 w-4" />)}<input ref={bodyImageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file, true); }} /><Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-none text-muted-foreground hover:text-gold-deep" onClick={() => bodyImageInputRef.current?.click()} disabled={uploadingBodyImage} aria-label="Embed image" title="Embed image">{uploadingBodyImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}</Button></div>
              <textarea ref={editorRef} rows={16} value={draft.content} onChange={(event) => updateDraft("content", event.target.value)} placeholder="Start writing your article… Use the toolbar to add headings, lists, links, quotes, and images." className="w-full bg-card border-x border-b border-border focus:border-gold outline-none p-4 text-sm leading-relaxed resize-y" />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-5"><label className="flex items-center gap-3 text-sm cursor-pointer"><input type="checkbox" checked={draft.published} onChange={(event) => updateDraft("published", event.target.checked)} className="h-4 w-4 accent-[hsl(var(--gold-deep))]" /> Published (visible on website)</label><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => setDraft(null)} className="rounded-none">Cancel</Button><Button type="button" onClick={save} disabled={saving} className="btn-luxe-primary rounded-none !h-auto !py-3 !px-5 gap-2">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{draft.published ? "Save & publish" : "Save draft"}</Button></div></div>
          </div>
        </div>
      </div>}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "", maxLength, multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string; maxLength?: number; multiline?: boolean }) {
  return <div className={className}><label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</label>{multiline ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 text-sm transition resize-y" /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2 text-sm transition" />}</div>;
}