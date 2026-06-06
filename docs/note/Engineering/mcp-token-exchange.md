# MCP Token Exchange：MCP 工具调用中的 Token 交换怎么设计

## 这篇文章解决什么问题

MCP 让 Agent 能统一接入外部工具，但工具越多，凭证边界越复杂。一个常见问题是：Agent Runtime、MCP Client、Gateway、MCP Server 和下游业务系统之间到底传什么 Token？谁代表用户？谁代表服务？Token 能访问什么？过期后怎么处理？

MCP Token Exchange 的目标是把“一个长效大权限 Token 调所有工具”改成“按用户、租户、工具、scope、run 签发短期凭证”。

## 参与角色

| 角色 | 职责 |
|---|---|
| User / Tenant | 发起任务，决定数据访问边界 |
| Agent Runtime | 规划任务、选择工具，但不持有真实下游密钥 |
| MCP Client | 做工具发现、schema 校验、policy filter 和调用封装 |
| MCP Gateway | 统一鉴权、scope 映射、token exchange、审计和限流 |
| MCP Server | 暴露具体工具，执行下游操作 |
| Downstream API | GitHub、Slack、数据库、企业内部系统等 |

## Token 类型

| Token | 说明 | 生命周期 |
|---|---|---|
| user_session_token | 用户登录态，只证明用户身份 | 会话级 |
| agent_run_token | 当前 Agent run 的执行票据 | run 级，短期 |
| mcp_gateway_token | Client 调 Gateway 的凭证 | 服务间，短期或轮换 |
| tool_execution_token | Gateway 给具体 Server 的工具执行票据 | tool_call 级，最短 |
| downstream_access_token | 访问真实业务系统的 token | 按 scope 和用户授权控制 |

## 推荐流程

1. 用户发起任务，系统生成 run_id；
2. Runtime 根据任务选择工具，但不直接拿下游 token；
3. MCP Client 请求 Gateway：run_id、tool_id、args_hash、requested_scope；
4. Gateway 检查 tenant、role、tool risk、approval、quota；
5. Gateway 签发 tool_execution_token；
6. MCP Server 用该 token 换取或调用下游最小权限凭证；
7. 执行结果返回，审计记录 tool_call_id、scope、args_hash、policy_result；
8. token 到期或 run 结束后失效。

## Scope 设计

Scope 不应该只有 read/write 两类，建议拆细：

- resource：能访问哪个仓库、文档库、数据表、频道；
- action：read、search、create_draft、send、delete、execute；
- tenant / workspace：租户和空间；
- risk：是否允许高风险副作用；
- duration：有效期；
- quota：调用次数、数据量、成本上限；
- approval：是否绑定某次人工审批。

## 审计字段

每次 token exchange 都应该记录：

| 字段 | 说明 |
|---|---|
| exchange_id | token 交换事件 ID |
| run_id / step_id / tool_call_id | 关联 Agent Trace |
| user_id / tenant_id / role | 访问主体 |
| tool_id / server_id | 工具和 Server |
| requested_scope / granted_scope | 请求和实际授予 scope |
| approval_id | 高风险操作审批记录 |
| args_hash | 防止审批后参数被替换 |
| expires_at | 过期时间 |
| policy_result | allow / deny / require_approval |

## 失败处理

| 失败 | 处理 |
|---|---|
| token expired | 重新走 exchange，不复用旧 token |
| insufficient scope | 返回可解释错误，让 Agent 申请更小或更明确 scope |
| approval required | 进入 WaitingApproval，不直接执行 |
| server untrusted | Gateway 拒绝或要求管理员启用 |
| schema changed | 暂停调用，等待 schema diff 审核 |

## 面试表达模板

> 我会在 MCP Client 和 Server 之间加 Gateway 做 Token Exchange。Runtime 不持有真实下游凭证，只提交 run_id、tool_id、args_hash 和 requested_scope。Gateway 根据租户、角色、工具风险、审批状态和配额签发短期 tool_execution_token，并把 exchange_id、granted_scope、expires_at 和 policy_result 写入审计日志。

## 常见误区

### 误区一：所有 MCP Server 共用一个全局 Token

这会导致任何 Server 或工具泄漏都扩大到整个工具生态。

### 误区二：Token 只和用户绑定，不和工具调用绑定

高风险场景下 token 应绑定 run、tool_call、args_hash 和 approval_id。

### 误区三：只鉴权不审计

没有审计就无法复盘越权、误调用、供应链风险和高成本调用。

## 相关链接

- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)
- [Agent Secret Management](/note/Engineering/agent-secret-management)
- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
