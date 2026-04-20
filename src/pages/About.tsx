import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";

const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-balance mb-10">
            Megh Balika began in a one-room weaving studio in Shantiniketan, where four artisans
            answered the question — "what does a cloud feel like, in silk?"
          </p>
          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
            <p>
              Today the atelier represents <em>more than 200 master weavers</em> across Bengal,
              Banaras and Kanchipuram. Every saree is hand-loomed, certified for authenticity, and
              shipped under our private label or yours.
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
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default About;
