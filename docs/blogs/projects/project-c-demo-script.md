# Project C Demo 验收脚本：10 分钟展示 MCP Gateway 与 Skill Hub

> 目标：演示 Project C 如何把一个外部能力从“未治理工具”变成“可发现、可审批、可审计、可评测”的 Agent 平台能力。

## Demo 主线

用户场景：团队想让 Agent 能访问 GitHub、数据库快照和工单系统，同时沉淀 PR Review、事故复盘、MCP Server 创建三个 Skill。

## 10 分钟节奏

| 时间 | 演示内容 | 证明点 |
|---|---|---|
| 0:00 - 1:00 | 展示 Gateway Console 总览 | 企业 Agent 能力入口 |
| 1:00 - 2:30 | 注册一个 MCP Tool | schema、owner、risk、approval |
| 2:30 - 4:00 | 运行 Security Scanner | tool poisoning / schema risk |
| 4:00 - 5:30 | 调用工具并触发审批 | HITL、action preview、audit |
| 5:30 - 7:00 | 发布一个 Skill | SKILL.md、references、scripts、eval |
| 7:00 - 8:30 | 跑 Eval Gate | contract test、replay、release decision |
| 8:30 - 10:00 | 展示 Trace / Audit | 可回放、可导出、可排障 |

## Demo 1：注册 MCP Tool

示例 tool：`github.create_issue`

验收点：

- 必须有 input schema。
- risk level = write。
- approval policy = on_risk。
- owner = platform-team。
- eval suite = github-tools-critical。

讲法：

> 我不会让工具一注册就直接给 Agent 用。Gateway 先要求声明 owner、风险等级、schema 和评测集，再决定哪些用户能看到它。

## Demo 2：Security Scanner

扫描结果示例：

```json
{
  "tool": "filesystem.write_file",
  "risk": "write",
  "findings": [
    "input path allows arbitrary absolute path",
    "description missing allowed directory boundary",
    "no approval policy declared"
  ],
  "decision": "reject_until_fixed"
}
```

讲法：

> 安全扫描重点不是替代人工，而是把明显危险的工具挡在发布前，比如任意文件写入、过宽 shell command、可疑 description 或缺少审批策略。

## Demo 3：Skill 发布

示例 Skill：`build-enterprise-mcp-server`

验收点：

- description 触发边界清晰。
- references 渐进加载。
- scripts 可运行。
- 有 3 个 should-trigger 和 2 个 should-not-trigger 用例。
- 有 changelog。

讲法：

> Skill Hub 让重复流程可版本化。比如创建 MCP Server 不是每次手写提示词，而是走固定 discovery、tool contract、auth、testing、release gate 流程。

## Demo 4：Eval Gate

Release decision：

- contract tests: pass
- permission tests: pass
- replay tests: pass
- skill trigger tests: pass
- high-risk approval tests: pass

讲法：

> Project C 的目标是让工具和 Skill 能持续演进。每次 schema、description、Skill 流程变动，都要跑回归，防止 Agent 能力悄悄退化。

## 验收清单

- [ ] 能注册 tool 并展示 risk / policy / owner。
- [ ] Security Scanner 能给出 reject / approve / needs review。
- [ ] 高风险工具调用进入审批。
- [ ] Skill 能展示 description、references、scripts 和 eval cases。
- [ ] Eval Gate 能阻断不安全发布。
- [ ] Trace / Audit 能按 user、tenant、tool、version 查询。

## 面试收尾

> 这个 Demo 证明的是企业 Agent 平台治理能力：工具不是越多越好，而是要可发现、可授权、可审批、可审计、可评测。Skill 也不是提示词文件，而是可版本化、可测试、可复用的工作流资产。
