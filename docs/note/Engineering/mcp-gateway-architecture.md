# MCP Gateway 架构：统一治理外部工具接入

## 这篇文章解决什么问题

当 Agent 只接一两个 MCP Server 时，可以在代码里直接连接。但工具数量、团队数量、租户权限和风险等级变多后，直接连接会变成治理问题。

MCP Gateway 的目标是把外部工具接入从每个 Agent 自己连，升级为统一发现、统一鉴权、统一策略、统一审计、统一观测。

## 架构位置

```text
Agent Runtime
  ↓
MCP Client Adapter
  ↓
MCP Gateway
  ↓
MCP Server Registry
  ↓
MCP Servers / Tools / Resources / Prompts
```

Agent Runtime 不直接知道所有 Server 的连接细节，而是向 Gateway 请求当前任务可用工具。

## Gateway 负责什么

| 能力 | 说明 |
|---|---|
| Server Registry | 管理 server_id、owner、env、endpoint、auth、health |
| Tool Discovery | 拉取 tools/resources/prompts 并缓存 schema |
| Policy Filter | 按 user、tenant、role、task_type、risk 过滤工具 |
| Schema Adapter | 规范化不同 Server 返回的 tool schema |
| Secret Boundary | token 和 secret 不暴露给 Agent Runtime |
| Approval Gate | 高风险工具统一进入审批流 |
| Rate Limit | 按 server、tool、tenant、user 限流 |
| Audit Log | 记录 tool_call、args_hash、result_digest、error_type |
| Health Check | 监控 Server 可用性、延迟和错误率 |
| Version Control | 管理 schema 版本、server 版本和兼容性 |

## 核心数据模型

### mcp_server

```text
server_id
name
owner_team
environment
transport
endpoint
allowed_tenants
auth_type
status
version
```

### mcp_tool_cache

```text
tool_id
server_id
name
description
schema_json
schema_version
risk_level
side_effect
requires_approval
enabled
```

### mcp_tool_call_log

```text
call_id
run_id
step_id
server_id
tool_id
tool_version
user_id
tenant_id
args_hash
approval_id
status
duration_ms
error_type
result_digest
```

## 工具发现流程

1. Gateway 定时或按需连接 MCP Server。
2. 拉取 tools、resources、prompts。
3. 校验 schema 是否符合内部规范。
4. 对工具打标签：risk_level、side_effect、owner、requires_approval。
5. 写入 tool cache。
6. Agent 请求工具列表时，只返回经过策略过滤后的工具。

模型不应该看到所有工具，只应该看到当前用户、租户、任务和环境允许调用的工具。

## 权限过滤

工具是否可见至少取决于用户角色、租户、workspace、任务类型、数据范围、工具风险等级、审批策略和运行环境。高风险工具在 production 中默认需要 approval。

## 执行流程

```text
Agent 选择 tool_id 和参数
  ↓
Gateway 校验工具是否可用
  ↓
参数 schema 校验
  ↓
权限和风险策略检查
  ↓
必要时创建 approval
  ↓
调用对应 MCP Server
  ↓
标准化返回结果并写入 Trace
```

## 高风险工具治理

| 风险 | 控制 |
|---|---|
| 参数错误 | schema + business validation |
| 越权调用 | tenant / role / scope filter |
| 危险副作用 | approval + idempotency key |
| 注入攻击 | 外部内容降权，工具参数二次校验 |
| 结果污染 | result sanitizer + digest |
| 审计缺失 | call log + trace + result digest |

## 观测指标

- tool discovery success
- schema change count
- tool call success rate
- p95 duration
- approval reject rate
- policy deny rate
- server error rate
- stale schema rate

## 面试表达

> 多 MCP Server 场景下我会引入 MCP Gateway，而不是让每个 Agent 直接连接所有 Server。Gateway 负责 server registry、tool discovery、schema cache、权限过滤、审批、限流、审计和监控。Agent 每次只拿到当前用户、租户和任务允许的工具；高风险工具必须经过审批和幂等控制。所有 tool_call 都记录 server_id、tool_id、schema_version、args_hash、approval_id、duration 和 error_type。

## 相关链接

- [MCP Server](/note/Engineering/mcp-server)
- [MCP Client 工程化](/note/Engineering/mcp-client-engineering)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent 协议全景](/topics/agent-protocol-landscape)
