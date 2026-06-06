# LLM 成本预算表：把 token、模型、缓存和业务价值算清楚

## 这篇文章解决什么问题

大模型项目从 Demo 到上线，成本经常突然失控：Prompt 越写越长、RAG 上下文越塞越多、工具循环调用、评测跑批、用户增长、模型升级。没有成本预算表，就很难判断一个 Agent 产品是否真的能商业化。

LLM 成本预算表的目标是把每个任务的 token、模型、工具、缓存、评测和人审成本拆开，形成可估算、可监控、可优化的成本模型。

## 为什么需要成本预算

Agent 项目成本不是只看一次模型调用。一次任务可能包含：

- 意图识别调用。
- 计划生成调用。
- RAG query rewrite。
- embedding 和向量检索。
- rerank。
- 多次工具调用。
- 结果生成。
- Judge 评测。
- 人工接管。
- 日志、存储和监控。

如果只看最终回答的 token，很容易低估真实成本。

## 成本拆解表

| 成本项 | 说明 | 优化方向 |
|---|---|---|
| Input Tokens | 系统提示、历史、证据、工具 schema | Prompt 瘦身、上下文裁剪 |
| Output Tokens | 模型生成内容 | 输出长度控制、结构化摘要 |
| Model Price | 不同模型单价不同 | 模型路由、降级策略 |
| Embedding | 文档和 query 向量化 | 增量入库、缓存 |
| Rerank | 候选证据重排 | 控制候选数量、按需启用 |
| Tool Calls | 外部 API、搜索、数据库 | 批处理、去重、缓存 |
| Evaluation | Judge、回归评测 | 抽样、离线批处理 |
| Human Review | 人工审批和接管 | 风险分级、运营台效率 |
| Infra | 数据库、队列、向量库、日志 | 资源配额、冷热分层 |

## 单任务预算模板

| 字段 | 示例 |
|---|---|
| task_type | research_summary |
| model_route | small -> large fallback |
| avg_input_tokens | 6000 |
| avg_output_tokens | 1200 |
| avg_tool_calls | 3 |
| avg_retrieved_chunks | 8 |
| avg_eval_calls | 1 |
| cache_hit_rate | 35% |
| cost_per_task | 估算值 |
| p95_cost_per_task | 估算值 |
| business_value | 节省 20 分钟人工阅读 |

预算表要按任务类型拆，不同任务成本差异很大。

## 任务类型分层

| 任务类型 | 成本特征 | 策略 |
|---|---|---|
| FAQ 问答 | 短输入、短输出、高频 | 用小模型、缓存、严格上下文 |
| RAG 深度问答 | 证据多、引用要求高 | 控制 top_k、rerank 按需启用 |
| 长文总结 | 输入长、输出中等 | 分块摘要、层级摘要 |
| 数据分析 Agent | 工具调用多、可能多轮 | 限制工具循环、SQL dry-run |
| 多 Agent 研究 | 多模型、多步骤 | 任务预算、步骤预算、人工中断 |
| 批量评测 | 调用量大但离线 | 低峰运行、抽样、便宜模型 Judge |

不要用一个平均成本覆盖所有任务。高频低价任务和低频高价任务要分开治理。

## Token 预算怎么设

Token 预算不是越大越好。建议为每个阶段设置预算：

| 阶段 | 预算策略 |
|---|---|
| System Prompt | 固定版本，避免不断膨胀 |
| Tool Schema | 只暴露当前可用工具，按需加载 |
| Chat History | 摘要压缩，保留关键事实 |
| RAG Context | 控制 chunk 数量和长度 |
| Memory | 只放相关且可信的记忆 |
| Output | 明确最大长度和结构 |

一个常用做法是设置 context budget：系统规则 10%，历史 15%，RAG 50%，工具 schema 15%，输出预留 10%。具体比例要按项目调整。

## 成本监控指标

| 指标 | 作用 |
|---|---|
| cost_per_task | 单任务平均成本 |
| p95_cost_per_task | 长尾任务成本 |
| token_per_task | token 使用量 |
| model_mix | 各模型调用占比 |
| cache_hit_rate | 缓存命中率 |
| tool_call_count | 工具调用次数 |
| retry_cost_ratio | 重试带来的额外成本 |
| eval_cost_ratio | 评测成本占比 |
| cost_per_success | 成功任务成本，而不是所有任务平均 |
| cost_by_tenant | 租户级成本和配额 |

cost_per_success 很重要。如果一个 Agent 单次任务便宜但失败率高，真实有效成本可能更高。

## 优化手段清单

| 手段 | 适用场景 | 风险 |
|---|---|---|
| Prompt 瘦身 | 系统提示过长 | 可能丢失约束 |
| Tool Schema 按需加载 | 工具很多 | 路由错误会漏工具 |
| RAG top_k 控制 | 上下文过长 | 召回不足 |
| Query Cache | 高频相似问题 | 过期和权限问题 |
| Answer Cache | FAQ | 需要 tenant 和 permission key |
| Model Routing | 简单任务用小模型 | 路由错误影响质量 |
| Batch Eval | 大量评测 | 延迟结果，不适合在线 |
| Early Exit | 低价值任务提前结束 | 可能影响体验 |
| Human Handoff | 高成本低置信任务 | 人工成本增加 |

成本优化不能牺牲安全边界。不要为了省 token 删除权限、引用和安全策略。

## 预算门禁

可以把成本接入 Release Gate：

| 门禁 | 示例 |
|---|---|
| avg_cost_per_task | 不高于上版 10% |
| p95_cost_per_task | 不超过业务预算 |
| retry_cost_ratio | 不超过 15% |
| model_mix | 大模型调用占比不超过阈值 |
| cache_hit_rate | 高频 FAQ 不低于目标 |
| cost_per_success | 不退化 |

当 Prompt 或模型变更导致成本上涨时，要能在上线前发现。

## 面试表达模板

我会为 Agent 系统设计成本预算表，把一次任务拆成 input/output token、模型路由、embedding、rerank、工具调用、评测、人审和基础设施成本。然后按任务类型统计 cost_per_task、p95_cost、cost_per_success、retry_cost_ratio 和 cost_by_tenant。优化时会做 Prompt 瘦身、上下文预算、工具 schema 按需加载、缓存和模型路由，但不会牺牲权限、引用和安全策略。

## 常见误区

### 误区一：只看 token 单价

真实成本还包括失败率、重试、工具、评测、人审和基础设施。

### 误区二：只看平均成本

长尾任务可能吞掉预算。必须看 p95 和高成本任务分布。

### 误区三：为了省钱删安全上下文

安全策略、权限说明、引用约束和审计字段是上线必需品，不能简单当作可删除 token。
