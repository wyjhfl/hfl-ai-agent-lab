# AI Agent Portfolio Navigation Playbook：作品集导航与证据呈现

## 这篇文章解决什么问题

HFL AI Agent Lab 的页面目标很明确：让读者快速判断这里有什么、适合谁、从哪里开始，以及哪些内容最能证明 AI Agent 工程能力。

这篇 Playbook 总结作品集导航、专题索引、项目证据和 Agent 产品界面的呈现原则，方便读者按目标进入内容，而不是在大量文章中迷路。

## 可借鉴方向

| 来源 | 可借鉴点 | 适用方式 |
|---|---|---|
| VitePress 默认主题 | home hero、features、nav、sidebar、local search、theme CSS variables | 保留稳定导航、搜索和 Markdown 渲染，重点增强关键页面 |
| VitePress Extending Default Theme | theme/index.ts、布局 slot、自定义组件 | 通过轻量组件增强首页、项目页和专题页 |
| VitePress Build-time Data Loading | 构建期生成文章列表、精选内容、标签数据 | 适合生成 Featured / Latest / Topic Index 数据组件 |
| vitepress-theme-teek | 分类卡片、文章列表、归档、标签、轻量博客体验 | 借鉴卡片密度和信息层级，不直接迁移整套主题 |
| vitepress-theme-trigger | Tailwind 风格博客、AI summary、阅读体验 | 借鉴文章卡片和摘要区 |
| Nólebase Integrations | 阅读增强、目录、链接、页面信息等文档工程组件 | 作为可选增强组件，优先评估体积和维护成本 |
| OpenAI Skills | 用 `SKILL.md` 固化重复检查流程、入口文件和验收标准 | 用于沉淀作品集页面检查清单 |

## 作品集定位

本站不是普通博客，而是 AI Agent 工程作品集。页面需要服务三类读者：

| 读者 | 进入页面后的第一问题 | 页面应回答 |
|---|---|---|
| 招聘方 / 面试官 | 你做过什么，证据在哪里？ | 项目卡片、能力证据地图、Demo 脚本、面试表达 |
| 学习者 | 我应该按什么顺序学？ | 学习路线、专题地图、分阶段路径 |
| 开发者 / 技术同行 | 你的工程理解有多深？ | RAG、MCP、Eval、Trace、安全、可观测专题入口 |

## 读者路径与页面角色

| 页面 | 读者目标 | 应提供的证据 |
|---|---|---|
| 首页 | 10 秒内理解站点价值 | 作品集定位、A/B 项目主线、推荐阅读路径 |
| 项目页 | 快速找到最强项目 | 项目主入口、架构、控制台 UI、评测、Demo、面试材料 |
| 专题页 | 按目标进入知识体系 | Builder、RAG、MCP、Eval、Security、Career 六类入口 |
| 内容地图 | 在全站内容中快速定位 | 学习路线、工程体系、项目作品、安全治理、面试求职 |
| 项目详情页 | 判断工程深度 | 背景、架构、数据流、失败处理、可观测性、验收脚本 |

## 首页应该呈现什么

首页承担四类入口：

1. **Hero**：一句话说明“AI Agent 工程作品集 / RAG · MCP · 多 Agent · Eval”。
2. **Audience Cards**：招聘方、学习者、开发者、求职前四类入口。
3. **Capability Map**：Builder、RAG、MCP、Evaluation、Security、Career Evidence。
4. **Featured Evidence**：不堆最新文章，只放最能证明能力的项目和证据链。

首页不需要过度追求炫酷动效。本站核心是可信度，动画只服务于路径理解。

## 专题页应该呈现什么

专题页要先让读者选目标，再进入完整索引：

| 区块 | 作用 |
|---|---|
| Topic Hero | 解释专题页用途 |
| Top Cards | RAG / Agent / Career / Product UI 等快速入口 |
| Goal Path | 按目标选择路径，例如“做生产级 Agent”“准备安全面试” |
| Featured Sections | Engineering、AI Agent、AI Tools、Interview、Source Reading |
| Dense Tables | 完整索引放在卡片和路径之后，避免一进来就是长表格 |

## 项目页应该呈现什么

项目页要从“列表”升级为“证据面板”：

| 模块 | 内容 |
|---|---|
| Project Hero | 项目一句话、业务场景、核心能力 |
| Architecture Snapshot | 前端、后端、RAG、Agent、MCP、Eval、Ops |
| Evidence Matrix | 代码、文章、截图、评测、Trace、Demo |
| Risk / Failure Story | 失败样本、修复、回归验证 |
| Interview Pack | 60 秒介绍、STAR 故事、追问入口 |

Project A 重点突出 Agentic RAG、引用证据、Trace、质量评测和生产验收；Project B 重点突出多 Agent 编排、ToolGateway、工具审批、审计、Trajectory 和离线可演示边界。

## 可复用检查清单

| 文件 | 作用 |
|---|---|
| references/ui-principles.md | 视觉和布局原则 |
| references/template-research.md | 开源模板参考记录 |
| references/component-checklist.md | 卡片、时间线、项目页、文章页验收清单 |

检查清单不需要复制大量外部模板代码，重点是记录“读者从哪里进入、如何找到证据、哪些页面需要验证、怎样避免破坏内容导航”。

## 取舍原则

- 不盲目整站迁移到新主题：内容量大，侧边栏和 rewrites 成本高。
- 不引入重型 UI 框架：当前 VitePress + CSS 已够用。
- 不依赖大量动效：会分散作品集可信度。
- 不只改颜色：真正问题通常是信息架构和证据路径。

## 页面验收清单

1. 首页是否能在首屏说明作品集定位。
2. 项目页是否能一眼看到 Project A / Project B 和证据链。
3. 专题页是否先给目标入口，再提供完整索引。
4. 内容地图是否覆盖学习、工程、项目、安全和面试。
5. 桌面端和移动端是否都能快速扫读卡片标题。
6. `npm run docs:build` 是否通过。

## 参考链接

- [VitePress Extending the Default Theme](https://vitepress.dev/guide/extending-default-theme)
- [VitePress Home Page](https://vitepress.dev/reference/default-theme-home-page)
- [VitePress Build-Time Data Loading](https://vitepress.dev/guide/data-loading)
- [vitepress-theme-teek](https://github.com/Kele-Bingtang/vitepress-theme-teek)
- [vitepress-theme-trigger](https://github.com/laplacetw/vitepress-theme-trigger)
- [Nólebase Integrations](https://github.com/nolebase/integrations)
- [OpenAI Agent Skills](https://github.com/openai/skills)
