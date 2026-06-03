<div align="center">

# HFL AI Agent Lab

**AI Agent 工程知识库 · 面试题库 · 源码拆解 · 项目作品集**

从学习路线、工程化笔记、源码拆解到面试题库，系统沉淀 AI Agent / RAG / Multi-Agent / LangGraph / MCP / Evaluation 等方向的工程能力。

[在线访问](https://hfl-ai-agent-lab.vercel.app/home) ·
[学习路线](https://hfl-ai-agent-lab.vercel.app/note/AI-Agent/) ·
[专题文章](https://hfl-ai-agent-lab.vercel.app/topics/) ·
[源码拆解](https://hfl-ai-agent-lab.vercel.app/note/Source-Reading/) ·
[面试题库](https://hfl-ai-agent-lab.vercel.app/note/AI-Interview/)

![VitePress](https://img.shields.io/badge/VitePress-Docs-646CFF)
![AI Agent](https://img.shields.io/badge/AI%20Agent-Lab-7C3AED)
![RAG](https://img.shields.io/badge/RAG-Engineering-0EA5E9)
![Status](https://img.shields.io/badge/status-building-22C55E)

</div>

## 项目定位

HFL AI Agent Lab 是一个围绕 AI Agent 工程能力建设的个人知识库和作品集站点。

它不是单纯的学习笔记，而是把 AI Agent 学习路线、工程化实践、源码拆解、面试题库和项目实战统一沉淀到一个可持续维护的网站中。

## 项目亮点

- 系统化整理 AI Agent 学习路线：从 RAG、Tool Calling 到 Multi-Agent、Evaluation、Production。
- 持续沉淀工程化笔记：FastAPI、Docker、Agent Trace、MCP Server、异步任务、上线检查清单。
- 拆解真实 Agent 项目：Hermes Agent、Harness Engineering、OpenClaw。
- 建设面试题库：覆盖 Agent、RAG、工具调用、大模型工程、LangChain / LangGraph。
- 对接项目实战：项目 A RAG 工单系统、项目 B 多 Agent Copilot 逐步展开。
- 适合作为 AI Agent 开发 / 大模型应用开发方向的求职作品集。

## 适合谁阅读

- 正在系统学习 AI Agent 工程的同学
- 准备 AI Agent / 大模型应用开发岗位面试的人
- 想了解 RAG、Tool Calling、Multi-Agent、Evaluation 工程化的人
- 想参考个人技术作品集结构的人

## 代表内容

- [从 RAG 到生产级 Agent Harness 的工程化学习路线](https://hfl-ai-agent-lab.vercel.app/topics/rag-to-agent-harness)
- [Hermes Agent 高级用法与进阶玩法](https://hfl-ai-agent-lab.vercel.app/note/Source-Reading/hermes-agent-advanced)
- [OpenClaw 架构拆解：复杂 Agent 系统怎么分层](https://hfl-ai-agent-lab.vercel.app/topics/openclaw-architecture)
- [AI Agent 面试题库](https://hfl-ai-agent-lab.vercel.app/note/AI-Interview/)

## 在线访问

- 站点首页：https://hfl-ai-agent-lab.vercel.app/home
- GitHub 仓库：https://github.com/wyjhfl/hfl-ai-agent-lab

## 核心模块

| 模块 | 内容 | 入口 |
|---|---|---|
| AI Agent 学习路线 | Agent 基础、RAG、Tool Calling、Multi-Agent、Evaluation、Production | [./docs/note/AI-Agent/](./docs/note/AI-Agent/) |
| 专题文章 | RAG 到 Agent Harness、OpenClaw 架构拆解等长文专题 | [./docs/blogs/topics/](./docs/blogs/topics/) |
| 源码拆解 | Hermes Agent、Harness Engineering、OpenClaw | [./docs/note/Source-Reading/](./docs/note/Source-Reading/) |
| 工程化笔记 | FastAPI、Docker、Trace、MCP、异步任务、上线检查 | [./docs/note/Engineering/](./docs/note/Engineering/) |
| 面试题库 | Agent、RAG、工具调用、大模型工程、LangChain / LangGraph | [./docs/note/AI-Interview/](./docs/note/AI-Interview/) |
| 项目实战 | 项目 A、项目 B 展示入口 | [./docs/blogs/projects.md](./docs/blogs/projects.md) |

## 推荐专题

| 专题 | 说明 |
|---|---|
| [从 RAG 到生产级 Agent Harness 的工程化学习路线](https://hfl-ai-agent-lab.vercel.app/topics/rag-to-agent-harness) | 梳理 RAG、Tool Calling、Memory、Agent Harness、Multi-Agent、Eval、Trace、Safety、Deploy |
| [Hermes Agent 高级用法与进阶玩法](https://hfl-ai-agent-lab.vercel.app/note/Source-Reading/hermes-agent-advanced) | 整理子代理驱动开发、Kanban、多代理协作、TDD、MCP、Cron、Skills、安全控制等高级能力 |
| [OpenClaw 架构拆解：复杂 Agent 系统怎么分层](https://hfl-ai-agent-lab.vercel.app/topics/openclaw-architecture) | 从 Gateway、Channel、Session、Agent Runtime、Workspace、Memory、Tools、Security、Evaluation 理解复杂 Agent 系统 |

## 推荐阅读路径

| 目标 | 阅读路径 |
|---|---|
| 系统学习 AI Agent | AI Agent 学习路线 → 工程化笔记 → 专题文章 |
| 准备面试 | 面试题库 → 工程化笔记 → 源码拆解 |
| 做项目 | 项目实战 → RAG 工程化 → Agent Trace → Evaluation |
| 读源码 | Source-Reading → Hermes Agent → OpenClaw → Harness Engineering |

## 当前内容完成度

| 方向 | 状态 |
|---|---|
| 学习路线 | 已形成 AI Agent 工程学习主线 |
| 工程化笔记 | 已扩展 FastAPI、RAG、Trace、MCP、异步任务、上线检查等方向 |
| 面试题库 | 已完成第一轮原创题解 |
| 源码拆解 | 已覆盖 Hermes Agent / Harness Engineering / OpenClaw |
| 专题文章 | 已沉淀 RAG 工程化、Agent Trace、Evaluation Pipeline、RAG → Agent Harness、OpenClaw 架构等长文专题 |
| 项目实战 | 项目 A / 项目 B 保持逐步展开 |

## 项目实战

- **项目 A：RAG 工单系统** — 作为 RAG 工程化项目入口，重点验证文档解析、检索、引用、质量评估和工单生成链路。
- **项目 B：多 Agent 运营中台 Copilot** — 当前保持占位，不在本轮展开，后续用于承载 Multi-Agent、权限、Trace、Evaluation 等工程能力。

## 技术栈

- **VitePress** — 文档站与作品集站点生成
- **Markdown** — 内容沉淀与结构化写作
- **TypeScript** — 站点配置与主题扩展
- **Vercel** — 站点部署与托管
- **AI Agent / RAG / Multi-Agent / MCP / Evaluation** — 内容主线与工程方向

## 本地开发

```bash
npm install
npm run docs:dev
```

## 构建与预览

```bash
npm run docs:build
npm run docs:preview
```

## 部署

推荐使用 Vercel 部署。

| 配置项 | 值 |
|---|---|
| Install Command | `npm install` |
| Build Command | `npm run docs:build` |
| Output Directory | `docs/.vitepress/dist` |
| Node.js Version | 20 或 22 |

## 建设记录

<details>
<summary>展开查看版本记录</summary>

- v0.1：站点基础改造完成
- v0.2：知识库骨架完成
- v0.3-lite：非项目 B 内容初稿完成，项目 B 仅保留占位
- v0.3.1：旧内容隔离与公开展示准备完成
- v0.3.2：公开展示页面优化完成
- v0.4：Vercel 部署上线完成
- v0.5：线上展示体验基础优化完成
- v0.6：AI Agent 核心知识文章打磨完成
- v0.7：工程化笔记质量提升完成
- v0.8：GitHub README 与网站首页展示优化完成
- v0.9：源码拆解栏目质量提升完成
- v1.0：网站导航、搜索、外链和公开访问体验检查完成
- v1.1-v1.4 修正版：Agent 拆解历史对话素材第一轮整理完成
- v1.5：AI Agent 面试题库模块改造完成
- v1.6：AI Agent 面试题库第一轮原创题解完成
- v1.7：AI Agent 学习路线总览升级完成
- v1.8：工程化笔记第二轮扩展完成
- v1.9：学习路线、工程化笔记、面试题库互链完成
- v2.0：GitHub README 与网站页面装饰优化完成
- v2.1：博客专题《从 RAG 到生产级 Agent Harness 的工程化学习路线》完成
- v2.3：Hermes Agent 高级用法与进阶玩法专题完成
- v2.4：OpenClaw 架构拆解专题完成
- v2.6：README 与首页 UI 作品集风格优化
- v2.8：Engineering 博客专题第一批完成，新增 RAG 工程化、Agent Trace、Evaluation Pipeline 三篇专题
- v2.9：AI Agent 核心概念专题第一批完成，新增 Agent Runtime、Tool Calling、Memory 与 State 三篇专题
- v3.0：AI 工具工作流专题第一批完成，新增 Claude Code 实战工作流、AI 编程审查清单、避免 AI 误提交和假验证三篇专题
- v3.1：面试表达专题第一批完成，新增 Agent 系统设计面试题、RAG 项目面试表达、多 Agent 项目面试表达三篇专题
- v3.2：专题入口重组与阅读路径优化完成，将专题页按 Engineering、AI Agent 核心概念、AI 工具工作流、面试表达、源码与架构进行分组，并补充推荐阅读路径
- v3.3：源码与架构横向对比专题完成，新增 Hermes vs OpenClaw、Agent Runtime 横向对比、Tool System 横向对比三篇专题

</details>
