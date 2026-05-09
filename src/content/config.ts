import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['active', 'completed', 'archived']).default('completed'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects };
