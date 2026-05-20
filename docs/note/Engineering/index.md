# 工程化笔记

这里记录 AI 应用从 Demo 走向真实项目所需的工程能力。

AI Agent 项目不能只停留在模型调用和 Prompt 层面，还需要具备后端服务、数据管理、日志追踪、部署运维和质量评估能力。

## 核心方向

### 1. FastAPI 后端接口

用于构建 AI 应用的服务入口，包括：

- 用户请求接口
- Agent 执行接口
- 工具调用接口
- 文件上传接口
- 结果查询接口

### 2. 数据库设计

用于保存业务数据和执行过程，包括：

- 用户请求
- Agent 任务
- 工具调用记录
- 执行状态
- 评测结果
- 错误日志

### 3. RAG 工程化

用于构建知识库问答能力，包括：

- 文档解析
- Chunk 切分
- Embedding
- 向量检索
- 引用溯源
- 检索评估

### 4. Docker 部署

用于让项目具备可部署能力，包括：

- 服务容器化
- 环境变量管理
- 数据卷挂载
- 本地开发环境
- 线上部署准备

### 5. 日志与可观测性

用于追踪 Agent 执行过程，包括：

- 请求日志
- 模型调用日志
- 工具调用日志
- 错误日志
- Trace
- Metrics

## 工程化目标

最终希望 AI Agent 项目具备这些能力：

- 能启动
- 能调用
- 能追踪
- 能调试
- 能部署
- 能复现问题
- 能评估质量

## 和学习路线、面试题库的关系

工程化笔记不是孤立的后端笔记，而是承接 AI Agent 学习路线，并服务面试表达。学习路线告诉你"学什么"，工程化笔记告诉你"怎么做"，面试题库告诉你"怎么答"。

| 工程化主题 | 对应学习路线 | 对应面试题库 |
|---|---|---|
| [RAG 工程化](/note/Engineering/rag-engineering) | [RAG](/note/AI-Agent/rag) | [RAG 面试题](/note/AI-Interview/rag-interview) |
| [API 安全与工具权限](/note/Engineering/api-security) | [Tool Calling](/note/AI-Agent/tool-calling) | [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) |
| [Agent Trace](/note/Engineering/agent-trace) | [Evaluation](/note/AI-Agent/evaluation)、[LangGraph](/note/AI-Agent/langgraph) | [Agent 面试题](/note/AI-Interview/agent-interview)、[LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview) |
| [Evaluation Pipeline](/note/Engineering/eval-pipeline) | [Evaluation](/note/AI-Agent/evaluation) | [Agent 面试题](/note/AI-Interview/agent-interview) |
| [MCP Server](/note/Engineering/mcp-server) | [Tool Calling](/note/AI-Agent/tool-calling) | [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) |
| [上线检查清单](/note/Engineering/production-checklist) | [Production Engineering](/note/AI-Agent/production) | [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) |

## 学习原则

不要只做一次性 Demo，要把每个模块都按真实项目要求沉淀：

- 文件结构清晰
- 接口边界明确
- 数据结构稳定
- 执行过程可追踪
- 失败原因可定位
