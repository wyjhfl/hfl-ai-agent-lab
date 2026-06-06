# MCP Gateway 运维：多 Server 接入后怎么巡检、限流和止血

## 这篇文章解决什么问题

MCP Gateway 解决了多个 MCP Server 的统一接入、权限过滤和审计问题。但只设计架构不够，真正上线后还要回答：Server 挂了怎么办？工具超时怎么办？schema 变化怎么办？某个租户打爆工具怎么办？Prompt Injection 从工具返回怎么办？

MCP Gateway 运维的目标是建立巡检、监控、限流、降级、告警、回滚和复盘机制，让 MCP 工具生态可长期运行。

## 运维关注点

| 关注点 | 问题 |
|---|---|
| Health | Server 是否在线，连接是否稳定 |
| Schema | 工具 schema 是否变化，是否兼容 |
| Latency | 工具调用是否超时，p95 是否升高 |
| Error | invalid_args、permission_denied、timeout、5xx 比例 |
| Policy | 权限过滤是否正常，高风险工具是否被审批 |
| Security | 工具返回是否包含注入或敏感内容 |
| Cost | 工具调用是否造成外部 API 成本异常 |
| Tenant | 是否有租户滥用或异常流量 |

MCP Gateway 的运维不是只看进程是否存活，而是看工具能力是否安全可用。

## 每日巡检清单

| 检查项 | 说明 |
|---|---|
| Server Health | 在线率、重连次数、失败 server 列表 |
| Tool Discovery | schema diff、工具新增删除、risk_level 变化 |
| Error TopN | 错误最多的工具和租户 |
| Latency TopN | p95 最高的工具 |
| Policy Block | 权限拦截和高风险审批统计 |
| Injection Signals | 工具返回中可疑指令或 secret pattern |
| Cost Spike | 外部 API 调用量和费用异常 |
| Canary Status | 新 server 或新工具灰度状态 |

巡检结果应该进入日报或运营面板，而不是只在出事故时查日志。

## 指标设计

| 指标 | 含义 |
|---|---|
| mcp_server_up | Server 是否可用 |
| tool_discovery_success_rate | 工具发现成功率 |
| tool_call_success_rate | 工具调用成功率 |
| tool_call_p95_latency | 工具 p95 延迟 |
| tool_call_timeout_rate | 超时比例 |
| policy_block_rate | 策略拦截比例 |
| approval_required_count | 需要审批的调用数 |
| schema_change_count | schema 变化次数 |
| tenant_tool_quota_usage | 租户工具额度使用 |
| unsafe_content_detected | 可疑工具返回次数 |

建议按 server_id、tool_id、tenant_id、risk_level 维度打标签。

## 限流策略

MCP Gateway 应该有多层限流：

| 层级 | 示例 |
|---|---|
| Tenant 限流 | 每个租户每分钟工具调用上限 |
| User 限流 | 单用户并发和频率限制 |
| Tool 限流 | 某个工具最大并发 |
| Server 限流 | 某个 MCP Server 最大连接数 |
| Risk 限流 | 高风险工具低频且需审批 |
| Cost 限流 | 外部付费 API 达预算后降级 |

限流不是为了阻止用户使用，而是为了保护系统和外部依赖。

## 降级与止血

常见止血动作：

| 场景 | 止血策略 |
|---|---|
| 单个 Server 挂了 | 标记 unhealthy，隐藏其工具，使用 fallback |
| 某工具错误率升高 | 临时 disable tool |
| schema 异常变化 | 回滚到 pinned schema 或阻断调用 |
| 外部 API 成本飙升 | 降低额度，切换缓存或人工队列 |
| Prompt Injection 命中 | 阻断高风险工具，保留只读工具 |
| 租户滥用 | 对租户限流或暂停高风险工具 |

所有止血动作都应该记录：谁操作、什么时间、影响范围、恢复条件。

## Schema 变更运维

MCP Gateway 应该定期检查 schema diff：

- 新增工具：默认不进入生产自动执行，需要评审。
- 删除工具：检查是否有 Agent Profile 依赖。
- 参数新增：判断是否兼容。
- 参数类型变化：视为破坏性变更。
- risk_level 提高：需要安全审批。
- 描述变化：可能影响模型选择，也要评估。

工具描述也是契约的一部分，因为模型会根据描述选择工具。

## 事故复盘模板

MCP Gateway 事故复盘要记录：

| 字段 | 说明 |
|---|---|
| server_id / tool_id | 受影响工具 |
| tenant_scope | 影响租户 |
| first_detected_at | 首次发现时间 |
| symptom | 超时、越权、错误、成本、注入 |
| trace_samples | 代表性 tool_call_id |
| root_cause | 根因 |
| mitigation | 止血动作 |
| regression_case | 新增回归样本 |
| policy_update | 是否更新策略 |

复盘后要更新 MCP Client 测试、Gateway 策略和 Release Gate。

## 面试表达模板

我会把 MCP Gateway 当成生产系统运维，而不是只做工具转发。上线后需要监控 server health、tool discovery、schema diff、tool_call_success_rate、p95 latency、policy_block_rate、tenant quota 和 unsafe content。出现异常时可以按 server、tool、tenant、risk_level 做限流、禁用、回滚 schema 或转人工，并把事故样本加入回归测试。

## 常见误区

### 误区一：MCP Gateway 只是代理

它还承担工具治理、权限、审计、限流、安全和观测职责。

### 误区二：工具 schema 变化不重要

schema 变化会影响模型选择和参数生成，可能造成生产事故。

### 误区三：只监控 HTTP 状态码

还要监控工具语义错误、权限拦截、注入信号和成本异常。
