# AI Agent 工程学习路线

## 这个模块解决什么问题

这个模块负责回答三个问题：

1. **学什么** — AI Agent 工程需要掌握哪些知识
2. **按什么顺序学** — 从基础到工程化的学习路径
3. **学到什么程度** — 每个阶段的学习目标和验收标准

它不是概念百科，而是一张工程学习地图，把零散的知识点串联成可执行的学习路径。

## 学习地图

| 阶段 | 学习主题 | 对应文章 | 学习目标 |
|---|---|---|---|
| 1 | LLM 应用基础 | [Agent 基础](/note/AI-Agent/agent-basic) | 理解 LLM 调用形态、上下文窗口、模型能力边界 |
| 2 | Prompt Engineering | [Prompt Engineering](/note/AI-Agent/prompt-engineering) | 掌握 Prompt 设计原则、结构化输出、Few-shot 技巧 |
| 3 | Context Engineering | [Context Engineering](/note/AI-Agent/context-engineering) | 理解任务上下文、RAG 证据、Memory、State、Trace 如何分层进入模型 |
| 4 | RAG | [RAG 基础](/note/AI-Agent/rag) | 理解检索增强生成的完整链路和工程化要点 |
| 5 | RAG vs Fine-tuning | [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning) | 区分外部知识检索和模型行为训练的适用边界 |
| 6 | Tool Calling | [Tool Calling](/note/AI-Agent/tool-calling) | 理解工具注册、参数生成、工具选择、结果回填 |
| 7 | Realtime Voice Agent | [Realtime Voice Agent](/note/AI-Agent/realtime-voice-agent) | 理解低延迟语音交互、打断、状态和工具调用 |
| 8 | Agent Runtime | [Agent Runtime](/note/AI-Agent/agent-runtime) | 理解 Agent 运行时循环、状态管理、工具编排和停止条件 |
| 9 | Memory / Persistence | [Memory / Persistence](/note/AI-Agent/memory) | 理解短期记忆、长期记忆、上下文压缩和持久化策略 |
| 10 | LangGraph 状态机 | [LangGraph 状态机](/note/AI-Agent/langgraph) | 掌握 State、Node、Edge、Checkpoint 的设计和使用 |
| 11 | Multi-Agent / Handoff | [Multi-Agent 架构](/note/AI-Agent/multi-agent) | 理解多 Agent 协作模式、调度策略、结果整合 |
| 12 | Guardrails / Human Approval | [Guardrails / Safety](/note/AI-Agent/guardrails)、[Human-in-the-loop](/note/AI-Agent/human-in-the-loop) | 理解安全边界、权限控制、Hook 拦截和人工审批 |
| 13 | Agent Harness | [Agent Harness 总览](/note/AI-Agent/agent-harness) | 理解 Runtime、Memory、Tool、Guardrails、Trace、Eval 如何组成生产级骨架 |
| 14 | Trace / Evaluation | [Trace 与 Evaluation](/note/AI-Agent/evaluation) | 理解 Trace 记录、自动评测、失败样本沉淀 |
| 15 | Production Engineering | [Production Engineering](/note/AI-Agent/production) | 理解部署、监控、成本控制、Prompt 管理 |

## 和工程化笔记的关系

学习路线关注“学什么”，工程化笔记关注“怎么做”。两者互为补充。

| 学习主题 | 对应工程化笔记 |
|---|---|
| RAG | [RAG 工程化](/note/Engineering/rag-engineering)、[向量数据库](/note/Engineering/vector-database) |
| RAG vs Fine-tuning | [Eval Dataset 设计](/note/Engineering/eval-dataset-design)、[LLM Gateway](/note/Engineering/llm-gateway) |
| Context Engineering | [Agent Trace](/note/Engineering/agent-trace)、[LLM Gateway](/note/Engineering/llm-gateway) |
| Tool Calling | [API 安全](/note/Engineering/api-security)、[MCP Server](/note/Engineering/mcp-server) |
| Agent Runtime | [Agent Trace](/note/Engineering/agent-trace)、[异步任务](/note/Engineering/async-task) |
| Memory / Persistence | [数据库设计](/note/Engineering/database)、[Agent Trace](/note/Engineering/agent-trace) |
| LangGraph / Multi-Agent | [Agent Trace](/note/Engineering/agent-trace)、[Eval Pipeline](/note/Engineering/eval-pipeline) |
| Guardrails / Safety | [API 安全](/note/Engineering/api-security)、[上线检查清单](/note/Engineering/production-checklist) |
| Agent Harness | [MCP Server](/note/Engineering/mcp-server)、[Agent Trace](/note/Engineering/agent-trace)、[Eval Pipeline](/note/Engineering/eval-pipeline) |
| Production Engineering | [FastAPI](/note/Engineering/fastapi)、[Docker 部署](/note/Engineering/docker-deploy)、[可观测性](/note/Engineering/observability) |

