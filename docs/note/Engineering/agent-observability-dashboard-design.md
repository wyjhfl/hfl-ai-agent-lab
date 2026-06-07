# Agent Observability Dashboard Design：Agent 可观测仪表盘怎么设计

## 这篇文章解决什么问题

Agent 系统上线后，如果只看 CPU、内存、HTTP 延迟，很难知道用户为什么不满意：是模型慢、RAG 没召回、工具超时、审批卡住、成本超标，还是安全策略误杀。

Agent Observability Dashboard 的目标是把 Agent 质量、成本、延迟、安全、工具和用户体验放到同一张图里。

## 仪表盘分层

| 层级 | 关键问题 |
|---|---|
| Product | 用户任务是否完成？ |
| Quality | 答案是否可信？ |
| Runtime | Agent 卡在哪一步？ |
| Tool | 哪些工具失败或慢？ |
| RAG | 检索是否命中且引用可信？ |
| Cost | 哪些租户/功能成本异常？ |
| Safety | 哪些策略拦截和风险上升？ |
| UX | 用户是否打开证据、重试或转人工？ |

## 核心指标

| 指标 | 说明 |
|---|---|
| task_success_rate | 任务成功率 |
| p95_run_latency | 端到端延迟 |
| cost_per_success | 每次成功任务成本 |
| tool_success_rate | 工具成功率 |
| retrieval_hit_rate | RAG 召回命中率 |
| citation_support_rate | 引用支持答案比例 |
| approval_timeout_rate | 审批超时比例 |
| policy_denied_rate | 策略拒绝比例 |
| handoff_rate | 转人工比例 |
| correction_rate | 用户纠错比例 |

## Drill Down 维度

| 维度 | 示例 |
|---|---|
| tenant | 哪个客户成本异常 |
| feature | 哪个功能失败率高 |
| model | 哪个模型版本退化 |
| prompt_version | 哪个 Prompt 引入问题 |
| tool_name | 哪个工具慢或失败 |
| knowledge_version | 哪版知识库导致错误 |
| release_version | 哪次发布造成回归 |
| user_segment | 新手/高级用户体验差异 |

## Dashboard 页面

1. **Overview**：任务成功率、成本、延迟、安全风险。
2. **Run Explorer**：按 run_id 查看 step、tool、RAG、eval。
3. **RAG Quality**：召回、引用、freshness、权限过滤。
4. **Tool Health**：成功率、p95、错误码、审批超时。
5. **Safety**：policy_denied、injection、PII redaction、red team。
6. **Cost**：tenant、feature、model、cache、retry 成本。
7. **User Feedback**：点踩、纠错、证据打开、转人工。

## 告警规则

| 告警 | 触发 |
|---|---|
| task_success_drop | 任务成功率连续下降 |
| cost_spike | cost_per_success 突增 |
| tool_timeout_spike | 工具超时升高 |
| retrieval_zero_hit | 召回为空比例升高 |
| policy_denied_spike | 安全拦截突增 |
| approval_stuck | 审批等待过久 |
| correction_spike | 用户纠错升高 |

## 面试表达

可以这样讲：

> Agent 可观测仪表盘不能只看服务延迟，而要把 task_success、RAG、tool、cost、safety、feedback 和 trace 放到同一套指标里。用户点踩后能通过 run_id drill down 到 prompt_version、model、retrieved_chunks、tool_calls、policy_decision 和 eval score，这样才能定位问题并驱动迭代。

## 落地检查清单

- [ ] 是否有 Overview + Run Explorer？
- [ ] 是否能按 tenant、feature、model、prompt_version drill down？
- [ ] 是否同时看质量、成本、延迟、安全和 UX？
- [ ] 用户反馈是否能关联 run_id？
- [ ] 是否有成本、工具、RAG、安全告警？
- [ ] 是否能从 dashboard 跳到 Trace 和 Eval case？