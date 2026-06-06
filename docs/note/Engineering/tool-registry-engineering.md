# Tool Registry 工程化：把工具当作可治理资产

## 这篇文章解决什么问题

Agent 能调用工具以后，工具数量会很快增长：

- 查询知识库。
- 创建工单。
- 发送邮件。
- 查询数据库。
- 调用 CRM。
- 读写文件。
- 接入 MCP Server。

如果没有 Tool Registry，工具会散落在代码里，出现：

- 工具说明不一致。
- 参数 schema 不规范。
- 风险等级不清楚。
- 谁能调用不清楚。
- 工具版本不可追溯。
- 高风险工具绕过审批。
- 工具失败率无人监控。

Tool Registry 的目标是把工具从“函数集合”变成可注册、可发现、可授权、可审批、可审计、可评测的工程资产。

## Tool Registry 记录什么

```json
{
  "tool_id": "create_ticket",
  "name": "Create Ticket",
  "version": "v2",
  "description": "Create an after-sales support ticket draft",
  "schema": {},
  "risk_level": "L3",
  "side_effect": true,
  "idempotent": true,
  "requires_approval": true,
  "allowed_roles": ["operator", "admin"],
  "owner": "support-platform",
  "timeout_ms": 5000,
  "enabled": true
}
```

最重要的不是 description，而是风险、权限、版本和审计字段。

## 工具生命周期

```text
Draft
  -> Review
  -> Staging
  -> Enabled
  -> Deprecated
  -> Disabled
```

每次工具上线前要检查：

- schema 是否严格。
- 参数是否有范围限制。
- 是否有副作用。
- 是否需要审批。
- 是否有幂等键。
- 是否有超时和错误码。
- 是否有单元测试和 smoke。
- 是否写入 Trace。

## 工具风险等级

| 等级 | 例子 | 控制 |
|---|---|---|
| L0 | 格式转换、只读公开查询 | 记录 Trace |
| L1 | 读取租户内文档 | 权限过滤 |
| L2 | 创建草稿 | 参数校验，可撤销 |
| L3 | 发送邮件、创建工单 | 人审 + 幂等 |
| L4 | 删除数据、付款、执行命令 | 默认禁用或强审批 |

风险等级要影响 Agent 可见工具列表，而不是只写在文档里。

## Tool Discovery

Agent 不应该每次看到所有工具。Registry 应按任务上下文筛选：

```text
candidate_tools = tools
  .filter(enabled)
  .filter(role allowed)
  .filter(tenant allowed)
  .filter(task_type allowed)
  .filter(risk allowed)
```

这样能降低 Prompt 长度、减少误调用、降低安全风险。

## Schema 设计原则

- 字段少而明确。
- enum 优先。
- 数值有范围。
- 字符串有长度限制。
- 文件路径要相对路径。
- URL 要域名白名单。
- 高风险参数要二次确认。
- 输出也要结构化。

## Tool Versioning

工具变更需要版本：

| 变更 | 是否升版本 |
|---|---|
| 新增可选字段 | minor |
| 删除字段 | major |
| 改字段含义 | major |
| 改风险等级 | policy version |
| 改外部 API | major |
| 改输出结构 | major |

Trace 中要记录 tool_version，否则历史 run 无法复现。

## 工具监控

每个工具至少监控：

- call_count。
- success_rate。
- latency p95。
- timeout_rate。
- schema_error_rate。
- permission_denied_rate。
- approval_rejection_rate。
- retry_count。
- cost。

工具失败率高时，可能是 schema 不清楚，也可能是外部系统不稳定。

## 面试表达模板

> 我会为 Agent 工具设计 Tool Registry，而不是把工具散落在代码里。每个工具记录 tool_id、version、schema、risk_level、side_effect、idempotent、requires_approval、allowed_roles、owner、timeout 和 enabled。Agent 每次任务只看到经过用户权限、任务类型和风险策略过滤后的候选工具。工具变更要版本化，调用时记录 tool_version、args_hash、approval_id、duration 和 error_type。高风险工具必须有人审和幂等键，工具指标进入监控，包括成功率、延迟、schema 错误和审批拒绝率。

## 项目落地清单

- [ ] 工具有统一注册表。
- [ ] 工具 schema 严格校验。
- [ ] 工具风险等级影响可见性。
- [ ] 高风险工具需要审批。
- [ ] 工具调用有幂等键。
- [ ] 工具版本写入 Trace。
- [ ] 工具有 owner 和启停状态。
- [ ] 工具成功率和失败率可监控。

## 相关链接

- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [MCP Client 工程化](/note/Engineering/mcp-client-engineering)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Tool Calling 工程化](/topics/tool-calling-engineering)
