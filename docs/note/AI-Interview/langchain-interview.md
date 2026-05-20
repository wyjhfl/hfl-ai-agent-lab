# LangChain / LangGraph 面试题

## 高频问题地图

- LangChain 解决什么问题？
- Chain、Agent、Tool 有什么区别？
- 为什么复杂 Agent 更适合用 LangGraph？
- State、Node、Edge、Conditional Edge 分别是什么？
- Checkpoint 有什么价值？
- Human-in-the-loop 如何设计？
- LangGraph 和普通 Agent Loop 有什么区别？
- 什么时候不用框架，选择手搓 Agent？
- 如何做框架选型？

## 核心概念速记

**LangChain**：LLM 应用开发框架，提供 Chain（链式调用）、Agent（自主决策）、Tool（工具封装）、Memory（上下文管理）等抽象，简化 LLM 应用开发。

**Chain**：预定义的执行流程，输入 → 处理 → 输出。适合流程固定、不需要动态决策的场景。

**Agent**：基于 LLM 的自主决策循环，能根据当前状态动态选择下一步行动。适合需要灵活判断的场景。

**Tool**：Agent 可调用的外部能力，定义名称、描述、参数 schema 和执行函数。

**LangGraph**：LangChain 生态的状态图编排框架。把 Agent 执行流程建模为有向图，节点是处理步骤，边是流转规则。

**State**：LangGraph 中贯穿整个图的状态对象，所有节点共享同一个 State，通过读写 State 传递数据。

**Node**：图中的处理节点，接收 State，执行逻辑，返回 State 更新。

**Edge**：节点之间的连接，定义执行顺序。

**Conditional Edge**：条件分支，根据 State 中的值决定下一个节点。

**Checkpoint**：状态快照，支持暂停/恢复、回溯、调试。LangGraph 的核心特性之一。

**Human-in-the-loop**：在 Agent 执行流程中插入人工审核节点，让人类在关键步骤确认或修改。

---

## Q1：LangChain 解决什么问题？

### 标准回答

LangChain 解决的是 LLM 应用开发中的工程化问题。在 LangChain 之前，开发一个 LLM 应用需要自己处理很多底层细节：怎么管理对话历史、怎么封装工具调用、怎么串联多个处理步骤、怎么处理模型输出的解析、怎么切换不同的 LLM 提供商。每个开发者都在重复实现这些基础能力。

LangChain 提供了一套标准化的抽象层。Chain 把多个处理步骤串联成流水线，输入经过一系列处理后输出。Agent 封装了 LLM 的自主决策循环，开发者只需要定义工具集和 Prompt，不需要自己写推理循环。Tool 提供了统一的工具定义和调用接口。Memory 管理对话历史和上下文，支持多种存储后端。LLM 抽象层让开发者可以用同一套代码切换不同的模型提供商。

LangChain 的价值在于降低了 LLM 应用开发的门槛，让开发者可以专注于业务逻辑而不是底层基础设施。但 LangChain 也因为抽象层过多、学习曲线陡峭、调试困难而受到批评。

### 面试官追问

1. LangChain 的抽象层带来了什么问题？什么场景下不用 LangChain 更好？
2. LangChain 的 Chain 和直接写代码串联步骤有什么区别？
3. LangChain 和 LlamaIndex、Haystack 等框架有什么区别？

### 工程化理解

LangChain 在工程中的价值主要体现在快速原型开发和标准化接口。对于简单的 LLM 应用（如聊天机器人、文档问答），LangChain 可以大幅减少样板代码。但对于复杂的生产级应用，LangChain 的抽象层可能成为负担：调试时难以追踪数据流、性能优化空间被框架限制、升级版本时 API 变动频繁。实际项目中，很多团队在原型阶段用 LangChain 快速验证，生产阶段逐步替换为更轻量的自研方案。

### 常见误区

1. 认为 LangChain 是 LLM 应用开发的必需品：简单场景直接调用 API 可能更高效。
2. 过度依赖框架抽象：不理解底层原理就用框架，出了问题无法排查。
3. 不关注框架版本变动：LangChain 的 API 变动频繁，升级可能引入 breaking changes。

### 背诵版总结

