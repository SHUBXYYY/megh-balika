import { useState } from "react";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import Collections from "@/components/Collections";
import ExportTeaser from "@/components/ExportTeaser";
import Footer from "@/components/Footer";
import SareeExpert from "@/components/SareeExpert";
import Seo, { breadcrumbLd } from "@/components/Seo";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative">
      <Seo
        path="/"
        title="Megh Balika — Luxury Handwoven Saree Wholesale & Export"
        description="Megh Balika is a Kolkata luxury saree house supplying handwoven Banarasi, Kantha, Tussar, Jamdani and pure silk sarees wholesale to boutiques and importers worldwide."
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Megh Balika",
            url: "https://www.meghbalika.store",
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Megh Balika",
            url: "https://www.meghbalika.store",
            description:
              "Luxury B2B saree house exporting handwoven Indian sarees to boutiques worldwide.",
            founder: { "@type": "Person", name: "Reshmi Pradhan" },
            email: "reshmip632@gmail.com",
            telephone: "+91 7001378042",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Esplanade East",
              addressLocality: "Kolkata",
              addressRegion: "West Bengal",
              postalCode: "700069",
              addressCountry: "IN",
            },
          },
        ]}
      />
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
