# Agent 面试题

## 高频问题地图

- 什么是 Agent？它和普通 LLM 调用有什么区别？
- Agent 的基本架构由哪些核心组件组成？
- Workflow、Agent、Tools 三者有什么区别？
- ReAct、Plan-and-Execute、Reflection 有什么区别？
- 复杂任务为什么要拆分？
- Agent 记忆机制如何设计？
- Single-Agent 和 Multi-Agent 如何选型？
- Multi-Agent 如何协作和动态切换？
- Agent 为什么需要 Evaluation？

## 核心概念速记

**Agent**：以 LLM 为推理核心，通过工具调用与外部环境交互，自主完成任务的系统。与普通 LLM 调用的区别在于 Agent 有感知-决策-行动的循环，能根据中间结果调整策略。

**Tool**：Agent 可调用的外部能力，如数据库查询、文件读写、API 调用。Tool 让 Agent 从"只能生成文本"变成"能执行实际操作"。

**Memory**：Agent 维护上下文的机制，包括短期记忆（当前对话）、中期记忆（可检索的历史会话）、长期记忆（提炼后的稳定知识）。

**Planner**：负责把复杂任务拆解为可执行步骤的模块。Plan-and-Execute 模式中 Planner 和 Executor 分离。

**Executor**：负责执行具体步骤、调用工具、产出结果的模块。

**Reflection**：Agent 对自身输出进行自我检查和修正的机制，可以提升输出质量。

**Multi-Agent**：多个 Agent 协作完成复杂任务的架构模式，常见角色包括 Coordinator、Worker、Reviewer。

## 标准回答模板

后续补充正式回答模板。

## 面试官追问

后续补充追问。

## 工程化理解

Agent 面试题不能只背概念，还要能讲工程边界：

- 工具调用：如何注册工具、如何生成 schema、如何处理工具失败
- 状态管理：如何维护会话状态、如何处理上下文溢出、如何做上下文压缩
- 评估机制：如何判断 Agent 输出质量、如何做 Trace 记录、如何用失败样本改进
- 权限控制：哪些工具可以自动执行、哪些需要人工确认、哪些直接禁止

结合本站 AI-Agent 学习路线和源码拆解栏目（Hermes Agent、Harness Engineering、OpenClaw），可以补充具体的工程实现细节。

## 常见误区

- 把 Agent 等同于角色 Prompt：Agent 不只是 system prompt，还需要工具、记忆、规划、执行、评估等完整运行时
- 把 Multi-Agent 等同于多个模型聊天：Multi-Agent 需要 Coordinator 编排、职责隔离、权限控制、结果汇总
- 只讲概念，不讲工具和状态：面试时要能讲清楚工具注册、工具结果结构化、状态持久化等工程细节
- 不知道如何评估 Agent 效果：需要了解 Trace、Evaluator、失败样本沉淀、评测集等工程化手段

## 背诵版总结

后续补充。

## 后续补充

- 标准回答模板
- 面试官追问及应对
- 背诵版总结
- 结合源码拆解的具体案例
