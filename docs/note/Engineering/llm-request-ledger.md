# LLM Request Ledger：大模型调用账本怎么设计

## 这篇文章解决什么问题

如果没有调用账本，团队很难回答：哪个租户用了多少钱？哪个 Prompt 版本成本最高？哪类任务重试最多？哪次发布导致 token 暴涨？哪个工具链导致 p95 延迟上升？

LLM Request Ledger 的目标是把每次模型调用记录成可统计、可追责、可优化的账本事件。

## Ledger 字段

| 字段 | 说明 |
|---|---|
| request_id | 模型请求 ID |
| run_id / step_id | 关联 Agent Trace |
| tenant_id / user_id | 成本归属 |
| feature / agent_type | 功能和 Agent 类型 |
| model_provider / model | 供应商和模型 |
| prompt_version | Prompt 版本 |
| route_policy | 模型路由策略 |
| input_tokens / output_tokens | token 用量 |
| cache_hit | 是否命中缓存 |
| retry_count | 重试次数 |
| latency_ms | 调用延迟 |
| cost_estimated | 估算成本 |
| quality_tags | 成功、失败、安全、格式等标签 |

## Ledger 用途

| 用途 | 说明 |
|---|---|
| 成本分摊 | tenant、feature、agent、run 维度 chargeback |
| 异常检测 | 发现 prompt bloat、retry storm、cache miss |
| 路由优化 | 比较不同模型 cost_per_success |
| 发布审计 | 关联 prompt_version 和 model_version 变化 |
| 评测成本 | 区分线上调用和 eval / judge 调用 |
| 商业化 | 支撑 quota、套餐、账单和成本毛利分析 |

## 设计原则

1. Ledger 是 append-only，不随业务对象覆盖；
2. 不记录完整 Prompt 明文，只记录 hash、版本和必要 metadata；
3. PII 和 secret 必须脱敏；
4. 成本估算和最终账单要可 reconcile；
5. 每条调用都要能追溯到 run 和 feature；
6. eval、prod、dev 环境要分开统计。

## 面试表达模板

> 我会为每次模型调用写 LLM Request Ledger，记录 request_id、run_id、tenant、feature、model、prompt_version、tokens、cache_hit、retry、latency 和 cost_estimated。这样可以做成本分摊、异常检测、模型路由优化和发布审计，而不是月底只看供应商总账单。

## 常见误区

### 误区一：只保存供应商账单

供应商账单无法告诉你哪个功能、Prompt、租户或工具链导致成本变化。

### 误区二：Ledger 里保存完整 Prompt

账本用于统计和审计，不应该成为敏感上下文泄漏源。

### 误区三：只记录成功请求

失败、超时、重试和被取消的请求同样会产生成本和延迟。

## 相关链接

- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
- [LLM Cost Anomaly Detection](/note/Engineering/llm-cost-anomaly-detection)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
