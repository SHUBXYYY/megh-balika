import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import { blogPosts, type BlogPost } from "./Blog";
import { Helmet } from "react-helmet-async";
import Seo, { breadcrumbLd, SITE_URL } from "@/components/Seo";
import { fetchPublishedBlogPost, type CmsBlogPost } from "@/lib/blog";

const BlogDetail = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { slug } = useParams();
  const staticPost = blogPosts.find((p) => p.slug === slug);
  const [post, setPost] = useState<BlogPost | CmsBlogPost | null>(staticPost ?? null);
  const [loading, setLoading] = useState(!staticPost);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    fetchPublishedBlogPost(slug).then(({ data }) => {
      if (!active) return;
      if (data) setPost(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-background">
        <MenuTrigger onOpen={() => setMenuOpen(true)} />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
        <section className="pt-44 pb-28">
          <div className="container px-6 md:px-12">
            <p className="font-serif text-3xl text-muted-foreground">Loading the journal…</p>
          </div>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="bg-background">
        <MenuTrigger onOpen={() => setMenuOpen(true)} />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
        <section className="pt-44 pb-28">
          <div className="container px-6 md:px-12">
            <Link to="/blog" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">
              ⟵ Journal
            </Link>
            <p className="font-serif text-3xl mt-10 text-muted-foreground">Post not found.</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Render a content block: supports ## headings, numbered items (1. ...), and inline [[text|url]] links
  const renderBlock = (block: string, i: number) => {
    const parseInline = (text: string) =>
      text.split(/(\[\[.+?\|.+?\]\])/g).map((part, j) => {
        const m = part.match(/^\[\[(.+?)\|(.+?)\]\]$/);
        if (m) return <a key={j} href={m[2]} className="text-gold-deep underline underline-offset-2 hover:opacity-80" target="_blank" rel="noreferrer">{m[1]}</a>;
        return part;
      });

    if (block.startsWith("## ")) {
      return (
        <motion.h2 key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 * i }}
          className="font-serif text-2xl md:text-3xl text-foreground mt-8 mb-2">
          {block.slice(3)}
        </motion.h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <motion.h3 key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 * i }}
          className="font-semibold text-lg text-foreground mt-6 mb-1 uppercase tracking-[0.2em]">
          {block.slice(4)}
        </motion.h3>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      const [head, ...rest] = block.split("\n");
      const numMatch = head.match(/^(\d+)\.\s(.+)$/);
      return (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 * i }}
          className="space-y-2">
          <p className="font-semibold text-foreground">{numMatch ? `${numMatch[1]}. ${numMatch[2]}` : head}</p>
          {rest.length > 0 && <p className="text-muted-foreground text-lg leading-relaxed">{parseInline(rest.join("\n"))}</p>}
        </motion.div>
      );
    }
    return (
      <motion.p key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 * i }}
        className="text-muted-foreground text-lg leading-relaxed">
        {parseInline(block)}
      </motion.p>
    );
  };

  const blocks = post.content.split("\n\n").filter(Boolean);

  return (
    <main className="bg-background">
      <Seo
        path={`/blog/${post.slug}`}
        type="article"
        title={post.metaTitle || `${post.title} | Megh Balika Journal`}
        description={(post.metaDescription || post.excerpt).slice(0, 158)}
        image={post.image}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            image: post.image ? [post.image] : undefined,
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
            author: { "@type": "Organization", name: "Megh Balika" },
            publisher: { "@type": "Organization", name: "Megh Balika" },
          },
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 silk-bg">
        <div className="container px-6 md:px-12 relative z-10 max-w-4xl">
          <Link to="/blog" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">
            ⟵ Journal
          </Link>

          {post.category && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-xs uppercase tracking-[0.3em] text-gold-deep"
            >
              {post.category}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mt-4 leading-[0.95] text-balance"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-sm text-muted-foreground tracking-widest uppercase"
          >
            {post.date}
          </motion.p>
        </div>
      </section>

      {/* Image */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="container px-6 md:px-12 max-w-5xl"
        >
          <img
            src={post.image}
            alt={post.imageAlt ?? post.title}
            title={post.imageTitle ?? post.title}
            className="w-full object-cover"
          />
        </motion.div>
      )}

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="container px-6 md:px-12 max-w-3xl">
          {/* Lead excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-2xl md:text-3xl leading-relaxed text-balance mb-12 text-foreground"
          >
            {post.excerpt}
          </motion.p>

          {/* Body blocks */}
          <div className="space-y-6">
            {blocks.map((block, i) => renderBlock(block, i))}
          </div>

          {/* Back link */}
          <div className="mt-16 pt-10 border-t border-gold-deep/20">
            <Link
              to="/blog"
              className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit hover:tracking-[0.45em] transition-all duration-300"
            >
              ⟵ Back to Journal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default BlogDetail;