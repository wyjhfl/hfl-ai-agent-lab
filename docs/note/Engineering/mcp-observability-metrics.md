# MCP Observability Metrics：MCP 工具体系怎么观测

## 这篇文章解决什么问题

MCP 工具接入多了以后，问题不再只是某个 Server 能不能启动，而是：工具发现是否稳定、schema 是否变化、调用延迟是否升高、错误是否集中在某个 server、token exchange 是否失败、审批是否卡住、供应链风险是否被及时发现。

MCP Observability Metrics 的目标是建立 MCP Gateway / Client / Server 的统一观测指标，让工具生态可运维、可审计、可降级。

## 指标分层

| 层级 | 指标 |
|---|---|
| Server Health | up/down、heartbeat、version、schema_hash |
| Tool Discovery | tool_count、schema_diff_count、discovery_latency |
| Call Metrics | call_count、success_rate、error_rate、p95_latency |
| Policy Metrics | allow、deny、require_approval、risk_level distribution |
| Token Metrics | token_exchange_success、scope_denied、expired_token |
| Approval Metrics | approval_wait_ms、timeout_rate、reject_rate |
| Safety Metrics | injection_detected、secret_redacted、sandbox_blocked |
| Cost Metrics | tool_cost、downstream_api_cost、retry_cost |

## Trace 字段

每次 MCP 工具调用应该能关联：

- run_id / step_id / tool_call_id；
- server_id / server_version；
- tool_id / schema_version / schema_hash；
- requested_scope / granted_scope；
- risk_level / policy_result；
- approval_id / args_hash；
- latency_ms / retry_count / timeout_ms；
- error_type / error_message_sanitized；
- result_hash / output_size；
- tenant_id / workspace_id。

## 告警场景

| 告警 | 可能原因 |
|---|---|
| server_health_down | MCP Server 崩溃、网络不可达、认证失败 |
| schema_diff_unreviewed | 工具参数变化未审核 |
| p95_latency_spike | 下游 API 慢、网络问题、Server 卡住 |
| error_rate_spike | schema 不兼容、权限变更、外部服务故障 |
| token_exchange_denied | scope 变更、角色不足、策略误配 |
| approval_timeout_spike | 人审队列没人处理或审批 UI 故障 |
| sandbox_blocked_spike | 工具行为异常或被注入诱导 |

## Dashboard 结构

建议 MCP Dashboard 有 5 个视图：

1. Server Inventory：server、version、owner、health、schema_hash；
2. Tool Catalog：tool、risk_level、schema、approval_policy、usage；
3. Runtime Metrics：调用量、成功率、延迟、错误、重试；
4. Security View：token、scope、policy、sandbox、injection；
5. Incident View：最近 schema diff、错误峰值、降级动作和复盘链接。

## 面试表达模板

> 我会把 MCP 工具生态纳入统一观测，而不是只看 Server 是否启动。每次调用都记录 server_id、tool_id、schema_hash、risk_level、policy_result、token scope、approval_id、latency 和 error_type。Dashboard 能看到 server health、schema diff、工具成功率、token exchange、审批等待和安全拦截，支持快速降级和复盘。

## 常见误区

### 误区一：MCP Server 能启动就算可用

启动成功不代表工具 schema 正确、权限正确、延迟可接受、输出可被 Agent 使用。

### 误区二：只看调用成功率

还要看 schema diff、policy deny、approval timeout、token exchange 和 sandbox block。

### 误区三：错误日志不脱敏

MCP 工具可能返回下游 API 错误、路径、header 或敏感数据，日志必须清洗。

## 相关链接

- [MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)
- [MCP Client 工程化](/note/Engineering/mcp-client-engineering)
- [MCP Token Exchange](/note/Engineering/mcp-token-exchange)
- [MCP Server Hardening](/note/Engineering/mcp-server-hardening)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
