import { useState } from "react";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import Collections from "@/components/Collections";
import ExportTeaser from "@/components/ExportTeaser";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Hero />
      <ValueProps />
      <Collections />
      <ExportTeaser />
      <Footer />

      <SareeExpert />
    </main>
  );
};

export default Index;