LangChain 解决 LLM 应用开发的工程化问题，提供 Chain、Agent、Tool、Memory 等标准化抽象。降低了开发门槛，但也引入了抽象层过多、调试困难等问题。适合快速原型开发，复杂生产场景可能需要更轻量的方案。核心价值是标准化接口和组件复用。

---

## Q2：Chain、Agent、Tool 有什么区别？

### 标准回答

Chain、Agent、Tool 是 LangChain 中三个不同层次的抽象。

Chain 是预定义的执行流程。开发者在设计时就确定了步骤顺序：输入经过步骤 A 处理后传给步骤 B，步骤 B 处理后传给步骤 C，最终输出。Chain 的执行路径是固定的，适合流程明确、不需要动态判断的场景。比如"用户输入 → 检索知识库 → 构建 Prompt → 调用 LLM → 格式化输出"就是一个典型的 Chain。

Agent 是动态决策系统。Agent 的执行路径不是预先定义的，而是由 LLM 在运行时根据当前状态动态决定。Agent 可以在推理过程中决定调用哪个工具、是否继续执行、是否需要调整策略。Agent 适合需要灵活判断的场景，比如"根据用户问题的类型，选择不同的处理策略"。

Tool 是 Agent 可以调用的外部能力。Tool 定义了名称、描述、参数 schema 和执行函数。Tool 本身没有决策能力，只负责执行具体操作。Agent 通过调用 Tool 来获取信息或执行操作。

三者的关系是：Agent 是决策者，Tool 是执行者，Chain 是编排者。Agent 调用 Tool 来完成任务，Chain 编排多个步骤的执行顺序。一个复杂应用中，可能有多个 Chain 和 Agent，每个 Agent 可以调用多个 Tool。

### 面试官追问

1. Chain 和 Agent 在代码层面有什么区别？实现上差在哪里？
2. 如果一个任务 90% 步骤固定、10% 需要动态判断，怎么设计？
3. Tool 的描述怎么写才能让 Agent 准确调用？

### 工程化理解

工程中，Chain 的优势是可预测性和可调试性：执行路径固定，容易做 Trace 记录和错误定位。Agent 的优势是灵活性：能处理未预见的场景。Tool 的设计需要平衡粒度和可用性：太粗的 Tool 功能单一但调用简单，太细的 Tool 功能丰富但调用复杂。实际项目中通常混合使用：主流程用 Chain 控制，关键判断点用 Agent，底层操作用 Tool。

### 常见误区

1. 混淆 Chain 和 Agent：Chain 是固定流程，Agent 是动态决策，解决不同问题。
2. 认为 Agent 一定比 Chain 好：如果流程固定，Chain 更可控、更易调试。
3. Tool 设计过粗或过细：需要根据 Agent 的推理能力和任务复杂度来确定粒度。

### 背诵版总结

Chain 是预定义流程，执行路径固定，适合明确场景。Agent 是动态决策系统，由 LLM 决定执行路径，适合灵活场景。Tool 是 Agent 调用的外部能力，没有决策权。三者的核心区别是决策权归属：Chain 的决策在设计时，Agent 的决策在运行时。实际项目通常混合使用。

---

## Q3：为什么复杂 Agent 更适合用 LangGraph？

### 标准回答

LangGraph 是 LangChain 生态中的状态图编排框架，专门为复杂 Agent 场景设计。它解决的核心问题是：当 Agent 的执行流程不再是简单的"推理→调用工具→再推理"循环，而是包含条件分支、循环、并行执行、人工审核等复杂控制流时，传统的 Agent Loop 很难清晰地表达和管理这些逻辑。

LangGraph 把 Agent 的执行流程建模为有向图。每个节点是一个处理步骤（可以是 LLM 调用、工具调用、人工审核等），每条边定义了节点之间的流转规则。条件边根据当前状态决定下一个节点，实现了分支逻辑。图的结构天然支持循环（Agent 可以反复推理直到任务完成）、并行（多个节点同时执行）、和人工审核（在特定节点暂停等待人工输入）。

和普通 Agent Loop 相比，LangGraph 的优势在于可视化、可控制、可检查点。可视化是指图结构可以直观地展示 Agent 的执行流程，方便理解和调试。可控制是指每个节点都可以独立测试和修改，不影响其他节点。可检查点是指 LangGraph 支持状态快照，可以暂停执行、回溯到任意状态、从断点恢复。

### 面试官追问

