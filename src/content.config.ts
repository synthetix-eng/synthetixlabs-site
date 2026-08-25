import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Three collections, not one. The content types genuinely differ in shape —
// an agent doc has an agent name, an article has tags and an author, a case
// study has neither. Folding them into a single `posts` collection with
// mostly-empty fields would make the Keystatic editing experience worse for
// everyone, and these schemas are what Keystatic's field definitions mirror.

const base = {
  title: z.string().min(1),
  date: z.coerce.date(),
  updated: z.coerce.date(),
  excerpt: z.string().min(1),
  // Set on content that must not publish yet. The compliance-review article
  // carries a body that does not match its title — a pre-existing authoring
  // error — so it is drafted until correct copy arrives.
  draft: z.boolean().default(false),
};

const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articles' }),
  schema: z.object({
    ...base,
    tags: z.array(z.string()).default([]),
    author: z.string().default('nitin'),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/case-studies' }),
  schema: z.object({ ...base }),
});

const agentDocs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/agent-docs' }),
  schema: z.object({
    ...base,
    agent: z.string().min(1),
  }),
});

export const collections = {
  articles,
  'case-studies': caseStudies,
  'agent-docs': agentDocs,
};
