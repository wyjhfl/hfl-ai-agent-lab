# AI Agent 面试题库

这个模块用于系统整理 AI Agent、RAG、LLM 工具调用、大模型工程、LangChain / LangGraph 相关面试题。

它和原来的"面试表达"不同：

- 面试表达：侧重项目怎么讲、简历怎么写、项目亮点怎么表达
- 面试题库：侧重技术概念、原理题、追问题、工程化理解和背诵版总结

## 当前分类

| 分类 | 覆盖内容 |
|---|---|
| Agent 面试题 | Agent 概念与架构、Workflow 与 Agent、ReAct、Plan-and-Execute、Reflection、任务拆分、记忆机制、Multi-Agent 协作 |
| Agent 面试追问库 | Agent vs ChatBot、什么时候不用 Agent、失败排查、评测、安全、成本、长任务恢复 |
| RAG 面试题 | RAG 原理、文档切割、Embedding、向量数据库、检索优化、Query Rewrite、多路召回、Reranking、幻觉规避、效果评估 |
| LLM 工具调用面试题 | Function Calling、Tools、MCP、A2A、Skills、SSE、WebSocket、WebRTC、LLM 网关 |
| 大模型工程面试题 | Transformer、Attention、KV Cache、LoRA、模型部署、推理加速、成本优化 |
| LangChain / LangGraph 面试题 | Chain、Agent、Tool、Graph、State、Checkpoint、Human-in-the-loop、框架选型 |

## 统一整理模板

每篇题库文章按照以下结构整理：

1. 高频问题地图
2. 核心概念速记
3. 标准回答模板
4. 面试官追问
5. 工程化理解
6. 常见误区
7. 背诵版总结
8. 后续补充

## 当前状态

当前先建立题库结构，后续会根据历史对话素材和个人学习内容逐步补充正式题解。

## 第一轮已完成题解

| 分类 | 已完成 |
|---|---|
| Agent 面试题 | 5 道 |
| Agent 面试追问库 | 12 道追问 |
| RAG 面试题 | 5 道 |
| LLM 工具调用面试题 | 5 道 |
| 大模型工程面试题 | 4 道 |
| LangChain / LangGraph 面试题 | 4 道 |

本轮内容为 HFL AI Agent Lab 原创整理，参考公开面试题方向，但不复制外站正文。

## 求职作品集补充

面试题库解决“怎么回答技术问题”，作品集路线解决“怎么证明自己做过”。建议配合阅读：

- [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap)
- [AI Agent 项目选题库](/topics/ai-agent-project-ideas)
- [Agent 框架选型](/topics/agent-framework-selection)
- [Agent 协议全景](/topics/agent-protocol-landscape)
- [生产级 Agent 治理清单](/topics/production-agent-governance-checklist)
- [RAG 项目面试表达](/topics/rag-project-interview)
- [多 Agent 项目面试表达](/topics/multi-agent-interview)
- [项目 B 一分钟介绍](/note/Interview/project-b-one-minute)
- [简历描述模板](/note/Interview/resume-bullets)

## 如何配合学习路线和工程化笔记复习

不要只背题。建议按照以下路径复习：

1. **先看学习路线理解概念** — 知道这个技术是什么、为什么需要
2. **再看工程化笔记理解落地** — 知道在真实项目中怎么设计和实现
3. **最后看面试题库练表达** — 知道怎么用简洁的语言回答面试官

| 面试题分类 | 推荐先读 | 推荐工程化补充 |
|---|---|---|
| [Agent 面试题](/note/AI-Interview/agent-interview) | [Agent 基础](/note/AI-Agent/agent-basic)、[Multi-Agent](/note/AI-Agent/multi-agent)、[Evaluation](/note/AI-Agent/evaluation) | [Agent Trace](/note/Engineering/agent-trace)、[Evaluation Pipeline](/note/Engineering/eval-pipeline) |
| [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) | [Context Engineering](/note/AI-Agent/context-engineering)、[Agent Runtime](/note/AI-Agent/agent-runtime) | [LLM Gateway](/note/Engineering/llm-gateway)、[Agent Trace](/note/Engineering/agent-trace) |
| Agent 协议与工具生态 | [Tool Calling](/note/AI-Agent/tool-calling)、[Browser / Computer Use Agent](/note/AI-Agent/browser-computer-use-agent) | [Agent 协议全景](/topics/agent-protocol-landscape)、[MCP Server 创建实战](/note/Engineering/mcp-server-build-guide) |
| Agent 安全与治理追问 | [Guardrails / Safety](/note/AI-Agent/guardrails)、[Human-in-the-loop](/note/AI-Agent/human-in-the-loop) | [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)、[生产级 Agent 治理清单](/topics/production-agent-governance-checklist) |
| [RAG 面试题](/note/AI-Interview/rag-interview) | [RAG](/note/AI-Agent/rag) | [RAG 工程化](/note/Engineering/rag-engineering)、[向量数据库](/note/Engineering/vector-database) |
| RAG / Fine-tuning 取舍 | [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning) | [Eval Dataset 设计](/note/Engineering/eval-dataset-design)、[LLM Gateway](/note/Engineering/llm-gateway) |
| [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) | [Tool Calling](/note/AI-Agent/tool-calling) | [API 安全](/note/Engineering/api-security)、[MCP Server](/note/Engineering/mcp-server) |
| [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) | [Production Engineering](/note/AI-Agent/production) | [Docker 部署](/note/Engineering/docker-deploy)、[可观测性](/note/Engineering/observability)、[上线检查清单](/note/Engineering/production-checklist) |
| [LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview) | [LangGraph](/note/AI-Agent/langgraph)、[Human-in-the-loop](/note/AI-Agent/human-in-the-loop) | [Agent Trace](/note/Engineering/agent-trace)、[Evaluation Pipeline](/note/Engineering/eval-pipeline) |
