# LLM Cost Anomaly Detection：大模型成本异常怎么发现

## 这篇文章解决什么问题

大模型应用成本异常往往发生得很快：某个 Prompt 变长、重试风暴、缓存失效、模型路由错误、某租户批量调用、工具超时导致重复执行。如果等到账单出来才发现，已经太晚。

LLM Cost Anomaly Detection 的目标是用分桶基线和实时告警发现成本异常，并能定位到 tenant、feature、agent、model、prompt_version、tool 和 run。

## 成本异常来源

| 来源 | 表现 |
|---|---|
| prompt bloat | input tokens 持续上升 |
| retry storm | retry_cost_ratio 暴涨 |
| cache miss | cache_hit_rate 下降 |
| model routing bug | 低价值任务误用高价模型 |
| batch runaway | 批量任务无限扩张 |
| tool loop | Agent 重复调用同一工具 |
| eval explosion | 评测集规模或 Judge 调用失控 |
| tenant abuse | 某租户异常高频调用 |

## 监控指标

| 指标 | 含义 |
|---|---|
| cost_per_task | 单任务平均成本 |
| cost_per_success | 成功任务成本 |
| p95_cost | 长尾成本 |
| retry_cost_ratio | 重试成本占比 |
| model_mix | 各模型成本占比 |
| cache_saving | 缓存节省金额 |
| tool_cost | 工具和下游 API 成本 |
| eval_cost | 自动评测成本 |
| tenant_cost_delta | 租户成本相对基线变化 |

## 异常检测方法

1. 按 tenant、feature、agent_type、model、prompt_version 分桶；
2. 为每个桶计算日/小时 baseline；
3. 同时监控绝对阈值和相对涨幅；
4. 结合 release 事件、模型路由变更、cache_version 变化；
5. 告警中直接给出 top contributors；
6. 触发预算熔断或降级策略。

## 响应动作

| 异常 | 动作 |
|---|---|
| prompt tokens 上升 | 检查 Prompt diff、上下文打包和 Memory 注入 |
| retry_cost_ratio 上升 | 检查 schema、工具错误和 provider timeout |
| cache_hit_rate 下降 | 检查 knowledge_version、prompt_version、permission_hash |
| 某租户成本暴涨 | 限流、配额、人工确认或商业化升级 |
| 高价模型占比异常 | 回滚 route policy 或启用低价 fallback |
| eval_cost 异常 | 暂停非关键评测或抽样执行 |

## 面试表达模板

> 我会把大模型成本做成实时异常检测，而不是月底看账单。成本按 tenant、feature、agent、model、prompt_version 和 tool 分桶，监控 cost_per_success、p95_cost、retry_cost_ratio、model_mix 和 cache_hit_rate。如果异常触发，就能定位到具体版本或租户，并执行降级、限流、回滚或暂停评测。

## 常见误区

### 误区一：只看总成本

总成本升高不一定是坏事，可能是用户增长；要看单位成功成本和分桶异常。

### 误区二：成本报警只按金额阈值

相对涨幅、长尾成本和 retry ratio 更容易提前发现问题。

### 误区三：成本治理和质量治理分离

降成本不能破坏 task success、grounding 和安全，需要和 scorecard 一起看。

## 相关链接

- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
