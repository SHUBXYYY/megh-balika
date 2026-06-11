import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, ArrowLeft, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import SareeLightbox from "@/components/SareeLightbox";
import { useSiteContent, SITE_DEFAULTS } from "@/hooks/useSiteContent";
import { Helmet } from "react-helmet-async";

type Collection = {
  id: string;
  slug: string;
  name: string;
  fabric: string | null;
  origin: string | null;
  description: string | null;
  image_url: string | null;
  images: string[];
  primary_image_index: number;
};

const SareeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [item, setItem] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { get } = useSiteContent();
  const email = get("contact_email", SITE_DEFAULTS.contact_email);
  const wa = get("whatsapp_number", SITE_DEFAULTS.whatsapp_number);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!data) {
        setNotFound(true);
      } else {
        const normalized = {
          ...(data as any),
          images: Array.isArray((data as any).images) ? (data as any).images : [],
          primary_image_index: (data as any).primary_image_index ?? 0,
        } as Collection;
        setItem(normalized);
        setActiveIdx(normalized.primary_image_index ?? 0);
      }
      setLoading(false);
    })();
  }, [slug]);

  // Build display gallery: prefer images[], fall back to image_url
  const gallery = (() => {
    if (!item) return [] as string[];
    if (item.images && item.images.length > 0) return item.images;
    if (item.image_url) return [item.image_url];
    return [];
  })();

  const waMsg = item
    ? `Namaste! I'd like to enquire about your ${item.name} sarees for wholesale.`
    : SITE_DEFAULTS.whatsapp_default_message;
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(waMsg)}`;

  return (
    <main className="bg-background">
      {item?.slug === "kantha-stitch" && (
        <Helmet>
          <title>Kantha Stitch Saree Supplier & Wholesaler USA | Megh Balika</title>
          <meta
            name="description"
            content="Partner with Megh Balika, India's premier kantha stitch saree supplier. We provide bulk handmade kantha clothing & sustainable fashion wholesale to the USA."
          />
        </Helmet>
      )}

      {item?.slug === "jamdani" && (
        <Helmet>
          <title>Pure Bishnupuri Silk Saree Wholesaler | Megh Balika</title>
          <meta
            name="description"
            content="Buy authentic Bishnupuri silk sarees wholesale from Megh Balika. Hand-loomed by master weavers in Bengal, shipped to 72+ countries."
          />
        </Helmet>
      )}
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-28 md:pt-36 pb-6">
        <div className="container px-6 md:px-12">
          <Link
            to="/sarees"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-deep link-edit"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All sarees
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="container px-6 md:px-12 py-32 text-center text-muted-foreground">Loading…</div>
      ) : notFound || !item ? (
        <div className="container px-6 md:px-12 py-32 text-center">
          <h1 className="font-serif text-4xl mb-4">Saree not found</h1>
          <p className="text-muted-foreground mb-8">
            This weave may have been moved or unpublished.
          </p>
          <Link to="/sarees" className="btn-luxe-outline !py-3 !px-6 !text-sm">
            Back to library
          </Link>
        </div>
      ) : (
        <section className="pb-24 md:pb-32">
          <div className="container px-6 md:px-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 relative"
            >
              <button
                type="button"
                onClick={() => gallery.length > 0 && setLightboxOpen(true)}
                className="aspect-[4/5] w-full overflow-hidden bg-secondary gold-sweep relative group block"
                aria-label="Open full-screen gallery"
                disabled={gallery.length === 0}
              >
                {gallery.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={gallery[activeIdx]}
                        src={gallery[activeIdx]}
                        alt={`${item.name} saree from Megh Balika — view ${activeIdx + 1}`}
                        className="w-full h-full object-cover absolute inset-0 cursor-zoom-in"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </AnimatePresence>
                    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-background/85 border border-gold-deep/20 text-[10px] uppercase tracking-[0.3em] text-gold-deep opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-3 w-3" /> Zoom
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Photograph coming soon
                  </div>
                )}
              </button>

              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {gallery.map((url, idx) => (
                    <button
                      key={url + idx}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      onDoubleClick={() => {
                        setActiveIdx(idx);
                        setLightboxOpen(true);
                      }}
                      className={`aspect-square overflow-hidden bg-secondary border-2 transition ${
                        idx === activeIdx ? "border-gold" : "border-transparent hover:border-gold/40"
                      }`}
                      aria-label={`View photo ${idx + 1} (double-click to enlarge)`}
                    >
                      <img
                        src={url}
                        alt={`${item.name} thumbnail ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 lg:pt-12"
            >
              <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">
                {item.fabric ?? "Heritage weave"}
              </div>
              <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-6">
                {item.name}
              </h1>
              {item.origin && (
                <div className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-8">
                  Woven in · {item.origin}
                </div>
              )}

              {item.description && (
                <p className="text-lg leading-relaxed text-foreground/80 mb-10 whitespace-pre-line">
                  {item.description}
                </p>
              )}

              <dl className="border-t border-gold-deep/20 divide-y divide-gold-deep/15 mb-10">
                <Row k="Fabric" v={item.fabric ?? "On request"} />
                <Row k="Origin" v={item.origin ?? "India"} />
                <Row k="Loom" v="Hand-loomed" />
                <Row k="MOQ (export)" v="12 pieces / design" />
                <Row k="Certification" v="Silk Mark · GI tagged where applicable" />
                <Row k="Care" v="Dry clean only · muslin storage" />
              </dl>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxe-primary !py-4 !px-6 !text-sm gap-2 inline-flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
                </a>
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${item.name}`)}`}
                  className="btn-luxe-outline !py-4 !px-6 !text-sm gap-2 inline-flex items-center justify-center"
                >
                  <Mail className="h-4 w-4" /> Email the atelier
                </a>
              </div>
            </motion.div>

            
          </div>
          
          {/* Extra content below gallery */}
          {!loading && item?.slug === "kantha-stitch" &&(
          
            <div className="container mt-12 space-y-12">

              {/* Introduction */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h2 className="text-xxl uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Pure Bishnupuri Silk from the Best Katha Embroidery Supplier in the USA
                </h2>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you are seeking a renowned Hand Katha Stitch saree wholesaler, Meghbalika is the best choice. As a Bishnupuri silk saree lover, you will admire a range of exquisite sarees with hand-katha silk embroidery. Our skilled artisans craft the beautiful embroidery using traditional handloom techniques. 
                  </p>

                  <p>
                    Our sarees portray a rich cultural legacy of West Bengal. The adorable Bishupuri sarees with katha work offer a perfect drape, artistic detailing, and refined texture suitable for modern wardrobes.  Meghbalika is a trusted katha stitch saree supplier that offers a blend of silk craftsmanship, heritage weaving traditions, and detailed hand embroidery to design sarees that reflect individuality, elegance, and grace.
                  </p>
                </div>
              </section>

              {/* Pure Bishnupuri Silk */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Pure Bishnupuri Sarees are Found Here! Buy Now!
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  At Meghbalika, we create authentic pure Bishnupuri sarees using premium quality Bishnupuri silk fabric, which is lightweight, carries a natural sheen, texture, smooth finish, and elegant fall. This silk originates from the heritage weaving traditions of West Bengal. Bishnupuri silk has long been admired for its refined craftsmanship and timeless appeal.  Each saree is carefully developed using authentic silk yarn and traditional weaving methods that preserve the purity and originality of the fabric.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So, if you want to buy graceful Bishnupuri silk sarees with an excellent katha silk embroidery, visit Meghbalika, a top Katha-stitched apparel supplier today.
                </p>
                
              </section>

              {/* Hand Katha Work */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Features of Our Bishnupuri Silk Sarees
                </h3>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    As the best Katha silk saree provider, we offer an authentic range of pure Bishnupuri sarees with beautiful embroidery and soft fabric. Let’s explore the characteristics of our sarees.
                  </p>
                  <ul className="grid gap-3 text-sm text-muted-foreground">
                    <li>✦ Pure Bishnupuri silk fabric </li>
                    <li>✦ Elegant natural sheen and graceful drape</li>
                    <li>✦ Soft, breathable, and luxurious texture</li>
                    <li>✦ Suitable for bridal, festive, cultural, and designer collections </li>
                    <li>✦ Lightweight and comfortable for long wear</li>
                  </ul>
                </div>
              </section>

              {/* Handloom */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Looking for an Elaborative Hand Katha Stitch Work? Connect With Meghbalika Today!
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Meghbalika is a prominent Katha silk saree provider that provides impeccable Bishnupuri sarees that reflect a traditional art form known for its fine needlework and storytelling patterns. We have a team of skilled artisans who spend hours creating delicate motifs, heritage-inspired designs, floral patterns, and artistic detailing. This hard work transforms a saree into a wearable masterpiece. 
                </p>
              </section>

              {/* Handloom */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Features of Hand Katha Stitch 
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Hand Katha stitch is an authentic handcrafted embroidery that showcases traditional West Bengal’s artistry. With decent thread detailing and motifs, the art gives a marvelous look to the silk saree. The artwork offers a unique handcrafted finish in every piece. Hand Katha stitch is ideal for premium ethnic and designer collections. Visit Meghbalika, and experience sophistication through aesthetically appealing Bishnupuri silk sarees that carry a unique identity and artisanal charm. 
                </p>
              </section>

              {/* Handloom */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Produced on Handlooms: Our Sarees Look Amazing!
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  At Meghbalika, the Bishnupuri silk sarees are produced on handlooms. We believe in preserving the texture, authenticity, and craftsmanship associated with traditional silk weaving. With the use of handlooms, we weave with greater attention to detail and create fabrics with perfect artisanal character and super softness.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We use handlooms not just to create intricate designs. However, Meghbalika promotes sustainable practices. This is our contribution toward traditional weaving communities and preserving India’s textile heritage. 

                </p>
              </section>

              {/* Certifications */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Our Certifications & Authenticity 
                </h3>

                <ul className="grid gap-3 text-sm text-muted-foreground">
                  <li>✓ Silk Mark Certified </li>
                  <li>✓ GI Tagged </li>
                  <li>✓ Authentic traditional weaving practices </li>
                  <li>✓ Trusted craftsmanship for export and domestic buyers </li>
                  <li>✓ Assured purity of silk</li>
                </ul>
              </section>

              {/* Who We Cater To */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Who do We Cater to?
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  The best <b>handmade Kantha clothing wholesale</b> company caters to fashion houses, boutiques, exporters, and ethnic wear brands looking for genuine Bishnupuri silk sarees with Katha hand stitch. As a trusted company for Katha stitch sarees, Meghbalika ensures consistent quality, timely delivery, and authentic craftsmanship. 
                </p>
              </section>

              {/* Care Instructions */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Key Care Instructions
                </h3>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✦ Store the silk saree in a muslin cloth</li>
                  <li>✦ Dry clean only</li>
                  <li>✦ Avoid direct sunlight for longer periods</li>
                  <li>✦ Refold periodically to maintain fabric quality </li>
                </ul>
                <br/>
                <p className="text-muted-foreground leading-relaxed">Proper care of Bishnupuri or any other silk saree helps preserve the richness, shine, longevity, texture, and embroidery detailing for years. </p>
              </section>

              {/* Why Choose Us */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Why Choose Us?
                </h3>
                <p className="text-muted-foreground leading-relaxed">If you are an admirer of silk sarees with Katha artwork, you should associate with us and buy a fine range of Bishupuri Silk sarees. Let’s explore the reasons to choose us.</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">✓ Heritage Craftsmanship</h4>
                    <p className="text-sm text-muted-foreground">
                      We promote traditional weaving and hand embroidery techniques, passed through generations.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">✓ Trusted Katha Stitch Saree Provider</h4>
                    <p className="text-sm text-muted-foreground">
                      Meghbalika is a reliable provider of Katha stitch sarees, serving exporters, retailers, and premium ethnic wear buyers with authentic collections.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">✓ Skilled Artisan Work</h4>
                    <p className="text-sm text-muted-foreground">
                      Every saree reflects detailed artistry and handcrafted excellence.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">✓ Sustainable Handloom Production</h4>
                    <p className="text-sm text-muted-foreground">
                      We produce on handlooms, and support sustainable practices, traditional artisans, and preserving India’s textile heritage.
                    </p>
                  </div>
                </div>
              </section>

              <section class="container py-16">
                  <h2 class="text-3xl font-light mb-8">
                    Frequently Asked Questions
                  </h2>

                  <div class="space-y-4">

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        What makes Bishnupuri Silk sarees unique?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        The lightweight fabric, perfect drape, smooth finish, and natural sheen, along with Katha hand stitch, make a Bishnupuri Silk saree look unique.
                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        What is the hand Katha Stitch work?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Hand Katha Stitch is a traditional embroidery technique, originating from West Bengal, where skilled artisans create comprehensive patterns and motifs through fine hand stitching. 

                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        Are your sarees created from pure silk?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Yes, the sarees are crafted using genuine and pure Bishnupuri silk fabric. Our silk holds a silk-marked certification for assured authenticity and quality.
                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        What is the minimum order quantity for export?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        The MOQ for export is 12 pieces per design, making it suitable for exporters, retailers, boutiques, and designer labels.

                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        What are the ways to maintain a Bishnupuri silk saree?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Bishnupuri silk sarees are maintained by considering some useful tips, including dry cleaning the saree, storing it in a muslin cloth, refolding periodically, and avoiding prolonged direct sunlight. This will help maintain the shine, texture, and longevity of your silk saree.
                      </p>
                    </details>

                  </div>
                </section>
            </div>
          )}

          {!loading && item?.slug === "jamdani" &&(
          
            <div className="container mt-12 space-y-12">

              {/* Introduction */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h2 className="text-xxl uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Pure Jamdani from the Best Jamdani Saree Wholesale in the USA
                </h2>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Meghbalika is a leading jamdani textile supplier. We blend traditional weaving with modern fashion and home décor needs. Our beautiful collections feature carefully crafted Jamdani fabrics made by skilled artisans using traditional methods and high-quality yarns. We give a wide range of designs, colors, and textures, suitable for clothing, scarves, furnishings, and unique boutique items.   
                  </p>

                  <p>
                    Quality is important to us. We follow strict quality control methods and ethical sourcing practices, and we ensure reliable delivery. We build strong partnerships with retailers, designers, wholesalers, and exporters to deliver great products at competitive prices. Whether you need small orders or large projects, we provide authentic craftsmanship, excellent service, and lasting value to our global customers through personalized support, clear communication, and flexible solutions.
                  </p>
                </div>
              </section>

              {/* Pure Bishnupuri Silk */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Get The Best Bengali Jamdani Wholesale at Affordable Price 
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  Meghbalika provides the best collections of authentic Jamdani fabrics of Bengali style at affordable costs. Recognized for their complex weaving, elegance in designs, and heritage, our Jamdani fabrics are made by experts through traditional methods. We provide our customers with high-quality Jamdani sarees, dress materials, and fabrics. 
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every item we sell is authentic in nature, durable, and beautiful to wear. At Meghbalika, we assure our customers the best service regarding quality, price, and fast delivery. Partner with us for wholesale Bengali Jamdani textiles that combine heritage craftsmanship with modern market demands and customer satisfaction.
                </p>
                
              </section>

              {/* Hand Katha Work */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Specification of Our Jamdani Sarees 
                </h3>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Our Jamdani sarees represent traditional Bengali weaving, artistic mastery, and quality fabrics, making them suitable for everyday use as well as festive events.
                  </p>
                  <ul className="grid gap-3 text-sm text-muted-foreground">
                    <li>✦ Handwoven by skilled Jamdani artisans </li>
                    <li>✦ Made of high-quality cotton fabrics and cotton blends</li>
                    <li>✦ Elaborate weaving patterns, both traditional and modern</li>
                    <li>✦ Soft, comfortable, and breathable to wear </li>
                    <li>✦ Offered in different colors, prints, and patterns</li>
                    <li>✦ Fine texture with excellent durability</li>
                  </ul>
                </div>
              </section>

              {/* Handloom */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Why People Choose Us? 
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Our goal is to supply genuine Jamdani fabric, which reflects the skills of Bengali artisans. We have established ourselves as an organization that can be relied upon for our quality and service standards because of our dedication to both our customers and high standards of professionalism.
                </p>
              </section>

              {/* Handloom */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Authentic Craftsmanship
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  The Jamdani pieces that we offer are all handcrafted, retaining the elegance of this ancient textile craft.
                </p>
              </section>

              {/* Handloom */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Premium Quality Materials
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  We use carefully selected fabrics and maintain strict quality standards to ensure durability, comfort, and an elegant finish in every piece.
                </p>                
              </section>

              {/* Certifications */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Competitive Wholesale Pricing
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Through our close ties with weavers, we offer premium-quality Jamdani pieces at wholesale prices.
                </p>  
                
              </section>

              {/* Who We Cater To */}
              <section className="border-t border-gold-deep/20 pt-8">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4">
                  Wide Product Selection
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Our collection includes a variety of sarees, fabrics, colors, patterns, and designs to meet diverse market demands and customer preferences.
                </p>
              </section> 
              

              <section class="container py-16">
                  <h2 class="text-3xl font-light mb-8">
                    Frequently Asked Questions
                  </h2>

                  <div class="space-y-4">

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        What fabrics are used in your Jamdani sarees?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Jamdani sarees are made from premium-quality cotton and cotton-blend fabrics, ensuring comfort, durability, and elegance.
                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        Do you provide wholesale Jamdani sarees?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Yes, Meghbalika is a wholesale supplier of Jamdani sarees at affordable prices.

                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        Can I place bulk orders?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Absolutely. We accept bulk and customized orders based on design preferences, quantity requirements, and business needs.
                      </p>
                    </details>

                    <details class="border rounded-lg p-4">
                      <summary class="cursor-pointer font-medium">
                        How do you ensure product quality?
                      </summary>
                      <p class="mt-3 text-gray-600">
                        Every saree undergoes careful quality inspection to ensure superior weaving, fabric quality, finishing, and overall craftsmanship.

                      </p>
                    </details>                    

                  </div>
                </section>
            </div>
          )}

        </section>
      )}

      <SareeLightbox
        images={gallery}
        open={lightboxOpen}
        startIndex={activeIdx}
        onClose={() => setLightboxOpen(false)}
        alt={item?.name ?? "Saree"}
      />

      <Footer />
      <SareeExpert />
    </main>
  );
};

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3">
      <dt className="text-xs uppercase tracking-[0.25em] text-gold-deep col-span-1">{k}</dt>
      <dd className="text-sm text-foreground/80 col-span-2">{v}</dd>
    </div>
  );
}

export default SareeDetail;
