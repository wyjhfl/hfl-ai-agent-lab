# Project B Demo 验收脚本

> 目标：5 分钟讲清企业级 Multi-Agent Runtime 的角色编排、工具治理、人审、审计和轨迹可视化。

## Demo Flow

| 时间 | 页面 | 讲什么 |
|---|---|---|
| 0:00 - 0:40 | Dashboard | 这是 enterprise-style Multi-Agent Runtime prototype，默认离线可演示 |
| 0:40 - 1:30 | Tasks | 创建 `multi_agent` task，说明 Coordinator / Analyst / Executor / Reviewer |
| 1:30 - 2:20 | Observability | 输入 `task_id`，展示 Trace 和 Multi-Agent Trajectory |
| 2:20 - 3:10 | Approvals | 高风险工具进入 Human Approval，可 approve / reject / edit |
| 3:10 - 4:00 | Audit / Metrics | 展示 audit trail、metrics、治理证据 |
| 4:00 - 5:00 | Tools / NL2SQL / LLM Status | 解释 ToolGateway、fake MCP、NL2SQL、offline LLM boundary |

## 讲解重点

- 多 Agent 的价值是可解释分工，不是角色名字堆叠。
- 工具执行必须经过 ToolGateway、PolicyEngine 和 OperationWhitelist。
- 高风险动作不能自动执行，必须进入 HITL approval。
- Trace 和 Trajectory 能解释每个 Agent 做了什么、为什么这么做。
- 默认 fake/offline，适合面试演示和稳定回归。

## 边界说明

> 这个项目是 production-grade engineering prototype，不是 public-production-ready software。它重点展示 Multi-Agent Runtime 的工程结构：角色编排、工具治理、人审、审计、可观测和轨迹可视化。
