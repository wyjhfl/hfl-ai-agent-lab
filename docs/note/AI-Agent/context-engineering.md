# Context Engineering：Agent 不是把所有内容塞进上下文

## 这篇文章解决什么问题

Prompt Engineering 关注“怎么写指令”，Context Engineering 关注“Agent 在每一步到底应该看到什么”。当 Agent 任务变长、工具变多、文件变多之后，真正限制系统质量的往往不是单句 Prompt，而是上下文组织方式。

常见问题包括：

- 一次性塞太多文档，模型抓不住重点。
- 工具返回结果原样进入上下文，噪声越来越多。
- 多轮对话越聊越长，关键决策反而被淹没。
- Agent 重启后不知道之前做过什么。
- RAG 检索、Memory、Trace、Scratchpad 混成一团。
- 多 Agent 之间互相传递大段自然语言，信息失真。

Context Engineering 的核心目标是：**让 Agent 在正确时间看到正确粒度的信息，并把不该留在上下文里的东西沉淀到外部状态、记忆或 Trace 中。**

## Context 和 Prompt 的区别

| 概念 | 关注点 | 例子 |
|---|---|---|
| Prompt | 对模型的任务指令 | 你是一个售后诊断助手，请根据证据回答 |
| Context | 模型本次推理可见的信息集合 | 用户问题、相关文档、工具结果、当前状态、约束 |
| Memory | 跨轮次或跨会话保存的信息 | 用户偏好、项目规则、历史决策 |
| State | 当前任务的结构化执行状态 | 当前步骤、已完成工具调用、待审批动作 |
| Trace | 已发生过程的审计记录 | run、step、tool_call、error、latency |

Prompt 只是 Context 的一部分。一个生产级 Agent 的质量，更多取决于如何选择、压缩、排序和持久化上下文。

## Context Engineering 的四层模型

### 1. 系统级上下文

系统级上下文定义长期稳定规则：

- Agent 身份和职责边界。
- 安全规则。
- 输出格式。
- 工具使用原则。
- 项目工程约束。

这类内容应该短、稳定、少变。不要把业务文档、历史对话、临时调试信息都塞进系统级上下文。

### 2. 任务级上下文

任务级上下文回答“这次要做什么”：

- 用户当前目标。
- 验收标准。
- 当前文件范围。
- 可用工具。
- 不允许做的事情。

任务级上下文应该随着任务变化而变化。比如“优化博客内容”和“修复 API bug”需要完全不同的上下文。

### 3. 工作记忆

工作记忆保存当前执行中的中间状态：

- 已读过哪些文件。
- 得出的关键结论。
- 当前假设。
- 未解决问题。
- 下一步计划。

工作记忆不应该无限增长。每完成一个阶段，就要压缩成结构化摘要。

### 4. 外部知识和长期记忆

外部知识包括：

- RAG 检索结果。
- 项目文档。
- 数据库 schema。
- API 文档。
- 历史决策。
- 用户偏好。

长期记忆不应该每次全量注入。正确做法是按任务检索、筛选、压缩，再进入上下文窗口。

## Agent 上下文的典型组成

一个执行中的 Agent 上下文可以拆成：

```text
System instruction
Project rules
User task
Current state
Relevant retrieved docs
Tool schemas
Recent tool results
Scratchpad summary
Output contract
```

每一块都要问三个问题：

1. 本轮推理真的需要它吗？
2. 它是否应该被压缩？
3. 它是否应该留在外部状态里，而不是塞进上下文？

## RAG、Memory、State、Trace 的分工

| 模块 | 保存什么 | 什么时候进上下文 |
|---|---|---|
| RAG | 外部知识、文档片段 | 当前问题需要证据时 |
| Memory | 稳定偏好、经验、项目规则 | 与当前任务相关时 |
| State | 当前任务状态 | 每一步执行都需要 |
| Trace | 已发生事件 | 调试、复盘、评测时 |
| Scratchpad | 当前推理摘要 | 当前任务未结束时 |

这几个模块不能互相替代。把 Trace 当 Memory 会过载；把 Memory 当 State 会失真；把 RAG 当 Prompt 会不稳定。

## 上下文污染的常见来源

### 原样保留所有工具结果

工具结果通常很长，尤其是搜索、日志、数据库查询。原样保留会快速污染上下文。

更好的做法：

- 工具结果先结构化。
- 提取关键字段。
- 大结果保存到外部引用。
- 上下文只保留摘要和引用 ID。

### 把 Trace 当 Memory

Trace 是审计记录，不是每轮都要读的记忆。它适合排查问题、评测和复盘，不适合全量进入模型上下文。

### RAG 召回过多

Top-K 越大不一定越好。过多文档会稀释重点，增加幻觉风险。

