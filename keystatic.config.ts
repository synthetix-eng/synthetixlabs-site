import { config, fields, collection } from '@keystatic/core';

// Keystatic field definitions mirror src/content.config.ts. If the two drift,
// the Astro schema is the one that fails the build — it is the enforcement
// point, this is the editing surface.
//
// Storage is env-driven so the same config serves local development and a
// deployed editor. Deployed modes require a Node.js runtime for Keystatic's
// API routes; a static host cannot serve them.
// NOTE: this file is bundled into the browser, so `process` does not exist
// here. Vite's import.meta.env is the only way to read configuration, and only
// PUBLIC_-prefixed variables are exposed to client code. Using process.env
// here fails at runtime with "process is not defined" and the admin renders
// as a blank page with no server-side error.
const kind = import.meta.env.PUBLIC_KEYSTATIC_STORAGE_KIND;

const storage =
  kind === 'github'
    ? {
        kind: 'github' as const,
        repo: { owner: 'synthetix-eng', name: 'synthetixlabs-site' },
      }
    : kind === 'cloud'
      ? { kind: 'cloud' as const }
      : { kind: 'local' as const };

const common = {
  excerpt: fields.text({
    label: 'Excerpt',
    description: 'One or two sentences. Used in listings and search results.',
    multiline: true,
    validation: { length: { min: 1 } },
  }),
  date: fields.date({
    label: 'Published',
    validation: { isRequired: true },
  }),
  updated: fields.date({
    label: 'Last updated',
    validation: { isRequired: true },
  }),
  draft: fields.checkbox({
    label: 'Draft',
    description: 'No page is generated at all. Use for content that has never been published.',
    defaultValue: false,
  }),
  needsReview: fields.checkbox({
    label: 'Needs review',
    description:
      'The page is still published, but flagged as having a known problem. ' +
      'Use this instead of Draft for anything already live — removing a live ' +
      'URL is worse than the problem on it.',
    defaultValue: false,
  }),
  content: fields.mdx({ label: 'Content' }),
};

export default config({
  storage,
  cloud: { project: 'synthetix/synthetixlabs-site' },
  ui: {
    brand: { name: 'Synthetix Labs' },
    navigation: {
      Content: ['articles', 'caseStudies', 'agentDocs'],
    },
  },
  collections: {
    articles: collection({
      label: 'Articles',
      path: 'src/content/articles/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The URL is taken from this and should not change once published.',
          },
        }),
        ...common,
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: (p) => p.value },
        ),
        author: fields.text({ label: 'Author', defaultValue: 'nitin' }),
      },
    }),

    caseStudies: collection({
      label: 'Case studies',
      path: 'src/content/case-studies/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        ...common,
      },
    }),

    agentDocs: collection({
      label: 'Agent documentation',
      path: 'src/content/agent-docs/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'agent', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        agent: fields.text({
          label: 'Agent',
          description: 'Just the agent name, e.g. "Scout".',
          validation: { length: { min: 1 } },
        }),
        ...common,
      },
    }),
  },
});
