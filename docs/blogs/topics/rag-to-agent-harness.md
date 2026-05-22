# 从 RAG 到生产级 Agent Harness 的工程化学习路线

## 为什么要从 RAG 学到 Agent Harness

RAG 是很多 LLM 应用的工程起点。它解决的是"让模型连接外部知识"的问题——通过检索外部文档，把相关信息注入上下文，让模型基于真实数据生成回答。

但真实 Agent 系统不只需要检索。一个能上线运行的 Agent 需要任务分解、工具调用、状态维护、错误处理、权限控制、执行追踪、质量评测和部署运维。这些能力加在一起，构成了 Agent 的工程骨架——Agent Harness。

RAG 是知识增强，Agent Harness 是执行增强。学习路线不能停在 RAG，而要沿着这条路径逐步升级。

## 这条路线解决什么问题

围绕三个问题展开：

1. **学什么** — 从 LLM 应用基础到 Agent 工程体系，10 个阶段的知识地图。
2. **怎么做** — 把 RAG、工具调用、Trace、Eval、安全、部署落成可复用的工程模块。
3. **怎么证明可靠** — 通过评测集、执行轨迹、失败样本和上线检查，证明系统不是 demo。

## 路线总览

| 阶段 | 主题 | 核心能力 | 对应站内内容 |
|---|---|---|---|
| 1 | RAG 基础能力 | 文档解析、检索、Rerank、幻觉规避 | [RAG](/note/AI-Agent/rag)、[RAG 工程化](/note/Engineering/rag-engineering) |
| 2 | Tool Calling 与工具 Schema | 工具注册、参数校验、执行、权限控制 | [Tool Calling](/note/AI-Agent/tool-calling)、[API 安全](/note/Engineering/api-security) |
| 3 | Memory 与状态管理 | 短期记忆、会话状态、上下文压缩 | [Agent 基础](/note/AI-Agent/agent-basic) |
| 4 | 最小 Agent Loop | Observe → Think → Act → Observe → Final | [Agent 基础](/note/AI-Agent/agent-basic) |
| 5 | 现代 Agent Harness | 工具注册、权限、Trace、Eval、安全、部署 | [Hermes Agent](/note/Source-Reading/hermes-agent)、[Harness Engineering](/note/Source-Reading/harness-engineering) |
| 6 | Multi-Agent 协调 | 职责拆分、调度、状态共享、结果聚合 | [Multi-Agent](/note/AI-Agent/multi-agent) |
| 7 | Skills / MCP / A2A | 标准化工具协议、跨系统通信 | [MCP Server](/note/Engineering/mcp-server) |
| 8 | Eval / Trace / Safety | 评测集、执行轨迹、安全防护 | [Evaluation](/note/AI-Agent/evaluation)、[Eval Pipeline](/note/Engineering/eval-pipeline) |
| 9 | Deploy / Production | API 服务、异步任务、监控、回滚 | [Production](/note/AI-Agent/production)、[上线检查清单](/note/Engineering/production-checklist) |
| 10 | 项目化与面试表达 | 把能力转化为可展示的项目和面试表达 | [面试题库](/note/AI-Interview/) |

## 第一阶段：RAG 是工程起点

RAG 要掌握的核心能力：

- 文档解析：处理 PDF、Word、HTML、表格、代码块等不同格式
- 文本切分：控制 chunk 粒度，平衡检索精度和上下文完整性
- Embedding：选择合适的向量模型，评估检索质量
- 向量检索：理解 ANN 算法、索引结构、检索性能
- Rerank：用更精确的模型对召回结果重排序
- 引用来源：让回答可溯源，增强可信度
- 幻觉规避：引导模型只基于检索结果回答，不确定时说"不知道"
- 检索质量评估：Recall@K、Precision@K、MRR 等指标

RAG 不等于"接一个向量库"。真正的 RAG 工程要处理 chunk 粒度选择、召回不足时的降级策略、噪声文档的过滤、引用溯源的格式设计、知识库的动态更新机制，以及端到端的检索质量评估。

**站内链接：**

