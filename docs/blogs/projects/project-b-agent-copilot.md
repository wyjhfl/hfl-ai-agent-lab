---
description: Project B：运营中台 Multi-Agent Runtime，四角色编排，ToolGateway / PolicyEngine / HITL 审批治理工具调用，Trajectory 可回放，Operator Console 默认离线可演示。
---

# Project B：运营中台 Multi-Agent Runtime

> GitHub：<https://github.com/wyjhfl/project-b-multi-agent>
> 定位：企业级 Multi-Agent Runtime 工程原型，用于简历和面试展示；默认 fake / offline 模式，不依赖真实 LLM、外部 MCP Server、业务系统、PostgreSQL 或 Redis。

<div class="project-status-card">
  <div>
    <p class="project-eyebrow">10 秒速读</p>
    <p><strong>可解释、可治理、可审计的 Multi-Agent Runtime：Coordinator / Analyst / Executor / Reviewer 四角色协作，工具调用统一经过 ToolGateway、PolicyEngine 与 HITL 审批并留存审计，轨迹全程可回放。</strong></p>
    <div class="project-pill-row"><b>4-Role Runtime</b><b>ToolGateway + HITL</b><b>Trajectory Replay</b></div>
    <p>岗位相关性：对应 AI Agent · Multi-Agent · 大模型应用工程岗，覆盖编排、治理与可观测；默认离线即可完整演示。</p>
  </div>
  <ul>
    <li><a href="https://github.com/wyjhfl/project-b-multi-agent">GitHub Repo</a></li>
    <li><a href="/projects/project-b-demo-script">Demo 脚本</a></li>
    <li><a href="/note/Interview/project-b-deep-dive">深挖问答</a></li>
  </ul>
</div>

## 项目一句话

Project B 展示一个可解释、可治理、可审计的 Multi-Agent Runtime：Coordinator、Analyst、Executor、Reviewer 分工协作，所有工具调用经过 ToolGateway、PolicyEngine、OperationWhitelist、审批和审计，并通过 Operator Console 展示 Tasks、Approvals、Trace、Audit、Metrics、Tools、NL2SQL、RBAC、LLM status 和 Multi-Agent Trajectory。

## 边界声明

| 项目边界 | 说明 |
|---|---|
| 默认模式 | fake / offline，本地 demo 不需要真实 LLM 或外部 MCP |
| 项目性质 | production-grade engineering prototype |
| 不应过度声明 | 不是 public-production-ready software，不是 fully autonomous multi-agent software |
| 发布边界 | `public_production_direct_launch=No-Go` |

## 核心能力

1. Multi-agent role orchestration：Coordinator、Analyst、Executor、Reviewer。
2. Tool governance：ToolGateway、PolicyEngine、OperationWhitelist、approval、audit。
3. LLM engineering boundary：fake/offline by default，optional real provider opt-in，budget、cache、fallback、guardrails。
4. Observability：task trace 和 Multi-Agent Trajectory visualization。
5. Operator Console：Tasks、Approvals、Trace、Audit、Metrics、Tools、NL2SQL、RBAC、LLM status。

## 技术栈

| 层级 | 技术 |
|---|---|
| Backend | Python 3.11、FastAPI、Pydantic、SQLAlchemy、Alembic |
| Agent Runtime | custom Harness、rule-based Multi-Agent orchestrator、optional LangGraph adapter |
| Tool Protocol | fake MCP、stdio MCP client skeleton、ToolGateway |
| Frontend | Next.js、React、TypeScript |
| Storage | SQLite demo default，PostgreSQL / Redis optional pilot path |
| Tests | pytest，默认测试不调用真实外部服务 |

## Demo Flow

1. 打开 Dashboard，说明这是 enterprise Multi-Agent Runtime，而不是普通聊天机器人。
2. 在 Tasks 页面创建 `multi_agent` task。
3. 打开 Observability，输入 `task_id`，展示 Trace 和 Multi-Agent Trajectory。
4. 打开 Approvals，解释高风险工具如何进入人工审批。
5. 打开 Audit 和 Metrics，解释治理和可观测性。
6. 打开 Tools 和 NL2SQL，解释统一工具执行边界。

## 相关页面

- [Project B 架构设计](/projects/project-b-architecture)
- [Project B 产品 UI 蓝图](/projects/project-b-ui-blueprint)
- [Project B Trace / Evaluation 方案](/projects/project-b-trace-eval-plan)
- [Project B Demo 验收脚本](/projects/project-b-demo-script)
- [Project B 路线图](/projects/project-b-roadmap)
- [Project B 一分钟介绍](/note/Interview/project-b-one-minute)
- [Project B 深挖问答](/note/Interview/project-b-deep-dive)
- [Project B STAR 故事库](/note/Interview/project-b-star-story-bank)
