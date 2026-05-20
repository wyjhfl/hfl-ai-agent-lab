# AI Agent 学习路线

这里是 HFL AI Agent Lab 的核心学习路线，用于系统沉淀 AI Agent、Multi-Agent、LangGraph、RAG 和 LLM 应用工程能力。

## 学习目标

这个模块不是为了堆概念，而是为了建立一套能支撑项目开发和面试表达的知识体系。

最终目标是：

> 能够设计、实现、解释一个可控、可审计、可扩展的 AI Agent 工程系统。

## 学习主线

### 第一阶段：LLM 应用基础

理解大模型应用的基本形态：

- Prompt
- Chat Completion
- Function Calling
- 上下文窗口
- 输出结构化
- 模型能力边界

### 第二阶段：RAG 工程化

理解如何让模型结合外部知识回答问题：

- 文档解析
- 文本切分
- 向量化
- 检索
- 重排序
- 引用来源
- 检索评估

### 第三阶段：Tool Calling

理解 Agent 如何调用外部工具：

- 工具定义
- 参数生成
- 工具选择
- 工具执行
- 结果回填
- 错误处理

### 第四阶段：Agent Loop

理解 Agent 的核心运行循环：

- Observation
- Thought
- Action
- Tool Result
- Reflection
- Final Answer

### 第五阶段：LangGraph 状态机

理解如何用状态机约束 Agent 执行流程：

- State
- Node
- Edge
- Conditional Edge
- Checkpoint
- Human-in-the-loop

### 第六阶段：Multi-Agent

理解多个 Agent 如何协作：

- 角色拆分
- 调度机制
- 状态共享
- 工具权限
- 风险审查
- 结果整合

### 第七阶段：Evaluation

理解如何判断 Agent 是否可靠：

- Trace
- 自动评测
- 人工评审
- 失败样本
- 质量指标
- 回归测试

## 学习原则

学习 AI Agent 不应该只停留在 Prompt 层面，而应该逐步深入到：

- 架构设计
- 状态管理
- 工具调用
- 工程部署
- 质量评估
- 面试表达
