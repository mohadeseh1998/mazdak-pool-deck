import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, normalizePath, type Plugin, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// The deck has to open from a USB stick by double-clicking index.html. Browsers
// refuse ES module scripts on file:// URLs, so the build emits one classic
// script (IIFE) and this plugin rewrites the injected tag to match.
function classicScriptTag(): Plugin {
  return {
    name: "classic-script-tag",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(/<script type="module" crossorigin/g, "<script defer");
    },
  };
}

// ---------------------------------------------------------------------------
// Pages. The root page (index.html) is the Funding Committee deck. The other
// pages live in their own folders: customer/index.html and
// financials/index.html. A classic script cannot be split across pages, so
// each page is its own build, run one after another into the same dist/ by
// scripts/build-pages.mjs. DECK_PAGE names the page; unset means the root.
//
// The root build below is exactly the configuration it always had, so its
// output stays byte-for-byte the same.
// ---------------------------------------------------------------------------

const PAGES = ["customer", "financials"] as const;
type Page = (typeof PAGES)[number];

const rootConfig: UserConfig = {
  base: "./",
  plugins: [react(), classicScriptTag()],
  build: {
    modulePreload: false,
    rollupOptions: {
      output: { format: "iife", inlineDynamicImports: true },
    },
  },
  server: { host: true, port: 5173 },
};

/**
 * Shared components (src/components, src/hooks) read their words from
 * `../content/<name>`. On a page build, that import is answered by the page's
 * own `src/pages/<page>/content/<name>.ts` when the page has one, so the same
 * TopBar, Claim, notes and sources show that page's copy. Files a page does
 * not provide (assets.ts) stay shared.
 */
function pageContent(page: Page): Plugin {
  const shared = [resolve("src/components"), resolve("src/hooks")].map((d) => normalizePath(d) + "/");
  return {
    name: "page-content",
    enforce: "pre",
    resolveId(source, importer) {
      if (!importer || !source.startsWith("../content/")) return null;
      const from = normalizePath(importer);
      if (!shared.some((dir) => from.startsWith(dir))) return null;
      const name = source.slice("../content/".length).replace(/\.tsx?$/, "");
      const file = resolve(`src/pages/${page}/content/${name}.ts`);
      return existsSync(file) ? normalizePath(file) : null;
    },
  };
}

function pageConfig(page: Page): UserConfig {
  return {
    base: "./",
    plugins: [react(), classicScriptTag(), pageContent(page)],
    build: {
      modulePreload: false,
      // The root build runs first and empties dist/; pages add to it.
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(`${page}/index.html`),
        output: { format: "iife", inlineDynamicImports: true },
      },
    },
    server: { host: true, port: 5173, open: `/${page}/` },
  };
}

export default defineConfig(() => {
  const page = process.env.DECK_PAGE as Page | undefined;
  if (!page) return rootConfig;
  if (!PAGES.includes(page)) throw new Error(`Unknown DECK_PAGE "${page}". Use one of: ${PAGES.join(", ")}`);
  return pageConfig(page);
});
