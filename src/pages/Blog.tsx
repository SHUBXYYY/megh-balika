import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  category?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "art-of-jamdani-weaving",
    title: "The Art of Jamdani Weaving",
    date: "May 20, 2025",
    category: "Craft & Heritage",
    excerpt:
      "A 3,000-year-old tradition, still alive in the hands of Bengal's master weavers. We trace the story of Jamdani — from ancient Dhaka looms to the global stage.",
    content: `Jamdani is one of the finest muslin textiles, historically produced in the Bengal region. The name comes from the Persian words 'jama' (cloth) and 'dana' (motif). UNESCO recognized it as an Intangible Cultural Heritage of Humanity in 2013.\n\nAt Megh Balika, every Jamdani saree is hand-loomed by master weavers in Shantiniketan and Dhaka, using techniques passed down across generations. The geometric and floral motifs are woven directly into the fabric — not printed, not embroidered — making each piece an irreplaceable work of art.\n\nThe process is slow by design. A single saree can take between 10 to 30 days depending on the intricacy of the pattern. Two weavers work side by side on a single loom, their fingers moving in perfect synchrony — a conversation in thread.`,
    image: "/src/assets/collection-banarasi.jpg",
  },
  {
    id: "2",
    slug: "kanchipuram-silk-guide",
    title: "A Guide to Kanchipuram Silk",
    date: "May 10, 2025",
    category: "Textile Guide",
    excerpt:
      "What makes a true Kanchipuram? Weight, zari, the interlocking border — we break down everything you need to know before investing in one.",
    content: `Kanchipuram silk, or Kanjivaram, is synonymous with southern Indian bridal wear. Woven in the temple town of Kanchipuram in Tamil Nadu, these sarees are known for their rich silk, heavy gold zari, and vibrant contrasting borders.\n\nAuthentic Kanchipuram sarees are made from pure mulberry silk, and the body and border are woven separately and interlocked — a technique unique to Kanchipuram. This makes the saree reversible with the border pattern visible on both sides.\n\nAt Megh Balika, our Kanchipuram collection is sourced directly from certified master weavers, each piece carrying a Silk Mark certification — your guarantee of authenticity.`,
    image: "/src/assets/collection-batik.jpg",
  },
  {
    id: "3",
    slug: "care-guide-silk-sarees",
    title: "How to Care for Your Silk Saree",
    date: "April 28, 2025",
    category: "Care Guide",
    excerpt:
      "Silk is resilient, but it rewards gentle handling. Our complete care guide — from storage to dry cleaning — to keep your saree in heirloom condition.",
    content: `A silk saree is an investment, and with the right care it can last generations. Here is our complete care guide.\n\nStorage: Always wrap your silk saree in a soft muslin cloth — never plastic. Store in a cool, dry place away from direct sunlight. Re-fold along different lines every few months to prevent permanent crease marks.\n\nCleaning: Dry clean only for zari-heavy sarees. For plain silk, hand wash gently in cold water with a mild silk-specific detergent. Never wring — press gently between two clean towels.\n\nIroning: Iron on the reverse side at a low silk setting. Place a thin cotton cloth between the iron and the saree to protect the lustre.`,
    image: "/src/assets/collection-kantha.jpg",
  },
];

const Blog = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero */}
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

      {/* Posts Grid */}
      <section className="py-20 md:py-28">
        <div className="container px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                <Link to={`/blog/${post.slug}`} className="group flex flex-row items-start gap-5 border border-gold-deep/10 hover:border-gold-deep/30 transition-colors duration-300 p-5">

                  {/* Image — left side */}
                  <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 overflow-hidden bg-muted">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Placeholder when no image set */
                      <div className="w-full h-full silk-bg flex items-center justify-center">
                        <span className="text-gold-deep/30 text-3xl font-serif">✦</span>
                      </div>
                    )}
                  </div>

                  {/* Text — right side */}
                  <div className="flex flex-col justify-between flex-1 min-h-[7rem]">
                    <div>
                      {post.category && (
                        <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-2">
                          {post.category}
                        </div>
                      )}
                      <h2 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-gold-shimmer transition-colors duration-300 text-balance">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                      <span className="text-xs uppercase tracking-[0.25em] text-gold-deep group-hover:tracking-[0.4em] transition-all duration-300">
                        Read →
                      </span>
                    </div>
                  </div>

                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default Blog;