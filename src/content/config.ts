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
    // 允许使用 date 或 publishDate
    date: z.date().optional(),
    publishDate: z.date().optional(),
    // 添加自定义验证，确保至少有一个日期字段
    category: z.string(),
    author: z.string().optional(),
    // excerpt 可选，因为可能使用 description 代替
    excerpt: z.string().optional(),
    description: z.string().optional(),
    // 图片字段支持字符串或对象类型
    image: z.union([
      z.string(),
      z.object({
        url: z.string().optional(),
        alt: z.string().optional(),
        // 添加其他可能的图片对象属性
      }).optional()
    ]).optional(),
    tags: z.array(z.string()).optional(),
  }).refine(data => data.date || data.publishDate, {
    message: "Either 'date' or 'publishDate' must be provided"
  }).refine(data => data.excerpt || data.description, {
    message: "Either 'excerpt' or 'description' must be provided"
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