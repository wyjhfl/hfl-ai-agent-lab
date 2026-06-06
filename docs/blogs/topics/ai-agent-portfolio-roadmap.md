# AI Agent 求职作品集路线：从知识库到可讲清楚的项目矩阵

## 这篇文章解决什么问题

想找 AI Agent / 大模型应用开发岗位，最容易犯的错误是只堆概念：

- 会 LangChain。
- 会 RAG。
- 会 Function Calling。
- 会 MCP。
- 会提示词工程。

这些词单独看都不弱，但放在简历和面试里容易变成“只会调用框架”。真正有说服力的作品集应该能证明三件事：

1. 你理解 AI Agent 的系统分层。
2. 你做过可运行、可测试、可追踪的项目。
3. 你能把项目讲成业务问题、工程方案和评估结果。

这篇文章把个人博客、项目 A、项目 B、面试题库、Skills/MCP 内容串成一条求职作品集路线。

## 作品集不应该只有项目链接

很多人的作品集只有 GitHub 链接和 README。问题是面试官没有时间完整跑项目，也不会自动理解项目亮点。

一个面向 AI Agent 岗位的作品集至少要有四层：

| 层级 | 作用 | 站内对应内容 |
|---|---|---|
| 知识体系 | 证明你理解概念和边界 | [AI Agent 学习路线](/note/AI-Agent/) |
| 工程笔记 | 证明你知道怎么落地 | [工程化笔记](/note/Engineering/) |
| 项目实战 | 证明你能把系统做出来 | [项目实战](/projects) |
| 面试表达 | 证明你能讲清楚价值 | [AI Agent 面试题库](/note/AI-Interview/) |

博客不是附属品，而是项目的说明书和证据链。它把“我做了一个项目”变成“我知道为什么这么设计、怎么验证、怎么改进”。

## 推荐项目矩阵

求职作品集不需要十个半成品，更需要 2 到 3 个完整项目，每个项目覆盖不同能力。

| 项目 | 证明的能力 | 面试中怎么讲 |
|---|---|---|
| RAG 工单/售后诊断系统 | 文档解析、检索、引用、评测、工单生成 | 我能把企业知识库接入业务流程，而不是只做聊天问答 |
| 多 Agent 运营中台 Copilot | 任务拆解、工具权限、Trace、人工审批、多 Agent 协作 | 我能设计可控的 Agent 执行系统 |
| 论文/知识助手 | 长文解析、结构化总结、引用溯源、研究工作流 | 我能处理复杂知识输入和研究型任务 |
| AI Exam Agent | 题目解析、知识点映射、答题评测、错题闭环 | 我能把 Agent 用到教育评测场景 |
| 个人博客知识库 | 学习路线、专题沉淀、面试题库、项目表达 | 我能持续沉淀工程认知并组织知识 |

最强的组合不是“项目越多越好”，而是每个项目都有明确定位。

## 一个合格 AI Agent 项目应该展示什么

### 1. 业务问题

不要一上来讲技术栈。先讲问题：

> 设备售后场景中，工程师需要从大量手册和历史工单中找故障原因，人工检索慢，答案缺少引用，生成工单质量不稳定。

业务问题讲清楚后，RAG、评测、引用、Trace 才有意义。

### 2. 系统架构

至少能画出：

- API 层。
- 任务层。
- RAG 检索层。
- Agent Runtime。
- Tool/MCP 层。
- Trace/Evaluation。
- 数据库和向量库。
- 前端展示。

面试官关注的是你有没有分层意识，而不是用了多少框架。

### 3. 核心链路

每个项目都要能讲一条端到端链路。

RAG 项目链路：

```text
文档上传 -> 文档解析 -> Chunk -> Embedding -> 检索 -> Rerank -> 引用组装 -> LLM 生成 -> 评测 -> 反馈沉淀
```

多 Agent 项目链路：

```text
用户任务 -> Planner 拆解 -> Agent 分工 -> Tool 调用 -> Trace 记录 -> 人工审批 -> 结果聚合 -> Evaluation
```

### 4. 可验证证据

项目不能只说“效果不错”。需要证据：

- 单元测试。
- smoke test。
- demo 脚本。
- 截图或录屏。
- Trace 示例。
- 评测样本。
- release notes。
- runbook。

这些证据会让面试表达从“我做过”变成“我能证明”。

## 博客内容应该如何支撑求职

个人博客应该承担三类任务：

### 知识地图

让面试官看到你不是零散学习，而是有结构地理解 Agent：

- [Agent Runtime](/topics/agent-runtime-explained)
- [Tool Calling 工程化](/topics/tool-calling-engineering)
- [Memory 与 State](/topics/memory-state-agent)
- [Agent Trace](/topics/agent-trace-observability)
- [Evaluation Pipeline](/topics/evaluation-pipeline)

### 工程落地

让面试官看到你知道系统怎么上线：

