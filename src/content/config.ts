import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        lang: z.enum(['en', 'zh']),
        image: z.string().optional(),
        draft: z.boolean().optional().default(false)
    })
});

export const collections = {
    articles
};