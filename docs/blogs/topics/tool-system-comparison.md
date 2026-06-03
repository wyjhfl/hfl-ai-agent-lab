# Tool System 横向对比：Tool、Skill、Plugin、MCP、Hook 到底怎么区分

## 这篇文章解决什么问题

学习 Agent 工具系统时，经常会遇到这些概念：

- Tool
- Function Calling
- Skill
- Plugin
- MCP
- Hook

很多人会把它们混在一起，认为都是"让 Agent 调函数"。但在工程上，它们处在不同抽象层，解决不同的问题。

这篇文章要回答：

- Tool 和 Function Calling 是什么关系？
- Skill 和 Tool 有什么区别？
- Plugin 是什么层面的扩展？
- MCP 解决什么问题？
- Hook 为什么不是普通工具？
- 生产级 Agent 工具系统应该怎么设计？

核心观点：**Tool 是具体能力，Function Calling 是模型侧机制，Skill 是能力封装，Plugin 是扩展机制，MCP 是协议层，Hook 是治理入口。** 它们不是互斥关系，而是处在不同抽象层。

---

## 对比结论先行

从站内已有拆解内容看，这些概念的定位可以总结为：

- **Tool** 是 Agent 可调用的具体能力，例如查询数据库、搜索知识库、调用 API、读写文件。
- **Function Calling** 是模型选择和表达工具调用的一种机制，让模型输出结构化的工具调用意图。
- **Skill** 更像一组可复用能力或任务模板，解决"怎么做得专业"，而不是"能不能做"。
- **Plugin** 更偏系统扩展入口，用于接入外部服务、注册工具、扩展能力。
- **MCP** 更偏工具接入协议，解决不同工具如何统一暴露、Agent 如何发现工具。
- **Hook** 更偏执行过程中的治理、拦截和约束点，让 Agent 做事之前、之中、之后变得可控。

它们不是互斥关系，而是处在不同抽象层。一个完整的 Agent 工具系统可能同时包含 Tool、Skill、Plugin、MCP 和 Hook。

---

## 对比维度总览

| 概念 | 解决的问题 | 更接近哪一层 | 典型关注点 |
|---|---|---|---|
| Tool | Agent 能调用什么具体能力 | 执行层 | tool_name、input_schema、output_schema、permission_level |
| Function Calling | 模型如何表达工具调用意图 | 模型侧机制 | 模型输出结构化 tool_call、参数 JSON |
| Skill | 一类任务怎么做得专业 | 能力封装层 | 任务说明书、工作流协议、可加载知识包 |
| Plugin | 系统如何扩展能力 | 扩展层 | 注册 provider、channel、tool、skill |
| MCP | 工具如何标准化接入 | 协议层 | 工具发现、参数描述、资源暴露 |
| Hook | 执行过程如何被治理 | 治理层 | 执行前检查、工具调用拦截、输出审查、审计日志 |

---

## Tool：最小可执行能力

Tool 是 Agent 可以调用的具体能力。从站内已有拆解内容看，Tool 的典型设计包括：

- `tool_name`：工具唯一标识。
- `description`：功能描述，帮助模型判断什么时候用。
- `input_schema`：输入参数的 JSON Schema。
- `output_schema`：输出结果的结构定义。
- `permission_level`：权限等级。
- `risk_level`：风险等级。
- `timeout`：超时时间。
- `retry_policy`：重试策略。
- `audit_log`：审计日志。

从 Hermes 的拆解看，工具自注册到 registry，model_tools 负责收集 schema，AIAgent 根据模型返回的 tool_calls 调用 handle_function_call() 分发执行。工具分两层：普通工具层（文件、终端、浏览器、Web、MCP）和 Agent 内核工具层（memory、todo、session_search、delegate_task、clarify）。

从 OpenClaw 的拆解看，每个 Agent 可以有不同的 tool policy，通过 allow/deny 列表控制。Tool Policy 控制 Agent 能调用哪些工具。

Tool 的核心价值是让 Agent 从"只能生成文本"变成"能执行操作"。

---

## Function Calling：模型表达工具调用的机制

Function Calling 更偏模型侧机制，用来让模型输出结构化的工具调用意图。

从 Hermes 的拆解看，AIAgent 支持三种 API mode：chat_completions（OpenAI-compatible）、codex_responses（OpenAI Responses/Codex 格式）、anthropic_messages（Anthropic Messages API）。内部消息统一成 OpenAI-style message 格式，在调用不同 provider 前后做格式转换。

**Function Calling 不等于工具系统。** 因为工具系统还要处理：

- 参数校验——模型生成的参数可能有格式错误。
- 权限检查——当前用户是否有权限调用该工具。
- 工具执行——实际执行操作。
- 错误处理——工具失败后的重试、降级或人工接管。
- 结果结构化——把工具返回转换成标准格式。
- Trace 记录——记录这次工具调用的完整信息。
- 审计——记录谁在什么时候调用了什么工具。
- 安全策略——高风险工具需要审批。

Function Calling 只解决了"模型如何表达我要调用工具"，但工具系统的工程化远不止于此。

