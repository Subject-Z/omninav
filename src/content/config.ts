import { defineCollection, z } from 'astro:content';

export type ContentEntry = {
  id: string;
  body?: string;
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
  content: contentCollection
};

export const homepageMetaTitle = "OmniNav | Premier Guide to Chinese Drama, Anime & Cinema";
export const homepageMetaDescription = "Explore the cultural richness of China with OmniNav - your ultimate companion for discovering quality Chinese dramas, films, and anime with expert reviews and recommendations.";

export function getHomePagedMetaTitle(page: number): string {
  return `OmniNav Curated Content | Page ${page}`;
}

export function getHomePagedMetaDescription(page: number): string {
  return `Continue exploring OmniNav's hand-picked selection on page ${page}: Exceptional Chinese dramas, anime, and films to enhance your cultural journey.`;
}

export const pageSize = 10;

export function ensureTagsArray(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : [tags];
}