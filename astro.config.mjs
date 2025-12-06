// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://omninav.uk/',
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/page/1/'),
        }),
    ],
});