- [FastAPI 到 Agent Backend](/topics/fastapi-agent-backend)
- [Agent 数据库设计](/topics/agent-database-design)
- [Docker 部署工程化](/topics/docker-agent-deployment)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [Skills 编写](/note/AI-Tools/skill-authoring)

### 面试表达

让面试官看到你能把项目讲清楚：

- [Agent 系统设计面试题](/topics/agent-system-design-interview)
- [RAG 项目面试表达](/topics/rag-project-interview)
- [多 Agent 项目面试表达](/topics/multi-agent-interview)
- [项目 B 一分钟介绍](/note/Interview/project-b-one-minute)
- [简历描述模板](/note/Interview/resume-bullets)

## 简历项目描述模板

### RAG 项目模板

```text
企业设备售后诊断 RAG 工单系统：
负责构建从文档解析、Chunk、Embedding、向量检索、Rerank、引用溯源到工单生成的完整链路；
设计文档、Chunk、检索结果、回答引用、用户反馈和评测结果的数据模型；
补充 Trace 与 Evaluation，用于定位召回失败、引用缺失和答案质量问题；
通过 Docker Compose 提供本地可运行环境，并沉淀 smoke test 和上线检查清单。
```

### 多 Agent 项目模板

```text
多 Agent 运营中台 Copilot：
设计任务拆解、Agent 分工、工具权限、执行 Trace、人工审批和结果聚合流程；
将工具调用抽象为可审计的服务接口，记录 run/step/tool_call 级执行轨迹；
补充评测样本和运营 runbook，用于验证任务完成质量、失败恢复和操作可追溯性；
项目重点不是多角色聊天，而是生产级 Agent 的可控执行和治理。
```

### 个人博客模板

```text
HFL AI Agent Lab：
基于 VitePress 构建 AI Agent 工程知识库，系统沉淀 RAG、Tool Calling、MCP、Agent Runtime、Trace、Evaluation、Multi-Agent 和求职面试内容；
按学习路线、工程化笔记、源码拆解、专题文章、面试题库和项目实战组织站点；
通过持续内容批次、构建检查和 Git 版本管理维护个人 AI Agent 作品集。
```

## 面试官追问与回答方向

| 追问 | 回答重点 |
|---|---|
| 你这个项目和普通 ChatBot 有什么区别？ | 强调 RAG、工具、状态、Trace、Evaluation、业务闭环 |
| 你怎么评估效果？ | 讲测试集、人工标注、引用准确率、失败样本库、版本对比 |
| Agent 调工具怎么控制风险？ | 讲权限分级、人工审批、参数校验、审计日志、幂等 |
| 为什么要用 MCP？ | 讲工具接入标准化、Tools/Resources/Prompts 区分、可复用能力 |
| 多 Agent 怎么避免失控？ | 讲任务状态机、角色边界、工具权限、Trace、结果聚合 |
| 线上出问题怎么排查？ | 讲 run_id、step_id、tool_call、检索结果、模型输入输出、错误分类 |

## 30 天作品集补强路线

| 时间 | 目标 | 产出 |
|---|---|---|
| 第 1 周 | 修项目 README 和 demo 路线 | 每个项目有定位、架构、启动命令、截图或示例 |
| 第 2 周 | 补 Trace 和评测证据 | 至少一条可复盘执行链路、一组评测样本 |
| 第 3 周 | 补博客专题 | RAG、MCP、Skills、Agent Runtime、面试表达各有入口 |
| 第 4 周 | 补简历和面试稿 | 一分钟介绍、深挖版、追问答案、STAR 项目经历 |

每一周都应该能提交一个完整批次，而不是每天零散改一点。

## 作品集检查清单

- GitHub 主页能看到核心项目。
- 每个项目 README 第一屏能说明项目价值。
- 项目能本地启动或至少有 demo 脚本。
- 有架构图或链路说明。
- 有测试或 smoke test。
- 有 Trace / Evaluation / Runbook 证据。
- 博客里能解释项目背后的工程方法。
- 简历表达和项目事实一致。
- 面试时能讲清楚取舍和失败案例。
- 不夸大模型效果，不把 Demo 说成生产系统。

## 面试表达

可以这样总结个人作品集：

> 我的作品集不是单个 Demo，而是围绕 AI Agent 工程能力组织的项目矩阵。项目 A 证明我能做 RAG 工程链路，项目 B 证明我理解多 Agent 执行、工具权限和 Trace，个人博客证明我能持续沉淀学习路线、工程方法和面试表达。我会把每个项目都补齐 README、架构链路、可运行脚本、测试、Trace 和评测证据，确保面试时不仅能说“我做过”，还能解释为什么这么设计、怎么验证效果、线上失败怎么排查。

## 相关链接

- [项目实战](/projects)
- [AI Agent 学习路线](/note/AI-Agent/)
- [AI Agent 工程化笔记](/note/Engineering/)
- [AI Agent 面试题库](/note/AI-Interview/)
- [Skills 编写](/note/AI-Tools/skill-authoring)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)

