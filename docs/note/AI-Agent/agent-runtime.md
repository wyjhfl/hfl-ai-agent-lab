# Agent Runtime

## 这一节解决什么问题

Agent Runtime 是 Agent 真正运行起来的执行引擎。Prompt、RAG、Tool Calling 都只是能力组件，Runtime 负责把这些组件组织成一条可推进、可中断、可恢复、可观测的任务链路。

如果没有 Runtime，Agent 很容易停留在“模型生成一段文本”或“模型调用一次工具”的 Demo 阶段。真正的 Runtime 要回答：任务当前处于什么状态、下一步该做什么、什么时候调用工具、什么时候停止、失败后如何恢复。

## 核心概念

### Agent Loop

最小 Agent Loop 可以概括为：

```text
Observe → Plan / Think → Act → Observe → Final
```

- Observe：接收用户输入、工具结果、环境状态。
- Plan / Think：判断目标、拆解步骤、选择下一步动作。
- Act：调用工具、查询知识库、生成中间结果。
- Observe：读取动作结果，更新状态。
- Final：满足停止条件后输出最终结果。

这个循环让 Agent 不只是一次性回答，而是能根据中间结果持续推进任务。

### State

State 是 Runtime 的核心。它记录当前任务运行到哪里、已经有哪些中间结果、下一步需要什么信息。

常见 State 包括：

- 用户目标和约束
- 当前任务阶段
- 已调用工具和返回结果
- 关键中间结论
- 错误信息和重试次数
- 是否需要人工确认
- 最终输出草稿

没有 State，Agent 每一步都像重新开始；有了 State，Agent 才能进行多步任务。

### Action

Action 是 Agent 可以执行的动作，例如调用工具、检索知识库、生成计划、请求用户补充信息、进入人工审批节点。

Runtime 不应该让模型直接操作真实系统。模型只生成 Action 意图，Runtime 负责校验、执行和回填结果。

### Stop Condition

Agent 必须有明确停止条件，否则容易无限循环或过度调用工具。

常见停止条件：

- 已完成用户目标
- 达到最大步骤数
- 达到最大重试次数
- 需要用户补充信息
- 触发高风险操作，需要人工确认
- 出现不可恢复错误

Stop Condition 是 Agent 稳定性的基础，不应该只靠模型自己判断。

## Runtime 的工程结构

一个最小可用 Runtime 通常包含：

```text
Input Handler
  → Prompt / Context Builder
  → Model Caller
  → Action Parser
  → Tool Executor
  → State Manager
  → Stop Controller
  → Trace Recorder
  → Final Response Builder
```

每一层都有明确职责：

- Input Handler：标准化用户输入。
- Context Builder：组装必要上下文，不把所有历史都塞进去。
- Model Caller：负责模型调用、重试、超时和错误处理。
- Action Parser：解析模型输出的工具调用或下一步动作。
- Tool Executor：在权限边界内执行工具。
- State Manager：保存和更新任务状态。
- Stop Controller：判断继续、暂停、失败还是完成。
- Trace Recorder：记录完整执行轨迹。
- Final Response Builder：把执行结果转成用户可读输出。

## 常见设计问题

### 问题一：只写 Prompt，没有 Runtime

很多 Agent Demo 的核心只有一段长 Prompt。它看起来能完成任务，但无法稳定处理多步执行、失败恢复、权限控制和状态追踪。

正确做法是把 Prompt 当成 Runtime 的一个组件，而不是整个系统。

### 问题二：状态全放在对话历史里

对话历史不是可靠状态管理。长对话会膨胀，关键信息会被噪声淹没，模型也可能忽略早期约束。

正确做法是把稳定状态结构化存储，再由 Context Builder 选择性注入上下文。

### 问题三：没有停止条件

没有停止条件的 Agent 很容易出现重复调用、无意义反思、无限循环。

正确做法是在 Runtime 层设置最大步骤数、最大重试次数、超时和人工确认条件。

### 问题四：工具执行和模型决策混在一起

模型负责判断“想做什么”，系统负责判断“能不能做”和“怎么做”。如果把执行权完全交给模型，风险会很高。

正确做法是让 Runtime 接管工具执行、参数校验、权限控制和结果回填。

## 和 LangGraph 的关系

LangGraph 可以理解为一种更结构化的 Runtime 实现方式。它用 State、Node、Edge、Checkpoint 来表达 Agent 执行过程。

- Node 对应一个执行步骤。
- Edge 对应流转条件。
- State 对应任务上下文。
- Checkpoint 对应可恢复状态。

如果任务流程比较固定，LangGraph 能让 Runtime 更清晰；如果任务高度开放，也可以先用简单 Agent Loop，再逐步抽象成图。

## 面试表达

可以这样表达：

> 我理解的 Agent Runtime 不是一段 Prompt，而是一套负责推进任务的执行引擎。它要管理状态、调用模型、解析动作、执行工具、判断停止条件，并记录 Trace。模型只负责生成决策意图，真正的工具执行、权限校验、重试和停止控制应该放在 Runtime 层。这样 Agent 才能从一次性 Demo 变成可调试、可恢复、可上线的系统。

## 相关链接

- [Tool Calling](/note/AI-Agent/tool-calling)
- [LangGraph 状态机](/note/AI-Agent/langgraph)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [从 RAG 到生产级 Agent Harness 的工程化学习路线](/topics/rag-to-agent-harness)
