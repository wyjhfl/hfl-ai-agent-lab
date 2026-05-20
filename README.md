# HFL AI Agent Lab

AI Agent 工程知识库 · 多 Agent 项目展示 · 求职作品集

## 项目定位

这是我的个人技术知识库和项目展示站，主要用于沉淀 AI Agent、Multi-Agent、LangGraph、RAG、LLM 应用工程和后端工程化相关内容。

## 线上访问

- 首页：https://hfl-ai-agent-lab.vercel.app
- 首页（备用）：https://hfl-ai-agent-lab.vercel.app/home

## 当前阶段

- v0.1：完成站点基础改造
- v0.2：完成知识库骨架
- v0.3-lite：完成非项目 B 内容初稿，项目 B 仅保留占位
- v0.3.1：旧内容隔离与公开展示准备
- v0.3.2：公开展示页面优化完成
- v0.4：Vercel 部署上线完成
- v0.5：线上展示体验基础优化中

## 内容模块

- AI Agent 学习路线
- Agent 源码拆解
- 项目实战
- 工程化笔记
- 面试表达
- 求职作品集

## 目录结构

```
docs/
  index.md             # 首页（根路径 /）
  note/
    AI-Agent/          # AI Agent 学习路线与核心概念
    Source-Reading/    # 开源项目源码拆解
    Engineering/       # 工程化笔记（FastAPI、RAG、Docker 等）
    Interview/         # 面试表达与简历描述
  blogs/
    projects/          # 项目实战详情页
    home.md            # 首页（备用路径 /home）
    about.md           # 关于页面
    projects.md        # 项目总览页
archive/               # 旧内容归档，不参与站点主线展示
```

## 技术栈

- VitePress
- Vue
- Tailwind CSS
- Markdown
- Vercel

## 本地开发

```bash
npm install
npm run docs:dev
```

## 构建

```bash
npm run docs:build
npm run docs:preview
```

## 部署

推荐使用 Vercel 部署。

Vercel 项目配置：

- Install Command: `npm install`
- Build Command: `npm run docs:build`
- Output Directory: `docs/.vitepress/dist`
- Node.js Version: 20 或 22
