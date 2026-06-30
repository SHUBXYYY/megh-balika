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
import imgBuyingBulk from "@/assets/blog-buying-sarees-bulk.jpg";
import imgHandcrafted from "@/assets/blog-handcrafted-clothing-investment.jpg";
import imgHandloom from "@/assets/blog-handloom-sustainable-fashion.jpg";

export interface BlogPost {
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
}

export const blogPosts: BlogPost[] = [
  {
    id: "7",
    slug: "the-role-of-handloom-in-promoting-sustainable-fashion-practices",
    title: "The Role of Handloom in Promoting Sustainable Fashion Practices",
    date: "June 21, 2025",
    category: "Sustainability",
    excerpt:
      "There are various role of handloom in promoting sustainable fashion practices. Read to know more about it in details.",
    image: imgHandloom,
    imageAlt: "Role of Handloom",
    imageTitle: "Promoting Sustainable Fashion Practices",
    metaTitle: "How Handloom Supports Sustainable Fashion",
    metaDescription: "There are various role of handloom in promoting sustainable fashion practices. Read to know more about it in details.",
    content: `Imagine a textile with a weave that speaks of a rhythm of a loom, the craftsmanship of patient hands, and the discipline of people who learned weaving in generations past. This is essentially what handloom means in the world of fashion. It's more than clothes; it's about a method of creation that is slow and deliberate. Many designers and conscious buyers looking for a reliable [[Jamdani textile supplier|https://www.meghbalika.store/sarees/jamdani]] are often drawn to this space because it naturally aligns with sustainability, tradition, and craftsmanship that doesn't rely on mass production.

Handloom is interesting in today's fashion because it naturally supports sustainability. There is no excessive production, no heavy industrial impact, just skilled artisans using traditional methods. In each piece there are subtle distinctions to show that it is a handmade product. In a hurried world, where uniformity prevails, handloom serves to encourage mindful buying and greater appreciation of one's clothes.

## Various Roles of Handloom in Promoting Sustainable Fashion Practices

Handloom is a representation of sustainable fashion due to its use of old-fashioned weaving skills and processes in order to avoid the negative impact on the environment brought about by mass production.

1. Low environmental impact by design
Handloom weaving does not involve any large machines or consume much energy. It's mostly human skill, simple tools, and natural materials working together. That alone reduces a huge chunk of the carbon footprint compared to factory-made textiles. When fewer machines are involved, there's less pollution, less water waste, and far more control over resources.

2. Preserves traditional craft techniques
Handloom isn't just about clothing; its cultural memory woven into fabric. Weaving, dyeing, and embroidery practices hold years of expertise in them. For example, a lot of people who are in search of [[kantha embroidery supplier in the USA|https://www.meghbalika.store/sarees/kantha-stitch]] are in search of a story woven into the fabric.

3. Supports artisan livelihoods
In the making of each piece of handloom cloth, there is always an artisan at work or a community of weavers. The livelihood of these artisans or weavers relies directly upon their skill. Handwoven products contribute to the continuity of these skills, which have been practiced for generations.

4. Promotes natural and biodegradable materials
In most cases, natural fibers such as cotton, silk, and wool are used in making handloom fabrics. They decompose much faster compared to man-made fiber materials. This will help avoid putting too much pressure on the environment and accumulation of textile waste in landfills.

5. Encourages conscious consumer choices
Choosing handloom means a change in the way fashion is thought about. People are not going to focus on following the trends anymore; instead, they are going to consider other aspects of clothing, like its quality, origin, and production. It may seem a minor change, but it is very influential.

6. Strengthens local and rural economies
Handlooms are typically based in rural areas. Promoting handlooms would mean that the financial benefits would go to the rural area and not the central factories. This ensures balanced economic growth and also preserves the communities who weave.

7. Encourages slow fashion instead of fast consumption
This fashion system is built around speed, rapid changes in style within a few weeks, high rotation, and disposability of clothes. Handloom works in the opposite direction. A woven piece often takes days or even weeks to complete. That time naturally slows down production and makes both makers and buyers value the garment more. It shifts fashion from "buy and toss" to "buy and keep."

### Conclusion

Handloom brings fashion back to something more grounded and responsible. It slows down production, conserves nature, and preserves the culture of manual skills in a way that mass production methods fail to take notice of. As a matter of fact, when you consider it carefully, sustainability is not just an added aspect in this scenario; it forms a part of the very process of handloom.`,
  },
  {
    id: "6",
    slug: "why-handcrafted-clothing-represents-a-wise-long-term-investment",
    title: "Why Handcrafted Clothing Represents a Wise Long-Term Investment",
    date: "June 14, 2025",
    category: "Craft & Heritage",
    excerpt:
      "There are various reasons handcrafted clothing represents a wise long-term investment. Read to know more about it in details.",
    image: imgHandcrafted,
    imageAlt: "Handcrafted Clothing",
    imageTitle: "Handcrafted Clothing Represents a Wise Long-Term Investment",
    metaTitle: "Why Handcrafted Apparel Is a Long-Term Investment",
    metaDescription: "There are various reasons handcrafted clothing represents a wise long-term investment. Read to know more about it in details.",
    content: `Clothes with a narrative are always intriguing. In fact, when you have one such garment in your hands, you cannot but appreciate the skill invested into making the item. This is why many buyers who are interested in purchasing [[jamdani saree wholesale in the USA|https://www.meghbalika.store/sarees/jamdani]] are actually buying something of value. Unlike ready-to-wear items which go out of trend rather soon, handcrafted clothing gets better and better as time passes. Selecting solid wood furniture is equivalent to selecting handmade clothes. The function of both items remains similar, but solid wood furniture proves to be durable. An excellent garment will remain relevant for a long time since it will not get outdated due to changing fashion trends. High-quality fabrics and fine workmanship ensure durability, and customers can instantly realize the value of an item purchased. The inheritance of craftsmanship ensures that every purchase has more meaning than just a fashionable piece of clothing.

## Reasons Handcrafted Clothing Represents a Wise Long-Term Investment

Fast fashion is becoming increasingly popular today. However, custom-made clothes can provide something different from regular fast fashion clothes due to their high quality, material and workmanship. This kind of clothing is made to last longer and have some unique designs, which make them worth purchasing.

1. Superior craftsmanship means longer wear
Clothing that is made by hand is constructed in a different manner. While crafting the piece of clothing through sewing, weaving, or embroidery, the intention behind it is not to create thousands of items within the shortest time frame possible but to make sure that the end product has quality. For example, take into consideration a handcrafted Kantha jacket compared to a poorly constructed one – the former can last in your closet for years while the latter wears out after a couple of washes.

2. Timeless designs outlast fashion trends
It is based on immediacy. Purchase fast fashion now, since it may no longer be fashionable in a month's time. On the contrary, handmade clothes take a completely different route. Time-honored designs, timeless shapes and techniques of making have frequently been in use for generations. When you purchase something beautiful and handmade, you will never find it passé the following season.

3. Better materials deliver greater value
The creation of handmade clothes starts with picking out good materials. The craftsmen know very well that the end product will rely on the materials used. This is just like when making food from fresh materials rather than processed ones; the results will be easily noticeable. Good quality cotton, silk, or natural materials usually look better and last longer.

4. Every piece carries a unique character
Mass-manufactured clothes are manufactured to appear identical. This is not the case with hand-made clothes. Subtle differences in the stitching, embroidery, or weaving make each article unique in its way. Buyers tend to like these things because they add uniqueness to the item. This is one of the reasons why many businesses prefer a reputable [[kantha boutique supplier|https://www.meghbalika.store/sarees/kantha-stitch]].

5. Stronger resale and heirloom potential
Some handmade clothes get their value from being artistic and culturally significant. Handmade fabrics, embroideries, and traditional clothing are often handed down through generations. It is uncommon to find someone who would keep an item of clothing that was made for fashion in decades to come. But if the clothes are handmade and done nicely, then it becomes something of value.

6. Supporting skilled artisans preserves traditional craftsmanship
The investment is not only in the clothing but also in what they symbolize. Every item purchased is an investment in the culture that has taken so much time and effort to develop. By choosing to purchase artisanal clothing, consumers keep cultures alive that would otherwise become extinct. There is much more meaning than just fabric in the purchase.

### Conclusion

Custom-made outfits do not only provide style but also durability, elegance, and real value. You are purchasing a piece of clothing to wear and appreciate for many years when you purchase custom-made clothes. This is a much better idea than spending money on fashionable trends.`,
  },
  {
    id: "5",
    slug: "top-essential-factors-to-consider-when-buying-sarees-in-bulk",
    title: "Top Essential Factors to Consider When Buying Sarees in Bulk",
    date: "June 07, 2025",
    category: "Buying Guide",
    excerpt:
      "There are various essential factors to consider when buying sarees in bulk. Read to know more about it in details.",
    image: imgBuyingBulk,
    imageAlt: "Buying Sarees in Bulk",
    imageTitle: "Essential Factors to Consider When Buying Sarees in Bulk",
    metaTitle: "Factors to Consider Before Buying Sarees in Bulk",
    metaDescription: "There are various essential factors to consider when buying sarees in bulk. Read to know more about it in details.",
    content: `Buying a bulk saree might sound like a good idea, but it could turn out to be a difficult situation once delivered. It may seem nice when looking through a catalog, but determining its quality, durability, and uniformity in large numbers comes later. In the case of [[kantha stitch wholesale in the USA|https://www.meghbalika.store/sarees/kantha-stitch]], this is very important as it determines its worth. Just because one piece looks great doesn't mean all will be the same. Wise bulk buyers should look out for factors that are often overlooked by other buyers, including the quality of the fabric used, the dependability of the supplier, and the quality control measures involved, all of which could make a bigger difference in the overall success of the business rather than a small difference in prices. A beautiful saree may not have an impressive finish, causing customers to lose faith in it.

## Various Essential Factors to Consider When Buying Sarees in Bulk

Purchasing sarees in large quantities is not just about cost and aesthetics. Quality, durability, and customer acceptance become major considerations. Analyzing all these aspects can help in making prudent decisions and enhance returns on investments.

1. Fabric quality comes first.
A saree may have a fantastic design; however, if the fabric is harsh or poor in quality, the buyers will recognize that right away. Fabric can be considered the base of any building. A poor base automatically decreases the worth of everything constructed on top of it.

2. Look at authenticity
In the case of the purchase of traditional products, such as [[Bengali jamdani wholesale|https://www.meghbalika.store/sarees/jamdani]], the factor of authenticity becomes very important. Any customers familiar with the history of weaving would be able to distinguish between authentic products created by skilled craftsmen and shoddy replicas. Authenticity of these beautiful designs with bright colors is evident.

3. Evaluate the craftsmanship
Small things can tell you much about the quality of the product. When you look closer, you will notice imperfect stitching; this is a sign of negligence. Threads sticking out of the product mean that it has been made quickly. Irregular borders can be a hint that the product was not carefully made but rather hurriedly put together. Meanwhile, attention to detail can be found in the careful matching of the pattern and evenness of stitching. All of these factors reveal the talent and effort of a committed creator who has made the product.

4. Check product variety
The tastes and preferences of consumers keep changing all the time. Companies have to cater to these changing tastes by giving their clients choices in terms of styles, materials, and embroidery work. They will attract more consumers if they provide different choices for their products.

5. Compare pricing carefully
Selecting a saree based on cost may initially sound wise but might not provide the most satisfaction. A saree with a slightly higher price tag could turn out to be better quality and more durable, thus making customers happy in the process. Customers will often notice that their experience using such a saree will make them appreciate spending a little extra on it. This could result in them returning for more.

### Conclusion

Purchasing sarees in large quantities entails striking a balance between various elements. While aesthetics and affordability play a big part, there is still more to consider. One needs to make sure that good materials will be used and that one deals with an honest seller. This is necessary for future success.`,
  },
  {
    id: "4",
    slug: "how-to-identify-the-right-supplier-for-quality-embroidered-sarees",
    title: "How to Identify the Right Supplier for Quality Embroidered Sarees",
    date: "June 28, 2025",
    category: "Buying Guide",
    excerpt:
      "There are various ways to identify the right supplier for quality embroidered sarees. Read to know more about it in details.",
    image: imgEmbroidered,
    imageAlt: "Embroidered Sarees",
    imageTitle: "Right Supplier for Quality Embroidered Sarees",
    metaTitle: "How to Identify the Right Supplier for Quality Embroidered Sarees",
    metaDescription: "There are various ways to identify the right supplier for quality embroidered sarees. Read to know more about it in details.",
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
Constantly procuring the products is vital for ensuring consistent stock levels. Delays in receiving stock or any inconsistencies can have repercussions that are not always anticipated. Such complications can interfere with the success of your planning and affect both your relationship with your suppliers as well as your customers. Maintaining a smooth chain is necessary, as anything else will prove disastrous to all parties involved. It is therefore imperative to ensure constant stock monitoring and to address any complications immediately.

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
            {[...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post, i) => (
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