import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import AppRoutes from "./AppRoutes";

/** Render a route to static HTML + head markup at build time. */
export function render(url: string): { html: string; head: string } {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>
  );

  const h = helmetContext.helmet;
  const head = h
    ? [
        h.title.toString(),
        h.meta.toString(),
        h.link.toString(),
        h.script.toString(),
      ]
        .filter(Boolean)
        .join("\n    ")
    : "";

  return { html, head };
}
