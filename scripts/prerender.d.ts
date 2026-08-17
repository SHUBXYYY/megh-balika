declare module "*/scripts/prerender.mjs" {
  import type { Plugin } from "vite";
  export const PRERENDER_ROUTES: string[];
  export function prerenderPlugin(): Plugin;
  const _default: typeof prerenderPlugin;
  export default _default;
}
