import { z, defineCollection } from 'astro:content';

// ==========================================
// 共用类型定义
// ==========================================

/**
 * 多语言文本对象
 */
const multiLangText = z.object({
  zh: z.string(),
  en: z.string()
});

/**
 * 网站目录项
 */
const directoryItem = z.object({
  id: z.string(),
  name: multiLangText,
  description: multiLangText.optional(),
  url: z.string(),
  logo: z.string().optional(),
  icon: z.string().optional(),
  promotion: z.object({
    url: z.string(),
    text: multiLangText
  }).optional()
});

/**
 * 子分类定义
 */
const subcategory = z.object({
  id: z.string(),
  name: multiLangText,
  items: z.array(directoryItem)
});

/**
 * 分类定义
 */
const category = z.object({
  id: z.string(),
  name: multiLangText,
  subcategories: z.array(subcategory).optional()
});

// ==========================================
// 集合 Schema 定义
// ==========================================

/**
 * 博客文章集合
 */
const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    author: z.string().optional(),
    excerpt: z.string(),
    image: image().optional(),
  }),
});

/**
 * 网站目录索引 Schema
 */
const directoryIndexSchema = z.object({
  categories: z.array(z.string())
});

/**
 * 网站目录条目 Schema
 */
const directoryItemSchema = z.object({
  categories: z.array(category),
});

/**
 * 网站目录集合
 */
const directoryCollection = defineCollection({
  type: 'data',
  schema: ({ id }) => id === 'index' ? directoryIndexSchema : directoryItemSchema
});

// ==========================================
// 导出集合配置
// ==========================================

export const collections = {
  'posts': postsCollection,
  'website-directory': directoryCollection,
};