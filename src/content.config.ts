import { defineCollection } from 'astro:content';
import { articleLoader } from './content/loaders/articleLoader';
import { markdownLoader } from './content/loaders/markdownLoader';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: articleLoader(),
  schema: z.object({
    articleId: z.string(),
    lang: z.enum(['es', 'en']),
    title: z.string(),
    author: z.string(),
    description: z.string(),
    heroImage: z.string().url().optional(),
    created: z.coerce.date(),
    edited: z.coerce.date(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    tags: z.array(z.string().min(1)).min(1),
    body: z.string(),
  }),
});

const landing = defineCollection({
  loader: markdownLoader('landing'),
});

const about = defineCollection({
  loader: markdownLoader('about'),
});

export const collections = { articles, landing, about };