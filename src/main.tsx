import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider, Helmet } from "react-helmet-async";
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <meta name="description" content="Megh Balika — luxury B2B saree house. Authentic Silk, Tussar, Kantha & Batik weaves crafted by Indian artisans, export-ready for global buyers." />
    </Helmet>
    <App />
  </HelmetProvider>
);