---

## Skill：可复用能力封装

Skill 更像是围绕某类任务封装的一组能力、模板、流程或经验。

从站内已有拆解内容看：

- **Hermes 的 Skill**：不是工具本身，更像"任务说明书 + 工作流协议 + 可加载知识包"。Tool 解决"能不能做"，Skill 解决"怎么做得专业"。Skills 可以安装、搜索、检查更新、发布、卸载，支持通过 GitHub 仓库作为技能源。
- **OpenClaw 的 Skill**：指导模型如何完成任务的说明。SKILL.md 会进入模型上下文，能改变 Agent 行为。OpenClaw 可以 mid-session 刷新 skills。
- **Harness Engineering 的 Skill**：把复杂工作流从 prompt 中抽离出来，变成可版本化、可复用、按需加载的任务手册。模型在系统提示中只看到技能目录，当任务匹配某个 Skill 时，再按需加载完整流程说明。

Skill 可能内部调用多个 Tool，也可能包含提示词模板、规则和步骤约束。例如：

- 代码审查 Skill：包含审查步骤、检查清单、需要调用哪些工具。
- 文档总结 Skill：包含总结模板、输出格式、质量标准。
- 测试生成 Skill：包含测试策略、覆盖要求、验证步骤。

---

## Plugin：系统扩展入口

Plugin 更偏系统扩展机制。从站内已有拆解内容看：

- **Hermes 的 Plugin**：有三个发现来源：~/.hermes/plugins/、.hermes/plugins/、pip entry points。Plugin 负责扩展 Hermes 自身能力。
- **OpenClaw 的 Plugin**：进程内代码，与 Gateway 在同一个进程里运行，不是 sandboxed。插件通过 central registry 注册 provider、channel、tool、skill、speech、web search、media 等能力。插件系统分为 manifest discovery、enablement validation、runtime loading、surface consumption 四层。

Plugin 关注的是"系统如何扩展"，Tool 关注的是"Agent 能调用什么能力"。

从 OpenClaw 的拆解看，Plugin 有风险等级：

- Skill 是 prompt/文档层风险——影响模型行为，但不直接影响系统。
- Tool 是可执行动作风险——可能修改数据、调用外部服务。
- Plugin 是进程内代码风险——可能直接影响 Gateway runtime。

---

## MCP：工具接入协议

MCP（Model Context Protocol）可以理解为一种标准化工具接入方式。

从站内已有拆解内容看，MCP 解决的问题：

- 不同工具如何统一暴露——用标准协议描述工具的名称、参数和能力。
- Agent 如何发现工具——通过协议自动发现和注册。
- 工具参数和资源如何描述——用标准化的 Schema 描述。
- 外部系统如何以标准方式接入 Agent——减少每个工具都写一套临时集成。

从 Hermes 的拆解看，Hermes 作为原生 MCP 客户端，支持连接 filesystem、GitHub、remote API 等外部工具。核心特性包括：工具自动发现和注册、命名约定（mcp_{server}_{tool}）、环境变量过滤、错误消息中的凭证脱敏、自动重连和指数退避。

MCP 是协议层，不等于某一个具体工具。它解决的是"工具如何标准化接入"的问题，而不是"工具能做什么"的问题。

---

## Hook：执行过程中的治理入口

Hook 不是普通工具，而是执行过程中的拦截点、检查点和治理入口。

从站内已有拆解内容看，Hook 可以用于：

- 执行前检查——验证参数、检查权限。
- 工具调用前校验——拦截高风险操作。
- 高风险操作拦截——需要人工确认。
- 输出结果审查——检查模型输出是否合规。
- 日志与 Trace 写入——记录执行过程。
- 成本控制——检查是否超出预算。
- 权限审计——记录谁做了什么。
- 自动化规则触发——基于事件触发自动化逻辑。

从站内已有拆解内容看，Harness Engineering 的 Hooks / Plugins / MCP 扩展层通过 Hooks 在生命周期节点插入风控、审计、记忆更新和自动化逻辑。OpenClaw 的安全防线中，Tool Policy 和 Exec Approval 本质上就是 Hook 机制的体现。

**核心观点：Tool 让 Agent 做事，Hook 让 Agent 做事之前、之中、之后变得可控。**

---

## 生产级 Tool System 设计

一条完整的 Tool System 工程链路：

**工具注册 → Schema 定义 → 权限配置 → 模型选择工具 → 参数校验 → Hook 拦截 → 工具执行 → 结果结构化 → Trace 记录 → 错误处理 → Evaluation**

每一步的作用：

1. **工具注册**：把可用工具注册到 registry，定义工具名称、描述和能力边界。
2. **Schema 定义**：为每个工具定义输入输出 Schema，明确参数类型、必填字段和约束条件。
3. **权限配置**：定义哪些用户、哪些 Agent 可以调用哪些工具。
4. **模型选择工具**：模型根据任务上下文，决定调用哪个工具。
5. **参数校验**：校验模型生成的参数是否符合 Schema。
6. **Hook 拦截**：在工具执行前，Hook 检查是否需要拦截（高风险操作、权限不足等）。
7. **工具执行**：调用工具系统执行具体操作。
8. **结果结构化**：把工具返回转换成标准格式（status、data、error_code、latency_ms）。
9. **Trace 记录**：记录这次工具调用的完整信息。
10. **错误处理**：根据错误类型决定重试、降级还是终止。
11. **Evaluation**：评估工具调用是否正确、是否高效。

