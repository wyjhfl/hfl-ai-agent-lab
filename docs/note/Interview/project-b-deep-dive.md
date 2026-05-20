# 项目 B 深挖版

## 为什么做这个项目

运营中台存在操作复杂、工具分散、风险高的问题。我希望用 AI Agent 帮助运营人员更高效、更安全地完成工作。

## 架构设计

系统采用 Multi-Agent 架构，使用 LangGraph 状态机编排。核心 Agent 包括：

- Supervisor：任务理解与调度
- Data Analyst：NL2SQL 与数据分析
- Tool Executor：业务工具调用
- Risk Reviewer：风险审查与人工确认
- Evaluator：结果评估与改进

## 技术难点

1. 如何让多个 Agent 协作而不混乱
2. 如何设计 Human-in-the-loop 保证安全
3. 如何追踪和评估执行质量

## 和普通 Demo 的区别

普通 Demo 只展示模型能力，这个项目关注工程化、可控性和可审计性。

## 面试表达

待补充。