更好的做法：

- 先召回，再 rerank。
- 按问题类型选择不同检索策略。
- 给每段证据加来源和置信度。
- 只把最相关的证据进入上下文。

### 让多 Agent 互传完整历史

多个 Agent 协作时，不应该互相传递完整对话。应该传递结构化 handoff：

```json
{
  "task": "validate deployment plan",
  "facts": ["frontend builds with VitePress", "dist is ignored by git"],
  "decisions": ["do not commit generated assets"],
  "open_questions": ["whether to add browser screenshot check"],
  "expected_output": "risk list and validation command"
}
```

## Context Engineering 设计原则

### 上下文要分层

不要把系统规则、用户需求、检索结果、工具结果、历史记忆混在一段文本里。分层能降低冲突和遗忘。

### 上下文要可追踪

重要信息应该带来源：

- 来自用户输入。
- 来自文档检索。
- 来自工具调用。
- 来自人工审批。
- 来自历史记忆。

没有来源的信息不适合作为高风险决策依据。

### 上下文要可压缩

长任务必须做阶段性压缩：

```text
已完成：
- 新增 skill-authoring.md
- 更新 AI-Tools 入口
- docs:build 通过

关键约束：
- 不提交 dist
- 新页面必须有侧边栏或入口页链接

下一步：
- 补 MCP 示例模板
```

压缩的目标不是“少字”，而是保留决策、证据和下一步。

### 上下文要可恢复

长任务应该能在新会话中恢复。需要保存：

- 当前目标。
- 已完成工作。
- 未完成计划。
- 已验证证据。
- 关键文件和提交。

这就是为什么项目应该有 README、release notes、runbook、Trace，而不是只依赖对话历史。

### 上下文要有预算

上下文窗口再大也不是免费资源。需要按价值分配：

| 内容 | 优先级 |
|---|---|
| 用户当前目标 | 最高 |
| 验收标准和约束 | 最高 |
| 当前任务相关文件 | 高 |
| 最近工具结果摘要 | 高 |
| 历史决策摘要 | 中 |
| 完整历史日志 | 低 |
| 无关背景知识 | 低 |

## 在个人博客项目中的实践

以 HFL AI Agent Lab 持续写作任务为例，Context Engineering 可以这样设计：

- 系统规则：写中文、面向 AI Agent / LLM 工程求职、内容要工程化。
- 任务级上下文：本批主题、允许修改的目录、构建验收。
- 工作记忆：已新增页面、已更新入口、构建结果、commit hash。
- 外部状态：Git 提交记录、构建日志、GitHub 远端状态。

这样即使下次换一个会话，也能从仓库和提交记录恢复上下文。

## 在 Agent 项目中的实践

对于多 Agent 运营中台，Context Engineering 应该落在数据模型和执行链路上：

- `task_context`：用户任务、业务目标、约束。
- `agent_state`：当前节点、已完成步骤、待审批动作。
- `tool_context`：工具 schema、权限、最近调用结果。
- `evidence_context`：RAG 证据、指标、日志。
- `handoff_context`：Agent 之间传递的结构化摘要。
- `recovery_context`：失败后恢复所需信息。

面试时可以强调：Agent 不是靠“更长上下文”解决复杂任务，而是靠“上下文分层 + 状态持久化 + 证据检索 + Trace 复盘”解决复杂任务。

## 设计检查清单

- 当前上下文里每一块信息都有用途吗？
- 工具结果是否经过结构化和摘要？
- RAG 证据是否有来源？
- 长任务是否有阶段性压缩？
- Agent 重启后能否恢复？
- 多 Agent handoff 是否结构化？
- Trace 是否和 Memory 分离？
- 高风险动作是否有人工审批上下文？
- 是否能解释模型为什么看到这些信息？
- 是否能根据失败样本优化上下文策略？

## 面试表达

可以这样回答 Context Engineering：

> 我理解的 Context Engineering 不是把更多内容塞进模型，而是设计 Agent 在每一步应该看到什么。生产级 Agent 的上下文应该分层：系统规则保持稳定，任务上下文描述当前目标，State 保存执行进度，RAG 提供外部证据，Memory 保存长期偏好，Trace 用于审计和复盘。长任务中我会做阶段性摘要，工具结果只保留结构化摘要和引用 ID，多 Agent 之间用 handoff 对象传递事实、决策和待办，而不是传递完整聊天记录。这样可以降低上下文污染，也让 Agent 在失败后可恢复、可调试、可评估。

## 相关链接

- [Memory / Persistence](/note/AI-Agent/memory)
- [Agent Runtime](/note/AI-Agent/agent-runtime)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [Agent 开发 Playbook](/topics/agent-development-playbook)

## 参考资料

- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)

