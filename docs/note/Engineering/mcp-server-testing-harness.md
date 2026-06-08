# MCP Server Testing Harness：从 Demo 到可回归

MCP Server 最容易停留在“客户端能看到工具、调用一次成功”的 demo 阶段。真正工程化要建立 testing harness：每次 schema、工具逻辑、权限、部署方式变化，都能自动验证不会破坏历史行为。

## 测试目标

| 层级 | 要证明什么 |
|---|---|
| Discovery | `tools/list`、`resources/list`、`prompts/list` 能稳定返回预期 schema |
| Contract | 每个 tool 的输入、输出、错误码、边界条件符合契约 |
| Permission | 不同租户、角色、scope 下只能看到和调用允许的能力 |
| Interaction | elicitation / approval / cancel / decline 等交互分支可控 |
| Failure | 上游超时、429、空结果、部分失败时返回可解释错误 |
| Regression | 历史重要会话和 tool call 不因改动退化 |

## 推荐目录结构

```text
mcp-server/
  src/
  tests/
    contracts/
      tools-list.snapshot.json
      resources-list.snapshot.json
    fixtures/
      users.json
      upstream-responses.json
    cases/
      tool-call-success.json
      tool-call-permission-denied.json
      tool-call-upstream-timeout.json
    replay/
      incident-2026-06-08.json
  scripts/
    verify-contracts.ts
    replay-tool-call.ts
    smoke-client.ts
```

## tools/list 快照测试

每次工具 schema 变化都可能影响 Agent 选择工具的行为，因此 `tools/list` 应该进入快照审查。

需要关注：

- 工具是否被误删或误改名。
- `description` 是否过短、过泛或包含误导性词语。
- required 字段是否变化。
- enum、min/max、format 是否变化。
- schema version 是否递增。

## tools/call 契约测试

每个 tool 至少覆盖 5 类用例：

1. 正常输入。
2. 缺少必填字段。
3. 字段类型错误或范围越界。
4. 权限不足。
5. 上游服务失败或超时。

返回结果要同时满足“用户能看懂”和“系统能处理”：

```json
{
  "ok": false,
  "error": {
    "code": "UPSTREAM_TIMEOUT",
    "message": "工单系统响应超时，请稍后重试",
    "retryable": true,
    "upstream": "ticket-api"
  },
  "traceId": "run_..."
}
```

## 权限测试

权限测试不要只测“调用时拒绝”，还要测 discovery 阶段：

- 无权限用户是否看不到高风险工具。
- 只读用户是否不能调用写操作。
- 租户 A 是否不能读取租户 B 的 Resource。
- scope 降级后旧 token 是否立即失效。

## Elicitation 测试

Elicitation 要覆盖：

| 动作 | Server 应如何处理 |
|---|---|
| accept | 校验结构，继续执行后续流程 |
| decline | 给出替代路径，不假装拿到了信息 |
| cancel | 保持状态可恢复，不重复骚扰用户 |
| invalid content | 拒绝处理并返回可修复错误 |

不要用 elicitation 请求密码、API Key、token、支付信息等敏感数据。

## Replay 测试

生产问题复盘后，把失败样本沉淀为 replay case：

- 原始 tool call 参数。
- 用户/租户/scope 的脱敏上下文。
- 上游 mock 响应。
- 期望错误码或期望输出。
- 关联 incident / commit / fix。

这样下一次改 schema、description、权限或错误处理时，就能防止同类问题回归。

## CI 门禁

建议最低门禁：

```bash
npm run lint
npm run test:contracts
npm run test:permissions
npm run test:replay
npm run mcp:smoke
```

如果是 Python 项目，对应替换成 `pytest`、`ruff`、`mcp inspector` 或自定义 smoke client。

## 面试表达

> 我会给 MCP Server 建 testing harness：先测 discovery schema，避免工具描述和参数契约无意变化；再测 tool call 的正常、异常、权限和上游失败；最后把线上问题沉淀成 replay case，进入 CI release gate。

## 参考资料

- [MCP Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [Build an MCP Server](https://modelcontextprotocol.io/docs/develop/build-server)
- [MCP Elicitation](https://modelcontextprotocol.io/docs/concepts/elicitation)
