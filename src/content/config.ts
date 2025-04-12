import { defineCollection, z } from 'astro:content';

// 添加 CategoryKey 类型导出
export type CategoryKey = keyof typeof categoryNames;

// 定义内容模式
const contentSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    date: z.date(),
    image: z.string().url().optional(),
});

export const collections = {
    drama: defineCollection({ type: 'content', schema: contentSchema }),
    anime: defineCollection({ type: 'content', schema: contentSchema }),
    movie: defineCollection({ type: 'content', schema: contentSchema }),
    novel: defineCollection({ type: 'content', schema: contentSchema }),
    game: defineCollection({ type: 'content', schema: contentSchema }),
    food: defineCollection({ type: 'content', schema: contentSchema }),
    travel: defineCollection({ type: 'content', schema: contentSchema }),
    lifestyle: defineCollection({ type: 'content', schema: contentSchema }),
};

// 导出可用的内容分类列表
export const validCategories = ['drama', 'anime', 'movie', 'novel', 'game', 'food', 'travel', 'lifestyle'] as const;

// 导出分类名称映射 - 只保留英文名称（用于导航和URL）
export const categoryNames = {
    drama: 'Drama',
    anime: 'Anime',
    movie: 'Movie',
    novel: 'Novel',
    game: 'Game',
    food: 'Food',
    travel: 'Travel',
    lifestyle: 'Lifestyle',
};

// 新增：用于页面标题的分类名称映射（添加Chinese前缀）
export const metaTitleNames = {
    drama: 'Chinese Drama',
    anime: 'Chinese Anime',
    movie: 'Chinese Movie',
    novel: 'Chinese Novel',
    game: 'Chinese Game',
    food: 'Chinese Food',
    travel: 'Chinese Travel',
    lifestyle: 'Chinese Lifestyle',
};