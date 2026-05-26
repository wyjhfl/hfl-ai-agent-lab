# Agent Harness 总览

## 这一节解决什么问题

Agent Harness 是把模型、工具、状态、记忆、权限、Trace、Evaluation 和部署能力组织起来的工程骨架。

如果说单个 Agent Loop 解决的是“怎么让模型连续做事”，那么 Agent Harness 解决的是“怎么让 Agent 在真实系统里稳定、可控、可观测、可评估地做事”。

## Agent Harness 是什么

Agent Harness 可以理解为 Agent 的运行框架。它不等于某个具体库，也不等于一段 Prompt，而是一组工程模块的组合。

一个生产级 Harness 通常包括：

- Prompt / Context Builder
- Agent Runtime
- Tool Registry
- MCP / Tool Executor
- Permission Gate
- State / Session Store
- Memory / Persistence
- Hook / Guardrails
- Trace Recorder
- Evaluation Pipeline
- Human-in-the-loop
- Deployment Runtime

这些模块共同决定 Agent 是否可上线。

## 为什么需要 Harness

普通 Agent Demo 的链路通常是：

```text
用户输入 → LLM → 工具调用 → 回复
```

这个链路能演示能力，但很难承载真实场景。真实系统还需要处理：

- 多轮任务状态；
- 工具权限和参数校验；
- 外部系统失败；
- 高风险操作审批；
- 长任务恢复；
- 成本和超时控制；
- 执行轨迹审计；
- 质量评测和回归测试。

这些都不是 Prompt 能单独解决的，需要 Harness 提供系统能力。

## 核心模块

### Prompt / Context Builder

负责组装模型需要的上下文。它不应该无脑塞入所有历史，而应该根据任务选择：用户目标、关键约束、当前状态、相关工具、必要记忆。

### Agent Runtime

负责推进任务执行，包括模型调用、动作解析、工具执行、状态更新和停止判断。

### Tool Registry

管理可用工具，包括工具名称、描述、参数 Schema、权限等级、使用场景和返回格式。

### MCP / Tool Executor

负责真正执行外部操作。MCP 可以把工具能力标准化，让 Agent 通过结构化协议调用外部系统。

### Permission Gate

判断当前 Agent、用户、任务是否有权限调用某个工具或访问某类数据。

### State / Session Store

保存当前任务和会话状态，让多步任务可延续、可恢复。

### Memory / Persistence

保存长期偏好、任务经验、知识片段、执行记录和中间产物。

### Hook / Guardrails

在执行前后做强制检查，包括权限、路径、参数、安全、格式、构建、发布、敏感信息等。

### Trace Recorder

记录 Agent 每一步做了什么、为什么做、调用了什么工具、结果是什么。

### Evaluation Pipeline

用测试集、指标和失败样本分析 Agent 的质量，避免只凭感觉优化。

### Human-in-the-loop

在高风险、不确定或需要业务判断的节点引入人工确认。

## 推荐分层

```text
用户目标
  ↓
入口层：API / UI / CLI / Webhook
  ↓
会话层：Session / Task / State
  ↓
推理层：Prompt Builder / Model Caller / Planner
  ↓
执行层：Tool Registry / MCP / Tool Executor
  ↓
治理层：Permission / Hook / Guardrails / Audit
  ↓
反馈层：Trace / Evaluation / Failure Analysis
```

这套分层的价值是把“模型推理”和“系统治理”拆开。模型负责理解和决策，系统负责边界和可靠性。

## Harness 和 RAG / Tool Calling / LangGraph 的关系

- RAG 是知识增强能力；
- Tool Calling 是执行入口；
- LangGraph 是流程编排方式；
- Memory 是状态和经验管理；
- Guardrails 是安全边界；
- Trace / Eval 是质量闭环；
- Harness 是把这些能力组织起来的整体框架。

所以学习路线不能停在 RAG 或 Tool Calling，而要逐步走向 Harness。

## 成熟度判断

可以用这张清单判断一个 Agent 是否接近生产级：

- 是否有结构化 State；
- 是否有明确停止条件；
- 工具是否有 Schema 和权限；
- 高风险操作是否有人审；
- 是否记录完整 Trace；
- 是否有失败样本分类；
- 是否有回归测试集；
- 是否能从中断任务恢复；
- 是否有成本、超时和重试策略；
- 是否能解释一次执行为什么成功或失败。

如果这些都没有，它大概率还是 Demo。

## 常见误区

### 误区一：Harness 等于框架选型

Harness 不是选 LangChain、LangGraph 或某个 SDK 就结束了。框架只能提供部分能力，工程边界仍然要自己设计。

### 误区二：Prompt 越强，Harness 越不重要

Prompt 很重要，但 Prompt 无法替代权限、状态、工具校验、Trace 和 Eval。

### 误区三：先做复杂 Multi-Agent

没有单 Agent Harness 的状态、工具、Trace 和评测基础，直接做 Multi-Agent 只会放大复杂度。

## 面试表达

可以这样表达：

> 我理解的 Agent Harness 是生产级 Agent 的工程骨架。它把 Prompt、Runtime、Tool Registry、MCP、Permission、Memory、Hook、Trace、Evaluation 和 Human-in-the-loop 组织起来。RAG 解决知识问题，Tool Calling 解决执行入口，LangGraph 解决流程编排，但 Harness 解决的是系统是否可控、可追踪、可恢复、可评估。我的设计重点不是让 Agent 看起来聪明，而是让它在真实业务边界内稳定运行。

## 相关链接

- [Agent Runtime](/note/AI-Agent/agent-runtime)
- [Memory / Persistence](/note/AI-Agent/memory)
- [Guardrails / Safety](/note/AI-Agent/guardrails)
- [Trace 与 Evaluation](/note/AI-Agent/evaluation)
- [从 RAG 到生产级 Agent Harness 的工程化学习路线](/topics/rag-to-agent-harness)
- [Hook 机制为什么是 Agent Harness 最重要的资产](/topics/agent-harness-hooks)
