# Agent Capability Matrix：用能力矩阵规划作品集和系统设计

## 这篇文章解决什么问题

学习 AI Agent 容易陷入两个极端：只学概念，不知道项目该展示什么能力；或者只堆功能，不知道这些功能对应什么工程价值。

Agent Capability Matrix 的目标是把一个 Agent 项目拆成可证明的能力项，用来指导项目选题、作品集规划、简历 bullet、面试讲法、系统设计查漏补缺和后续迭代。

## 能力矩阵总览

| 能力域 | 典型能力 | 如何证明 |
|---|---|---|
| LLM 调用 | 模型接入、流式输出、结构化输出 | API、Demo、schema 测试 |
| Context | 上下文裁剪、历史摘要、证据注入 | context trace、token 预算 |
| RAG | 入库、检索、rerank、引用 | 检索评测、引用展示 |
| Tool | tool schema、权限、审批、审计 | tool call trace、审批流 |
| MCP | server/client/gateway、工具发现 | MCP demo、schema cache |
| Runtime | 状态机、停止条件、重试 | run trace、状态转移图 |
| Memory | 写入、检索、更新、遗忘 | memory eval、用户控制页 |
| Multi-Agent | router、planner、supervisor、handoff | 任务拆解 trace |
| Evaluation | smoke、regression、judge、benchmark | eval report、失败样本库 |
| Safety | prompt injection、越权、沙箱 | red team report |
| Product | UI、任务面板、反馈、运营台 | browser e2e、PRD |
| Ops | 部署、监控、报警、回滚 | runbook、dashboard |

一个项目不需要一次性覆盖全部能力，但作品集最好能证明多个能力域。

## 三档项目能力要求

### L1：能演示

| 能力 | 要求 |
|---|---|
| LLM | 能调用模型并返回结果 |
| Prompt | 有基本 prompt 模板 |
| UI | 有可交互页面 |
| API | 有基础接口 |
| Demo | 能跑通 happy path |

L1 的问题是容易被认为只是 Demo。

### L2：能复现

| 能力 | 要求 |
|---|---|
| 数据 | 任务、文档、工具调用可落库 |
| Trace | 每次运行有 run_id 和 step_id |
| RAG / Tool | 有引用或工具调用记录 |
| Error | 有失败状态和错误类型 |
| Eval | 有基础测试集和评测结果 |
| README | 能说明架构、运行方式和指标 |

L2 能证明你不只是调 API，而是在做工程系统。

### L3：能上线

| 能力 | 要求 |
|---|---|
| 权限 | tenant / role / tool policy |
| Safety | prompt injection、防越权、审批 |
| Reliability | 队列、重试、幂等、恢复 |
| Observability | 成本、延迟、质量、安全 dashboard |
| Benchmark | 对比模型、框架或方案 |
| Ops | Docker、健康检查、runbook、回滚 |
| Product | 反馈闭环、运营台、用户控制 |

L3 能讲出生产级系统设计。

## 不同项目如何选能力

### RAG 知识库项目

重点能力：RAG 入库、向量检索、权限过滤、引用溯源、RAG Debug、Evaluation、反馈闭环。不一定需要复杂 Multi-Agent。

### 多 Agent Copilot

重点能力：Runtime 状态机、Planner / Executor / Reviewer、Tool Registry、MCP Client / Gateway、Trace、Human Takeover、Benchmark。不要只强调多个 Agent 对话，要强调协作可控。

### Code Agent

重点能力：仓库检查、计划和小步编辑、测试执行、Diff review、安全沙箱、Skills、防止假验证和误提交。

### Data Analysis Agent

重点能力：语义层、SQL 生成和校验、权限过滤、图表生成、结构化洞察、数据血缘和 Trace。

### Agent SaaS

重点能力：多租户、额度计费、Team / Role、Onboarding、任务面板、反馈和运营台、成本和质量仪表盘。

## 简历 bullet 映射

不要写：使用 LangChain 开发 AI Agent。

可以写：设计并实现多 Agent 任务运行时，基于状态机管理 planning、tool execution、review 和 human approval，记录 run_id / step_id / tool_call trace，支持失败重试和结果复盘。

不要写：接入了 MCP 工具。

可以写：构建 MCP 工具接入层，支持 server registry、tool discovery、schema cache、权限过滤和高风险工具审批，将工具调用成功率、延迟和拒绝率纳入监控。

不要写：做了记忆功能。

可以写：设计 Agent 长期记忆生命周期，区分偏好、事实和项目状态，支持 source、confidence、superseded / deleted 状态，并通过 memory eval 验证写入准确率、检索相关性和遗忘合规。

## 面试讲法

面试时可以按能力矩阵讲：这个项目不是只做模型调用，我把它拆成 RAG 证据获取、Tool / MCP 执行、Agent Runtime 状态机、Trace 和 Evaluation、Safety / Approval、Product / Ops 六个能力域。然后每个能力域举一个具体实现和一个指标。

## 作品集检查清单

- [ ] 项目 README 是否说明能力矩阵？
- [ ] 是否至少覆盖 3 个能力域？
- [ ] 是否有 Trace 或截图证明运行过程？
- [ ] 是否有 Eval 或 Benchmark 结果？
- [ ] 是否有安全和权限设计？
- [ ] 是否有失败恢复或运维说明？
- [ ] 简历 bullet 是否写出工程价值而不是框架名？

## 相关链接

- [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap)
- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
- [AI Agent 项目选题库](/topics/ai-agent-project-ideas)
- [Agent 系统设计案例库](/topics/agent-system-design-casebook)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
