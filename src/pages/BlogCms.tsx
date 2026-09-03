import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import Seo, { breadcrumbLd } from "@/components/Seo";
import { fetchPublishedBlogPosts, formatBlogDate, type CmsBlogPost } from "@/lib/blog";
import { blogPosts } from "./Blog";

const BLOG_DESCRIPTION =
  "Stories on handloom heritage, sourcing handwoven sarees in bulk, fabric guides and wholesale buying advice from the Megh Balika atelier in Kolkata.";

const legacyPosts: CmsBlogPost[] = blogPosts.map((post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  date: new Date(post.date).toISOString().slice(0, 10),
  excerpt: post.excerpt,
  content: post.content,
  image: post.image,
  imageAlt: post.imageAlt,
  imageTitle: post.imageTitle,
  category: post.category,
  metaTitle: post.metaTitle,
  metaDescription: post.metaDescription,
}));

export default function BlogCms() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<CmsBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchPublishedBlogPosts().then(({ data, error: fetchError }) => {
      if (!active) return;
      if (fetchError) setError("The journal is temporarily unavailable. Please try again shortly.");
      // Keep the public journal useful during a new Cloud setup while still
      // preferring published CMS rows whenever they exist.
      setPosts(data.length > 0 ? data : legacyPosts);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Megh Balika Journal",
    url: "https://www.meghbalika.store/blog",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      url: `https://www.meghbalika.store/blog/${post.slug}`,
      image: post.image,
    })),
  };

  return (
    <main className="bg-background">
      <Seo
        path="/blog"
        title="The Journal — Saree Craft, Trade & Textile Notes | Megh Balika"
        description={BLOG_DESCRIPTION}
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }]), blogJsonLd]}
      />
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-32 md:pt-44 pb-20 silk-bg">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">
            ⟵ Atelier
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mt-6 leading-[0.95] text-balance max-w-4xl"
          >
            Stories from <em className="text-gold-shimmer not-italic">the loom</em>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 text-muted-foreground text-lg max-w-xl"
          >
            Craft, heritage, and the people behind every thread.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-label="Published journal posts">
        <div className="container px-6 md:px-12 max-w-6xl">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading the journal…</div>
          ) : error ? (
            <div className="py-20 text-center text-muted-foreground">{error}</div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">New journal stories are being prepared.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group flex flex-row items-start gap-5 border border-gold-deep/10 hover:border-gold-deep/30 transition-colors duration-300 p-5">
                    <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 overflow-hidden bg-muted">
                      {post.image ? (
                        <img src={post.image} alt={post.imageAlt ?? post.title} title={post.imageTitle ?? post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full silk-bg flex items-center justify-center" aria-hidden="true">
                          <span className="text-gold-deep/30 text-3xl font-serif">✦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-h-[7rem] min-w-0">
                      <div>
                        {post.category && <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-2">{post.category}</div>}
                        <h2 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-gold-shimmer transition-colors duration-300 text-balance">{post.title}</h2>
                        <p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">{formatBlogDate(post.date)}</p>
                        <span className="text-xs uppercase tracking-[0.25em] text-gold-deep group-hover:tracking-[0.4em] transition-all duration-300">Read →</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
}