import sitemap from '@astrojs/sitemap';

import { defineConfig, sharpImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import mdx from '@astrojs/mdx';
import icon from "astro-icon";
import react from "@astrojs/react";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), partytown(), sitemap() , icon({
    include: {
      'logos': ['*']
    },
  })],
  image: {
    service: sharpImageService(),
    remotePatterns: [{ protocol: "https" }],
  },
  site: 'https://rapo7.github.io',
  base: '/blog',
  vite: {
    plugins: [tailwindcss(), rawFonts([".ttf", ".woff"])],
    build: {
      minify: "terser",
      brotliSize: false,
      sourcemap: true,
      chunkSizeWarningLimit: 1024,
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"]
    }
  }
});

// vite plugin to import fonts
function rawFonts(ext) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_, id) {
      if (ext.some(e => id.endsWith(e))) {
        const buffer = readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null
        };
      }
    }
  };
}
