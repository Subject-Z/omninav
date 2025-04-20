import { defineCollection, z } from 'astro:content';

// 添加 CategoryKey 类型导出
export type CategoryKey = keyof typeof categoryNames;

// ContentEntry 类型定义
export type ContentEntry = {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    title?: string;
    chineseTitle?: string;
    image?: string;
    tags?: string | string[];
    date?: string | Date;
    description?: string;
  };
  render(): Promise<any>;
};

// 定义内容模式
const contentSchema = z.object({
    title: z.string(),
    chineseTitle: z.string().optional(),
    description: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    image: z.string().url().optional(),
    date: z.coerce.date().optional(),
});

const contentCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    chineseTitle: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  content: contentCollection,
  drama: defineCollection({ schema: contentSchema }),
  anime: defineCollection({ schema: contentSchema }),
  movie: defineCollection({ schema: contentSchema }),
  novel: defineCollection({ schema: contentSchema }),
  game: defineCollection({ schema: contentSchema }),
  food: defineCollection({ schema: contentSchema }),
  travel: defineCollection({ schema: contentSchema }),
  lifestyle: defineCollection({ schema: contentSchema }),
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

// 首页元数据
export const homepageMetaTitle = "OmniNav | Chinese drama, anime, movies and more";
export const homepageMetaDescription = "Discover China with OmniNav! Get reviews & recommendations for Chinese dramas, movies, anime, games & novels. Explore authentic food, travel guides & cultural insights.";

// 首页分页元数据 (格式化函数)
export function getHomePagedMetaTitle(page: number): string {
  return `OmniNav - Page ${page}`;
}
export function getHomePagedMetaDescription(page: number): string {
  return `Continue your journey with OmniNav's Page ${page}: Curated drama, anime, novels, and insider travel tips for an authentic Chinese experience. Dive deeper now!`;
}

// 分类页元数据 (格式化函数)
export function getCategoryMetaTitle(category: CategoryKey): string {
  return `${metaTitleNames[category]} | OmniNav`;
}
export function getCategoryMetaDescription(category: CategoryKey): string {
  return `Explore the best ${metaTitleNames[category]} with OmniNav. Discover authentic recommendations, reviews, and insights into China's most popular entertainment and cultural experiences.`;
}

// 分类分页元数据 (格式化函数)
export function getCategoryPagedMetaTitle(category: CategoryKey, page: number): string {
  return `${metaTitleNames[category]} | Page ${page} | OmniNav`;
}
export function getCategoryPagedMetaDescription(category: CategoryKey, page: number): string {
  return `Continue exploring ${metaTitleNames[category]} on page ${page}. Find more curated recommendations and authentic insights on Chinese culture with OmniNav.`;
}

// 分页设置
export const pageSize = 10;

// 辅助函数
export function ensureTagsArray(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : [tags];
}