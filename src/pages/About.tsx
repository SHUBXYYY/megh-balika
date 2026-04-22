import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import { useSiteContent, SITE_DEFAULTS } from "@/hooks/useSiteContent";

const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { get } = useSiteContent();
  const email = get("contact_email", SITE_DEFAULTS.contact_email);
  const phone = get("contact_phone", SITE_DEFAULTS.contact_phone);
  const aboutIntro = get("about_intro", "");

  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="pt-32 md:pt-44 pb-20 silk-bg">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">⟵ Atelier</Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mt-6 leading-[0.95] text-balance max-w-4xl"
          >
            The atelier <em className="text-gold-shimmer not-italic">behind the cloud</em>.
          </motion.h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container px-6 md:px-12 max-w-3xl">
          {aboutIntro && (
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-balance mb-10">
              {aboutIntro}
            </p>
          )}
          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
            <p>
              Megh Balika began in a one-room weaving studio in Shantiniketan, where four artisans
              answered the question — "what does a cloud feel like, in silk?"
            </p>
            <p>
              The atelier was founded by <em className="text-foreground not-italic font-medium text-gold-shimmer">Reshmi Pradhan</em> —
              a Bengali textile custodian whose grandmother's Jamdani trousseau lit the first spark.
              Today, under her watch, Megh Balika represents <em>more than 200 master weavers</em> across
              Bengal, Banaras, Kanchipuram and Bhuj. Every saree is hand-loomed, certified for authenticity,
              and shipped under our private label or yours.
            </p>
            <p>
              We believe heritage is best preserved when it travels — so we make it our work to
              place these textiles on the boutique floors of Paris, Dubai, Toronto, Sydney, Singapore,
              and beyond.
            </p>
            <p>
              <em className="text-foreground">Megh Balika</em> means <em className="text-foreground">Cloud Maiden</em> —
              for the lightness, the drape, the play of light — and for the care with which each piece is born.
            </p>
          </div>

          {/* Founder card */}
          <div className="mt-14 p-8 border border-gold-deep/20 bg-card">
            <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Founder</div>
            <div className="font-serif text-3xl mb-2">Reshmi Pradhan</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Custodian, curator and weaver-whisperer. Reshmi leads the atelier from Esplanade East,
              Kolkata — bridging looms in Bengal villages with boutiques across 72+ countries.
            </div>
          </div>

          {/* Contact card */}
          <div className="mt-16 border-t border-gold-deep/20 pt-10 grid sm:grid-cols-2 gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Direct line</div>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-serif text-2xl link-edit hover:text-gold transition">
                {phone}
              </a>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Atelier email</div>
              <a href={`mailto:${email}`} className="font-serif text-2xl link-edit hover:text-gold transition break-all">
                {email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default About;
