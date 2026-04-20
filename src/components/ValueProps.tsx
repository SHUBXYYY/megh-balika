import { motion } from "framer-motion";
import { Award, Globe2, Sparkles } from "lucide-react";

const props = [
  {
    icon: Sparkles,
    title: "Artisan Authenticity",
    body: "Every saree carries the signature of a master weaver from Bengal, Banaras, or Kanchipuram. GI-tagged. Silk-Marked. Soul-stitched.",
  },
  {
    icon: Globe2,
    title: "Globally Export-Ready",
    body: "Documentation, certifications, custom labelling and logistics handled end-to-end. From handloom to harbour, in 14 days.",
  },
  {
    icon: Award,
    title: "Bespoke for Boutiques",
    body: "Private-label collections, MOQs from 50 pieces, and curated edits tailored to your market and seasons.",
  },
];

export default function ValueProps() {
  return (
    <section className="relative py-24 md:py-36 container px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
        className="max-w-3xl mb-16 md:mb-24"
      >
        <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">— The atelier promise</div>
        <h2 className="font-serif text-4xl md:text-6xl text-balance leading-tight">
          Three vows we keep,
          <br />
          for every yard we ship.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-px bg-gold-deep/20">
        {props.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="bg-background p-8 md:p-10 group hover:bg-card transition-colors duration-700"
          >
            <div className="flex items-start justify-between mb-12">
              <p.icon className="h-7 w-7 text-gold transition-transform duration-700 group-hover:scale-110" strokeWidth={1.2} />
              <span className="font-serif text-sm text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl mb-4 text-balance">{p.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-pretty">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
