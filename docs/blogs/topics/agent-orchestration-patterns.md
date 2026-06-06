# Agent 编排模式：Router、Planner、Supervisor 和 Workflow 怎么选

## 这篇文章解决什么问题

Agent 系统不是只有一种“循环调用模型”的写法。常见编排方式包括：

- 简单 Chain。
- Router。
- Planner-Executor。
- Supervisor + Workers。
- State Machine。
- Graph Workflow。
- Multi-Agent Debate。
- Human-in-the-loop Workflow。

如果不理解这些模式，很容易把所有任务都做成复杂 Multi-Agent，或者把复杂任务硬塞进一个 Prompt。

这篇文章整理常见 Agent 编排模式，以及它们适合什么场景。

## 1. Chain

```text
input -> step1 -> step2 -> step3 -> output
```

适合：

- 固定流程。
- 文档摘要。
- 格式转换。
- 简单分类后生成。

优点：简单、稳定、易测试。

缺点：不适合动态分支和复杂工具选择。

## 2. Router

```text
input -> classify intent -> route to expert chain/tool
```

适合：

- 多任务入口。
- 客服意图分流。
- RAG / 数据分析 / 工单创建分流。

关键点：

- router 输出要结构化。
- 低置信度要追问或 fallback。
- 路由错误要进入评测集。

## 3. Planner-Executor

```text
goal -> plan steps -> execute steps -> verify result
```

适合：

- 多步骤任务。
- 需要工具调用。
- 任务目标明确但路径不固定。

风险：

- plan 太泛。
- executor 自由度太高。
- step 没状态，失败难恢复。

建议：plan 要能落到可执行 step，并写入状态机。

## 4. Supervisor + Workers

```text
supervisor -> assign task -> worker agent -> report -> supervisor
```

适合：

- 多能力分工。
- Research / Coding / Review / QA。
- 多数据源协作。

关键点：

- worker 职责边界要清楚。
- supervisor 不应只是“聊天主持人”。
- handoff 要结构化。
- 共享状态和权限要受控。

## 5. State Machine

```text
PENDING -> RUNNING -> WAITING_APPROVAL -> SUCCEEDED / FAILED
```

适合：

- 长任务。
- 有审批。
- 有失败恢复。
- 有外部副作用。

优点：可控、可恢复、可审计。

缺点：灵活性不如自由 Agent，但生产系统通常更需要可控。

## 6. Graph Workflow

Graph Workflow 把节点和边显式建模：

```text
retrieve -> decide -> tool_call -> verify -> answer
          -> ask_clarification
          -> human_approval
```

适合：

- 分支复杂。
- 需要 checkpoint。
- 需要回放和调试。
- LangGraph 类项目。

## 7. Debate / Reflection

多个模型或 Agent 互相审查：

- Generator。
- Critic。
- Refiner。

适合：

- 高价值内容生成。
- 代码审查。
- 复杂推理校验。

不适合：

- 低成本高并发任务。
- 强实时任务。
- 没有评测标准的任务。

会增加成本和延迟。

## 8. Human-in-the-loop

人工介入点：

- 澄清需求。
- 审批高风险工具。
- 纠正输出。
- 标注失败样本。

适合：

- 高风险动作。
- 低置信度结果。
- 企业流程。

## 怎么选择

| 场景 | 推荐模式 |
|---|---|
| 固定摘要流程 | Chain |
| 多意图入口 | Router |
| 多步骤工具任务 | Planner-Executor |
| 多角色协作 | Supervisor + Workers |
| 长任务和审批 | State Machine |
| 复杂分支 | Graph Workflow |
| 高价值生成 | Reflection / Critic |
| 高风险业务动作 | Human-in-the-loop |

## 组合模式

真实系统通常组合使用：

```text
Router
  -> RAG Chain
  -> Data Analysis Agent
  -> Planner-Executor
       -> State Machine
       -> Human Approval
       -> Tool Sandbox
```

不要迷信单一模式。

## 面试表达模板

> 我会根据任务复杂度选择 Agent 编排模式。固定流程用 Chain，多意图入口用 Router，多步骤任务用 Planner-Executor，有长任务和审批时用 State Machine，需要复杂分支和 checkpoint 时用 Graph Workflow。多 Agent 不应该只是多角色聊天，而要明确 supervisor、worker、handoff、共享状态和权限边界。生产系统通常是组合模式：先 Router 分流，再进入 RAG、数据分析或 Planner-Executor，执行过程由状态机、Trace 和人审控制。

## 项目落地清单

- [ ] 先判断是否需要 Agent，而不是默认 Multi-Agent。
- [ ] Router 输出结构化且可评测。
- [ ] Planner 的 step 可执行、可恢复。
- [ ] Supervisor 和 worker 职责明确。
- [ ] 长任务使用状态机。
- [ ] 高风险动作有人审。
- [ ] 编排过程写入 Trace。
- [ ] 每种分支有测试样本。

## 相关链接

- [Agent Runtime](/note/AI-Agent/agent-runtime)
- [LangGraph](/note/AI-Agent/langgraph)
- [Multi-Agent](/note/AI-Agent/multi-agent)
- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)
- [Agent 系统设计面试题](/topics/agent-system-design-interview)
