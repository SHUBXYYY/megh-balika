import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import imgBanarasi from "@/assets/collection-banarasi.jpg";
import imgBatik from "@/assets/collection-batik.jpg";
import imgKantha from "@/assets/collection-kantha.jpg";
import imgEmbroidered from "@/assets/blog-embroidered-sarees.jpg";

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
    id: "4",
    slug: "how-to-identify-the-right-supplier-for-quality-embroidered-sarees",
    title: "How to Identify the Right Supplier for Quality Embroidered Sarees",
    date: "June 26, 2025",
    category: "Buying Guide",
    excerpt:
      "There are various ways to identify the right supplier for quality embroidered sarees. Read to know more about it in details.",
    image: imgEmbroidered,
    content: `Some sarees don't just sit in a wardrobe; they carry stories in every thread. Embroidery work, especially detailed hand finishes, can completely change how a fabric feels and drapes. That's why choosing the right [[katha stitch saree provider|https://www.meghbalika.store/sarees/kantha-stitch]] matters so much when you're looking for quality pieces that actually hold their charm over time. The difference often shows up in the small things: stitch consistency, fabric feel, and how well the design holds up after regular use.

The issue with this is that not all suppliers have maintained the same standards. Some put a lot of emphasis on design variety but do not pay attention to finishes, while others concentrate on longevity but do not have enough creativity when designing their patterns. It turns out that choosing the right supplier involves much more than glossy catalogs – it's all about the craft involved. Once you learn how to recognize this, things get much easier.

## Various Ways to Identify the Right Supplier for Quality Embroidered Sarees

The selection of an ideal supplier of embroidered sarees will involve putting emphasis on quality, uniformity, and craftsmanship. The ideal supplier will offer beautiful designs, tough fabric, good finishing, and good stitching.

1. Check consistency in craftsmanship.
The first thing that tells you a lot is how consistent the embroidery looks across multiple pieces. If one saree looks refined and the next feels rushed, that's a red flag. A reliable supplier maintains steady detailing, especially in traditional patterns where even small uneven stitches stand out immediately.

2. Understand sourcing transparency
An honest supplier is also always very clear regarding the origin of materials and craftsmanship involved in their product. For example, a [[jamdani importer in the USA|https://www.meghbalika.store/sarees/jamdani]] dealing in authentic pieces will typically highlight the origin, weaving process, and artisan involvement rather than just focusing on visuals.

3. Check design originality
The market has lots of products with designs that seem identical and devoid of any uniqueness. A great supplier differentiates itself by coming up with unique designs and finding ideas from the local cultures. This emphasis on innovation guarantees that the suppliers will come up with unique designs rather than repeating old ones.

4. Review client feedback
In general, real reviews offer a more in-depth insight into the product than pictures. Concentrate on reviews that talk about the stitching quality since it speaks of the product's quality and craftsmanship. Moreover, delivery is another important point to remember when considering comments, as shipping is an integral part of customer experience. Fabric comfort should also be taken into account for its importance to actual use.

5. Check supply reliability
Constantly procuring the products is vital for ensuring consistent stock levels. Delays in receiving stock or any inconsistencies can have repercussions that are not always anticipated. Such complications can interfere with the success of your planning and affect both your relationship with your suppliers as well as your customers. Maintaining a smooth chain is necessary, as anything else will prove disastrous to all parties involved.

6. Balance aesthetics with practicality
The saree needs to be both beautiful and convenient. It must be easy to put on and handle in order for the person to be able to wear and move about in it confidently. It is crucial that you feel comfortable wearing the saree, so it should fit just like a second skin and also should integrate seamlessly into your life. Every saree must be both fashionable and comfortable enough to wear on a day-to-day basis.

### Conclusion

At the end of the day, choosing the right supplier for embroidered sarees comes down to noticing the details most people overlook. Fabric strength, stitching consistency, finishing, and transparency in sourcing all say more than any catalog ever will. When these elements line up, you're not just buying a saree, you're investing in something that actually holds its value and beauty over time. A careful eye and patience usually separate a reliable supplier from the rest, and that makes all the difference in long-term satisfaction.`,
  },
  {
    id: "1",
    slug: "art-of-jamdani-weaving",
    title: "The Art of Jamdani Weaving",
    date: "May 20, 2025",
    category: "Craft & Heritage",
    excerpt:
      "A 3,000-year-old tradition, still alive in the hands of Bengal's master weavers. We trace the story of Jamdani — from ancient Dhaka looms to the global stage.",
    content: `Jamdani is one of the finest muslin textiles, historically produced in the Bengal region. The name comes from the Persian words 'jama' (cloth) and 'dana' (motif). UNESCO recognized it as an Intangible Cultural Heritage of Humanity in 2013.\n\nAt Megh Balika, every Jamdani saree is hand-loomed by master weavers in Shantiniketan and Dhaka, using techniques passed down across generations. The geometric and floral motifs are woven directly into the fabric — not printed, not embroidered — making each piece an irreplaceable work of art.\n\nThe process is slow by design. A single saree can take between 10 to 30 days depending on the intricacy of the pattern. Two weavers work side by side on a single loom, their fingers moving in perfect synchrony — a conversation in thread.`,
    image: imgBanarasi,
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
    image: imgBatik,
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
    image: imgKantha,
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