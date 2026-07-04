# Project B 路线图：从 Runtime 原型到可答辩作品

## 当前基线

- FastAPI + custom Harness。
- Coordinator、Analyst、Executor、Reviewer 角色编排。
- ToolGateway、PolicyEngine、OperationWhitelist。
- Human approval、audit trail、trace、trajectory visualization。
- Next.js Operator Console。
- SQLite demo 默认路径。
- fake/offline LLM 默认模式。

## 后续演进

| 阶段 | 目标 | 不做什么 |
|---|---|---|
| v0.5 面试展示版 | 稳定 demo flow、补齐截图和讲解稿 | 不接真实生产系统 |
| v0.6 Pilot Path | PostgreSQL / Redis pilot path、更多策略样例 | 不声明 public production ready |
| v0.7 Provider Opt-in | 可选真实 LLM provider、budget、cache、fallback | 不默认依赖真实 LLM |
| v0.8 MCP 深化 | stdio MCP client skeleton、更多 fake MCP tools | 不接未知外部工具 |

## 作品集重点

Project B 的卖点不是“自动化程度最高”，而是：

- 可解释 orchestration。
- governed tool execution。
- HITL approval / resume。
- audit trail。
- LLM fallback / offline boundary。
- NL2SQL demo。
- operator console。
- trajectory visualization。
