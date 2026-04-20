import { motion } from "framer-motion";
import CatalogForm from "./CatalogForm";

export default function ExportTeaser() {
  return (
    <section id="expert" className="relative py-24 md:py-36 bg-gradient-to-b from-card to-background">
      <div className="container px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">— Export hub</div>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight text-balance mb-6">
            From handloom to your boutique floor.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-10 max-w-lg">
            We handle Silk Mark certification, GI documentation, custom labelling, currency invoicing,
            and door-to-door logistics across 72 countries.
          </p>

          <dl className="space-y-5">
            {[
              ["MOQ", "From 50 pieces per design"],
              ["Lead time", "14–28 days, ex-Kolkata"],
              ["Certifications", "Silk Mark · GI · Handloom Mark"],
              ["Payment", "T/T, L/C, escrow"],
              ["Custom labelling", "Yes, included from 200 pcs"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 py-4 border-b border-border">
                <dt className="text-xs uppercase tracking-[0.3em] text-gold-deep col-span-1">{k}</dt>
                <dd className="font-serif text-lg col-span-2">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="bg-card border border-gold-deep/20 p-8 md:p-10 shadow-soft"
        >
          <CatalogForm embedded />
          <div className="mt-8">
            <div className="font-serif text-2xl mb-2">Request the export catalogue</div>
            <p className="text-sm text-muted-foreground">Pricing, swatches and lead times within 24 hours.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
