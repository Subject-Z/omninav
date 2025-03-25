# OmniNav | 一站式智能导航平台

OmniNav是一个综合性数字平台，致力于为用户提供AI技术、生活服务、前沿资讯、娱乐内容及效率工具的深度整合体验。通过覆盖全球的视野与本土化洞察，我们旨在成为您探索数字世界的指南针。

## 🌟 项目特点

- **多语言支持**: 中文和英文双语界面
- **AI工具聚合**: 覆盖ChatGPT、Claude、Midjourney等主流AI服务
- **生活服务导航**: 整合电商、社交、出行等常用网站
- **信息资讯分类**: 提供新闻、数据等多维度信息获取渠道
- **娱乐内容引导**: 影视、动漫、音乐等娱乐资源导航
- **效率工具推荐**: 汇总设计、开发、VPN等实用工具

## 🚀 项目结构

```
omninav/
├── .astro/                  # Astro生成的临时文件
├── .github/                 # GitHub工作流配置
│   └── workflows/           # 自动部署工作流
├── .vscode/                 # VSCode配置
├── public/                  # 静态资源
│   ├── favicon.webp         # 网站图标
│   ├── robots.txt           # 搜索引擎爬虫配置
│   └── ads.txt              # 广告相关配置
├── src/                     # 源代码
│   ├── assets/              # 静态资源
│   │   └── image/           # 图片资源
│   ├── components/          # 组件
│   │   ├── NavigationBar.astro  # 导航栏
│   │   ├── Pagination.astro     # 分页
│   │   ├── PostList.astro       # 文章列表
│   │   ├── SearchBar.astro      # 搜索栏
│   │   ├── WebsiteCard.astro    # 网站卡片
│   │   └── WebsiteDirectory.astro # 网站目录
│   ├── content/             # 内容数据
│   │   ├── about/           # 关于页面内容
│   │   │   ├── en.md        # 英文
│   │   │   └── zh.md        # 中文
│   │   ├── posts/           # 博客文章
│   │   │   ├── en/          # 英文文章
│   │   │   └── zh/          # 中文文章
│   │   └── website-directory/ # 网站目录数据
│   │       ├── index.json   # 目录索引
│   │       ├── aigc.json    # AI类目
│   │       ├── lifestyle.json # 生活类目
│   │       ├── information.json # 信息类目
│   │       ├── entertainment.json # 娱乐类目
│   │       └── tools.json   # 工具类目
│   ├── layouts/             # 布局组件
│   │   └── BaseLayout.astro # 基础布局
│   └── pages/               # 页面
│       └── [lang]/          # 语言路由
│           ├── index.astro  # 首页
│           ├── about.astro  # 关于页面
│           ├── posts/       # 文章页面
│           └── [postcategory]/ # 文章分类页面
├── astro.config.mjs         # Astro配置
├── package.json             # 项目依赖
├── tsconfig.json            # TypeScript配置
└── README.md                # 项目说明
```

## 💾 核心内容模块

- **AI** - 聚合AI助手、多模态模型、AI聚合平台和AI开发工具
- **生活** - 整合衣食住行网站和优惠信息
- **信息** - 提供新闻、数据等资讯
- **娱乐** - 覆盖影视、动漫等娱乐内容
- **工具** - 包含设计、格式转换、网络访问等实用工具

## 🧩 技术栈

- **Astro** - 静态站点生成器
- **TypeScript** - 类型安全的JavaScript超集
- **Markdown/MDX** - 内容管理
- **JSON** - 数据存储

## 🛠️ 开发命令

所有命令都在项目根目录下的终端中运行:

| 命令 | 操作 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务器，访问 localhost:4321 |
| `npm run build` | 构建生产站点到 ./dist/ 目录 |
| `npm run preview` | 在部署前本地预览构建 |
| `npm run astro ...` | 运行Astro CLI命令，如 astro add, astro check |

## 🌐 多语言支持

OmniNav支持中文和英文两种语言，通过URL路径区分:

- 中文: `/zh/...`
- 英文: `/en/...`

## 📊 部署信息

本项目可以部署在多个平台：

- GitHub Pages: https://subject-z.github.io/omninav
- Cloudflare Pages: https://omninav.uk

### 手动构建

- GitHub Pages: `npm run build:github`
- Cloudflare Pages: `npm run build:cloudflare`

## 📧 联系方式

Email: william@omninav.uk

## 🔍 访问与支持

访问 [OmniNav](https://subject-z.github.io/omninav)，探索更多精彩内容！