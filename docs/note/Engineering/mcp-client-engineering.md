# MCP Client 工程化：不只是会连 MCP Server

## 这篇文章解决什么问题

前面已经整理过 MCP Server 怎么写。但在真实 Agent 系统里，MCP Client 同样重要：

- 如何发现可用工具？
- 如何选择 server？
- 如何加载 tool schema？
- 如何处理连接失败？
- 如何隔离不同用户的工具权限？
- 如何把 MCP tool call 写入 Trace？
- 如何防止恶意 server 暴露危险工具？

MCP Client 的职责是把 MCP Server 暴露的能力安全、稳定、可观测地接入 Agent Runtime。

## MCP Client 基本职责

```text
Server Registry
  -> Connection Manager
  -> Tool Discovery
  -> Permission Filter
  -> Schema Adapter
  -> Tool Execution
  -> Result Normalization
  -> Trace / Audit
```

## Server Registry

需要记录：

```json
{
  "server_id": "github_tools",
  "transport": "stdio",
  "command": "node github-mcp.js",
  "allowed_tenants": ["internal"],
  "risk_level": "medium",
  "owner": "platform-team",
  "enabled": true
}
```

不要让用户随便接入未知 server 执行高风险工具。

## Tool Discovery

MCP Client 会发现 server 暴露的 tools/resources/prompts，但不能全部直接给模型。

需要过滤：

- 当前用户是否有权限。
- 当前任务是否需要。
- 工具风险等级是否允许。
- 是否需要审批。
- schema 是否合规。
- tool description 是否包含可疑指令。

## Schema Adapter

不同 server 的 schema 风格可能不一致。Client 层要做适配：

- 标准化 tool name。
- 标准化参数说明。
- 补充 risk_level。
- 添加 timeout。
- 添加 idempotency_key。
- 添加 tenant context。
- 限制参数范围。

## 连接管理

MCP Server 可能失败：

- 启动失败。
- stdio 断开。
- HTTP 超时。
- schema 加载失败。
- 工具执行无响应。

Client 要支持：

- health check。
- timeout。
- retry。
- circuit breaker。
- fallback。
- 禁用异常 server。

## 权限隔离

多用户系统里，MCP Client 不能共享敏感上下文：

- 每个 tenant 独立凭证。
- 用户 token 不进入模型上下文。
- server 调用带 user/tenant context。
- 工具结果按权限过滤。
- Trace 脱敏。

## Tool Result Normalization

工具结果要统一结构：

```json
{
  "ok": true,
  "tool_name": "search_issues",
  "result_summary": "found 3 issues",
  "data": [],
  "error_type": null,
  "metadata": {
    "duration_ms": 320,
    "server_id": "github_tools"
  }
}
```

不要把 server 原始输出无处理地塞给模型。

## 安全检查

MCP Client 要防：

- server 暴露危险工具。
- tool description 注入模型指令。
- 返回内容中包含 Prompt Injection。
- 工具结果包含密钥。
- server 访问越权资源。
- 工具执行无限阻塞。

## Trace 记录

记录：

- server_id。
- tool_name。
- schema_version。
- args_hash。
- risk_level。
- approval_id。
- duration_ms。
- result_summary。
- error_type。
- retry_count。

## 面试表达模板

> MCP Client 不只是连接 MCP Server。它需要维护 server registry、连接管理、tool discovery、权限过滤、schema adapter、执行超时、结果标准化和 Trace。Client 发现工具后不能全部暴露给模型，而要根据用户权限、任务类型、风险等级和审批策略过滤。不同 server 的 schema 要标准化，并补充 risk_level、timeout、tenant context 和 idempotency_key。执行结果要规范成统一结构，敏感数据脱敏，所有 server_id、tool_name、args_hash、duration、error_type 写入 Trace。

## 项目落地清单

- [ ] 有 MCP server registry。
- [ ] Tool discovery 后做权限过滤。
- [ ] Tool schema 有风险等级和 timeout。
- [ ] 连接失败有 retry / circuit breaker。
- [ ] 多租户凭证隔离。
- [ ] 工具结果标准化。
- [ ] MCP tool call 写入 Trace。
- [ ] 恶意 tool description 和返回内容有安全检查。

## 相关链接

- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [MCP Server](/note/Engineering/mcp-server)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent 协议全景](/topics/agent-protocol-landscape)
- [Tool System 横向对比](/topics/tool-system-comparison)
