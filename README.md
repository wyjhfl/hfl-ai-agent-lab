# HFL AI Agent Lab

**AI Agent 工程知识库 · 多 Agent 项目展示 · 求职作品集**

![VitePress](https://img.shields.io/badge/VitePress-1.6-blue)
![Vue](https://img.shields.io/badge/Vue-3.5-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)
![Markdown](https://img.shields.io/badge/Markdown-Content-555)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

**在线访问：** [https://hfl-ai-agent-lab.vercel.app](https://hfl-ai-agent-lab.vercel.app) ｜ [备用入口 /home](https://hfl-ai-agent-lab.vercel.app/home)

---

## 项目定位

HFL AI Agent Lab 是围绕 AI Agent、Multi-Agent、LangGraph、RAG、LLM 应用工程和后端工程化搭建的个人知识库与作品集站点。

目标是系统沉淀 AI Agent 工程能力，将学习路线、源码拆解、工程化笔记和项目实战整合为一个可公开展示的技术作品集。

## 核心模块

| 模块 | 内容 |
|------|------|
| AI Agent 学习路线 | Agent 基础、Prompt Engineering、Tool Calling、LangGraph、Multi-Agent、Evaluation |
| Agent 源码拆解 | Hermes Agent、Harness Engineering、OpenClaw |
| AI 编程工具 | Claude Code、Codex、AI Coding Workflow |
| 工程化笔记 | FastAPI、RAG 工程化、Docker 部署、可观测性 |
| 项目实战 | 项目 A（RAG 工单系统）已预留，项目 B（多 Agent Copilot）当前仅保留入口 |
| 面试题库 | Agent / RAG / LLM 工具 / 大模型工程 / LangChain 高频面试题 |

## 当前阶段

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

## 已完成内容

- AI Agent 学习路线基础内容
- Prompt Engineering 完整文章
- Tool Calling 完整文章
- LangGraph 完整文章
- Multi-Agent 完整文章
- Evaluation 完整文章
- FastAPI 工程化笔记
- RAG 工程化笔记
- Docker 部署笔记
- Observability 可观测性笔记
- 项目 B 占位页面
- Vercel 部署上线

## 项目 B 当前状态

项目 B 当前只保留入口和路线占位，暂不展开正式架构和实现细节。后续版本将逐步补充 Agent 分工、状态机设计、工具调用链路和 Trace 机制。

## 技术栈

- **VitePress** — 静态站点生成
- **Vue 3** — 前端框架
- **Tailwind CSS** — 样式
- **Markdown** — 内容编写
- **Vercel** — 部署与托管
- **Node.js** — 构建运行时

## 目录结构

```text
docs/
├── blogs/
│   ├── home.md
│   ├── about.md
│   ├── projects.md
│   └── projects/
├── note/
│   ├── AI-Agent/
│   ├── Source-Reading/
│   ├── Engineering/
│   ├── AI-Tools/
│   └── AI-Interview/
├── .vitepress/
└── public/

archive/
└── old-content/
```

`archive/` 为旧内容归档，不参与站点主线展示。

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
|--------|-----|
| Install Command | `npm install` |
| Build Command | `npm run docs:build` |
| Output Directory | `docs/.vitepress/dist` |
| Node.js Version | 20 或 22 |
