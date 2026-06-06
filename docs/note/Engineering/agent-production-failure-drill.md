# Agent Production Failure Drill：上线前故障演练清单

## 这篇文章解决什么问题

Agent 系统上线前只跑功能测试是不够的。真实线上问题通常不是“完全不能用”，而是：模型变慢、工具超时、RAG 召回变差、缓存返回旧答案、审批卡住、MCP Server schema 变化、多租户权限异常、成本突然上升。

Production Failure Drill 的目标是主动制造故障，验证系统能否发现、隔离、降级、恢复和复盘。它是 Agent Release Gate 和生产运维 Runbook 之间的桥梁。

## 演练原则

| 原则 | 说明 |
|---|---|
| 小范围 | 先在 staging 或 canary 租户演练 |
| 可观测 | 每个故障都要有指标、日志、Trace |
| 可止血 | 演练前准备开关和回滚路径 |
| 可复盘 | 演练结束要沉淀失败样本和 Runbook 更新 |
| 不伤害用户 | 不在真实用户流量上做破坏性实验 |

演练不是为了证明系统完美，而是为了提前发现系统在哪些地方没有保护。

## 故障场景一：模型延迟飙升

### 注入方式

- 将模型网关延迟人为增加 3-10 秒。
- 让部分请求返回 timeout。
- 降低模型可用配额。

### 观察指标

- p95 / p99 latency。
- timeout_rate。
- queue_depth。
- fallback_rate。
- user_cancel_rate。

### 期望行为

- 超时请求能被标记为可重试或降级。
- 低风险任务可以切到备用模型。
- 高风险任务不因 fallback 破坏安全策略。
- 前端展示“处理中 / 已降级 / 可稍后查看”。

## 故障场景二：RAG 召回退化

### 注入方式

- 使用旧 index_version。
- 禁用 rerank。
- 删除部分关键 chunk。
- 构造无答案问题。

### 观察指标

- Recall@k。
- citation_accuracy。
- no_answer_accuracy。
- context_precision。
- answer_feedback_negative_rate。

### 期望行为

- Eval Gate 能拦截明显退化版本。
- 无证据时拒答，不编造。
- Trace 能看到入库、召回、rerank、context pack 哪一层失败。
- 失败样本进入 regression set。

## 故障场景三：工具超时或错误率升高

### 注入方式

- MCP Server 返回 500。
- 工具执行超过 timeout。
- 工具返回 invalid schema。
- 外部 API 限流。

### 观察指标

- tool_error_rate。
- timeout_rate。
- retry_count。
- circuit_breaker_open。
- human_takeover_count。

### 期望行为

- 可重试错误按退避重试。
- 不可重试错误不反复消耗成本。
- 连续失败时熔断工具。
- Agent 给出可解释失败信息或转人工。

## 故障场景四：审批流程卡住

### 注入方式

- 审批人长时间不处理。
- 审批通过后参数变化。
- 审批过期后继续执行。
- 非授权角色尝试审批。

### 观察指标

- approval_wait_time。
- approval_expired_count。
- approval_rejected_count。
- bypass_blocked_count。

### 期望行为

- 任务进入 WaitingApproval。
- 超过 SLA 后提醒或转人工。
- 参数变化必须重新审批。
- 过期或越权审批不能执行。

## 故障场景五：多租户隔离异常

### 注入方式

- 使用 tenant A 的用户请求 tenant B 文档。
- 缓存中放入跨租户相似 query。
- MCP 工具参数伪造 tenant_id。
- Memory 检索混入其他用户记忆。

### 观察指标

- permission_leak_rate。
- blocked_cross_tenant_access。
- cache_permission_miss。
- policy_denied_count。

### 期望行为

- 数据访问被执行层拒绝。
- 缓存命中因 scope 不一致被拦截。
- 工具层忽略模型传入的 tenant_id。
- Trace 能证明没有跨租户数据进入上下文。

## 故障场景六：成本失控

### 注入方式

- 构造长上下文输入。
- 让工具反复失败触发重试。
- 禁用缓存。
- 增加 batch eval 样本量。

### 观察指标

- cost_per_task。
- token_per_run。
- retry_cost_ratio。
- cache_hit_rate。
- budget_exceeded_count。

### 期望行为

- 触发 token budget 和 step budget。
- 超预算任务停止或请求审批。
- 批量任务被限流。
- 仪表盘能定位成本来源。

## 演练报告模板

每次演练结束写一份简短报告：

| 字段 | 内容 |
|---|---|
| drill_id | 演练编号 |
| scenario | 故障场景 |
| scope | staging / canary / mock |
| injected_failure | 注入方式 |
| expected_behavior | 预期行为 |
| actual_behavior | 实际结果 |
| detection | 是否被监控发现 |
| mitigation | 是否成功止血 |
| gaps | 暴露问题 |
| action_items | 修复项 |
| regression_cases | 要加入的回归样本 |

演练的价值在于把“可能的问题”转成可执行改进。

## 面试表达模板

我会上线前做故障演练，不只跑 happy path。比如模拟模型超时、RAG 召回退化、MCP 工具 500、审批过期、多租户缓存误命中和成本超预算。每个演练都要求有观测指标、预期降级、止血开关和复盘输出，最后把暴露的问题加入 regression eval、Runbook 和 Release Gate。这样系统不是出了事故才补救，而是提前验证恢复能力。

## 常见误区

### 误区一：测试通过就能上线

测试通常覆盖预期路径，故障演练覆盖异常路径和恢复能力。

### 误区二：只演练基础设施故障

Agent 还要演练模型、RAG、工具、审批、权限、成本和评测退化。

### 误区三：演练完不沉淀样本

没有进入回归集、Runbook 和 Release Gate 的演练，价值会快速流失。

## 相关链接

- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [Agent 事故复盘模板](/topics/agent-incident-postmortem-template)
- [Agent 错误分类](/note/Engineering/agent-error-taxonomy)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
