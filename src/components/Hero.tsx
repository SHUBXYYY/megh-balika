import { motion } from "framer-motion";
import silkHero from "@/assets/silk-hero.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden silk-bg">
      {/* Hero image with subtle Ken Burns */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={silkHero}
          alt="Flowing golden silk fabric"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
      </motion.div>

      {/* Top brand mark */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-20"
      >
        <div className="font-serif text-xl md:text-2xl tracking-[0.25em] text-foreground/80">
          MEGH<span className="text-gold-shimmer mx-1">·</span>BALIKA
        </div>
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mt-1">
          Est. heritage · Bengal
        </div>
      </motion.div>

      {/* Side rails */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block z-10"
      >
        <div className="v-text font-serif italic text-sm tracking-widest text-foreground/50">
          The Cloud Maiden — Heritage in motion
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block z-10"
      >
        <div className="v-text rotate-180 font-serif italic text-sm tracking-widest text-foreground/50">
          Hand-loomed · Export-ready · Since generations
        </div>
      </motion.div>

      {/* Headline */}
      <div className="relative z-10 container px-6 md:px-12 pb-20 md:pb-28 lg:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="text-xs md:text-sm uppercase tracking-[0.5em] text-gold-deep mb-6">
            ⟶ &nbsp; The Cloud Maiden
          </div>
          <h1 className="font-serif text-balance text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] tracking-tight text-foreground">
            Sarees woven<br />
            from <em className="text-gold-shimmer not-italic">cloud</em>,
            <br /> draped on the world.
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-8 max-w-xl font-serif text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty"
          >
            A B2B atelier of artisan weaves — Banarasi, Tussar, Kantha, Batik —
            crafted by Indian masters and dispatched, certified, to boutiques across 72 countries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 1 }}
            className="mt-10 flex flex-wrap gap-4 items-center"
          >
            <a href="#collections" className="btn-luxe-primary group">
              <span>Explore the weaves</span>
              <span className="transition-transform group-hover:translate-x-1">⟶</span>
            </a>
            <a href="#expert" className="btn-luxe-outline">
              Speak with Megh — our expert
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-foreground/50"
      >
        <div className="text-[10px] uppercase tracking-[0.4em]">Scroll</div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gold-deep/50"
        />
      </motion.div>
    </section>
  );
}
