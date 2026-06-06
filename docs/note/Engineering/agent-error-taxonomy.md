# Agent 错误分类：失败不是只有“模型不行”

## 这篇文章解决什么问题

线上 Agent 失败时，很多团队只会说“模型效果不好”。这会导致排查没有方向，重试策略也很粗糙。生产级 Agent 必须把错误分类，因为不同错误的修复方式完全不同。

Agent Error Taxonomy 的目标是把失败变成可定位、可统计、可恢复、可回归的工程信号。

## 错误分类总览

| 大类 | 典型错误 | 处理方式 |
|---|---|---|
| Input Error | 用户意图不清、缺少参数 | 澄清、表单补全 |
| Policy Error | 权限不足、风险过高 | 拒绝、审批、转人工 |
| Context Error | 证据缺失、上下文过期、记忆冲突 | 重新检索、压缩、刷新状态 |
| Retrieval Error | 召回失败、过滤错误、rerank 错误 | RAG debug、索引修复 |
| Model Error | 格式错误、幻觉、推理错误 | 输出修复、换模型、评测回归 |
| Tool Error | 参数错误、超时、外部 5xx | 参数校验、重试、熔断 |
| Runtime Error | 状态机异常、循环失控 | 停止条件、断点恢复 |
| Infra Error | 队列积压、数据库失败、限流 | backpressure、降级、告警 |
| UX Error | 用户看不懂状态、无法重试 | 前端状态、错误提示优化 |

## 错误记录结构

每个失败 step 建议记录：

```json
{
  "error_type": "tool_timeout",
  "error_category": "Tool Error",
  "retryable": true,
  "user_visible": true,
  "risk_level": "L1",
  "suggested_action": "retry_with_backoff",
  "root_cause_hint": "external_service_timeout"
}
```

错误分类要进入 Trace，而不是只写在日志文本里。

## Retryable vs Terminal

| 错误 | 是否重试 | 原因 |
|---|---|---|
| LLM rate limit | 是 | 等待后可能恢复 |
| Tool timeout | 是 | 外部服务偶发问题 |
| JSON schema error | 一次修复后再试 | 可能是格式问题 |
| Permission denied | 否 | 权限不满足，重试无意义 |
| Prompt injection detected | 否 | 应拒绝或降权 |
| Missing required input | 否 | 需要用户补充 |
| Database unavailable | 是，但要限流 | 基础设施故障可能扩大 |

无脑重试会制造 retry storm。错误分类是 backpressure 和恢复策略的前提。

## 用户可见错误

不是所有错误都应该原样暴露给用户。

| 错误 | 用户提示 | 内部记录 |
|---|---|---|
| 权限不足 | 你没有执行该操作的权限 | policy_denied + scope |
| 工具超时 | 外部系统响应超时，可稍后重试 | tool_timeout + duration |
| 检索无结果 | 没找到足够证据，请补充资料 | retrieval_empty |
| 模型格式错误 | 系统正在修复输出格式 | schema_validation_failed |
| 安全命中 | 该请求涉及高风险操作，需要人工确认 | risk_policy_triggered |

用户提示要可理解，内部错误要可排查。

## 错误到评测的闭环

每类高频错误都应该转成 eval case：

1. 从 Trace 中抽取失败样本。
2. 标注 error_category 和 root cause。
3. 修复代码、prompt、检索或工具。
4. 把样本加入 regression set。
5. 后续发布前自动回归。

这样错误分类就不只是运维字段，而是持续改进入口。

## 错误指标

| 指标 | 说明 |
|---|---|
| error_rate_by_category | 各类错误占比 |
| retry_success_rate | 重试后成功比例 |
| terminal_failure_rate | 不可恢复失败比例 |
| policy_denied_rate | 权限拒绝比例 |
| tool_timeout_rate | 工具超时比例 |
| schema_error_rate | 输出格式失败比例 |
| user_recover_rate | 用户根据提示完成恢复比例 |

## 面试表达

> 我不会把 Agent 失败都归因成模型不行。生产级 Agent 要有错误分类，把失败分成输入、权限、上下文、检索、模型、工具、运行时、基础设施和用户体验几类。每个 step 的错误都记录 error_category、retryable、user_visible、risk_level 和 suggested_action。可重试错误走 backoff，不可重试错误进入澄清、拒绝、审批或转人工。高频错误会被抽成 regression case，形成从线上失败到评测集的闭环。

## 相关链接

- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
