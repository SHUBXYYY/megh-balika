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
                      className={`aspect-square overflow-hidden bg-secondary border-2 transition ${
                        idx === activeIdx ? "border-gold" : "border-transparent hover:border-gold/40"
                      }`}
                      aria-label={`View photo ${idx + 1}`}
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
        </section>
      )}

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