- [RAG](/note/AI-Agent/rag)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量数据库](/note/Engineering/vector-database)
- [RAG 面试题](/note/AI-Interview/rag-interview)

## 第二阶段：Tool Calling 是 Agent 的执行入口

RAG 让模型能查知识，Tool Calling 让模型能调用外部能力。

工具必须有结构化 Schema——名称、描述、参数定义，让模型能理解工具的用途和调用方式。模型负责生成调用意图和参数，系统负责校验、执行、权限控制和结果回填。

工程上需要关注：

- 工具注册：定义工具的 JSON Schema，描述要清晰准确
- 参数校验：模型生成的参数可能有格式错误或恶意注入，必须校验
- 工具执行：在安全边界内执行，记录执行日志
- 工具结果结构化：返回结构化的成功/失败信息，让模型能理解
- 错误处理：区分可重试和不可重试错误，把错误信息回传给模型
- 权限控制：不同工具有不同权限级别，高风险操作需要人工确认
- 高风险操作确认：删除、发送、修改等操作不能自动执行

**站内链接：**

- [Tool Calling](/note/AI-Agent/tool-calling)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [MCP Server 工程化](/note/Engineering/mcp-server)
- [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview)

## 第三阶段：从 Agent Loop 到 Agent Harness

最小 Agent Loop 通常是：

```
Observe → Think / Plan → Act → Observe → Final
```

这个循环让模型能"做事"，但生产级系统不能只有循环。一个能在真实环境中稳定运行的 Agent，需要一整套工程框架来支撑——这就是 Agent Harness。

Agent Harness 的核心组件：

- Agent Loop：推理-决策-执行的循环引擎
- Tool Registry：工具注册表，管理所有可用工具
- Permission Gate：权限控制层，校验工具调用权限
- Session Store：会话状态存储，维护对话历史和任务上下文
- Context / Memory：记忆系统，短期/中期/长期记忆管理
- Prompt Builder：Prompt 构建器，动态组装上下文
- Trace Recorder：执行轨迹记录器，记录每步输入输出
- Error Handler：错误处理器，处理超时、失败、重试
- Evaluator：评测器，评估输出质量和任务完成率
- Safety Guard：安全防护层，防御注入攻击和越权操作
- Deploy Runtime：部署运行时，支持异步任务、并发、监控

Harness 的重点不是"让 Agent 看起来智能"，而是让它可控、可追踪、可恢复、可评估、可上线。

**站内链接：**

- [Hermes Agent 源码拆解](/note/Source-Reading/hermes-agent)
- [Harness Engineering 源码拆解](/note/Source-Reading/harness-engineering)
- [OpenClaw 架构拆解](/note/Source-Reading/openclaw)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)

## 第四阶段：Multi-Agent 是协调问题，不是魔法

Multi-Agent 不是多个角色 Prompt 随便聊天。

错误理解："产品经理 Agent、运营 Agent、数据 Agent 自由讨论。"

工程理解："Supervisor / Planner / Executor / Reviewer / Router 通过明确的输入输出和状态流转协同。"

真正的 Multi-Agent 要解决：

- 职责边界：每个 Agent 负责什么、不负责什么
- 共享状态：Agent 之间怎么传递数据、怎么避免冲突
- 任务分派：谁来决定哪个 Agent 处理哪个任务
- 冲突处理：多个 Agent 输出矛盾时怎么裁决
- 结果聚合：怎么把多个 Agent 的输出合并成最终结果
- 停止条件：怎么判断任务完成、怎么防止无限循环

多 Agent 系统应该有调度机制，而不是让多个 Agent 自由对话。常见的调度模式包括 Supervisor（一个 Agent 调度其他 Agent）、Planner-Executor（一个负责规划，其他负责执行）、Router（根据任务类型路由到对应 Agent）。

**站内链接：**

- [Multi-Agent](/note/AI-Agent/multi-agent)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent 面试题](/note/AI-Interview/agent-interview)

## 第五阶段：Eval、Trace、Safety 是生产级分水岭

一个 Agent 如果没有评测和 Trace，很难证明可靠。这是 demo 和生产级系统的分水岭。

**评测体系：**

