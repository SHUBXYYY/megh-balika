import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import CatalogForm from "@/components/CatalogForm";

const Contact = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
        <div className="container px-6 md:px-12 grid lg:grid-cols-3 gap-px bg-gold-deep/20 mb-20">
          <a
            href="https://wa.me/919999999999"
            target="_blank" rel="noreferrer"
            className="bg-card p-8 hover:bg-secondary transition-colors group"
          >
            <MessageCircle className="h-7 w-7 text-gold mb-5 transition-transform group-hover:scale-110" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">WhatsApp Business</div>
            <div className="text-sm text-muted-foreground">Fastest reach for trade enquiries</div>
            <div className="mt-3 text-gold-deep">+91 9999 999 999 ⟶</div>
          </a>
          <a
            href="mailto:hello@meghbalika.in"
            className="bg-card p-8 hover:bg-secondary transition-colors group"
          >
            <Mail className="h-7 w-7 text-gold mb-5 transition-transform group-hover:scale-110" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">Email</div>
            <div className="text-sm text-muted-foreground">For catalogues, pricing & orders</div>
            <div className="mt-3 text-gold-deep">hello@meghbalika.in ⟶</div>
          </a>
          <div className="bg-card p-8">
            <MapPin className="h-7 w-7 text-gold mb-5" strokeWidth={1.2} />
            <div className="font-serif text-2xl mb-2">Atelier address</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Megh Balika Atelier<br />
              Salt Lake, Sector V<br />
              Kolkata, West Bengal · India
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
