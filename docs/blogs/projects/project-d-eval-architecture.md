# Project D 架构设计：Agent Evaluation & Red Team Lab

> 这页用于系统设计答辩：如何为 Agent、RAG、MCP 和 Skills 设计统一评测平台。

## 设计目标

1. **可复现**：每个 eval run 都绑定模型、Prompt、工具版本、数据版本和 trace id。
2. **可阻断**：critical case 不通过时不能发布。
3. **可解释**：失败要能定位到 retrieval、planning、tool、approval、safety 或 final answer。
4. **可扩展**：同一套平台覆盖 Project B、Project C、RAG 和 Skills。

## 模块分层

| 层级 | 模块 | 说明 |
|---|---|---|
| Dataset Layer | golden、adversarial、regression、incident replay | 存评测样本和期望断言 |
| Runner Layer | model runner、agent runner、tool runner、skill runner | 统一执行被测对象 |
| Trace Layer | span collector、tool call log、approval log | 捕获执行过程 |
| Grader Layer | rule grader、LLM judge、human review | 混合评分 |
| Report Layer | scorecard、failure clustering、diff report | 输出评测报告 |
| Gate Layer | release policy、risk threshold、rollback decision | 控制发布 |
| UI Layer | dashboard、case browser、trace replay | 展示和排障 |

## Eval Case 数据模型

```ts
interface EvalCase {
  caseId: string
  suite: 'rag' | 'tool' | 'approval' | 'mcp-security' | 'skill' | 'regression'
  input: string
  context?: Record<string, unknown>
  expected: {
    mustCallTools?: string[]
    mustNotCallTools?: string[]
    requireApproval?: boolean
    requireCitation?: boolean
    expectedErrorCode?: string
    rubric?: string
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
}
```

## Grader 设计

| Grader | 适用场景 | 例子 |
|---|---|---|
| Rule Grader | 工具、权限、审批、citation、错误码 | 必须调用 `create_ticket_draft`，不能调用 `submit_action` |
| LLM Judge | 表达完整性、业务可读性、总结质量 | 答案是否覆盖原因、证据、建议 |
| Human Review | 高风险发布、争议样本、低置信 judge | 安全用例人工复核 |
| Differential Eval | 新旧版本对比 | 新模型是否降低 tool accuracy |

## Release Gate 策略

| 等级 | 策略 |
|---|---|
| critical | 必须 100% 通过，否则阻断发布 |
| high | 通过率低于 98% 阻断 |
| medium | 通过率低于 95% 需要人工批准 |
| low | 记录趋势，不阻断 |

## 失败分类

- retrieval_miss：没检索到关键证据。
- tool_selection_error：选错工具。
- tool_argument_error：参数不合法。
- approval_bypass：高风险动作未审批。
- hallucinated_fact：编造事实。
- unsafe_output：输出越权或泄漏。
- skill_misfire：Skill 误触发或漏触发。
- regression：历史修复问题复现。

## 面试表达

> Project D 的架构核心是把 eval case、runner、trace、grader、report 和 release gate 解耦。规则能判断的用规则，表达质量用 LLM judge，高风险用人工复核。这样既能自动化，也不会把安全判断完全交给模型。
