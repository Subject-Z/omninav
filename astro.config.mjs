import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// 获取部署环境
const IS_NETLIFY = Boolean(process.env.NETLIFY);
const IS_GITHUB = Boolean(process.env.GITHUB_ACTIONS);
const IS_CLOUDFLARE = Boolean(process.env.CF_PAGES);

// 根据环境设置站点 URL 和基础路径
let site = 'https://omninav.uk'; // 默认为 Cloudflare/自定义域名
let base = '/'; // 默认无基础路径

if (IS_GITHUB) {
  site = 'https://subject-z.github.io';
  base = '/omninav';
  console.log('使用GitHub Pages配置');
} else if (IS_CLOUDFLARE) {
  console.log('使用Cloudflare Pages配置');
} else {
  // 本地开发环境
  console.log('使用本地开发环境配置');
}

console.log(`站点: ${site}, 基础路径: ${base}`);

// https://astro.build/config
export default defineConfig({
  site,
  base,
  outDir: './dist',
  trailingSlash: 'always', // 确保URL末尾有斜杠，解决一些路径问题
  
  // 仅在 Netlify 部署时使用 Netlify 适配器
  output: IS_NETLIFY ? 'server' : 'static',
  adapter: IS_NETLIFY ? netlify() : undefined,
  
  integrations: [
    sitemap({
      // i18n 设置
      i18n: {
        defaultLocale: 'en',
        locales: {
          'zh': 'zh-CN',
          'en': 'en-US'
        }
      },
      changefreq: 'weekly',
      priority: 0.7,
      filter: (page) => !page.includes('/admin/')
    })
  ],
  
  // 构建优化
  build: {
    inlineStylesheets: 'auto'
  },
  
  // 开发服务器配置
  server: {
    port: 4321,
    host: true
  }
});