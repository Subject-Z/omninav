import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
    schema: z.object({
        title: z.string(),
        metaTitle: z.string().optional(),
        chineseName: z.string(),
        author: z.string(),
        releaseDate: z.date(),
        poster: z.string().optional(), // URL or path to image
        category: z.enum(['drama', 'movie', 'game', 'anime', 'novel']),
        tags: z.array(z.string()).optional(),
        description: z.string(),
        officialLink: z.string().optional(),
    }),
});

export const collections = { articles };
