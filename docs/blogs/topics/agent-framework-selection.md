# Agent 框架选型：LangGraph、OpenAI Agents SDK、LlamaIndex、CrewAI 怎么看

## 这篇文章解决什么问题

Agent 项目一开始最容易陷入“框架先行”：

- 先选 LangChain / LangGraph。
- 先选 OpenAI Agents SDK。
- 先选 CrewAI。
- 先选 LlamaIndex。

但框架不是目标。目标是把业务任务做成可运行、可追踪、可评估、可上线的系统。

这篇文章整理 Agent 框架选型的判断维度，帮助把“我会某个框架”升级成“我知道为什么选它”。

## 先看任务，不先看框架

选框架前先问：

- 任务是固定流程还是动态决策？
- 是否需要长任务恢复？
- 是否需要人工审批？
- 是否需要复杂 RAG？
- 是否需要多 Agent 协作？
- 是否需要工具权限治理？
- 是否需要 Trace 和评测？
- 团队技术栈是什么？

如果只是一次模型调用，不需要 Agent 框架。如果是固定流程，普通 workflow 可能比 Agent 更稳定。

## 常见框架定位

| 框架/工具 | 更适合什么 | 需要注意什么 |
|---|---|---|
| LangGraph | 状态机、长任务、checkpoint、human-in-the-loop、多步骤 Agent | 学习成本比简单 chain 高，需要认真设计 State |
| OpenAI Agents SDK | 快速构建 Agent、handoff、tools、guardrails、tracing | 更适合 OpenAI 生态，底层治理仍要自己设计 |
| LlamaIndex | RAG、知识库、索引、检索增强、数据连接器 | 不要把 RAG 框架当完整 Agent 平台 |
| CrewAI | 多角色任务协作、快速 Demo、角色分工表达 | 生产治理、状态和权限需要额外设计 |
| 自研轻量 Runtime | 业务边界清晰、团队想强控制 | 初期快，但要补 Trace、Eval、工具治理 |

框架没有绝对好坏，只有任务匹配度。

## 选型维度

### 1. State 管理

如果任务需要多步骤推进、失败恢复、人工审批，就必须重视 State。

判断问题：

- State 是否结构化？
- 是否支持 checkpoint？
- 是否能从中断处恢复？
- 是否能展示给前端？
- 是否能进入评测？

如果框架只能保留聊天历史，不适合复杂长任务。

### 2. Tool 接入

工具接入要看：

- schema 是否清晰。
- 参数校验是否方便。
- 工具错误是否结构化。
- 是否支持权限分级。
- 是否能接入 MCP。
- 是否能记录 tool_call trace。

工具治理弱的框架，需要在业务层补安全控制。

### 3. Human-in-the-loop

生产系统常有人工审批：

- 高风险工具调用前确认。
- 低置信度答案人工复核。
- 多 Agent 结果人工选择。
- 长任务暂停等待用户输入。

如果框架没有暂停、恢复和审批状态，就很难做真实业务。

### 4. Trace 和 Evaluation

框架选型要看是否方便记录：

- run。
- step。
- model_call。
- tool_call。
- retrieval。
- state transition。
- error。

没有 Trace，框架 Demo 再好也难上线。

### 5. RAG 能力

RAG 项目要重点看：

- 文档解析。
- chunk 策略。
- embedding。
- hybrid search。
- rerank。
- citation。
- metadata filter。
- eval。

如果项目核心是知识库问答，LlamaIndex / RAG 专用组件可能比通用 Agent 框架更重要。

## 选型场景建议

### 场景一：RAG 工单系统

推荐思路：

- RAG 检索链路优先。
- Agent Runtime 保持轻量。
- 重点补 citation、eval、trace。

可选组合：

```text
FastAPI + RAG Service + Vector DB + lightweight Agent Runtime + Evaluation
```

如果检索复杂，可以引入 LlamaIndex；如果任务状态复杂，再引入 LangGraph。

### 场景二：多 Agent 运营中台

推荐思路：

- 先设计 State 和权限。
- 再设计 Agent 角色。
- 最后决定框架。

可选组合：

```text
FastAPI + LangGraph/OpenAI Agents SDK + MCP Tools + Trace + Human Approval
```

不要只用“多个角色聊天”表示多 Agent。

### 场景三：个人学习 Demo

推荐思路：

- 快速验证概念。
- 不追求复杂治理。
- 但保留最小 trace 和 eval。

可选组合：

```text
OpenAI Agents SDK / CrewAI + simple tools + markdown run log
```

Demo 可以快，但要知道它距离生产还缺什么。

## 框架选型矩阵

| 需求 | 优先考虑 |
|---|---|
| 多步骤状态机 | LangGraph |
| OpenAI 生态快速 Agent | OpenAI Agents SDK |
| 知识库/RAG 核心 | LlamaIndex 或专门 RAG 组件 |
| 多角色协作 Demo | CrewAI |
| 强业务控制 | 自研轻量 Runtime |
| 高风险工具 | 框架之外补权限、审批、审计 |
| 长任务恢复 | 支持 checkpoint / persistence 的方案 |
| 求职作品集 | 选能讲清楚架构取舍的组合 |

## 面试表达

可以这样讲框架选型：

> 我不会一开始就说必须用某个 Agent 框架，而是先看任务。如果是固定流程，我会用普通 workflow；如果需要多步骤状态、暂停恢复和人工审批，我会考虑 LangGraph 这类状态机框架；如果是在 OpenAI 生态快速做 tools、handoff、tracing，可以考虑 Agents SDK；如果项目核心是 RAG，我会优先把检索、引用和评测做好，必要时引入 LlamaIndex。多 Agent Demo 可以用 CrewAI 快速表达角色协作，但生产系统仍然要补 State、权限、Trace 和 Evaluation。框架只是执行载体，工程治理才决定能不能上线。

## 常见误区

### 误区一：会框架等于会 Agent

框架 API 会用，不代表能设计任务边界、状态、工具权限和评测。

### 误区二：多 Agent 框架解决所有复杂度

多 Agent 会增加沟通成本和状态复杂度，不能替代架构设计。

### 误区三：RAG 项目过早引入复杂 Agent

很多 RAG 项目的主要问题是检索质量，不是 Agent 不够复杂。

### 误区四：忽略团队维护成本

框架越复杂，团队学习、调试和运维成本越高。

## 相关链接

- [Agent 开发 Playbook](/topics/agent-development-playbook)
- [Agent Runtime 横向对比](/topics/agent-runtime-comparison)
- [Tool System 横向对比](/topics/tool-system-comparison)
- [LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview)
- [Agent 面试追问库](/note/AI-Interview/agent-followup-interview)

## 参考资料

- [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview)
- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [LlamaIndex documentation](https://docs.llamaindex.ai/)
- [CrewAI documentation](https://docs.crewai.com/)

