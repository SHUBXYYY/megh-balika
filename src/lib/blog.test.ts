import { describe, expect, it } from "vitest";
import { hasDuplicateBlogSlug, mergePublishedBlogPosts, type CmsBlogPost } from "./blog";

const article = (id: string, slug: string, date: string): CmsBlogPost => ({
  id,
  slug,
  title: slug,
  date,
  excerpt: "",
  content: "",
});

describe("public blog listing", () => {
  it("keeps the legacy article when a newly published CMS article is added", () => {
    const previous = article("15", "best-traditional-fabrics-for-premium-boutiques", "2026-08-28");
    const latest = article("new-id", "new-published-story", "2026-10-15");

    const posts = mergePublishedBlogPosts([latest], [previous]);

    expect(posts.map((post) => post.slug)).toEqual([
      "new-published-story",
      "best-traditional-fabrics-for-premium-boutiques",
    ]);
  });

  it("uses the published CMS version for a matching legacy slug without duplicating it", () => {
    const legacy = article("15", "best-traditional-fabrics-for-premium-boutiques", "2026-08-28");
    const published = { ...legacy, id: "cms-id", title: "Updated article" };

    const posts = mergePublishedBlogPosts([published], [legacy]);

    expect(posts).toHaveLength(1);
    expect(posts[0]?.id).toBe("cms-id");
    expect(posts[0]?.title).toBe("Updated article");
  });

  it("detects a slug already used by an existing article", () => {
    expect(hasDuplicateBlogSlug("best-traditional-fabrics-for-premium-boutiques", [
      "best-traditional-fabrics-for-premium-boutiques",
    ])).toBe(true);
    expect(hasDuplicateBlogSlug("a-new-journal-story", [
      "best-traditional-fabrics-for-premium-boutiques",
    ])).toBe(false);
  });
});