1. LangGraph 的图是静态定义的还是动态生成的？
2. 状态图的循环怎么防止无限循环？
3. LangGraph 的 Checkpoint 是怎么实现的？存储在哪里？

### 工程化理解

LangGraph 的工程价值在于把复杂的 Agent 逻辑结构化。传统 Agent Loop 是一个 while 循环加 if-else 分支，当逻辑变复杂时代码难以维护。LangGraph 把逻辑拆成节点和边，每个节点职责单一，边定义了流转规则，整体结构清晰。Checkpoint 机制支持暂停恢复和调试，这在生产环境中非常有价值：长任务可以暂停后恢复，出错时可以回溯到上一个正确状态。但 LangGraph 也有学习成本，简单场景用原生 Agent Loop 可能更直接。

### 常见误区

1. 认为 LangGraph 只是"画了个图"：图结构不只是可视化，它定义了执行逻辑、状态管理和检查点机制。
2. 认为所有 Agent 都需要 LangGraph：简单的单轮工具调用不需要状态图框架。
3. 忽略状态设计的重要性：State 是 LangGraph 的核心，设计不好会导致节点间数据传递混乱。

### 背诵版总结

LangGraph 是状态图编排框架，把 Agent 执行流程建模为有向图。节点是处理步骤，边是流转规则，支持条件分支、循环、并行、人工审核。比普通 Agent Loop 的优势在于可视化、可控制、可检查点。适合复杂 Agent 场景，简单场景用原生 Agent Loop 更直接。核心设计要素是 State、Node、Edge 和 Checkpoint。

---

## Q4：State、Node、Edge、Conditional Edge 分别是什么？

### 标准回答

State、Node、Edge、Conditional Edge 是 LangGraph 的四个核心概念。

State 是贯穿整个图的状态对象。所有节点共享同一个 State，通过读取 State 获取信息，通过返回 State 更新信息。State 是节点之间传递数据的唯一通道。State 通常是一个字典或 TypedDict，包含对话历史、中间结果、任务状态等信息。

Node 是图中的处理节点。每个节点接收当前 State 作为输入，执行一段逻辑（可以是 LLM 调用、工具调用、数据处理等），返回一个 State 更新。节点只关心自己的输入和输出，不直接和其他节点通信，所有数据交换通过 State 完成。

Edge 是节点之间的连接，定义了执行顺序。从节点 A 到节点 B 的边表示 A 执行完后接下来执行 B。Edge 是无条件的，执行完当前节点后固定流向下一个节点。

Conditional Edge 是条件分支。和普通 Edge 不同，Conditional Edge 根据当前 State 中的值动态决定下一个节点。比如：如果任务完成就结束，如果需要更多信息就回到工具调用节点，如果需要人工审核就进入审核节点。Conditional Edge 是实现 Agent 动态决策的关键机制。

### 面试官追问

1. State 设计太大或太小各有什么问题？
2. 节点之间只能通过 State 传递数据吗？能不能直接传参？
3. Conditional Edge 的条件表达式写在哪里？是函数还是字符串？

### 工程化理解

State 设计是 LangGraph 工程化的核心。State 太大（包含过多字段）会导致序列化开销大、Checkpoint 占用空间大。State 太小（字段不足）会导致节点之间信息传递不充分，需要额外的上下文机制。工程实践中，State 通常按职责分组：对话相关（messages、history）、任务相关（task_status、current_step）、工具相关（tool_results、pending_calls）。Conditional Edge 的条件是一个函数，接收 State 返回下一个节点的名称，逻辑清晰且可测试。

### 常见误区

1. State 设计过于随意：没有明确的字段定义和类型约束，运行时容易出现 KeyError 或类型错误。
2. 节点职责不单一：一个节点做了太多事情，违反了图结构"每个节点职责清晰"的设计原则。
3. Conditional Edge 条件过于复杂：条件函数应该简洁明了，复杂逻辑应该拆分到节点中处理。

### 背诵版总结

State 是贯穿图的状态对象，所有节点通过读写 State 传递数据。Node 是处理节点，接收 State 执行逻辑返回 State 更新。Edge 是无条件连接，定义固定执行顺序。Conditional Edge 是条件分支，根据 State 动态决定下一个节点。State 设计是核心工程决策，需要平衡完整性和简洁性。
