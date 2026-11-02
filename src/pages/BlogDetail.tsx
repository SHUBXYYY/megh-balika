import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import { blogPosts, type BlogPost } from "./Blog";
import Seo, { breadcrumbLd, SITE_URL } from "@/components/Seo";
import ArticleProse from "@/components/ArticleProse";
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

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ArticleProse content={post.content} />
          </motion.div>

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