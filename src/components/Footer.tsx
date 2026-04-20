import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container px-6 md:px-12 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="font-serif text-3xl md:text-4xl tracking-[0.15em] mb-4">
              MEGH<span className="text-gold-shimmer mx-1">·</span>BALIKA
            </div>
            <p className="text-ink-foreground/60 max-w-sm leading-relaxed">
              The Cloud Maiden — a B2B saree atelier weaving Indian heritage for boutiques across the world.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Atelier</div>
            <ul className="space-y-2 text-ink-foreground/70">
              <li><a href="/#collections" className="link-edit hover:text-gold">Collections</a></li>
              <li><Link to="/export" className="link-edit hover:text-gold">Export Hub</Link></li>
              <li><Link to="/book" className="link-edit hover:text-gold">Book a Tour</Link></li>
              <li><Link to="/about" className="link-edit hover:text-gold">About</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">B2B</div>
            <ul className="space-y-2 text-ink-foreground/70">
              <li><a href="#expert" className="link-edit hover:text-gold">Catalogue</a></li>
              <li><Link to="/export" className="link-edit hover:text-gold">MOQ & Pricing</Link></li>
              <li><Link to="/contact" className="link-edit hover:text-gold">Contact</Link></li>
              <li><Link to="/auth" className="link-edit hover:text-gold">Admin</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Reach us</div>
            <ul className="space-y-2 text-ink-foreground/70">
              <li>hello@meghbalika.in</li>
              <li>WhatsApp · +91 · Business</li>
              <li>Kolkata · West Bengal · India</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16 mb-6" />
        <div className="flex flex-col md:flex-row justify-between gap-3 text-xs text-ink-foreground/40 uppercase tracking-widest">
          <div>© {new Date().getFullYear()} Megh Balika. Hand-loomed in India.</div>
          <div>Silk Mark · GI Certified · Export-ready</div>
        </div>
      </div>
    </footer>
  );
}
