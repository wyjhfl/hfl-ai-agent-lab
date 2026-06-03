# Agent Runtime 横向对比：任务执行引擎到底负责什么

## 这篇文章解决什么问题

很多人理解 Agent Runtime 时有误区：

- 把 Runtime 当成模型——Runtime 不是 LLM，而是组织 LLM 调用的执行引擎。
- 把 Runtime 当成 Prompt——Prompt 是输入，Runtime 是执行机制。
- 把 Runtime 当成简单 while loop——简单 loop 没有权限、Trace、错误恢复和评测。
- 把 Runtime 和 Workflow 混在一起——Workflow 偏预定义流程，Runtime 偏动态任务执行。
- 不知道 Runtime 和 Tool / Memory / Trace / Evaluation 的边界——这些是 Runtime 协调的模块，不是 Runtime 本身。

这篇文章要通过横向对比回答：

- Runtime 在不同 Agent 系统里通常承担什么职责？
- Runtime 和 Workflow 有什么区别？
- Runtime 和 Agent Loop 有什么区别？
- Runtime 应该如何服务个人项目设计？

核心观点：**Runtime 的核心职责可以抽象为：接管任务 → 初始化状态 → 调用模型 → 解析动作 → 调用工具 → 更新状态 → 记录执行轨迹 → 判断停止条件 → 生成结果 → 进入评测。** 不同系统对 Runtime 的侧重点不同，但 Runtime 都不是模型本身，而是任务执行中心。

---

## 对比结论先行

从站内已有拆解内容看，Runtime 在不同系统中的定位可以总结为：

- **简单 Agent Loop**：能跑 Demo，但缺乏工程化能力。
- **Workflow 系统**：适合确定性流程，但缺乏动态决策能力。
- **生产级 Agent Runtime**：在 Agent Loop 基础上，增加权限控制、Trace、错误恢复、成本统计、人工审批和 Evaluation。

不同系统对 Runtime 的侧重点不同：Hermes 的 AIAgent 更偏"任务执行循环引擎"，OpenClaw 的 Runtime 更偏"系统级任务执行节点"，Harness Engineering 的 Runtime 更偏"九层架构中的执行核心"。

---

## 对比维度总览

| 维度 | 简单 Agent Loop | Workflow 系统 | 生产级 Agent Runtime |
|---|---|---|---|
| 执行方式 | while 循环调用模型和工具 | 按预定义节点顺序执行 | 动态任务执行，根据模型输出和状态决定下一步 |
| 状态管理 | 无状态或简单 context append | 状态在流程节点间传递 | 完整的 State 管理，支持暂停、恢复、重试 |
| 工具调用 | 直接调用，无校验 | 工具是流程中的固定节点 | Schema 校验、权限检查、错误处理、Trace 记录 |
| 错误处理 | 无或简单重试 | 流程层面定义错误分支 | 错误分类、重试策略、降级方案、人工接管 |
| 停止条件 | 无或手动 | 流程结束即停止 | 最大 step 数、最大耗时、成本上限、状态变化检测 |
| Trace | 无 | 流程执行日志 | 完整执行轨迹：run_id、step_id、model_call、tool_call、state_change |
| Evaluation | 无 | 无或简单结果检查 | 任务完成率、工具准确率、成本、安全违规率 |
| 安全控制 | 无 | 流程层面的权限控制 | 工具权限、高风险审批、敏感信息脱敏、审计日志 |
| 适用场景 | Demo 验证 | 确定性业务流程 | 需要动态推理和决策的 Agent 任务 |

---

## Runtime 的最小职责

从站内已有拆解内容看，Runtime 的最小职责可以抽象为：

- **接收任务**：从 API 或 Gateway 接收用户请求。
- **创建 run_id**：为这次任务执行创建唯一标识。
- **初始化 State**：设置初始状态，包括任务目标、已完成步骤、待处理操作。
- **构建 Context**：从 Session、Memory、Workspace 中读取相关信息，组装模型输入。
- **调用模型**：传入 Context，获取模型输出。
- **解析 Action**：把模型输出解析成结构化行动（tool_call、final_answer、invalid）。
- **调用 Tool**：如果 Action 是 tool_call，校验参数、检查权限、执行工具。
- **更新 State**：根据工具结果更新任务状态。
- **记录 Trace**：记录这次调用的完整信息（model_call、tool_call、state_change、latency）。
- **判断停止**：检查停止条件（最大 step 数、最大耗时、成本上限、final_answer）。
- **返回结果**：生成最终结果，记录到 Trace。

