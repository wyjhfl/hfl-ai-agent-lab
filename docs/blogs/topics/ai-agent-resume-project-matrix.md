# AI Agent Resume Project Matrix：简历项目能力矩阵怎么写

## 这篇文章解决什么问题

很多 AI Agent 简历项目写成了技术栈列表：LangGraph、RAG、FastAPI、向量数据库、Docker。这样很难让面试官判断你到底具备哪些工程能力。

Resume Project Matrix 的目标是把项目经历映射到能力矩阵：你证明了哪些能力、每个能力有什么实现、有什么指标、面试时怎么讲。

## 能力矩阵

| 能力 | 项目中如何体现 | 简历表达方向 |
|---|---|---|
| RAG 工程 | 入库、检索、引用、评测 | 构建可追溯知识问答链路 |
| Agent Workflow | 状态机、长任务、恢复 | 将自由对话约束为可控执行流程 |
| Tool Calling | schema、权限、审批 | 治理高风险工具调用 |
| MCP | Server、Client、Gateway | 标准化外部工具接入 |
| Evaluation | regression、scorecard | 用评测闭环驱动迭代 |
| Security | injection、防越权、脱敏 | 控制 Agent 安全边界 |
| Cost | budget、cache、chargeback | 降低 token 成本和延迟 |
| Observability | Trace、Audit、Dashboard | 支持线上排查和复盘 |
| Product | 指标、试点、反馈 | 证明业务价值 |

简历不是堆能力，而是每条 bullet 对应一个可验证能力点。

## 简历 bullet 模板

### RAG 项目

> 设计并实现企业知识库 RAG 链路，覆盖文档入库、权限过滤、Hybrid Retrieval、Rerank、Citation Trace 和 RAG Evaluation Report，使答案可追溯、可拒答、可回归评测。

### 多 Agent 项目

> 基于状态机设计多 Agent 协作流程，将任务拆分、工具调用、人工审批、失败恢复和执行 Trace 显式建模，降低长任务不可控风险。

### MCP 工具平台

> 设计 MCP Tool Schema 与 Server Hardening 规范，支持工具风险分级、参数校验、超时、错误映射、审计日志和 schema version，提升外部工具接入安全性。

### 成本优化

> 建立 LLM 成本账本和语义缓存策略，按 tenant、feature、agent、model 和 run 归因成本，监控 cost_per_task、retry_cost_ratio 和 cache_saving_rate。

### 生产治理

> 建立 Agent Release Gate 和 Production Readiness Review，从 eval、RAG、tool、safety、cost、latency、ops 和 product 指标判断版本是否可灰度上线。

## 项目页结构

作品集项目页面建议按下面结构写：

1. 背景：业务问题是什么。
2. 目标：希望提升什么指标。
3. 架构：核心模块和数据流。
4. Workflow：Agent 如何执行任务。
5. RAG / Tool：如何接入知识和工具。
6. Evaluation：如何证明效果。
7. Security：如何控制风险。
8. Cost / Ops：如何上线和运维。
9. Result：指标、收获和下一步。
10. Interview：60 秒介绍和深挖问题。

这样项目页可以直接支撑简历和面试。

## 面试讲法矩阵

| 面试官问题 | 回答方向 |
|---|---|
| 你负责什么 | 模块 + 设计决策 + 验证结果 |
| 难点是什么 | 具体问题 + 方案 + trade-off |
| 怎么评估效果 | 数据集、指标、失败样本、回归 |
| 怎么上线 | Release Gate、灰度、回滚、监控 |
| 怎么控风险 | 权限、审批、沙箱、审计、脱敏 |
| 怎么控成本 | 模型路由、缓存、预算、chargeback |
| 如果重做 | 数据治理、评测覆盖、用户反馈 |

不要只回答“我用了某框架”，要回答“我解决了什么工程风险”。

## 简历自查清单

- 每个项目是否有业务目标？
- 是否能说明为什么需要 Agent？
- 是否有可量化指标或至少有评测指标？
- 是否讲清楚 RAG / Tool / State / Eval / Security？
- 是否说明你个人负责的部分？
- 是否有线上或准生产意识？
- 是否能被 GitHub、博客文章或项目页面佐证？

如果一条 bullet 不能被项目代码、文档或博客文章支撑，就容易被面试深挖击穿。

## 相关链接

- [Agent Capability Matrix](/topics/agent-capability-matrix)
- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
- [AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)
- [AI Agent 项目答辩稿](/topics/ai-agent-project-defense-script)
- [简历描述模板](/note/Interview/resume-bullets)
