// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://subject-z.github.io/omninav', 
  base: '/omninav',
  outDir: './dist',
  integrations: [
    sitemap({
      // i18n设置
      i18n: {
        defaultLocale: 'en',  // 默认语言
        locales: {
          'zh': 'zh-CN',
          'en': 'en-US'
        }
      },
      // 可选: 自定义更改频率
      changefreq: 'weekly',
      // 可选: 自定义优先级
      priority: 0.7,
      // 可选: 排除某些页面
      filter: (page) => !page.includes('/admin/')
    })
  ]
});