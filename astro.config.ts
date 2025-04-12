// astro.config.ts
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://omninav.uk',
  output: 'static',
  integrations: [
    sitemap({
      lastmod: new Date(),
    }),
  ],
});