---

## Tool System 与 Security

高风险工具必须有：

- **权限上下文**：当前用户是谁、有什么权限。
- **工具白名单**：只允许调用已注册的工具。
- **参数校验**：模型生成的参数不能直接执行。
- **人工审批**：删除数据、发送消息、执行代码等操作需要审批。
- **沙箱执行**：高风险操作在隔离环境中执行。
- **敏感信息脱敏**：Trace 中不保存 API Key、Token、密码。
- **审计记录**：记录所有工具调用和状态变化。
- **回滚策略**：操作失败后能回滚到安全状态。

从站内已有拆解内容看，OpenClaw 的安全思路是 identity first、scope next、model last——先决定谁能触发 bot，再决定 bot 能在哪里行动，最后才考虑模型，因为要假设模型可能被操纵。

---

## Tool System 与 Trace

每次工具调用都应记录：

- `run_id`：任务执行唯一标识。
- `step_id`：当前步骤标识。
- `tool_call_id`：这次工具调用的唯一标识。
- `tool_name`：调用的工具名称。
- `arguments_summary`：参数摘要（敏感参数需脱敏）。
- `result_summary`：结果摘要。
- `status`：执行状态（success、failed、timeout、permission_denied）。
- `latency_ms`：执行耗时。
- `error_message`：错误信息（如果失败）。
- `created_at`：调用时间。

---

## Tool System 与 Evaluation

Agent 评测不能只看最终答案，还要看：

- 工具是否选对——是否调用了正确的工具。
- 参数是否正确——参数是否符合 Schema、是否合理。
- 是否重复调用——同一个工具是否被不必要地多次调用。
- 是否越权——是否调用了无权限的工具。
- 是否失败恢复——工具失败后是否正确处理。
- 是否成本过高——工具调用次数和延迟是否在预期范围内。
- 是否触发高风险操作——是否需要人工审批的操作。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

- RAG 查询、文档上传、Rerank、评测触发都可以设计为 Tool。
- Query 和 Citation 可以进入 Tool Result。
- RAG Tool 的调用记录可以进入 Trace，用于问题排查和效果评估。
- 每个 Tool 都有 Schema 定义、参数校验和权限配置。

**项目 B（多 Agent 运营中台 Copilot）：**

- 多 Agent Copilot 需要工具权限矩阵——不同 Agent 可以访问不同 Tool / Skill。
- 高风险工具需要 Hook 拦截和人工审批。
- 工具调用结果要参与 Evaluation——评估工具是否被正确使用。
- 项目 B 当前保持占位，不展开实现。

---

## 面试表达

我不会把 Tool、Skill、Plugin、MCP、Hook 都混成"函数调用"。在学习和架构抽象层面，Tool 是具体能力，Skill 是能力封装，Plugin 是扩展机制，MCP 是协议层，Hook 是治理入口。它们处在不同抽象层，解决不同的问题。

生产级 Agent 工具系统要考虑 Schema、权限、错误处理、Trace、安全和评测。从站内已有拆解内容看，Hermes 的 Tool Registry 自注册 + Skill 任务说明书 + MCP 外部接入提供了一种工具系统设计思路；OpenClaw 的 Tool + Skill + Plugin 三层能力体系 + Tool Policy + Exec Approval 提供了另一种思路；Harness Engineering 的 Tool Gateway + Permission & Governance + Hooks / Plugins / MCP 提供了第三种思路。

这也是 Agent 从 Demo 走向工程系统的关键差异——Demo 只需要 Function Calling，生产系统需要完整的 Tool System。

---

## 常见误区

- 把 Function Calling 等同于工具系统——Function Calling 只是模型侧机制，工具系统还包括参数校验、权限、执行、Trace、审计。
- 把 MCP 当成单个工具——MCP 是协议层，不等于某一个具体工具。
- 把 Hook 当成普通 Tool——Hook 是治理入口，不是执行能力。
- 不做参数校验——模型生成的参数可能有格式错误、类型不匹配甚至安全风险。
- 不做权限控制——Agent 能调用工具后，安全风险成倍增加。
- 不记录工具调用——出问题后无法定位原因。
- 不区分 Skill 和 Tool——Tool 解决"能不能做"，Skill 解决"怎么做得专业"。
- 不考虑工具失败和回滚——工具调用可能失败，需要重试、降级或人工接管。
- 不考虑高风险工具审批——删除数据、发送消息、执行代码等操作需要审批。

---

## 后续 TODO

- 补充 Tool / Skill / MCP / Hook 架构图。
- 补充工具权限矩阵。
- 补充高风险工具审批流程。
- 补充 Tool System 与 Agent Trace 的联动示例。
