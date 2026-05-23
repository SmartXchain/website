import { defineCollection, reference, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      date: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: reference('authors'),
      category: z.enum([
        'chain-watch',
        'ai-lab',
        'deep-tech',
        'markets',
        'research',
        'opinion',
      ]),
      tags: z.array(z.string()).default([]),
      excerpt: z.string().max(280),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const authors = defineCollection({
  type: 'data',
  schema: () =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      bio: z.string().max(400).optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
      site: z.string().url().optional(),
      email: z.string().email().optional(),
    }),
});

export const collections = { posts, authors };
