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
      if (process.env.MEGH_PRERENDER_SSR === "1") return; // nested SSR build
      const template = path.join(outDir, "index.html");
      if (!fs.existsSync(template)) return;

      // Strip the shell's generic <title> and <meta name="description"> so each
      // prerendered page only carries its route-specific head tags.
      const shell = fs
        .readFileSync(template, "utf8")
        .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
        .replace(/\s*<meta\s+name=["']description["'][^>]*>/i, "");


      // Minimal browser shims so browser-only modules (e.g. the auth client)
      // can be imported in the Node SSR context.
      const memoryStorage = () => {
        const store = new Map();
        return {
          getItem: (k) => (store.has(k) ? store.get(k) : null),
          setItem: (k, v) => void store.set(k, String(v)),
          removeItem: (k) => void store.delete(k),
          clear: () => store.clear(),
          key: (i) => Array.from(store.keys())[i] ?? null,
          get length() {
            return store.size;
          },
        };
      };
      if (typeof globalThis.localStorage === "undefined")
        globalThis.localStorage = memoryStorage();
      if (typeof globalThis.sessionStorage === "undefined")
        globalThis.sessionStorage = memoryStorage();

      const ssrDir = path.join(root, "node_modules/.megh-prerender");
      let ok = 0;
      try {
        const { build } = await import("vite");
        process.env.MEGH_PRERENDER_SSR = "1";
        await build({
          root,
          mode: "production",
          logLevel: "warn",
          build: {
            ssr: path.join(root, "src/entry-server.tsx"),
            outDir: ssrDir,
            emptyOutDir: true,
            copyPublicDir: false,
            rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
          },
        });
        process.env.MEGH_PRERENDER_SSR = "";

        const mod = await import(
          `${new URL(`file://${path.join(ssrDir, "entry-server.mjs")}`).href}?t=${Date.now()}`
        );

        for (const route of PRERENDER_ROUTES) {
          try {
            const { html, head } = mod.render(route);
            const markedHead = head
              .replace(/\sdata-rh=("|')true\1/g, "")
              .replace(/<(title|meta|link|script)(\s|>)/g, '<$1 data-prerender="true"$2');
            const page = shell
              .replace(
                "</head>",
                `  <!-- prerendered -->\n    ${markedHead}\n  </head>`
              )
              .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

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
        process.env.MEGH_PRERENDER_SSR = "";
      }
      console.log(`[prerender] wrote ${ok}/${PRERENDER_ROUTES.length} static pages`);
    },

  };
}

export default prerenderPlugin;
