import { supabase } from "@/integrations/supabase/client";

export type CmsBlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  imageAlt?: string;
  imageTitle?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
};

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  image_alt: string | null;
  image_title: string | null;
  category: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
};

export const toCmsBlogPost = (row: BlogRow): CmsBlogPost => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  date: (row.published_at ?? row.created_at).slice(0, 10),
  excerpt: row.excerpt,
  content: row.content,
  image: row.image_url ?? undefined,
  imageAlt: row.image_alt ?? undefined,
  imageTitle: row.image_title ?? undefined,
  category: row.category ?? undefined,
  metaTitle: row.meta_title ?? undefined,
  metaDescription: row.meta_description ?? undefined,
});

export async function fetchPublishedBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, image_url, image_alt, image_title, category, meta_title, meta_description, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return {
    data: ((data as BlogRow[] | null) ?? []).map(toCmsBlogPost),
    error,
  };
}

export async function fetchPublishedBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, image_url, image_alt, image_title, category, meta_title, meta_description, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return {
    data: data ? toCmsBlogPost(data as BlogRow) : null,
    error,
  };
}

export const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

/** Converts the legacy CMS link notation into standard markdown links. */
export const normalizeBlogContent = (content: string) =>
  content.replace(/\[\[(.+?)\|(.+?)\]\]/g, "[$1]($2)");