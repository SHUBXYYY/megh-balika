import { useState } from "react";
import { Link } from "react-router-dom";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import CatalogForm from "@/components/CatalogForm";
import { motion } from "framer-motion";
import { Award, Globe2, Truck, ShieldCheck, FileText, Tag } from "lucide-react";

const certs = [
  { icon: Award, title: "Silk Mark", desc: "Government-issued silk authenticity certification" },
  { icon: Tag, title: "GI Tagged", desc: "Geographical Indication for protected origin" },
  { icon: ShieldCheck, title: "Handloom Mark", desc: "Verified handwoven by master artisans" },
  { icon: FileText, title: "Export Documents", desc: "All paperwork handled — invoice, BOL, certificate of origin" },
];

const Export = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Header */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 silk-bg">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">⟵ Atelier</Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mt-6 leading-[0.95] text-balance max-w-4xl"
          >
            The Export Hub.
          </motion.h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg leading-relaxed">
            Everything an importer, distributor or boutique buyer needs to bring Megh Balika to their floor.
          </p>
        </div>
      </section>

      {/* Specs */}
      <section className="py-20 md:py-28">
        <div className="container px-6 md:px-12 grid lg:grid-cols-2 gap-16">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">— Order specifications</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-10 text-balance">Built for serious buyers.</h2>
            <dl className="space-y-0 divide-y divide-border">
              {[
                ["Minimum order", "50 pieces per design · 200 pcs blended OK"],
                ["Lead time", "14 days standard · 28 days for custom labelling"],
                ["Sampling", "3 swatches free · pre-production sample on request"],
                ["Currencies", "USD · EUR · GBP · AED · CAD · AUD"],
                ["Payment terms", "30% T/T advance · L/C at sight · escrow via PayPal"],
                ["Incoterms", "EXW Kolkata · FOB Kolkata · CIF destination port"],
                ["Shipping partners", "DHL · FedEx · Aramex · sea freight via Kolkata Port"],
                ["Custom branding", "Woven labels · printed tags · branded boxes"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 py-5">
                  <dt className="text-xs uppercase tracking-[0.3em] text-gold-deep">{k}</dt>
                  <dd className="font-serif text-lg col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">— Certifications</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-10 text-balance">Authenticity, on paper.</h2>
            <div className="grid sm:grid-cols-2 gap-px bg-gold-deep/20">
              {certs.map((c) => (
                <div key={c.title} className="bg-card p-7 hover:bg-secondary transition-colors duration-700 group">
                  <c.icon className="h-7 w-7 text-gold mb-6 transition-transform duration-700 group-hover:scale-110" strokeWidth={1.2} />
                  <div className="font-serif text-xl mb-2">{c.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{c.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-ink text-ink-foreground">
              <Globe2 className="h-7 w-7 text-gold mb-4" strokeWidth={1.2} />
              <div className="font-serif text-3xl mb-2">72 countries.</div>
              <div className="text-ink-foreground/70 text-sm leading-relaxed">
                Active distributor partners across North America, EU, GCC, ASEAN and Australasia.
                We coordinate customs clearance and final-mile in all served markets.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog form */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container px-6 md:px-12">
          <CatalogForm source="export-page" />
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default Export;
