# Model Provider Failover：模型供应商故障怎么降级

## 这篇文章解决什么问题

生产级 Agent 不能假设模型供应商永远稳定。模型 API 可能限流、超时、区域故障、价格变化、模型版本行为变化，甚至某个账号额度耗尽。如果没有 Failover，整个 Agent 系统会因为单个供应商不可用而停止。

Model Provider Failover 的目标是设计多供应商、多模型、多路由策略，让系统在质量、成本、安全和延迟之间可控降级。

## 故障类型

| 故障 | 表现 |
|---|---|
| timeout | 请求超过 p95 / p99 或硬 timeout |
| rate limit | 429、quota exceeded、并发受限 |
| provider outage | 某区域或供应商整体不可用 |
| model regression | 新模型质量下降或格式不稳定 |
| safety block | 供应商安全策略误拦截 |
| cost spike | 单位 token 成本或重试成本突然升高 |
| auth failure | key 失效、权限变化、账单异常 |

## 路由策略

| 策略 | 说明 |
|---|---|
| primary / secondary | 主供应商失败后切备用 |
| task-based routing | 不同任务用不同模型或供应商 |
| quality-tier routing | 高价值任务保质量，低价值任务降成本 |
| latency-tier routing | 交互任务优先低延迟模型 |
| safety-tier routing | 高风险任务使用更强安全策略和审计 |
| regional routing | 按区域、合规和可用性选择供应商 |

## Failover 前必须验证什么

不能只要模型能返回文本就切过去。备用模型必须通过：

- structured output schema；
- tool calling 参数生成；
- RAG 引用格式；
- 安全拒答；
- Prompt Regression；
- cost / latency budget；
- 关键语言和业务术语；
- 数据合规和供应商策略。

## 降级等级

| 等级 | 行为 |
|---|---|
| L0 正常 | 主模型正常运行 |
| L1 重试 | 同模型短重试，限制次数 |
| L2 同供应商降级 | 切更快或更稳定模型 |
| L3 跨供应商切换 | 切备用供应商模型 |
| L4 功能降级 | 禁用复杂工具、多轮规划或高成本 RAG |
| L5 人工接管 | 高风险或关键任务进入人工队列 |
| L6 暂停能力 | 安全或质量无法保证时暂停入口 |

## 观测指标

- provider_error_rate；
- timeout_rate；
- rate_limit_rate；
- failover_count；
- fallback_success_rate；
- quality_delta_after_failover；
- cost_delta_after_failover；
- latency_delta_after_failover；
- structured_output_failure_rate；
- tool_arg_error_rate。

## 面试表达模板

> 我不会把模型调用写死到单一供应商，而是通过 LLM Gateway 做 provider routing 和 failover。备用模型上线前必须通过 schema、tool calling、RAG citation、安全拒答和回归评测。故障时先短重试，再同供应商降级，必要时跨供应商切换；如果质量或安全不能保证，就禁用高风险能力或进入人工接管。

## 常见误区

### 误区一：备用模型只要便宜就行

备用模型必须能满足关键格式、工具、引用和安全要求，否则降级会引入业务事故。

### 误区二：无限重试

无限重试会放大成本和延迟，还可能压垮队列。重试必须有预算和熔断。

### 误区三：Failover 不做用户体验设计

降级后可能功能变少、延迟变长、质量变低，需要在产品层给出状态提示和人工兜底。

## 相关链接

- [LLM Gateway](/note/Engineering/llm-gateway)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
- [Model Rollout Canary](/note/Engineering/model-rollout-canary)
- [Agent Latency Budget](/note/Engineering/agent-latency-budget)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
