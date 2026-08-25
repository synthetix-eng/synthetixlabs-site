// @ts-check
import { defineConfig } from 'astro/config';

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