## 和面试题库的关系

学习路线建立知识体系，面试题库检验表达能力。学完一个主题后，可以通过对应面试题验证理解深度。

| 学习主题 | 对应面试题 |
|---|---|
| Agent 基础 | [Agent 面试题](/note/AI-Interview/agent-interview) |
| Context Engineering | [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) |
| RAG | [RAG 面试题](/note/AI-Interview/rag-interview) |
| RAG vs Fine-tuning | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |
| Tool Calling | [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) |
| LangGraph | [LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview) |
| Agent Harness / Guardrails | [Agent 面试题](/note/AI-Interview/agent-interview)、[大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |
| Production Engineering | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |

## 推荐学习顺序

**第一阶段：建立 LLM 应用基础**

先理解 LLM 调用的基本形态、上下文窗口和 Prompt Engineering。这是所有后续内容的基础。

**第二阶段：学习 RAG 和 Tool Calling**

RAG 让模型能结合外部知识回答问题，Tool Calling 让模型能调用外部工具执行操作。这两个是 Agent 的核心能力前置。

**第三阶段：进入 Agent Runtime、Memory 和 LangGraph**

在理解 RAG 和 Tool Calling 的基础上，学习 Agent 的运行循环、状态管理、记忆系统和流程编排。

**第四阶段：补齐 Guardrails、Harness、Trace / Evaluation**

这一阶段关注 Agent 如何从 Demo 变成工程系统：权限、审计、人工审批、执行轨迹、评测集和失败样本闭环。

**第五阶段：进入 Production Engineering 和项目实战**

最后补齐部署、监控、成本控制、回滚方案，并把知识点落到可展示项目中。

## 三大模块联动

站点由三个核心模块组成，分别解决学习、落地和表达三个问题：

- **学习路线**负责回答：学什么、按什么顺序学
- **工程化笔记**负责回答：怎么落地、怎么部署、怎么评估
- **面试题库**负责回答：怎么表达、怎么回答追问

三者不是孤立的，而是“学 → 做 → 答”的闭环。学完一个主题后，到工程化笔记看怎么落地，再到面试题库练怎么表达。

| 学习主题 | 学习路线 | 工程化笔记 | 面试题库 |
|---|---|---|---|
| Agent 基础 | [Agent 基础](/note/AI-Agent/agent-basic) | [Agent Trace](/note/Engineering/agent-trace) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| Prompt Engineering | [Prompt Engineering](/note/AI-Agent/prompt-engineering) | [上线检查清单](/note/Engineering/production-checklist) | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |
| Context Engineering | [Context Engineering](/note/AI-Agent/context-engineering) | [Agent Trace](/note/Engineering/agent-trace)、[LLM Gateway](/note/Engineering/llm-gateway) | [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) |
| RAG | [RAG 基础](/note/AI-Agent/rag) | [RAG 工程化](/note/Engineering/rag-engineering) | [RAG 面试题](/note/AI-Interview/rag-interview) |
| RAG vs Fine-tuning | [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning) | [Eval Dataset 设计](/note/Engineering/eval-dataset-design) | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |
| Tool Calling | [Tool Calling](/note/AI-Agent/tool-calling) | [API 安全](/note/Engineering/api-security)、[MCP Server](/note/Engineering/mcp-server) | [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) |
| Agent Runtime | [Agent Runtime](/note/AI-Agent/agent-runtime) | [Agent Trace](/note/Engineering/agent-trace) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| Memory / Persistence | [Memory / Persistence](/note/AI-Agent/memory) | [数据库设计](/note/Engineering/database)、[Agent Trace](/note/Engineering/agent-trace) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| LangGraph | [LangGraph](/note/AI-Agent/langgraph) | [Agent Trace](/note/Engineering/agent-trace) | [LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview) |
| Multi-Agent | [Multi-Agent](/note/AI-Agent/multi-agent) | [Agent Trace](/note/Engineering/agent-trace) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| Guardrails | [Guardrails / Safety](/note/AI-Agent/guardrails) | [API 安全](/note/Engineering/api-security) | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |
| Agent Harness | [Agent Harness 总览](/note/AI-Agent/agent-harness) | [MCP Server](/note/Engineering/mcp-server)、[Agent Trace](/note/Engineering/agent-trace) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| Evaluation | [Trace 与 Evaluation](/note/AI-Agent/evaluation) | [Evaluation Pipeline](/note/Engineering/eval-pipeline) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| Production | [Production Engineering](/note/AI-Agent/production) | [上线检查清单](/note/Engineering/production-checklist) | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |

## 当前状态

当前已完成 AI Agent 学习路线的第一轮补齐，基础能力、Agent Runtime、Memory / Persistence、Guardrails、Agent Harness、Trace / Evaluation 与 Production Engineering 已形成独立页面。后续重点是继续加深 RAG、Production 和项目实战内容，并把知识点沉淀到可展示项目中。
