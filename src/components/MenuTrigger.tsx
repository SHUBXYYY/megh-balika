import { motion } from "framer-motion";

interface Props {
  onOpen: () => void;
}

export default function MenuTrigger({ onOpen }: Props) {
  return (
    <motion.button
      onClick={onOpen}
      aria-label="Open menu"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed top-6 right-6 md:top-8 md:right-8 z-50 group flex items-center gap-3 px-4 py-3 bg-background/60 backdrop-blur-md border border-gold-deep/30 hover:border-gold transition-all duration-500"
    >
      <span className="font-serif text-xs uppercase tracking-[0.3em] text-foreground/70 group-hover:text-gold transition-colors hidden sm:inline">
        Menu
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="block h-px w-6 bg-foreground/80 group-hover:bg-gold transition-all duration-500 group-hover:w-7" />
        <span className="block h-px w-4 bg-foreground/80 group-hover:bg-gold transition-all duration-500 group-hover:w-7 ml-auto" />
        <span className="block h-px w-6 bg-foreground/80 group-hover:bg-gold transition-all duration-500 group-hover:w-7" />
      </span>
    </motion.button>
  );
}