这些职责在不同系统中有不同的实现方式，但核心逻辑是一致的。

---

## Runtime 与简单 Agent Loop 的区别

简单 Agent Loop 通常是这样的：

```python
while not done:
    output = call_model(context)
    result = call_tool(output)
    context.append(result)
```

这个循环能跑 Demo，但缺乏工程化能力：

- **没有清晰 run_id / step_id**：无法追踪每次执行。
- **没有权限控制**：任何工具都能调用。
- **没有错误分类**：所有错误都一样处理。
- **没有成本统计**：不知道消耗了多少 token。
- **没有恢复机制**：任务中断后无法继续。
- **没有 Evaluation**：不知道任务完成质量。
- **很难做生产调试**：出问题后无法定位原因。

从站内已有拆解内容看，Hermes 的 AIAgent 在简单 loop 基础上增加了：iteration budget 硬控、错误分类和恢复、messages 和 api_messages 分离、上下文压缩、Tool Registry 自注册、Tool Executor 支持顺序和并发执行。这些都是从"简单 loop"到"生产级 Runtime"的关键工程化能力。

---

## Runtime 与 Workflow 的区别

| 对比项 | Workflow | Runtime |
|---|---|---|
| 是否预定义 | 流程在设计时确定 | 执行逻辑在运行时动态决定 |
| 是否动态决策 | 节点逻辑固定 | 根据模型输出和状态动态决策 |
| 状态管理 | 状态在流程节点间传递 | 完整的 State 管理，支持暂停、恢复、重试 |
| 错误处理 | 流程层面定义错误分支 | 根据错误类型动态决定重试、降级或终止 |
| 工具调度 | 工具是流程中的固定节点 | 工具调用由模型动态决定，Runtime 负责校验和执行 |
| 适用任务 | 确定性高的业务流程 | 需要动态推理和决策的 Agent 任务 |
| 评测方式 | 流程正确性检查 | 任务完成率、工具准确率、成本、安全违规率 |

从站内已有拆解内容看，Hermes 的 Kanban 编排更接近 Workflow 思想——Orchestrator 分解任务、Worker 按计划执行、关键节点人工审查。但 Hermes 的单个 Worker 内部仍然是 Runtime 驱动的动态执行。

生产系统里二者可以结合：用 Workflow 定义大框架，用 Runtime 处理每个节点内的动态 Agent 逻辑。

---

## Runtime 与 Trace 的关系

Runtime 执行任务，Trace 记录任务。Runtime 每推进一步，都应该记录：

- `run_id`：任务执行唯一标识。
- `step_id`：当前步骤标识。
- `model_call`：模型调用的输入、输出和耗时。
- `tool_call`：工具调用的名称、参数、结果和状态。
- `state_change`：任务状态的变化。
- `error_event`：错误信息和处理方式。
- `latency`：执行耗时。
- `token_usage`：token 消耗。
- `cost`：成本。
- `final_result`：最终结果。

从站内已有拆解内容看，Hermes 通过 session DB 持久化 messages 和执行元数据，OpenClaw 通过 Session transcript jsonl 记录执行过程，Harness Engineering 强调"执行结果和评估结果分离"——同一个执行结果可以被多次评估。

---

## Runtime 与 Tool System 的关系

Runtime 不应该直接相信模型生成的工具调用参数。它要负责：

- 选择工具或接收模型提出的工具调用。
- 校验参数是否符合 Schema。
- 检查权限——当前用户是否有权限调用该工具。
- 调用工具并获取结果。
- 处理工具失败——重试、换工具、降级、人工接管。
- 写入工具调用记录到 Trace。

从站内已有拆解内容看，Hermes 的 Tool Executor 支持顺序和并发两种执行模式，执行可以并发但写回消息历史必须有序。OpenClaw 的 Tool Policy 通过 allow/deny 列表控制每个 Agent 的工具权限。Harness Engineering 的 Permission & Governance 层区分只读工具和变更工具，查询类自动允许、变更类需要确认、高风险强制审批。

---

## Runtime 与 Memory / State 的关系

- **State** 是当前任务如何推进——记录当前步骤、已完成步骤、待处理操作和关键状态摘要。
- **Memory** 是跨任务复用的信息——保存用户偏好、项目背景和历史经验。
- **Context** 是当前模型调用看到的信息——从 Session、Memory、Workspace 中构建。

Runtime 负责决定：

- 读取哪些 Memory。
- 当前 State 如何更新。
- 哪些 State 进入下一轮 Context。
- 哪些信息沉淀为长期记忆。

