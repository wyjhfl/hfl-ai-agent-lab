# Project B Operator Console UI 蓝图

> 目标：把 Multi-Agent Runtime 做成可展示、可解释、可审计的操作台，而不是普通聊天框。

## Console 页面

| 页面 | 展示内容 | 工程能力 |
|---|---|---|
| Dashboard | 项目定位、运行模式、核心指标 | 面试入口 |
| Tasks | 创建 `multi_agent` task，查看状态 | Runtime 状态管理 |
| Approvals | 查看高风险工具审批请求 | Human-in-the-loop |
| Trace | task trace、role steps、tool calls | 可回放、可排查 |
| Audit | actor、action、target、risk、timestamp | 审计闭环 |
| Metrics | task success、latency、tool errors | 可观测性 |
| Tools | ToolGateway、白名单、策略 | 工具治理 |
| NL2SQL | 受控查询示例 | 工具边界 |
| RBAC | 角色和权限 | 企业治理 |
| LLM Status | fake/offline、provider opt-in、budget、fallback | LLM 边界 |

## 静态界面说明

```text
Project B Operator Console

[Tasks]
- task_id: task_demo_001
- mode: multi_agent
- status: waiting_approval
- roles: Coordinator -> Analyst -> Executor -> Reviewer

[Trajectory]
Coordinator: accepted task
Analyst: created analysis plan
Executor: requested governed tool call
PolicyEngine: approval_required
Human: approved draft action
Reviewer: passed with audit notes

[Governance]
ToolGateway: enabled
OperationWhitelist: enforced
Audit: 6 events
LLM Mode: fake/offline
```

## 面试讲法

> 我没有把 Project B UI 做成一个聊天窗口，而是做成 Operator Console。面试时可以从 Tasks 看到任务状态，从 Trace 看到角色协作，从 Approvals 看到高风险动作如何被人审，从 Audit / Metrics 看到治理证据，从 Tools / NL2SQL 看到工具边界。这能证明我理解 Multi-Agent 系统上线前最重要的不是“会回答”，而是可控、可审计、可回放。
