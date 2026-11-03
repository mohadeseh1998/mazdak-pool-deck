import { defineConfig, type Plugin } from "vite";
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

export default defineConfig({
  base: "./",
  plugins: [react(), classicScriptTag()],
  build: {
    modulePreload: false,
    rollupOptions: {
      output: { format: "iife", inlineDynamicImports: true },
    },
  },
  server: { host: true, port: 5173 },
});
