# MCP Server Template for Agents：Agent 可用的 MCP Server 模板

## 这篇文章解决什么问题

很多 MCP Server 示例能跑通工具调用，但距离生产级 Agent 使用还差一层：工具 schema 不稳定、错误不可恢复、权限边界不清楚、没有审计、没有测试，也没有告诉 Agent 什么时候该用资源、工具或提示模板。

MCP Server Template 的目标是给每个 MCP Server 一个可复用骨架，让它不仅能被调用，还能被治理、观测、测试和安全接入 Agent Runtime。

## MCP Server 的三个核心出口

| 出口 | 用途 | 示例 |
|---|---|---|
| Tools | 让模型触发动作 | search_docs、create_ticket、query_database |
| Resources | 暴露上下文数据 | file、ticket、schema、runbook |
| Prompts | 提供可复用工作流模板 | triage_ticket、summarize_incident |

设计 MCP Server 时不要把所有能力都做成 Tool。只读上下文更适合 Resource，固定任务流程更适合 Prompt，高副作用动作才需要 Tool + Policy。

## 推荐目录结构

```txt
mcp-server-example/
  src/
    server.ts
    tools/
      search-docs.ts
      create-ticket.ts
    resources/
      runbook-resource.ts
    prompts/
      incident-summary.ts
    policy/
      tool-risk.ts
      authz.ts
    telemetry/
      audit-log.ts
      metrics.ts
    errors.ts
    schema.ts
  tests/
    contract.test.ts
    policy.test.ts
    injection.test.ts
  package.json
  README.md
```

## Tool 模板字段

| 字段 | 说明 |
|---|---|
| name | 稳定工具名，不随意改 |
| description | 说明何时使用、何时不要使用 |
| input_schema | 参数类型、必填、枚举、限制 |
| output_schema | status、data、evidence_refs、error |
| risk_level | R0-R4 风险等级 |
| idempotency | 是否需要 idempotency_key |
| timeout_ms | 工具超时预算 |
| auth_scope | 所需权限 |
| audit_event | 审计事件名 |

## 统一错误结构

| 字段 | 示例 |
|---|---|
| code | PERMISSION_DENIED / VALIDATION_ERROR / UPSTREAM_TIMEOUT |
| message | 给用户看的短错误 |
| retryable | 是否可自动重试 |
| user_action_required | 是否需要用户补充输入 |
| safe_to_show | 是否可展示给用户 |
| root_cause_hint | schema、auth、network、upstream、policy |

没有结构化错误，Agent 就只能“猜”是否重试或降级。

## Policy 层

MCP Server 不应该完全信任客户端或模型。至少需要：

1. 参数校验：schema 只是第一层，还要做业务校验。
2. 权限校验：tenant、workspace、role、scope。
3. 风险分级：读取、写入、删除、外发、财务动作分级。
4. 审批绑定：高风险工具必须绑定 approval_id 和 args_hash。
5. 速率限制：防止 Agent 循环调用。
6. 输出脱敏：不要把 secret、PII、内部错误栈直接返回。

## Agent 友好的输出

Tool 输出不要直接返回一大段原始 JSON。推荐结构：

| 字段 | 说明 |
|---|---|
| status | success、partial、failed、denied |
| summary | 给模型和用户看的短摘要 |
| key_fields | 模型后续推理需要的字段 |
| evidence_refs | 原始记录引用 |
| next_actions | 推荐下一步 |
| error | 结构化错误 |
| raw_ref | 原始结果存储引用 |

## 测试清单

| 测试 | 目标 |
|---|---|
| Tool schema contract | 输入输出 schema 不破坏客户端 |
| Permission test | 不同角色不能越权 |
| Prompt injection test | 外部资源不能诱导危险工具调用 |
| Timeout test | 超时能返回 retryable 错误 |
| Idempotency test | 重试不会重复写入 |
| Audit test | 高风险动作有审计事件 |
| Resource test | URI、MIME、权限过滤正确 |

## 上线门禁

- [ ] 每个 Tool 都有 schema version。
- [ ] 每个 Tool 都有 risk_level 和 auth_scope。
- [ ] 错误结构包含 retryable 和 user_action_required。
- [ ] 高风险 Tool 支持 approval_id / args_hash。
- [ ] 输出包含 evidence_refs 或 raw_ref。
- [ ] 有 contract、policy、injection、timeout 测试。
- [ ] 有 health check、metrics 和 audit log。

## 面试表达

可以这样讲：

> 我设计 MCP Server 时不会只暴露一个函数调用，而是把 Tools、Resources、Prompts 分开建模。每个 Tool 都有 schema、风险等级、权限范围、超时、结构化错误和审计事件。这样 Agent 调用失败时能判断是否重试，高风险操作能审批，线上也能通过 metrics 和 audit log 排查。