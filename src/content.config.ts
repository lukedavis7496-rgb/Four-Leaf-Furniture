import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Pieces: everything you've built. One folder per piece in
 * src/content/pieces/<slug>/ with an index.md and its photos.
 *   status: built    → shows in Work
 *           for-sale → shows in Work and Shop (with price)
 *           sold     → shows in Work, marked sold
 */
const pieces = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/pieces', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      type: z.enum(['live-edge', 'round', 'classic', 'shelving', 'other']),
      status: z.enum(['built', 'for-sale', 'sold']),
      price: z.number().optional(),
      species: z.string(),
      dimensions: z.string(),
      base: z.string().optional(),
      finish: z.string().optional(),
      year: z.number(),
      featured: z.boolean().default(false),
      /** Mark entries that are stand-ins so they're labelled on the site. */
      placeholder: z.boolean().default(false),
      photos: z.array(z.object({ src: image(), alt: z.string() })).min(1),
    }),
});

/** Learn: articles and videos. One Markdown file per entry in src/content/learn/. */
const learn = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/learn' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      kind: z.enum(['article', 'video']),
      tags: z.array(z.enum(['getting-started', 'live-edge', 'finishing', 'tools', 'design'])).default([]),
      youtubeId: z.string().optional(),
      cover: image(),
      coverAlt: z.string(),
      placeholder: z.boolean().default(false),
    }),
});

export const collections = { pieces, learn };

