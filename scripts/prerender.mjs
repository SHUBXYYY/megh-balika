/**
 * Build-time static prerendering (SSG) for the Vite SPA.
 *
 * Runs as a Vite plugin (closeBundle) after the client bundle is written:
 *  - spins up a Vite SSR module runner
 *  - renders each public route with react-dom/server + StaticRouter
 *  - bakes the rendered HTML into #root and inlines Helmet's
 *    title/meta/OG/JSON-LD into <head>
 *  - writes dist/<route>/index.html so view-source shows real content
 */
import fs from "node:fs";
import path from "node:path";

export const PRERENDER_ROUTES = [
  "/",
  "/sarees",
  "/sarees/banarasi",
  "/sarees/kantha-stitch",
  "/sarees/silk",
  "/sarees/tussar",
  "/sarees/chanderi",
  "/sarees/jamdani",
  "/sarees/batik",
  "/about",
  "/blog",
  "/export",
  "/book",
  "/contact",
  "/certifications",
  "/reviews",
];

const outFileFor = (outDir, route) =>
  route === "/"
    ? path.join(outDir, "index.html")
    : path.join(outDir, route.replace(/^\//, ""), "index.html");

export function prerenderPlugin() {
  let outDir = "dist";
  let root = process.cwd();

  return {
    name: "megh-prerender",
    apply: "build",
    configResolved(config) {
      // Only prerender the client build
      if (config.build?.ssr) return;
      outDir = path.resolve(config.root, config.build.outDir);
      root = config.root;
    },
    async closeBundle() {
      const template = path.join(outDir, "index.html");
      if (!fs.existsSync(template)) return;

      const shell = fs.readFileSync(template, "utf8");
      let createServer;
      try {
        ({ createServer } = await import("vite"));
      } catch {
        return;
      }

      const server = await createServer({
        root,
        logLevel: "warn",
        server: { middlewareMode: true, hmr: false },
        appType: "custom",
      });

      let ok = 0;
      try {
        const mod = await server.ssrLoadModule("/src/entry-server.tsx");
        for (const route of PRERENDER_ROUTES) {
          try {
            const { html, head } = mod.render(route);
            const page = shell
              .replace(
                "</head>",
                `  <!-- prerendered -->\n    ${head
                  .replace(/data-rh="true"/g, 'data-prerender="true"')
                  .replace(/<title/g, '<title data-prerender="true"')}\n  </head>`
              )
              .replace(
                '<div id="root"></div>',
                `<div id="root">${html}</div>`
              );

            const file = outFileFor(outDir, route);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, page);
            ok++;
          } catch (err) {
            console.warn(`[prerender] skipped ${route}: ${err?.message ?? err}`);
          }
        }
      } catch (err) {
        console.warn(`[prerender] disabled: ${err?.message ?? err}`);
      } finally {
        await server.close();
      }
      console.log(`[prerender] wrote ${ok}/${PRERENDER_ROUTES.length} static pages`);
    },
  };
}

export default prerenderPlugin;
