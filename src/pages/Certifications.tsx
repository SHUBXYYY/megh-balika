import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ShieldCheck, Award, Stamp, FileText } from "lucide-react";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";

const CERT_PDF = "/certificates/megh-balika-registration-certificate.pdf";

const credentials = [
  {
    icon: ShieldCheck,
    label: "Government Registered",
    detail: "Officially recognised under Government of India trade norms.",
  },
  {
    icon: Stamp,
    label: "Silk Mark Authority",
    detail: "Every weave verified for 100% pure mulberry silk authenticity.",
  },
  {
    icon: Award,
    label: "GI Tag Compliant",
    detail: "Geographical Indication adherence for Banarasi, Kanjivaram & Baluchari.",
  },
];

const Certifications = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="bg-background">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 silk-bg relative overflow-hidden">
        <div className="container px-6 md:px-12 relative z-10">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold-deep link-edit">
            ⟵ Atelier
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-4xl"
          >
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-6">
              Trust · Provenance · Paperwork
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
              Certified by <em className="text-gold-shimmer not-italic">authority</em>,
              <br />
              proven in <em className="text-gold-shimmer not-italic">silk</em>.
            </h1>
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Every shipment that leaves the atelier carries the weight of formal recognition —
              government registration, Silk Mark verification, and GI compliance. Below is our
              official registration certificate, available to download for your records.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Credentials grid */}
      <section className="py-20 md:py-28">
        <div className="container px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {credentials.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-card border border-border p-8 md:p-10 hover:border-gold/60 transition-colors duration-700 overflow-hidden"
              >
                <div
                  className="absolute -top-px left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)" }}
                />
                <c.icon className="h-8 w-8 text-gold-deep mb-6 group-hover:text-gold transition-colors duration-500" strokeWidth={1.2} />
                <div className="font-serif text-2xl md:text-3xl mb-3">{c.label}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate showcase */}
      <section className="pb-24 md:pb-36 bg-secondary/40">
        <div className="container px-6 md:px-12 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">
                Document of Record
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Government Registration Certificate
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                This is our official registration document — issued under Government of India
                regulatory framework. It authorises Megh Balika to operate as a verified textile
                exporter and B2B saree atelier.
              </p>
              <div className="space-y-3 mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold-deep w-24 shrink-0">Reg. No.</span>
                  <span className="font-serif text-lg">AA191225065074A</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold-deep w-24 shrink-0">Issued</span>
                  <span className="font-serif text-lg">23 December 2025</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold-deep w-24 shrink-0">Status</span>
                  <span className="font-serif text-lg text-gold-deep">Active &amp; Verified</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={CERT_PDF}
                  download
                  className="btn-luxe-primary !py-3 !px-6 !text-sm gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
                <a
                  href={CERT_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxe-outline !py-3 !px-6 !text-sm gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Open in new tab
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="relative group">
                <div
                  className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "var(--gradient-gold)", filter: "blur(40px)" }}
                />
                <div className="relative bg-background border border-gold-deep/30 shadow-luxe overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold-deep" />
                      <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        Registration Certificate · PDF
                      </span>
                    </div>
                    <a
                      href={CERT_PDF}
                      download
                      aria-label="Download certificate"
                      className="text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                  <object
                    data={CERT_PDF}
                    type="application/pdf"
                    className="w-full h-[600px] md:h-[760px] bg-muted"
                    aria-label="Megh Balika government registration certificate"
                  >
                    <div className="p-10 text-center text-muted-foreground">
                      <p className="mb-4">PDF preview is not available in your browser.</p>
                      <a href={CERT_PDF} download className="btn-luxe-primary !py-2 !px-4 !text-xs gap-2 inline-flex">
                        <Download className="h-3.5 w-3.5" /> Download instead
                      </a>
                    </div>
                  </object>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <SareeExpert />
    </main>
  );
};

export default Certifications;
