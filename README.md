<p align="center">
  <strong>HFL AI Agent Lab</strong><br/>
  AI Agent 工程知识库 · 面试题库 · 项目展示站
</p>

<p align="center">
  <a href="https://hfl-ai-agent-lab.vercel.app">在线访问</a>
  ·
  <a href="https://hfl-ai-agent-lab.vercel.app/home">备用入口</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VitePress-1.6-blue" alt="VitePress" />
  <img src="https://img.shields.io/badge/Vue-3.5-green" alt="Vue" />
  <img src="https://img.shields.io/badge/Markdown-Content-555" alt="Markdown" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000" alt="Vercel" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" alt="Build" />
</p>

---

## 项目定位

HFL AI Agent Lab 是围绕 AI Agent、RAG、Tool Calling、LangGraph、Multi-Agent、工程化落地和面试题库构建的个人知识库与作品集站点。

目标是系统沉淀 AI Agent 工程能力，将学习路线、工程化笔记、面试题库、源码拆解和项目实战整合为一个可公开展示的技术作品集。

## 在线访问

- 首页：https://hfl-ai-agent-lab.vercel.app
- 备用入口：https://hfl-ai-agent-lab.vercel.app/home

## 核心模块

| 模块 | 内容 |
|---|---|
| 学习路线 | AI Agent、RAG、Tool Calling、LangGraph、Multi-Agent、Evaluation |
| 工程化笔记 | FastAPI、RAG 工程化、Docker、可观测性、MCP Server、上线检查清单 |
| 面试题库 | Agent、RAG、LLM 工具调用、大模型工程、LangChain / LangGraph |
| 源码拆解 | Hermes Agent、Harness Engineering、OpenClaw |
| AI 工具 | Claude Code、Codex、AI Coding Workflow |
| 项目实战 | 项目 A / 项目 B 入口预留 |

## 推荐阅读路径

| 目标 | 推荐路径 |
|---|---|
| 系统学习 AI Agent | 学习路线 → Agent 基础 → Tool Calling → LangGraph → Multi-Agent |
| 学工程落地 | 工程化笔记 → FastAPI → RAG 工程化 → Agent Trace → Production Checklist |
| 准备面试 | 面试题库 → Agent 面试题 → RAG 面试题 → LLM 工具调用面试题 |
| 看源码拆解 | 源码拆解 → Hermes Agent → Harness Engineering → OpenClaw |

## 当前内容完成度

| 方向 | 状态 |
|---|---|
| 学习路线 | 已完成第一轮工程学习地图 |
| 工程化笔记 | 已完成第二轮扩展 |
| 面试题库 | 已完成第一轮原创题解 |
| 源码拆解 | 已导入 Hermes / Harness / OpenClaw 第一轮正文 |
| AI 工具 | 已建立 Claude Code / Codex / Workflow 入口 |
| 项目实战 | 项目 A / 项目 B 当前保持预留 |

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
- v1.7：AI Agent 学习路线总览升级完成
- v1.8：工程化笔记第二轮扩展完成
- v1.9：学习路线、工程化笔记、面试题库互链完成
- v2.0：GitHub README 与网站页面装饰优化完成

## 技术栈

- **VitePress** — 静态站点生成
- **Vue 3** — 前端框架
- **Markdown** — 内容编写
- **Vercel** — 部署与托管
- **Node.js** — 构建运行时

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
