import { defineCollection, z } from 'astro:content';

// 为文章定义架构
const articlesCollection = defineCollection({
  type: 'content', // 将data改为content类型
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum(['culture', 'lifestyle', 'information', 'world']),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    // 多语言支持字段
    lang: z.enum(['en', 'zh']),
    // 如果文章有翻译版本，可以引用另一篇文章作为翻译
    translationOf: z.string().optional(),
  }),
});

// 类别翻译配置
export const categoryTranslations = {
  'en': {
    'culture': 'Culture',
    'lifestyle': 'Lifestyle',
    'information': 'Information',
    'world': 'World',
    'all': 'All Articles'
  },
  'zh': {
    'culture': '文化',
    'lifestyle': '生活',
    'information': '信息',
    'world': '世界',
    'all': '所有文章'
  }
};

// 翻译辅助函数
export function translateCategory(category: string, lang: 'en' | 'zh'): string {
  const translations = categoryTranslations[lang];
  return translations[category as keyof typeof translations] || category;
}

// 导出集合配置
export const collections = {
  'articles': articlesCollection,
};