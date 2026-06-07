# VitePress UI Template Research

## 2026-06 调研结论

- VitePress 官方默认主题已经覆盖本站需要的基础能力：home hero、features、nav、sidebar、local search、outline、theme CSS variables。
- 本站内容量大，不适合直接替换成第三方主题；更稳妥的做法是扩展默认主题和自定义组件。
- 开源主题适合参考信息架构，不适合整包迁移。

## 候选参考

| 项目 | 观察点 | 对本站的启发 |
|---|---|---|
| VitePress default theme | 默认文档体验稳定，支持扩展默认主题 | 继续使用 DefaultTheme + Layout slots |
| vitepress-theme-teek | 分类、归档、标签、博客体验完整 | 借鉴分类/归档/标签入口 |
| vitepress-theme-trigger | Tailwind 博客风格，强调文章生成和摘要 | 借鉴卡片摘要与轻量博客列表 |
| Nólëbase Integrations | 文档工程增强组件 | 后续按需评估阅读增强插件 |
| OpenAI skills | 用技能封装重复工作流 | 维护 hfl-vitepress-ui skill，避免 UI 改版散乱 |

## 引入策略

1. 先用 CSS 和 Vue 小组件解决 80% 体验问题。
2. 只有在明确收益大于维护成本时才引入插件。
3. 所有 UI 改动都要更新导航和专题入口。
4. 视觉组件必须服务三类读者：招聘方、学习者、开发者。

## 后续验证

- npm run docs:build 必须通过。
- 首页、专题页、项目页需要浏览器目测桌面和移动端。
- 不提交 docs/.vitepress/dist/ 和 docs/blogs/public/blog-index/。
