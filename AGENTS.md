# AGENTS.md

## 项目定位

- 本仓库是个人博客与 AI Agent 知识库 / 作品集站点。
- 技术栈是 VitePress、Vue 3、TypeScript、Tailwind CSS、npm。
- 内容主线包括 AI Agent、RAG、Tool Calling、LangGraph、Multi-Agent、MCP、Evaluation、工程化笔记、源码拆解和面试题库。
- 默认使用简体中文维护内容，除非用户明确要求其他语言。

## 关键目录

- `docs/blogs/`：公开博客页面、首页、专题文章、项目展示和关于页。
- `docs/note/`：知识库正文，包含 AI Agent、AI Interview、AI Tools、Engineering、Source Reading 等栏目。
- `docs/.vitepress/`：VitePress 配置、主题、组件、工具函数和构建缓存 / 产物目录。
- `scripts/`：站点辅助脚本，例如博客索引生成、图片准备和图床推送。
- `archive/`：历史内容归档，默认不要改动，除非任务明确要求。
- `drafts/`：草稿、原始对话或待整理材料，默认不要直接发布。

## 常用命令

- 安装依赖：`npm install`
- 本地开发：`npm run docs:dev`
- 生产构建：`npm run docs:build`
- 本地预览：`npm run docs:preview`
- 生成博客索引：`npm run blog:index`
- 准备图片：`npm run images:prepare`
- 推送图片仓库：`npm run images:push`

## 内容编辑规则

- 优先修改 Markdown 内容；只有导航、主题、交互或构建逻辑需要变化时才改 VitePress 配置或 Vue 组件。
- 公开发布内容放在 `docs/blogs/` 或 `docs/note/` 下。
- 草稿、原始访谈、历史资料先放 `drafts/` 或 `archive/`，整理后再迁入公开目录。
- 新增文章时优先补充标题、描述、日期等 frontmatter，便于索引和搜索展示。
- 不要把未整理的原始对话、隐私信息、内部链接或本地绝对路径直接写入公开文章。
- 站内链接优先使用 VitePress 路由路径，例如 `/note/AI-Agent/`、`/topics/`。

## VitePress 规则

- 主配置在 `docs/.vitepress/config.mts`。
- 顶部导航和侧边栏主要维护在 `docs/.vitepress/config.mts`。
- 首页内容在 `docs/blogs/index.md`。
- 公开路径通过 `rewrites` 将 `docs/blogs/` 下页面映射到根路径，例如 `/`、`/topics/`、`/projects`；线上 `/home` 由 Vercel 永久重定向到 `/`。
- 博客索引由 `scripts/generate-blog-index.mjs` 生成到 `docs/blogs/public/blog-index/`。
- `docs/.vitepress/dist/` 和 `docs/.vitepress/cache/` 是构建产物 / 缓存，不要作为功能变更提交。

## 验证规则

- 修改内容或配置后，优先运行最窄检查。
- 只改文档规则文件时，可用读取文件和 `git status --short` 验证。
- 改 Markdown 公开内容、导航、侧边栏、VitePress 配置或脚本后，运行 `npm run docs:build`。
- 构建失败时，先定位具体 Markdown、链接、代码块语言或配置问题，不要盲目重构。

## Git 与发布注意事项

- 当前主分支是 `master`，默认不要创建分支、提交或推送，除非用户明确要求。
- 不要随意清理或重写 `archive/`、`drafts/`、`docs/.obsidian/`。
- `docs/.obsidian/` 里包含 Obsidian 配置和插件，处理公开仓库内容时要注意隐私和体积。
- 不要提交 `node_modules/`、构建产物、缓存目录或本地图床工作目录。
- Vercel 部署使用 `vercel.json`，构建命令是 `npm run docs:build`，输出目录是 `docs/.vitepress/dist`。
