# UI Design Skill 调研：把界面优化沉淀成可复用流程

> 目标：把“优化博客 UI”从临时审美判断，沉淀成一个可复用 Skill：每次改页面前检查信息架构、可访问性、视觉层级、响应式、元数据和构建验证。

## 调研结论

当前站点不适合直接更换整套主题。更稳的路线是继续扩展 VitePress 默认主题：保留导航、搜索、侧边栏和 Markdown 渲染稳定性，在关键页面增加自定义卡片、路径看板、项目证据包和产品化 UI mockup。

## 可借鉴的开源方向

| 来源 | 可借鉴点 | 本站采用方式 |
|---|---|---|
| VitePress 默认主题扩展 | layout slots、home、page、自定义组件、CSS 变量 | 保留默认主题，扩展 `HomeShowcase` 和 `custom.css` |
| vitepress-theme-teek | 博客增强、卡片、归档、主题细节 | 借鉴信息密度和卡片布局，不整体替换主题 |
| Nólëbase Integrations | Git changelog、页面增强、阅读体验 | 后续可选择性接入增强组件 |
| UI / Frontend Skills | accessibility、metadata、motion、responsive check | 沉淀为本站 UI Review Checklist |
| Design token 系统 | color、radius、shadow、spacing、dark mode | 统一 `--hfl-*` CSS 变量，减少随意样式 |

## HFL UI Review Skill 草案

```text
hfl-vitepress-ui-review/
  SKILL.md
  references/
    vitepress-theme-patterns.md
    accessibility-checklist.md
    portfolio-information-architecture.md
  scripts/
    count-docs.mjs
    verify-links.mjs
```

## Skill 触发场景

- 用户要求优化 UI、首页、项目页、专题页或导航。
- 新增大量内容后需要重组信息架构。
- 需要把普通文档页升级成作品集页面。
- 构建前需要检查页面入口、死链、统计数字和生成目录忽略状态。

## Review Checklist

### 1. 信息架构

- [ ] 页面第一屏是否说明“给谁看、解决什么问题”。
- [ ] 是否有 3-6 个优先入口，而不是纯列表。
- [ ] 是否能从首页进入项目、学习、专题、面试、工具。
- [ ] 新内容是否接入 nav、sidebar、topic index 或 homepage。

### 2. 视觉层级

- [ ] 是否有 hero / card / matrix / CTA 区分层级。
- [ ] 卡片标题是否能快速扫读。
- [ ] 长表格是否可横向滚动。
- [ ] 深色模式是否保持对比度。

### 3. Agent 作品集表达

- [ ] 是否把技术点映射到项目证据。
- [ ] 是否包含架构、Demo、Trace / Eval、失败恢复和面试讲法。
- [ ] 是否避免“只列技术栈”。

### 4. 构建验证

- [ ] `npm run docs:build` 通过。
- [ ] `docs/.vitepress/dist/` 保持 ignored。
- [ ] `docs/blogs/public/blog-index/` 保持 ignored。
- [ ] 首页统计与实际 Markdown 数量一致。

## 推荐默认流程

1. 先看当前页面入口和 git 状态。
2. 选择本轮优化目标：内容导航、项目展示、专题地图、面试路径、UI 组件。
3. 新增内容时同步更新索引和导航。
4. 更新 `custom.css` 时优先复用现有 design tokens。
5. 构建验证后再提交推送。


## Agent UI 开源组件补充调研

| 项目 | 定位 | 对本站启发 |
|---|---|---|
| assistant-ui | 面向生产 AI Chat 的 React 组件和 runtime 抽象 | 说明 Agent UI 不只是消息气泡，还需要 thread、tool result、runtime、attachments 和 actions |
| Vercel AI Elements | 基于 shadcn/ui 的 AI UI primitives | 可借鉴 Reasoning、Conversation、Prompt Input、Response Actions 等组合方式 |
| CopilotKit | 面向应用内 Copilot、Generative UI、shared state 和 HITL | Project B 的审批卡、业务状态联动和 agentic UI 可以参考其模式 |
| LangGraph Studio | 面向 LangGraph 应用的调试和可视化 | Project B Trace Drawer / 状态机视图可以参考其 run debugging 思路 |

## 更新后的 UI Skill 建议

HFL UI Review Skill 后续不只检查博客页面美观，还要检查 Agent 产品页面是否包含：

- chat / task input
- agent progress timeline
- tool call inspector
- evidence drawer
- human approval modal
- trace / replay view
- eval / release gate summary

这类结构可以让作品集页面更接近真实 Agent 产品，而不是纯文字架构图。

## 新增参考资料

- [assistant-ui Documentation](https://www.assistant-ui.com/docs)
- [Vercel AI Elements](https://ai-sdk.dev/elements/overview)
- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [LangGraph Studio](https://docs.langchain.com/langgraph-platform/langgraph-studio)


## 面试表达

> 我把个人站 UI 优化当成一个可复用工作流，而不是每次凭感觉改样式。每次新增内容后，我会检查首页入口、专题地图、项目证据链、面试表达路径和构建结果，确保站点持续从知识库升级成作品集。

## 参考资料

- [VitePress Extending Default Theme](https://vitepress.dev/guide/extending-default-theme)
- [VitePress Default Theme Layout](https://vitepress.dev/reference/default-theme-layout)
- [vitepress-theme-teek](https://vp.teek.top/)
- [Nólëbase Integrations](https://nolebase-integrations.ayaka.io/)
- [Agent Skills Best Practices](https://agentskills.io/skill-creation/best-practices)
