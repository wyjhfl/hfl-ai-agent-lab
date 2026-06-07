# AI Agent Site UI Optimization Playbook：个人博客界面优化路线

## 这篇文章解决什么问题

下一阶段站点重点不是继续堆文章数量，而是把 HFL AI Agent Lab 从“内容很多的知识库”升级成“能快速证明能力的作品集界面”。读者打开页面后，要能在 10 秒内判断：这里有什么、适合谁、从哪里开始、哪些内容最能证明 AI Agent 工程能力。

这篇 Playbook 记录本轮 UI 深度调研结果，并把可执行优化拆成批次，后续每次改版都可以按这里验收。

## 调研结论

| 来源 | 可借鉴点 | 本站采用方式 |
|---|---|---|
| VitePress 默认主题 | home hero、features、nav、sidebar、local search、theme CSS variables | 继续扩展默认主题，不整站换主题 |
| VitePress Extending Default Theme | 通过 theme/index.ts、布局 slot、自定义组件渐进增强 | 保留 ReadingProgress、BackToTop、HomeShowcase，继续加轻组件 |
| VitePress Build-time Data Loading | 构建期生成文章列表、精选内容、标签数据 | 后续做 Featured / Latest / Topic Index 数据组件 |
| vitepress-theme-teek | 分类卡片、文章列表、归档、标签、轻量博客体验 | 借鉴信息架构，不直接迁移主题 |
| vitepress-theme-trigger | Tailwind 风格博客、CLI 生成文章、AI summary、阅读体验 | 借鉴文章卡片和摘要区，不引入重依赖 |
| Nólëbase Integrations | 阅读增强、目录/链接/页面信息等文档工程组件 | 作为插件候选，先评估体积和维护成本 |
| OpenAI Skills | 用 SKILL.md 固化重复工作流、入口文件、验收标准 | 继续维护 .claude/skills/hfl-vitepress-ui |

## UI 定位

本站不是普通博客，而是 AI Agent 工程作品集。UI 要围绕三类人组织：

| 读者 | 进入页面后的第一问题 | UI 应答 |
|---|---|---|
| 招聘方 / 面试官 | 你做过什么、证据在哪里？ | 项目卡片、能力证据地图、Demo 脚本、面试表达 |
| 学习者 | 我应该按什么顺序学？ | 学习路线、专题地图、分阶段路径 |
| 开发者 / 技术同行 | 你的工程理解有多深？ | RAG、MCP、Eval、Trace、安全、可观测专题入口 |

## 优先级路线图

| 批次 | 目标 | 具体改动 | 验收标准 |
|---|---|---|---|
| P0 当前批次 | 入口清晰 | 首页/专题页增加 UI 优化入口，skill 加调研原则 | 构建通过，新增入口可点击 |
| P1 首页精选 | 从“静态介绍”变成“精选内容橱窗” | Featured cards：安全、可观测、UI、项目、面试 | 首页首屏后 2 屏内看到最强内容 |
| P2 专题地图瘦身 | 降低长表格压迫感 | 增加分组卡片、路径筛选、推荐阅读 CTA | 移动端不需要长时间横滑找入口 |
| P3 项目作品集 | 项目页真正像作品集 | Project hero、Evidence Matrix、Architecture Snapshot、Demo Checklist | 面试官 1 分钟能找到项目亮点 |
| P4 文章体验 | 长文阅读更舒服 | article meta、reading time、上一篇下一篇、相关专题 | 长文页面信息层次稳定 |
| P5 数据驱动 | 自动生成索引 | build-time loader 生成精选、最近更新、标签 | 减少手动维护重复链接 |
| P6 视觉系统 | 形成统一组件语言 | card、badge、timeline、metric、callout、evidence-link 样式规范 | 新页面视觉一致，不复制粘贴失控 |

## 首页优化方案

首页建议保留当前结构，但继续增强 4 个区域：

1. **Hero**：一句话说明“AI Agent 工程知识库与求职作品集”。
2. **Audience Cards**：招聘方 / 学习者 / 开发者三个入口。
3. **Capability Map**：RAG、Runtime、Tool/MCP、Evaluation、Safety/Ops、Career Evidence。
4. **Featured Evidence**：不放最新文章堆砌，只放能证明能力的精选链接。

首页不要过度追求炫酷动效。本站核心是可信度，动画只服务于路径理解。

## 专题页优化方案

当前专题页内容很全，但长表格会让新读者压力大。建议改成：

| 区块 | 作用 |
|---|---|
| Topic Hero | 解释专题页用途 |
| Top Cards | RAG / Agent / Career / UI 四个快速入口 |
| Goal Path | 按目标选择路径，例如“做生产级 Agent”“准备安全面试” |
| Featured Sections | Engineering、AI Agent、AI Tools、Interview、Source Reading |
| Dense Tables | 保留完整索引，但放在卡片和路径之后 |

## 项目页优化方案

项目页要从“项目列表”升级成“证据面板”：

| 模块 | 内容 |
|---|---|
| Project Hero | 项目一句话、业务场景、核心能力 |
| Architecture Snapshot | 前端、后端、RAG、Agent、MCP、Eval、Ops |
| Evidence Matrix | 代码、文章、截图、评测、Trace、Demo |
| Risk / Failure Story | 失败样本、修复、回归验证 |
| Interview Pack | 60 秒介绍、STAR 故事、追问入口 |

项目 B 后续尤其要突出 Multi-Agent、LangGraph/Workflow、工具审批、可观测和安全治理。

## Skills 优化方案

现有 .claude/skills/hfl-vitepress-ui 已经能固化 UI 工作流。后续建议补三类内容：

| 文件 | 作用 |
|---|---|
| references/ui-principles.md | 视觉和布局原则 |
| references/template-research.md | 开源模板调研记录 |
| references/component-checklist.md | 卡片、时间线、项目页、文章页验收清单 |

Skill 不应该复制大量外部模板代码，而要记录“什么时候看哪些入口文件、如何验收、怎样避免破坏内容导航”。

## 不建议现在做什么

- 不建议整站迁移到新主题：内容量大，侧边栏和 rewrites 成本高。
- 不建议引入重型 UI 框架：当前 VitePress + CSS 已够用。
- 不建议大量动效：会分散作品集可信度。
- 不建议只改颜色：真正问题是信息架构和证据路径。

## 下一轮可执行清单

1. 首页增加 Featured Evidence 组件。
2. 专题页顶部卡片从 3 个扩展到 6 个，加入 Safety、MCP、UI。
3. 项目页增加 Evidence Matrix 和 Project B 状态卡。
4. 新增 build-time featured data 文件，减少手动维护。
5. 用浏览器检查首页、专题页、项目页在桌面和移动端的视觉层级。

## 参考链接

- [VitePress Extending the Default Theme](https://vitepress.dev/guide/extending-default-theme)
- [VitePress Home Page](https://vitepress.dev/reference/default-theme-home-page)
- [VitePress Build-Time Data Loading](https://vitepress.dev/guide/data-loading)
- [vitepress-theme-teek](https://github.com/Kele-Bingtang/vitepress-theme-teek)
- [vitepress-theme-trigger](https://github.com/laplacetw/vitepress-theme-trigger)
- [Nólëbase Integrations](https://github.com/nolebase/integrations)
- [OpenAI Agent Skills](https://github.com/openai/skills)
