import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Terencio Cash Market'),
    image: image().optional(),
    imageAlt: z.string().optional(), // Added for accessibility
    tags: z.array(z.string()).optional(),
  }),
});

const newsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: image(),
    imageAlt: z.string(), // Required for accessibility
    tags: z.array(z.string()),
    category: z.string(),
    isBreaking: z.boolean().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'noticias': newsCollection,
};