从站内已有拆解内容看，Hermes 的 Memory Manager 在调用模型前 preflight 发现上下文太大时触发压缩，压缩时先 flush memory，再把中间对话摘要化，保持 tool call/result 成对不拆。OpenClaw 的 Compaction 机制在长对话中保留目标、关键证据、已完成步骤和下一步计划。

---

## Runtime 与 Evaluation 的关系

Evaluation 不是 Runtime 的一部分，但 Runtime 的输出要能被 Evaluation 使用。Evaluation 需要：

- `run_id`：关联执行记录。
- `final_result`：最终输出。
- `tool_call_record`：工具调用记录。
- `trace`：完整执行轨迹。
- `latency`：执行延迟。
- `cost`：token 消耗。
- `error_type`：错误类型。
- `human_feedback`：人工反馈。

从站内已有拆解内容看，Harness Engineering 强调"执行结果和评估结果分离"——同一个执行结果可以被多次评估，评估标准可以随时间变化而不需要重新执行任务。失败样本沉淀为评测集，用失败样本做回归测试。

---

## Runtime 设计清单

如果你要设计一个生产级 Runtime，可以检查以下清单：

- [ ] 是否有 run_id——唯一标识一次任务执行。
- [ ] 是否有 step_id——标识每个执行步骤。
- [ ] 是否有明确 State——记录任务当前状态。
- [ ] 是否有停止条件——最大 step 数、最大耗时、成本上限。
- [ ] 是否有工具权限检查——不能让 Agent 随意调用高风险工具。
- [ ] 是否有错误分类——区分可重试错误和不可重试错误。
- [ ] 是否有 Trace——记录完整执行轨迹。
- [ ] 是否有成本统计——记录 token 消耗和工具调用成本。
- [ ] 是否能关联 Evaluation——执行结果能被评估系统使用。
- [ ] 是否支持人工接管——高风险操作需要人工确认。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

- 一次 RAG 查询可以看作一次 run。
- 文档检索、Rerank、生成、引用可以看作 step。
- 后续可以把 RAG 链路改造成可追踪 Runtime：每次查询有 run_id，每个阶段有 step_id，检索结果、排序分数、引用来源都记录到 Trace。
- 当答案质量不好时，可以通过 Trace 定位是哪个环节出了问题。

**项目 B（多 Agent 运营中台 Copilot）：**

- 多 Agent Copilot 需要更明确的 Runtime。
- Runtime 应该管理任务分派、Agent step、工具调用、状态共享和最终聚合。
- 每个 Agent 的执行都应该有 run_id 和 step_id，通过 Trace 记录完整过程。
- 项目 B 仍保持占位，不展开实现。

---

## 面试表达

我理解 Runtime 是 Agent 的任务执行引擎，不是模型。Runtime 负责把 LLM、Tool、State、Trace、Evaluation 连接起来：接管任务 → 初始化状态 → 调用模型 → 解析动作 → 调用工具 → 更新状态 → 记录执行轨迹 → 判断停止条件 → 生成结果 → 进入评测。

简单 Agent Loop 能跑 Demo，但生产级 Runtime 还要处理权限控制、错误恢复、停止条件、成本统计、Trace 记录和 Evaluation 关联。从站内已有拆解内容看，Hermes 的 AIAgent 增加了 iteration budget 硬控、错误分类和恢复、上下文压缩；OpenClaw 的 Runtime 嵌入在 Gateway → Routing → Session → Runtime 的完整链路中；Harness Engineering 把 Runtime 拆成九层架构。

如果让我设计 Agent 系统，我会先定义 Runtime 的 run / step / tool_call 数据结构，然后围绕这些数据结构构建 Trace、Evaluation 和安全控制。

---

## 常见误区

- 把 Runtime 当成 LLM——Runtime 是执行引擎，LLM 是推理组件。
- 只写 while loop——没有权限、Trace、错误恢复和评测的 loop 不是 Runtime。
- 不记录 run_id——无法追踪任务执行过程。
- 没有停止条件——Agent 可能陷入无限循环。
- 工具失败只让模型重新回答——模型不知道工具为什么失败，需要 Runtime 做工程决策。
- 不做权限控制——Agent 能调用工具后，安全风险成倍增加。
- 没有 Trace——出问题后无法定位原因。
- 没有 Evaluation——不知道任务完成质量。
- 不统计成本——不知道消耗了多少 token 和工具调用成本。

---

## 后续 TODO

- 补充 Runtime 状态机图。
- 补充 Runtime 数据库表设计。
- 补充 Runtime 与 LangGraph 的关系。
- 补充多 Agent Runtime 调度示例。
