# Project C Gateway Console UI：MCP 与 Skill 治理控制台

> 目标：把 Project C 做成可视化作品集，不只是讲架构。控制台展示工具发现、风险扫描、审批、Skill 版本和评测门禁。

## 控制台 Mockup

<div class="gateway-console-shell">
  <div class="gateway-console-sidebar">
    <strong>MCP Gateway</strong>
    <span class="active">Tool Registry</span>
    <span>Skill Hub</span>
    <span>Approval Center</span>
    <span>Security Scanner</span>
    <span>Eval Gate</span>
  </div>
  <div class="gateway-console-main">
    <div class="gateway-console-header">
      <div><p class="mock-eyebrow">Enterprise Agent Platform</p><h2>Tool Registry Overview</h2></div>
      <span>43 tools · 12 skills · 6 high-risk pending</span>
    </div>
    <div class="gateway-metric-grid">
      <div><strong>87%</strong><span>approved tools</span></div>
      <div><strong>6</strong><span>needs review</span></div>
      <div><strong>99.2%</strong><span>call success</span></div>
      <div><strong>14</strong><span>eval suites</span></div>
    </div>
    <div class="gateway-table">
      <div class="gateway-row gateway-head"><span>Tool</span><span>Risk</span><span>Policy</span><span>Status</span></div>
      <div class="gateway-row"><span>github.create_issue</span><span>write</span><span>approval</span><span class="ok">approved</span></div>
      <div class="gateway-row"><span>db.query_snapshot</span><span>read</span><span>auto</span><span class="ok">approved</span></div>
      <div class="gateway-row"><span>ops.send_notification</span><span>destructive</span><span>disabled</span><span class="warn">blocked</span></div>
      <div class="gateway-row"><span>filesystem.write_file</span><span>write</span><span>approval</span><span class="review">review</span></div>
    </div>
  </div>
</div>

## 关键界面

| 页面 | 展示内容 | 证明能力 |
|---|---|---|
| Tool Registry | 工具名、schema、risk、owner、status、eval suite | 工具治理 |
| Skill Hub | Skill 版本、触发描述、references、scripts、changelog | 可复用工作流 |
| Approval Center | 高风险调用、影响范围、审批历史、回滚方式 | HITL / 审计 |
| Security Scanner | tool poisoning、prompt injection、schema risk、resource leak | Agent 安全 |
| Eval Gate | contract tests、replay、skill eval、release decision | 回归评测 |

## UI 设计原则

1. **风险可见**：高风险工具必须在列表中高亮。
2. **版本可追踪**：工具 schema 和 Skill 都有版本与 changelog。
3. **审批可解释**：用户能看到为什么需要审批和审批后会发生什么。
4. **评测可阻断**：Eval Gate 不通过时不能发布新版本。
5. **审计可导出**：企业场景需要能导出调用日志和审批记录。

## 面试表达

> 我给 Project C 设计了 Gateway Console，而不是只做命令行工具。它能展示工具注册、风险等级、审批策略、Skill 版本、安全扫描和评测结果。这样面试官可以直观看到这是一个企业 Agent 平台治理项目，而不是一个单点 MCP demo。
