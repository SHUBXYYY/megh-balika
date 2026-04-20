import { motion } from "framer-motion";
import banarasi from "@/assets/collection-banarasi.jpg";
import tussar from "@/assets/collection-tussar.jpg";
import kantha from "@/assets/collection-kantha.jpg";
import batik from "@/assets/collection-batik.jpg";

const collections = [
  {
    n: "01",
    name: "Banarasi",
    tag: "Banaras · Silk & Zari",
    desc: "Royal brocades with real silver-gilt zari motifs. The empress of Indian silk.",
    img: banarasi,
  },
  {
    n: "02",
    name: "Tussar",
    tag: "Bhagalpur · Wild Silk",
    desc: "Sun-warm wild silk with a tactile, textured hand-feel. Earthy and effortless.",
    img: tussar,
  },
  {
    n: "03",
    name: "Kantha",
    tag: "Bengal · Hand Embroidery",
    desc: "Generations of running stitches retell folktales across cotton and silk.",
    img: kantha,
  },
  {
    n: "04",
    name: "Batik",
    tag: "Shantiniketan · Wax-Resist",
    desc: "Dye and wax converse — each piece an unrepeatable studio composition.",
    img: batik,
  },
];

export default function Collections() {
  return (
    <section id="collections" className="relative py-24 md:py-36 bg-card">
      <div className="container px-6 md:px-12 mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">— The weaves</div>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight text-balance">
              Four traditions.
              <br />
              <em className="text-gold-shimmer not-italic">Infinite</em> drape.
            </h2>
          </div>
          <p className="md:max-w-sm text-muted-foreground leading-relaxed">
            A curated four-house edit available now for international wholesale.
            Full catalogue, swatches and pricing on request.
          </p>
        </motion.div>
      </div>

      {/* Staggered overlapping vertical layout */}
      <div className="container px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-y-20 md:gap-y-28">
          {collections.map((c, i) => {
            const isOdd = i % 2 === 1;
            return (
              <motion.article
                key={c.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`md:col-span-7 group ${isOdd ? "md:col-start-6" : "md:col-start-1"}`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden">
                    <img
                      src={c.img}
                      alt={`${c.name} saree weave detail`}
                      loading="lazy"
                      width={1024}
                      height={1280}
                      className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 font-serif text-xs tracking-[0.3em] text-ink-foreground/80 bg-ink/40 backdrop-blur-sm px-3 py-1.5">
                    Nº {c.n}
                  </div>
                </div>

                <div className={`mt-6 md:mt-8 ${isOdd ? "md:pl-12" : "md:pr-12"}`}>
                  <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">{c.tag}</div>
                  <h3 className="font-serif text-4xl md:text-5xl mb-4">{c.name}</h3>
                  <p className="text-muted-foreground max-w-md leading-relaxed mb-5">{c.desc}</p>
                  <a href="#expert" className="link-edit font-serif italic text-foreground/80 hover:text-gold transition-colors">
                    Inquire about {c.name} ⟶
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
