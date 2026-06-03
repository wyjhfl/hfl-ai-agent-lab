# 博客专题

这里整理 HFL AI Agent Lab 中适合对外传播的长文专题。专题文章用于把学习路线、工程化笔记、源码拆解和面试题库串起来，帮助读者从单点知识过渡到完整工程理解。

## 推荐阅读顺序

1. [RAG 工程化：从文档到可评估答案](/topics/rag-engineering-system)
2. [Agent Trace：如何让 Agent 执行过程可观测](/topics/agent-trace-observability)
3. [Evaluation Pipeline：Agent 效果怎么评估](/topics/evaluation-pipeline)
4. [从 RAG 到生产级 Agent Harness 的工程化学习路线](/topics/rag-to-agent-harness)
5. [Hermes Agent 高级用法与进阶玩法](/note/Source-Reading/hermes-agent-advanced)
6. [OpenClaw 架构拆解：复杂 Agent 系统怎么分层](/topics/openclaw-architecture)
7. [Hook 机制为什么是 Agent Harness 最重要的资产](/topics/agent-harness-hooks)

## 当前专题

| 专题 | 内容 | 适合读者 |
|---|---|---|
| [RAG 工程化：从文档到可评估答案](/topics/rag-engineering-system) | 从文档解析、Chunk、Embedding、检索、重排、引用、评测和失败样本库理解生产级 RAG。 | 想做 RAG 项目、理解 RAG 工程全链路的人 |
| [Agent Trace：如何让 Agent 执行过程可观测](/topics/agent-trace-observability) | 用 Run、Step、Tool Call、状态变化和错误事件记录 Agent 的完整执行轨迹。 | 想让 Agent 系统可调试、可审计、可优化的人 |
| [Evaluation Pipeline：Agent 效果怎么评估](/topics/evaluation-pipeline) | 从测试集、指标、自动评测、人工抽检、版本对比和失败样本库构建评测闭环。 | 想系统化评估 Agent / RAG 效果的人 |
| [从 RAG 到生产级 Agent Harness 的工程化学习路线](/topics/rag-to-agent-harness) | 整理从 RAG、Tool Calling、Memory、Agent Harness 到 Eval、Trace、Deploy 的工程学习路线。 | 想建立 AI Agent 工程学习地图的人 |
| [Hermes Agent 高级用法与进阶玩法](/note/Source-Reading/hermes-agent-advanced) | 整理子代理驱动开发、Kanban、多代理协作、TDD、MCP、Cron、Skills、安全控制等高级能力。 | 想理解 Agent Harness 高级能力的人 |
| [OpenClaw 架构拆解：复杂 Agent 系统怎么分层](/topics/openclaw-architecture) | 从 Gateway、Channel、Session、Agent Runtime、Workspace、Memory、Tools、Security、Evaluation 等角度理解复杂 Agent 系统分层。 | 想学习复杂 Agent 系统架构拆分的人 |
| [Hook 机制为什么是 Agent Harness 最重要的资产](/topics/agent-harness-hooks) | 从唯一真相源、MCP 工具边界和 Hook 治理层三个角度，整理 Agent Harness 的规则落地方式。 | 想把 Agent 从 Prompt Demo 推向可控系统的人 |

## 如何配合站内内容阅读

| 阅读目标 | 建议路径 |
|---|---|
| 建立学习主线 | [AI Agent 学习路线](/note/AI-Agent/) → 专题文章 → 工程化笔记 |
| 学工程落地 | [工程化笔记](/note/Engineering/) → RAG / Trace / Evaluation / Production 专题 |
| 准备面试 | [面试题库](/note/AI-Interview/) → 专题文章 → 源码拆解 |
| 看架构设计 | [源码拆解](/note/Source-Reading/) → Hermes / OpenClaw / Harness Engineering |
