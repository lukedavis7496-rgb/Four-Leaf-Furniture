// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves the site from /Four-Leaf-Furniture/ until a custom
// domain is set up; the deploy workflow passes BASE_PATH and SITE_URL.
// Locally (and on a custom domain) the site lives at the root.
export default defineConfig({
  site: process.env.SITE_URL || 'https://lukedavis7496-rgb.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: { responsiveStyles: true },
});
