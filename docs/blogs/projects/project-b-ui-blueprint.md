# Project B 产品 UI 蓝图：把多 Agent Copilot 做成可展示界面

> 目标：Project B 不只停留在系统设计文字，而是逐步具备产品级 UI 叙事：用户能看到 Agent 的状态、证据、工具调用、审批和评测结果。

## 设计原则

1. **透明优先**：用户要知道 Agent 正在理解、检索、规划、调用工具还是等待审批。
2. **证据优先**：关键结论必须能看到数据来源、指标口径和工具结果。
3. **风险显性**：高风险动作要有 preview、影响范围、审批按钮和回滚说明。
4. **可回放**：Trace Drawer 能展示每个 span 的输入、输出、耗时、错误和 reviewer verdict。
5. **面试可讲**：每个 UI 区块都能对应一个工程能力点。

## 核心界面

<div class="screen-wire-grid">
  <div class="screen-wire-card"><span>Screen 01</span><h3>Copilot Task Panel</h3><p>用户输入任务、选择上下文范围、看到任务类型和风险等级。</p></div>
  <div class="screen-wire-card"><span>Screen 02</span><h3>Agent Progress Timeline</h3><p>展示 Understand、Retrieve、Plan、Execute、Review、Final 的状态。</p></div>
  <div class="screen-wire-card"><span>Screen 03</span><h3>Evidence Drawer</h3><p>展示指标口径、RAG 引用、业务数据快照和证据置信度。</p></div>
  <div class="screen-wire-card"><span>Screen 04</span><h3>Tool Call Inspector</h3><p>展示工具名称、输入参数、输出摘要、错误码、耗时和重试。</p></div>
  <div class="screen-wire-card"><span>Screen 05</span><h3>Approval Modal</h3><p>展示高风险动作 preview、影响范围、审批/拒绝/编辑路径。</p></div>
  <div class="screen-wire-card"><span>Screen 06</span><h3>Eval Dashboard</h3><p>展示关键 case 通过率、回归状态、成本、延迟和失败分类。</p></div>
</div>

## 状态设计

| 状态 | 用户看到什么 | 工程含义 |
|---|---|---|
| Understanding | “正在识别任务类型和风险等级” | Router 分类 |
| Retrieving | “正在查询指标口径和业务证据” | RAG / Resource 读取 |
| Planning | “正在生成执行计划” | Planner 输出步骤 |
| Executing | “正在调用受控工具” | Tool Registry 调用 |
| Waiting Approval | “该动作需要人工确认” | Human-in-the-loop |
| Reviewing | “正在检查证据和安全边界” | Reviewer guardrail |
| Completed | “生成最终建议” | Final answer |
| Failed / Degraded | “工具失败，已降级” | Failure recovery |

## UI Wireframe 文案

```text
[Task] 分析昨天 A 活动转化率下降原因，并生成工单草稿

Status: Reviewing
Risk: Medium
Evidence: 4 citations
Tool calls: 3 succeeded / 0 failed
Approval: 工单草稿无需直接发送，等待用户确认

Findings:
- 转化率较 7 日均值下降 18.2%
- 库存不足 SKU 占比从 2.1% 上升到 14.7%
- 页面错误率无明显异常

Next actions:
1. 创建库存排查工单草稿
2. 准备用户通知文案草稿
3. 等待运营负责人确认是否发送
```

## 组件清单

| 组件 | 作用 | 关联工程能力 |
|---|---|---|
| `RunStatusBadge` | 展示 run 状态和风险等级 | 状态机、风险控制 |
| `AgentTimeline` | 展示每一步执行状态 | Trace、Span、可回放 |
| `EvidenceList` | 展示引用和数据来源 | RAG、Grounding、Citation |
| `ToolCallCard` | 展示工具输入输出和错误 | Tool Contract、Observability |
| `ApprovalModal` | 展示 action preview 和审批 | Human-in-the-loop、Audit |
| `EvalSummaryCard` | 展示 eval 结果和 release gate | Evaluation、Regression |

## 产品化验收

- [ ] 用户能区分“草稿”和“已执行动作”。
- [ ] 工具调用失败时有可解释错误，而不是空白。
- [ ] 无证据时 UI 明确显示“证据不足”。
- [ ] 高风险动作默认不执行。
- [ ] Trace Drawer 能按 span 展开。
- [ ] Eval Dashboard 能展示关键 case 是否通过。

## 面试表达

> 我把 Project B 的 UI 设计成透明 Agent 界面，不只是聊天框。用户可以看到任务状态、工具调用、证据来源、审批动作和 Trace 回放。这样既提高用户信任，也能在面试中展示我对 Agent 产品化和工程可观测性的理解。

## 下一步实现建议

1. 在项目页增加静态 UI 蓝图截图或 CSS mockup。
2. 用 Vue 组件做 Agent timeline 和 approval modal demo。
3. 加入一组模拟 Trace JSON，渲染成 Trace Drawer。
4. 给 Project B 增加 Eval Dashboard 示例数据。

## 参考资料

- [VitePress Extending Default Theme](https://vitepress.dev/guide/extending-default-theme)
- [VitePress Default Theme Layout](https://vitepress.dev/reference/default-theme-layout)
- [Nólëbase Integrations](https://nolebase-integrations.ayaka.io/)
- [vitepress-theme-teek](https://vp.teek.top/)
