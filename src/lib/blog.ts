import { supabase } from "@/integrations/supabase/client";

export type BlogPostResolutionStatus = "ready" | "missing" | "error";

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

export const hasDuplicateBlogSlug = (slug: string, existingSlugs: string[]) =>
  existingSlugs.includes(slug);

export function normalizeBlogSlug(value: string) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Keep the original URL text if it contains malformed escape sequences.
  }

  const pathText = decoded.split(/[?#]/, 1)[0] ?? "";
  return pathText
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^blog(?:\/|$)/i, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function blogSlugCandidates(pathname: string) {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] ?? "";
  const path = withoutQuery.replace(/^\/+|\/+$/g, "");
  const blogPath = path.replace(/^blog(?:\/|$)/i, "");
  const segments = blogPath.split("/").filter(Boolean);
  const candidates = [
    normalizeBlogSlug(segments.join("-")),
    normalizeBlogSlug(segments.at(-1) ?? ""),
  ];

  return [...new Set(candidates.filter(Boolean))];
}

export function findBlogPostBySlug(posts: CmsBlogPost[], slugs: string[]) {
  const candidates = new Set(slugs.map(normalizeBlogSlug).filter(Boolean));
  return posts.find((post) => candidates.has(normalizeBlogSlug(post.slug))) ?? null;
}

export function mergePublishedBlogPosts(
  publishedPosts: CmsBlogPost[],
  fallbackPosts: CmsBlogPost[],
) {
  const postsBySlug = new Map(fallbackPosts.map((post) => [post.slug, post]));

  // CMS entries take precedence for a matching slug, while unrelated legacy
  // articles remain available in the public journal.
  for (const post of publishedPosts) postsBySlug.set(post.slug, post);

  return [...postsBySlug.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function fetchPublishedBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, image_url, image_alt, image_title, category, meta_title, meta_description, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return {
    data: ((data as BlogRow[] | null) ?? []).map(toCmsBlogPost),
    error,
  };
}

export async function fetchPublishedBlogPost(slugs: string | string[]) {
  const candidates = [...new Set((Array.isArray(slugs) ? slugs : [slugs]).map(normalizeBlogSlug).filter(Boolean))];
  if (candidates.length === 0) return { data: null, error: null };

  const results = await Promise.all(candidates.map(async (slug) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, content, image_url, image_alt, image_title, category, meta_title, meta_description, published_at, created_at")
      .ilike("slug", slug)
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  }));
  const match = results.find((result) => result.data);

  return {
    data: match?.data ? toCmsBlogPost(match.data as BlogRow) : null,
    error: results.find((result) => result.error)?.error ?? null,
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