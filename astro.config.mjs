import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gofitgym.vercel.app',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
