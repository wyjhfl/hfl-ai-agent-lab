# Project B 架构设计：运营中台 Multi-Agent Copilot

> 这页用于项目答辩：面试官问“你的多 Agent 项目到底怎么设计？”时，能从业务、模块、状态、数据、权限和可观测性完整回答。

## 设计目标

Project B 不追求“Agent 越多越好”，而是追求三个工程目标：

1. **可控**：模型只能提出计划和参数，真正执行由工具层和权限层控制。
2. **可观测**：每次任务都能回放输入、计划、工具调用、审批、结果和错误。
3. **可评测**：关键任务有 golden cases、失败样本和 release gate。

## 分层架构

| 层级 | 模块 | 关键设计 |
|---|---|---|
| Product UI | Copilot Panel、Trace Drawer、Approval Modal | 用户能看到 Agent 正在做什么、为何需要审批、结果来自哪里 |
| API Layer | Run Controller、Session、Tenant Context | 统一创建 run、管理状态、绑定用户和租户 |
| Agent Runtime | Router、Planner、Executor、Reviewer | 多 Agent 角色分工，不让模型自由串场 |
| Context Layer | RAG、Metric Dictionary、SOP、Memory | 给 Agent 提供指标口径、业务规则和历史上下文 |
| Tool Layer | Tool Registry、Risk Policy、MCP / internal tools | 工具 schema、风险等级、幂等性、审批策略统一治理 |
| Governance | RBAC、Approval、Audit、Secret Management | 限制越权、记录动作、保护凭证 |
| Observability | Trace、Span、Eval、Replay | 能定位慢、贵、错、越权和幻觉 |

## Run 数据模型

```ts
interface AgentRun {
  runId: string
  userId: string
  tenantId: string
  taskBrief: string
  riskLevel: 'low' | 'medium' | 'high'
  status: 'created' | 'planning' | 'waiting_approval' | 'executing' | 'reviewing' | 'completed' | 'failed'
  plan: PlanStep[]
  toolCalls: ToolCallRecord[]
  approvals: ApprovalRecord[]
  evidence: EvidenceItem[]
  finalAnswer?: string
  error?: AgentError
}
```

## Tool Registry 设计

| 字段 | 说明 |
|---|---|
| name | 工具稳定名称，例如 `query_operation_snapshot` |
| description | 适用/不适用场景，帮助模型少误调 |
| input_schema | JSON Schema / Zod / Pydantic 定义 |
| output_schema | 成功、失败、空结果的结构化输出 |
| risk_level | read / write_draft / external_side_effect |
| approval_policy | never / conditionally / always |
| timeout_ms | 超时预算，避免 run 卡死 |
| idempotency_key | 写操作和外部副作用动作必须支持 |
| audit_fields | 需要写入审计日志的字段 |

## 高风险动作门禁

高风险动作不允许 Agent 直接执行。流程是：

1. Executor 生成 action preview。
2. Risk Policy 判断是否需要审批。
3. UI 展示影响范围、参数、回滚方式和证据。
4. 用户 approve / reject / edit。
5. 只有审批通过才调用 `submit_approved_action`。
6. 审批记录写入 audit log 和 trace。

## 错误处理

| 错误 | 处理方式 |
|---|---|
| 工具参数不合法 | 返回 schema error，让 Planner 修正 |
| 上游 API 超时 | 标记 retryable，最多重试一次，仍失败则降级 |
| 检索无证据 | 不输出确定结论，提示需要人工补充数据 |
| 权限不足 | 直接拒绝，不让 Agent 通过其他工具绕过 |
| Reviewer 不通过 | 进入 Repair 分支，补证据或重跑工具 |

## 可观测性指标

- end-to-end latency / p95
- planning latency
- retrieval latency
- tool call success rate
- approval wait time
- token cost per successful run
- no-evidence answer rate
- human edit rate
- replay pass rate

## 为什么这套架构适合作品集

因为它覆盖了 AI Agent 工程岗位最关心的能力：

- 会不会把业务任务拆成状态机。
- 会不会把工具调用做成可控后端能力。
- 会不会设计 human-in-the-loop。
- 会不会做 trace、eval、replay 和 release gate。
- 会不会考虑权限、审计、成本、延迟和失败恢复。

## 参考资料

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [OpenAI Agents SDK Tracing](https://openai.github.io/openai-agents-python/tracing/)
- [OpenAI Agents SDK Guardrails](https://openai.github.io/openai-agents-python/guardrails/)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
