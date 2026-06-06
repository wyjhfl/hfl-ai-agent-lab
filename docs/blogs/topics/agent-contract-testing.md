# Agent Contract Testing：把不稳定的 AI 输出约束成可验收接口

## 这篇文章解决什么问题

AI Agent 输出天然有不确定性，但工程系统不能只靠人工体验。Contract Testing 的目标不是要求模型每次说同一句话，而是验证 Agent 和外部系统之间的接口契约是否稳定。

契约测试适合验证：结构化输出、工具参数、工具返回、状态流转、事件格式、前端展示字段、Trace 字段。

## 哪些东西需要 Contract

| 对象 | 契约 |
|---|---|
| LLM 输出 | JSON schema、字段类型、枚举值 |
| Tool Call | tool_id、args schema、risk_level |
| Tool Result | status、data、error_type、result_digest |
| Task State | allowed transitions、terminal states |
| Trace Event | run_id、step_id、event_type、timestamp |
| UI API | response shape、分页、错误格式 |
| MCP Tool | schema_version、input/output schema |

这些契约稳定后，前端、后端、评测、监控才能可靠协作。

## Contract Test 与 Eval 的区别

| 维度 | Contract Test | Eval |
|---|---|---|
| 目标 | 接口和结构是否稳定 | 语义质量是否好 |
| 判断方式 | 确定性断言 | rubric、judge、人工标注 |
| 示例 | JSON 字段存在且类型正确 | 答案是否忠实、完整、有帮助 |
| 失败含义 | 系统集成会坏 | 模型效果退化 |

两者都需要。Contract Test 保证系统能接住输出，Eval 保证输出质量。

## 结构化输出契约

示例：Agent 输出一个工单分类结果。

```json
{
  "category": "refund | delivery | account | other",
  "priority": "low | medium | high",
  "confidence": 0.82,
  "reason": "...",
  "needs_human": false
}
```

测试重点：字段必须存在、枚举值合法、confidence 在 0-1、needs_human 是布尔值。不要断言 reason 必须逐字一致。

## Tool Call 契约

工具调用测试要覆盖：

- 正确 tool_id。
- 参数字段完整。
- 参数类型正确。
- 高风险工具包含 approval_id 或 requires_approval。
- 不允许多余危险参数。
- 参数经过业务校验。

## 状态机契约

Agent 任务状态不能随意跳转。

```text
queued -> running -> waiting_approval -> running -> succeeded
queued -> running -> failed_retryable -> queued
running -> cancelled
```

Contract Test 应断言非法跳转会被拒绝，例如 succeeded 不能重新变成 running。

## MCP Contract

MCP 工具契约至少包括：server_id、tool_id、schema_version、input_schema、output_schema、risk_level、side_effect、requires_approval。Schema 变化要触发回归。

## 测试策略

| 策略 | 说明 |
|---|---|
| golden schema | 保存预期 schema |
| mock model | 固定模型输出，测试系统解析 |
| mock tool | 固定工具返回，测试 Agent 状态 |
| property check | 检查字段范围和枚举 |
| snapshot event | 检查 Trace event shape |
| compatibility test | 新旧 schema 兼容性 |

## 常见误区

- 断言完整自然语言回答，导致测试脆弱。
- 只测 happy path，不测错误格式。
- 只测 API，不测 Trace event。
- schema 改了但前端和评测没同步。
- MCP tool schema 没有版本。

## 面试表达

> 我会把 Agent 测试拆成 Contract Test 和 Eval。Contract Test 不判断答案好不好，而是保证结构化输出、工具参数、工具返回、任务状态、Trace 事件和 MCP schema 的接口契约稳定。比如 JSON 字段、枚举、类型、状态机跳转、tool_id 和 schema_version 都可以确定性断言；自然语言 reason 不做逐字匹配。这样前端、后端、监控和评测系统不会因为模型输出漂移而集成失败。

## 相关链接

- [Structured Output 工程化](/note/Engineering/structured-output-engineering)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [Browser Automation Testing](/topics/browser-automation-testing-agent-ui)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
