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
| 3 | RAG | [RAG 基础](/note/AI-Agent/rag) | 理解检索增强生成的完整链路和工程化要点 |
| 4 | Tool Calling | [Tool Calling](/note/AI-Agent/tool-calling) | 理解工具注册、参数生成、工具选择、结果回填 |
| 5 | Agent Runtime | [Agent 基础](/note/AI-Agent/agent-basic)（后续补充独立页面） | 理解 Agent 运行时循环、状态管理、工具编排 |
| 6 | Memory / Persistence | [Agent 基础](/note/AI-Agent/agent-basic)（后续补充独立页面） | 理解短期/中期/长期记忆和持久化策略 |
| 7 | LangGraph 状态机 | [LangGraph 状态机](/note/AI-Agent/langgraph) | 掌握 State、Node、Edge、Checkpoint 的设计和使用 |
| 8 | Multi-Agent / Handoff | [Multi-Agent 架构](/note/AI-Agent/multi-agent) | 理解多 Agent 协作模式、调度策略、结果整合 |
| 9 | Guardrails / Human Approval | [Human-in-the-loop](/note/AI-Agent/human-in-the-loop) | 理解人工审核节点设计、权限控制、安全审查 |
| 10 | Trace / Evaluation | [Trace 与 Evaluation](/note/AI-Agent/evaluation) | 理解 Trace 记录、自动评测、失败样本沉淀 |
| 11 | Production Engineering | [Production Engineering](/note/AI-Agent/production) | 理解部署、监控、成本控制、Prompt 管理 |

## 和工程化笔记的关系

学习路线关注"学什么"，工程化笔记关注"怎么做"。两者互为补充。

| 学习主题 | 对应工程化笔记 |
|---|---|
| RAG | [RAG 工程化](/note/Engineering/rag-engineering)、[向量数据库](/note/Engineering/vector-database) |
| Tool Calling | API 安全、MCP Server（后续补充） |
| LangGraph / Multi-Agent | Agent Trace、Eval Pipeline（后续补充） |
| Production Engineering | [FastAPI](/note/Engineering/fastapi)、[Docker 部署](/note/Engineering/docker-deploy)、[可观测性](/note/Engineering/observability) |

## 和面试题库的关系

学习路线建立知识体系，面试题库检验表达能力。学完一个主题后，可以通过对应面试题验证理解深度。

| 学习主题 | 对应面试题 |
|---|---|
| Agent 基础 | [Agent 面试题](/note/AI-Interview/agent-interview) |
| RAG | [RAG 面试题](/note/AI-Interview/rag-interview) |
| Tool Calling | [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) |
| LangGraph | [LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview) |
| Production Engineering | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |

## 推荐学习顺序

**第一阶段：建立 LLM 应用基础**

先理解 LLM 调用的基本形态（Chat Completion、Function Calling、上下文窗口），再学习 Prompt Engineering 的设计原则。这是所有后续内容的基础。

**第二阶段：学习 RAG 和 Tool Calling**

RAG 让模型能结合外部知识回答问题，Tool Calling 让模型能调用外部工具执行操作。这两个是 Agent 的核心能力前置。

**第三阶段：进入 Agent / Multi-Agent / LangGraph**

在理解 RAG 和 Tool Calling 的基础上，学习 Agent 的运行时循环、状态机编排、多 Agent 协作。这是 Agent 工程的核心内容。

**第四阶段：补工程化、评测和面试表达**

最后补齐 Production Engineering（部署、监控、成本）、Trace / Evaluation（评测、回归测试）、以及面试题库的表达训练。

## 当前状态

当前已完成第一轮学习路线整理，11 个阶段的框架已建立。其中 Agent Runtime 和 Memory / Persistence 暂时关联到 Agent 基础页面，后续会补充独立页面。Guardrails 暂时关联到 Human-in-the-loop 页面，后续会补充独立的安全审查专题。
