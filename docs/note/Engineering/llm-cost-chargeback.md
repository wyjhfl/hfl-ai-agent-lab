# LLM Cost Chargeback：大模型成本分摊与租户账单设计

## 这篇文章解决什么问题

很多 Agent 项目上线前只算“总 token 成本”，上线后才发现真正难的问题是：哪个租户最贵？哪个功能最烧钱？哪些失败重试浪费最多？免费用户和付费用户如何分配额度？团队内部怎么解释预算消耗？

LLM Cost Chargeback 的目标是把大模型成本从“平台总账单”拆到 tenant、workspace、user、agent、feature、run 和 tool 层级，让成本可解释、可限额、可优化、可计费。

## 为什么要做成本分摊

| 问题 | 没有 chargeback 的后果 |
|---|---|
| 租户成本不可见 | 大客户和小客户成本混在一起 |
| 功能 ROI 不清楚 | 不知道哪个 Agent 功能值得继续投入 |
| 失败成本不可控 | 重试、超时和错误调用持续烧钱 |
| 配额无法设计 | 免费版、团队版、企业版边界模糊 |
| 优化没有方向 | 不知道该优化 Prompt、RAG、模型还是缓存 |

Chargeback 不一定等于立刻收费，但它是商业化和平台治理的基础。

## 成本账本字段

每次模型或工具消耗都应该进入成本账本：

| 字段 | 说明 |
|---|---|
| cost_event_id | 成本事件 ID |
| run_id / step_id | 关联执行轨迹 |
| tenant_id / workspace_id | 成本归属 |
| user_id | 触发用户 |
| agent_id | 哪个 Agent |
| feature | 问答、报告、代码审查、评测等 |
| model | 调用模型 |
| input_tokens | 输入 token |
| output_tokens | 输出 token |
| cached_tokens | 缓存命中 token |
| tool_cost | 外部工具成本 |
| eval_cost | 评测成本 |
| retry_count | 重试次数 |
| success | 是否产生有效结果 |
| amount | 折算金额 |
| created_at | 时间 |

关键是把 cost_event 和 run_id 关联起来，否则只能看到账单，看不到成本来自哪个任务。

## 成本指标

| 指标 | 说明 |
|---|---|
| cost_per_task | 单任务成本 |
| cost_per_success | 成功任务成本 |
| cost_per_user | 单用户成本 |
| cost_per_tenant | 租户成本 |
| retry_cost_ratio | 重试成本占比 |
| eval_cost_ratio | 评测成本占比 |
| cache_saving_rate | 缓存节省比例 |
| model_mix | 各模型成本占比 |
| p95_cost | 高成本长尾 |
| cost_per_feedback_positive | 正反馈任务成本 |

不要只看平均成本。p95_cost 和 retry_cost_ratio 往往更能暴露问题。

## 分摊维度

| 维度 | 用途 |
|---|---|
| tenant | 企业账单、租户限额 |
| workspace | 团队内部预算 |
| user | 滥用检测和个人额度 |
| agent | 哪个 Agent 成本高 |
| feature | 哪个功能 ROI 低 |
| model | 模型路由优化 |
| tool | 外部工具成本治理 |
| eval | 离线评测预算 |
| environment | dev / staging / prod 成本隔离 |

评测环境和生产环境要分开，否则开发调试会污染产品成本判断。

## 配额策略

| 策略 | 示例 |
|---|---|
| hard quota | 租户每月最多 100 万 token |
| soft quota | 超过后报警但不立刻停用 |
| per-run budget | 单次任务最多 2 万 token |
| per-tool budget | 某工具每天最多调用 100 次 |
| eval budget | 每晚评测最多消耗固定预算 |
| burst credit | 企业客户允许短时突增 |
| approval over budget | 超预算任务需要审批 |

配额不是只限制用户，也保护系统不被异常任务和重试风暴拖垮。

## 计费模型

如果要商业化，可以从简单到复杂：

1. 免费额度 + 超额限制。
2. 按 seat + token 包。
3. 按任务成功数计费。
4. 按功能包计费，例如 RAG、数据分析、代码审查。
5. 企业版自定义额度、模型和审计。

不建议一开始就做复杂计费，但应该提前把成本归属字段打好。

## 成本异常排查

当成本突然上升时，按这条链路排查：

1. 哪个 tenant / agent / feature 上升？
2. 是 input_tokens 还是 output_tokens 上升？
3. 是模型切换还是 Prompt 变长？
4. 是 RAG top_k 增大还是上下文重复？
5. 是工具失败导致重试？
6. 是缓存命中率下降？
7. 是评测任务异常放量？
8. 是否有滥用或 Prompt Injection 导致循环？

成本异常通常不是“模型变贵”这么简单，而是系统策略、任务质量和失败恢复共同导致。

## 面试表达模板

我会为 LLM 调用建立成本账本，把每次模型、RAG、工具和评测消耗都关联到 run_id、tenant_id、agent_id、feature 和 model。这样可以计算 cost_per_task、cost_per_success、retry_cost_ratio、cache_saving_rate 和 p95_cost。上线后如果成本异常，可以按租户、功能、模型、缓存和失败重试逐层定位，而不是只看平台总账单。

## 常见误区

### 误区一：只记录总 token

总 token 不能回答哪个租户、哪个功能、哪个失败路径最贵。

### 误区二：成本优化只靠换便宜模型

很多成本来自 Prompt 冗余、RAG 上下文过长、工具重试和缓存缺失。

### 误区三：评测成本可以忽略

大规模离线评测会持续消耗预算，必须和生产成本分开管理。

## 相关链接

- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [LLM Semantic Cache](/note/Engineering/llm-semantic-cache)
- [Agent SaaS 多租户、RBAC 与配额设计](/topics/agent-saas-tenant-rbac-quota)
- [Agent Product Metrics](/topics/agent-product-metrics)
