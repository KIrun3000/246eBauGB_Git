// @ts-check
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['grundlagen', '100m', 'aussenbereich', 'ablauf', 'faq']),
    tags: z.array(z.string()),
    region: z.string().default('Brandenburg'),
    intent: z.string().default('owner'),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string().url()
    })).default([])
  })
});

export const collections = { blog };
