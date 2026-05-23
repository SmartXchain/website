import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://smartxchain.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    build: {
      rollupOptions: {
        // Pagefind ships its runtime into /pagefind/pagefind.js after the
        // Astro build completes. Treat it as external so the search page's
        // dynamic import is left as a runtime fetch instead of a bundle-time
        // resolution attempt.
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
