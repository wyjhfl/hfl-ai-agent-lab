# AI Agent 工程化笔记

这不是一组普通后端学习笔记，而是围绕 AI Agent、RAG 和 Multi-Agent 项目落地所需要的工程能力地图。

AI Agent 项目不能只停留在模型调用和 Prompt 层面。一个可上线、可维护、可评估的 Agent 系统，至少需要后端服务、数据存储、RAG 检索、工具权限、异步任务、执行轨迹、评测体系、安全控制和部署运维。

## 1. 为什么需要工程化笔记

Demo 阶段通常只需要模型调用和简单 Prompt。只要能把用户输入传给模型，再把模型输出展示出来，就可以完成一个演示版本。

项目阶段完全不同。真实系统要面对用户、数据、权限、成本、延迟、失败重试、线上部署和问题排查。此时需要接口、数据库、日志、队列、权限、Trace、Evaluation 等工程模块共同支撑。

面试时，工程化能力比“会调一个框架”更能体现真实项目能力。因为企业更关心候选人能否把 AI 能力接入业务系统、能否排查线上问题、能否控制风险、能否持续评估效果。

工程化笔记的目标不是堆技术名词，而是建立一套可迁移的方法：面对一个 Agent 或 RAG 项目时，知道应该从接口、数据、任务、工具、执行轨迹、评测和部署几个层面设计系统。

## 2. AI Agent 工程化能力地图

| 工程层级 | 核心内容 | 对 Agent 项目的价值 |
| --- | --- | --- |
| 后端接口层 | FastAPI、路由、请求校验、统一响应、鉴权 | 提供稳定的任务入口、RAG 问答入口、文件上传入口和状态查询入口 |
| 数据存储层 | 用户、任务、文档、工具调用、Trace、评测结果 | 保存业务状态和运行证据，让系统可追踪、可恢复、可评估 |
| RAG 检索层 | 文档解析、Chunk、Embedding、Hybrid Search、Rerank、引用溯源 | 让模型基于外部知识回答，并能解释答案来源 |
| 向量数据库层 | Collection、Metadata、索引、过滤查询、增量更新 | 支撑高质量召回、权限过滤、引用定位和检索性能优化 |
| 异步任务层 | 任务队列、Worker、状态机、超时、重试、幂等 | 处理文档入库、长时间 Agent 执行、批量评测等耗时任务 |
| 工具权限层 | 工具注册、参数校验、权限控制、审批、审计 | 控制 Agent 能调用什么工具、在什么条件下调用、如何追责 |
| Trace 可观测层 | Run ID、Step ID、工具调用记录、状态变化、错误定位 | 还原 Agent 执行过程，支持调试、复盘和质量分析 |
| Evaluation 评测层 | 测试集、指标、版本对比、失败样本库 | 把效果从主观感觉变成可比较、可迭代的数据 |
| MCP 工具接入层 | Tools、Resources、Prompts、Schema、鉴权、审计 | 标准化外部工具接入方式，降低工具集成成本 |
| 部署上线层 | Docker、环境变量、健康检查、日志、回滚、成本监控 | 保证系统能在真实环境稳定运行，并支持运维和回滚 |

这张地图可以作为项目设计时的检查框架。一个 Agent 系统如果只实现了模型调用，而没有任务状态、工具权限、执行轨迹和评测闭环，就很难进入真实生产环境。

## 3. 推荐学习顺序

1. FastAPI：先把服务接口搭起来。
2. Database：设计任务、文档、Trace、评测等数据模型。
3. RAG Engineering：构建知识检索链路。
4. Vector Database：管理向量数据和检索性能。
5. Async Task：处理长任务和并发。
6. API Security：控制工具权限和高风险操作。
7. Agent Trace：记录 Agent 执行过程。
8. Evaluation Pipeline：评估系统效果。
9. MCP Server：标准化外部工具接入。
10. Docker Deploy：部署和运维。
11. Production Checklist：上线前检查。

这个顺序从“服务能接请求”开始，到“系统能上线和评估”结束。学习时不建议一开始就追求复杂 Agent 框架，而是先把后端接口、数据模型、检索链路和执行记录打牢。

## 4. 与项目 A / 项目 B 的关系

### 项目 A：RAG 工单系统

项目 A 的核心是把工单、文档和知识库连接起来，让系统能基于检索结果生成可信答案或工单建议。

- FastAPI 提供 API。
- Database 保存工单、文档、检索结果、用户反馈。
- RAG Engineering 负责检索增强。
- Vector Database 负责向量检索。
- Trace 记录检索、生成、引用、失败原因。
- Evaluation 衡量答案质量和工单生成质量。

在这个项目中，工程重点不是“能不能回答”，而是回答是否有来源、是否能复现、是否能评估、是否能根据反馈迭代。

### 项目 B：多 Agent Copilot

项目 B 的重点是任务拆解、多个 Agent 协作、工具调用和执行过程管理。这里只讨论通用迁移关系，不展开具体实现。

- FastAPI 提供任务入口。
- Database 保存任务、Agent 运行记录、工具调用。
- Async Task 支撑长任务。
- API Security 控制工具权限。
- Agent Trace 记录多 Agent 协作过程。
- Evaluation 评估任务完成质量。

在这个项目中，工程重点是可控性。多 Agent 系统如果没有任务状态、权限边界和执行轨迹，失败后很难判断问题来自任务拆解、工具调用、模型输出还是外部依赖。

## 5. 面试表达

我不是只关注模型调用，而是关注 Agent 系统从接口、数据、任务、工具、Trace、评测到部署的完整工程链路。模型能力只是系统中的一个组件，真正可上线的 Agent 还需要任务状态管理、错误处理、权限控制、执行记录和效果评估。

在 RAG 项目中，我会把文档、Chunk、Embedding、检索、引用、反馈和评测都建模，而不是只调一个向量库。这样当答案质量不好时，可以定位是文档解析问题、召回问题、排序问题、上下文构建问题还是生成问题。

在多 Agent 项目中，我会重点设计任务状态、工具权限、执行轨迹和评测闭环，避免系统不可控。每一次任务执行都应该有 run_id，每一个关键步骤都应该能被记录和复盘。

## 6. 后续 TODO

- 补充项目 A 的具体数据库设计。
- 补充项目 B 的多 Agent Trace 设计。
- 补充 Evaluation 指标示例。
- 补充 Docker Compose 生产配置示例。

## 7. 常见误区

### 误区一：只要模型效果好，系统就能上线

模型效果只是一个环节。真实项目还需要接口稳定、数据可追踪、权限可控制、失败可恢复、成本可监控。

### 误区二：只做 Prompt，不做数据建模

Agent 项目如果不保存任务、步骤、工具调用和评测结果，就无法复现问题，也无法持续改进。

### 误区三：忽略执行轨迹

没有 Run ID、Step ID 和工具调用记录，线上问题只能靠猜。执行轨迹是 Agent 系统的调试基础。

### 误区四：评测只靠人工感觉

人工体验很重要，但不能替代测试集、指标和失败样本库。没有评测闭环，系统迭代很容易退化。

## 8. 相关链接

- [FastAPI 后端接口工程化](/note/Engineering/fastapi)
- [数据库设计：从业务数据到 Agent 运行记录](/note/Engineering/database)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量数据库工程化](/note/Engineering/vector-database)
- [异步任务与长任务处理](/note/Engineering/async-task)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [MCP Server](/note/Engineering/mcp-server)
- [Docker 部署](/note/Engineering/docker-deploy)
- [AI Agent 上线检查清单](/note/Engineering/production-checklist)
