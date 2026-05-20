# 项目 B：运营中台多 Agent Copilot

## 项目定位

这是一个面向运营中台场景的多 Agent Copilot 系统。

它的目标不是做一个简单聊天机器人，而是把运营人员的自然语言需求转化为可控、可审计、可确认的业务执行流程。

## 核心问题

运营中台通常存在这些问题：

- 操作流程复杂
- 数据查询分散
- 业务工具多
- 高风险操作需要审批
- 执行过程缺少追踪
- 新人上手成本高

项目 B 希望用 AI Agent 帮助运营人员完成：

- 意图理解
- 任务规划
- 数据分析
- 工具调用
- 风险审查
- 人工确认
- 结果追踪

## 核心 Agent

### Supervisor Agent

负责理解用户需求、拆解任务计划、调度其他 Agent，并维护全局状态。

### Data Analyst Agent

负责数据分析、指标解释、NL2SQL 和查询结果总结。

### Tool Executor Agent

负责调用业务工具、执行操作、返回结构化执行结果。

### Risk Reviewer Agent

负责识别高风险操作，判断是否需要人工确认。

### Reflection / Evaluator

负责检查结果质量，记录失败原因，并提供改进建议。

## 技术主线

- LangGraph 状态机
- Multi-Agent 编排
- Tool Calling
- Human-in-the-loop
- Trace / Evaluation
- 后端工程化

## 项目价值

这个项目用于证明我具备：

- AI Agent 系统设计能力
- 多 Agent 编排能力
- 业务工具调用能力
- 风险控制与人工审批设计能力
- 工程化落地能力