- 固定测试集：覆盖常见场景、边界情况和已知失败案例
- 成功率：任务完成率、回答准确率
- 工具调用成功率：工具选择准确率、参数正确率
- 失败原因分类：推理错误、工具错误、权限错误、超时等
- 回归测试：每次修改后重新运行测试集，确保没有退化

**执行轨迹：**

- 关键决策摘要：每步决策的结果和选择依据
- 工具调用记录：工具名、参数、返回结果、执行耗时
- 状态变化记录：State 从什么值变成了什么值
- 执行轨迹：完整的一次 Agent 执行的全链路记录

**安全防护：**

- Prompt Injection 防护：防止恶意输入诱导模型执行危险操作
- Data Exfiltration 防护：防止模型泄露敏感数据
- Tool Abuse 防护：防止模型被诱导滥用工具
- 成本与延迟监控：监控 Token 消耗和执行延迟，设置告警阈值

**站内链接：**

- [Evaluation](/note/AI-Agent/evaluation)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [可观测性](/note/Engineering/observability)

## 第六阶段：把 Agent 送上线

生产级 Agent 上线需要：

- API 服务：用 FastAPI 或类似框架提供 HTTP 接口
- 异步任务：长任务用异步执行，避免客户端超时
- 状态存储：会话状态、任务状态的持久化
- 工具权限：按角色配置工具权限，高风险操作需要人工确认
- 日志和 Trace：记录每次执行的完整轨迹
- 失败重试：区分可重试和不可重试错误，用指数退避策略
- 超时控制：设置任务最大执行时间，防止卡死
- 成本上限：设置 Token 消耗上限，防止失控
- 人工确认：关键操作需要人工确认，结合 Human-in-the-loop
- 回滚方案：保留上一稳定版本，出问题能快速恢复
- README 和运行说明：文档化部署步骤和已知限制

**站内链接：**

- [Production](/note/AI-Agent/production)
- [异步任务与长任务处理](/note/Engineering/async-task)
- [Docker 部署](/note/Engineering/docker-deploy)
- [AI Agent 上线检查清单](/note/Engineering/production-checklist)

## 项目路线：从项目 A 到项目 B

- **项目 A**：适合作为 RAG 基础能力项目，重点验证文档解析、检索质量、引用溯源、RAG 评测。
- **项目 B**：后续适合作为多 Agent 工程化项目，重点验证 Agent Harness、Multi-Agent 协调、权限控制、状态管理、Trace、评测。
- **最终目标**：不是做一个能聊天的 demo，而是做一个能运行、可追踪、可评估、可维护的 Agent 系统。

## 面试表达：这条路线怎么讲

可以这样表达：

> 我对 AI Agent 的学习不是从多角色 Prompt 开始，而是从 RAG 和 Tool Calling 这种基础工程能力开始，逐步补齐状态管理、工具权限、Trace、Evaluation 和部署。我的目标不是只会调框架，而是理解一个生产级 Agent Harness 需要哪些工程组件，以及如何验证它的可靠性。

> 在 RAG 阶段，我关注文档解析、检索质量、幻觉规避和评测指标。在 Tool Calling 阶段，我关注工具 Schema 设计、参数校验、权限控制和错误处理。在 Agent Harness 阶段，我把这些能力组装成一个可控、可追踪、可恢复的执行框架，配合 Trace 和 Eval 验证系统质量。

> 我的项目目标不是做一个能聊天的 demo，而是做一个能上线运行、有完整执行轨迹、有评测数据支撑、有回滚方案的生产级 Agent 系统。

## 学习原则

- 先动手，再深读
- 宁可做小的可靠 Agent，不做炫的 demo
- 工具用严格 Schema
- 加 Agent 前先加 Eval
- 重要运行都留 Trace
- Multi-Agent 是协调问题，不是魔法
- 危险操作留人在 loop 里
- 尊重平台规则、版权和数据访问边界

## 后续 TODO

- 补充项目 A 总览
- 补充项目 B 正式设计提纲
- 增加 Agent Harness 架构图
- 增加 RAG → Tool Calling → Harness 的流程图
- 继续扩展面试题库中 Agent Harness 相关题目
