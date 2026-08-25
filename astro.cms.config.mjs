// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

// Config for the Keystatic editor ONLY. Run it with:
//   npm run cms
//
// It is deliberately separate from astro.config.mjs because the editor and the
// public site have incompatible requirements:
//
//   trailingSlash  The site must use 'always' to preserve the URL shape Google
//                  has indexed. Keystatic's client calls /api/keystatic/tree
//                  with no trailing slash, which 'always' rejects with a 404,
//                  leaving the admin as a blank page.
//
//   rendering      Keystatic injects routes with prerender: false, so it needs
//                  a server. The public site must stay fully static — no PHP,
//                  no database, no server to patch was the whole point of the
//                  rebuild.
//
// Sharing the project root means the editor reads the same src/content files
// and the same keystatic.config.ts, with no duplicated dependencies.
export default defineConfig({
  integrations: [mdx(), react(), keystatic()],
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },

  // Keystatic's routes are prerender: false, so the editor needs a real
  // server. Cloud Run runs this container; the public site stays static on
  // Firebase Hosting and never gains a server or an admin surface.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: Number(process.env.PORT) || 8080, host: true },
  outDir: './dist-cms',
});
