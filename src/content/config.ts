import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Frontmatter contract per Web-Blog-SEO_Build_05 (locked 2026-05-04, revision 3).
// 9 required fields. Add fields only when a real problem appears (Build_05 §7).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z
      .string()
      .min(30, 'title must be at least 30 chars (Build_05 §3)')
      .max(80, 'title must be at most 80 chars (Build_05 §3)')
      .regex(/[^.!?,;:]$/, 'title must not end with punctuation (Build_05 §3)'),

    description: z
      .string()
      .min(100, 'description must be at least 100 chars (Build_05 §3)')
      .max(200, 'description must be at most 200 chars (Build_05 §3)'),

    // slug must match the filename exactly — enforced by Astro getStaticPaths
    // in the article template + by n8n pre-validation (Build_05 §3).
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase + hyphens only (Build_05 §3)'),

    publish_date: z.coerce.date(),

    last_updated: z.coerce.date(),

    category: z.enum(['401k-rollover', 'self-directed-ira', 'nra-investing']),

    tags: z.array(
      z.string().regex(/^[a-z0-9-]+$/, 'each tag must be lowercase + hyphens only (Build_05 §3)'),
    ),

    author: z.literal('Sunny Sun'),

    schema_type: z.enum(['Article', 'FAQPage', 'HowTo']),
  }),
});

export const collections = { blog };
