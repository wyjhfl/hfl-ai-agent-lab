# Project B 一分钟介绍

Project B 是一个企业级 Multi-Agent Runtime 工程原型，用来展示多 Agent 角色编排、工具治理、人审、审计和轨迹可视化。

它不是一个“多个 Agent 聊天”的 Demo，而是把 Coordinator、Analyst、Executor、Reviewer 放进一个 custom Harness。任务进入系统后，Runtime 会记录每个角色的输入输出；工具调用必须经过 ToolGateway、PolicyEngine 和 OperationWhitelist；高风险动作进入 Human Approval；所有关键动作写入 Audit；最后通过 Trace 和 Multi-Agent Trajectory 展示整个执行过程。

这个项目默认 fake/offline 模式，不依赖真实 LLM、外部 MCP Server 或业务系统，适合稳定面试演示。边界上我不会把它描述成 public-production-ready software，而是 production-grade engineering prototype，重点证明我理解 Multi-Agent 系统工程化需要的编排、治理、审批、审计和可观测性。

## 相关链接

- [GitHub 仓库](https://github.com/wyjhfl/project-b-multi-agent)
- [Project B 主入口](/projects/project-b-agent-copilot)
- [Project B 架构设计](/projects/project-b-architecture)
- [Project B Trace / Evaluation 方案](/projects/project-b-trace-eval-plan)
- [Project B Demo 验收脚本](/projects/project-b-demo-script)
