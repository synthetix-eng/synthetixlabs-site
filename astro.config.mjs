// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Migration strategy
// ------------------
// The site is a frozen wget mirror being ported page by page. Everything not
// yet ported lives in public/ and is copied to dist/ verbatim, so the site
// stays fully deployable throughout. Porting a page means adding it under
// src/pages/ and deleting its counterpart from public/ in the same commit —
// leaving both would produce two files claiming the same output path.
//
// trailingSlash + build.format match the existing URL shape (/governance/),
// which is what Firebase already serves and what Google has indexed. Changing
// either would silently break every indexed URL.
export default defineConfig({
  // Keystatic is opt-in via KEYSTATIC=1. Its integration injects routes with
  // prerender: false, which requires a server adapter — enabling it
  // unconditionally would break the static production build. The public site
  // must stay fully static; the editor runs separately.
  // Keystatic is NOT mounted here. Two hard reasons, both verified:
  //  1. Its routes are prerender: false, so it needs a server adapter — the
  //     public site must stay fully static.
  //  2. Its client calls /api/keystatic/tree with NO trailing slash, which
  //     trailingSlash: 'always' rejects with a 404. Relaxing trailingSlash
  //     would change the URL shape Google has indexed, which is not on offer.
  // The editor therefore runs as a separate app. See docs/cms.md.
  integrations: [mdx(), react()],
  site: 'https://synthetixlabs.ai',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
