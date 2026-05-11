import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Phase 2 stub. Full frontmatter schema (per Web-Blog-SEO_Build_05) lands in Phase 3 §3.2.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog };
