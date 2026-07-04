# Project B 深挖问答：Multi-Agent Runtime

## Q1：Project B 和普通 Agent Demo 有什么区别？

普通 Agent Demo 关注模型能不能完成任务。Project B 关注 Runtime：角色如何编排，工具如何治理，高风险动作如何审批，执行过程如何审计，失败时如何通过 Trace 和 Trajectory 定位问题。

## Q2：为什么默认 fake/offline？

面试作品集需要稳定可演示。默认 fake/offline 可以避免真实 LLM、外部 MCP、业务系统、PostgreSQL 或 Redis 不可用导致 demo 失败。同时它能清晰展示工程边界：真实 provider 是 opt-in，不是默认依赖。

## Q3：多 Agent 如何分工？

Coordinator 负责任务接收和流程组织；Analyst 负责分析和查询意图；Executor 负责通过 ToolGateway 请求工具执行；Reviewer 负责检查结果、风险和策略。重点不是角色多，而是每个角色有明确输入输出和可追踪状态。

## Q4：工具治理怎么做？

Agent 不直接执行工具，而是通过 ToolGateway。ToolGateway 会经过 PolicyEngine 和 OperationWhitelist 判断是否允许、是否需要审批、是否记录审计。高风险动作进入 Human Approval，审批结果再影响后续 resume。

## Q5：怎么证明系统可观测？

每个 task 都有 trace，包含 role step、tool call、policy decision、approval 和 audit event。Operator Console 可以展示 Multi-Agent Trajectory，让面试官看到系统为什么走到某个状态，而不是只看最终回答。

## Q6：如何避免过度声明？

我会明确说 Project B 是 production-grade engineering prototype，不是 public-production-ready software，也不是完全自主的生产级多 Agent 系统。它的价值是展示可解释编排、工具治理、人审、审计和轨迹可视化。
