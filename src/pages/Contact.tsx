import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import CatalogForm from "@/components/CatalogForm";
import { useSiteContent, SITE_DEFAULTS } from "@/hooks/useSiteContent";

const Contact = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { get } = useSiteContent();
  const email = get("contact_email", SITE_DEFAULTS.contact_email);
  const phone = get("contact_phone", SITE_DEFAULTS.contact_phone);
  const wa = get("whatsapp_number", SITE_DEFAULTS.whatsapp_number);
  const waMsg = get("whatsapp_default_message", SITE_DEFAULTS.whatsapp_default_message);
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(waMsg)}`;

  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-32 md:pt-44 pb-16 silk-bg">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">⟵ Atelier</Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl mt-6 leading-tight text-balance max-w-3xl"
          >
            Reach the atelier.
          </motion.h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6 md:px-12 grid lg:grid-cols-4 gap-px bg-gold-deep/20 mb-20">
          <a
            href={waHref}
            target="_blank" rel="noreferrer"
            className="bg-card p-8 hover:bg-secondary transition-colors group"
          >
            <MessageCircle className="h-7 w-7 text-gold mb-5 transition-transform group-hover:scale-110" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">WhatsApp</div>
            <div className="text-sm text-muted-foreground">Fastest reach for trade enquiries</div>
            <div className="mt-3 text-gold-deep break-all">+{wa.slice(0,2)} {wa.slice(2)} ⟶</div>
          </a>
          <a
            href={`tel:${phone.replace(/\s/g,"")}`}
            className="bg-card p-8 hover:bg-secondary transition-colors group"
          >
            <Phone className="h-7 w-7 text-gold mb-5 transition-transform group-hover:scale-110" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">Phone</div>
            <div className="text-sm text-muted-foreground">Mon — Sat · 10:30 to 19:00 IST</div>
            <div className="mt-3 text-gold-deep">{phone} ⟶</div>
          </a>
          <a
            href={`mailto:${email}`}
            className="bg-card p-8 hover:bg-secondary transition-colors group"
          >
            <Mail className="h-7 w-7 text-gold mb-5 transition-transform group-hover:scale-110" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">Email</div>
            <div className="text-sm text-muted-foreground">For catalogues, pricing & orders</div>
            <div className="mt-3 text-gold-deep break-all">{email} ⟶</div>
          </a>
          <div className="bg-card p-8">
            <MapPin className="h-7 w-7 text-gold mb-5" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">Atelier</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Megh Balika Atelier<br />
              Kolkata, West Bengal<br />
              India
            </div>
          </div>
        </div>

        <div className="container px-6 md:px-12 max-w-3xl">
          <CatalogForm source="contact" title="Send us an enquiry" subtitle="Our team replies within one business day." />
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default Contact;
