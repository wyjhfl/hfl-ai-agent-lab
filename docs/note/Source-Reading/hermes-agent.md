# Hermes Agent 源码拆解

## 1. 项目定位

Hermes Agent 不是一个"会调用工具的聊天机器人"，而是一个长期运行在本地或服务器上的 Agent Runtime。它把聊天入口、模型调用、工具系统、记忆系统、技能系统、定时任务、跨平台消息网关和插件扩展整合成一个完整的 Agent 操作系统。

官方 README 将其定位为"self-improving AI agent"，支持 CLI、Telegram、Discord、Slack、WhatsApp、Signal 等入口，并有内置学习循环、记忆、技能、定时任务和 subagent delegation。

与普通 Agent Demo 的区别：

- 普通 Agent Demo：用户输入 → LLM → tool call → 返回结果
- Hermes Agent：多入口 → 会话层 → Agent Runtime → Prompt 系统 → Provider 系统 → Tool 系统 → Memory & Session → 结果投递

核心主线：`AIAgent` 是心脏，外围所有模块都在给 `AIAgent` 提供入口、上下文、工具、记忆、投递和恢复能力。

## 2. 整体架构

Hermes Agent 的整体架构可以分为以下层次：

### 入口层（Entry Points）

Hermes 不只有一个命令行入口，而是支持多种触发方式：

- CLI：终端交互入口
- Gateway：Telegram / Discord / Slack 等消息平台入口
- ACP：IDE/ACP 集成入口
- Batch Runner：批量任务/轨迹生成入口
- API Server：OpenAI-compatible API 入口
- Python Library：直接 `from run_agent import AIAgent` 使用

这意味着 Hermes 的设计像一个"可嵌入 Agent Runtime"，而不是只能在 CLI 里跑。`chat()` 方法会在内部处理完整 conversation loop，包括工具调用、重试等，然后只返回最终文本。

### Agent Runtime（AIAgent）

`AIAgent` 是核心 orchestration engine，负责：

- 构建 system prompt
- 选择 provider / API mode
- 发起模型调用
- 解析 tool_calls
- 执行工具
- 维护 messages
- 处理 compression
- 处理 retry / fallback
- 处理 callbacks
- 处理 memory flush
- 处理 session persistence

它支持三种 API mode：`chat_completions`（OpenAI-compatible）、`codex_responses`（OpenAI Responses/Codex 格式）、`anthropic_messages`（Anthropic Messages API）。内部消息统一成 OpenAI-style message 格式，在调用不同 provider 前后做格式转换。

### Prompt 系统

分层组装 system prompt，包括 SOUL.md（身份人格）、工具行为指导、MEMORY 快照、USER 快照、Skills 索引、项目上下文文件（AGENTS.md / .cursorrules）等。

### Provider 系统

支持 OpenRouter、Anthropic、OpenAI、local endpoint、fallback 等多种模型来源。

### Tool 系统

工具自注册到 registry，model_tools 负责收集 schema，AIAgent 根据模型返回的 tool_calls 调用 handle_function_call() 分发执行。

### Memory & Session

三层记忆：当前 messages（短期）、session database SQLite + FTS5（中期，可搜索历史对话）、MEMORY.md / USER.md（长期稳定事实和偏好）。

### Gateway

长期运行进程，接收平台消息，统一封装成 MessageEvent，做用户授权、解析 session key、加载历史 session、创建 AIAgent、调用 run_conversation()、把结果发回平台。支持的平台适配器包括 Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Mattermost、Email、SMS、DingTalk、Feishu、WeCom、Weixin、Webhook、API Server 等。

### Cron

定时任务不是普通提醒，而是定时创建一个 fresh AIAgent，给它 job prompt + skills context，让它独立完成任务，再投递到目标平台。

### Skills

Skill 不是工具本身，更像"任务说明书 + 工作流协议 + 可加载知识包"。Tool 解决"能不能做"，Skill 解决"怎么做得专业"。

### Plugin / MCP / Provider

Provider 负责模型来源，MCP 负责外部工具接入，Plugin 负责扩展 Hermes 自身能力。插件有三个发现来源：`~/.hermes/plugins/`、`.hermes/plugins/`、pip entry points。

## 3. 核心运行链路

Hermes Agent 的核心运行链路由 `AIAgent.run_conversation()` 驱动。所有入口（CLI、Gateway、API、Cron、Python Library）最终都在调用它。

### 主循环流程

```
run_conversation(user_message)
  ↓
1. 初始化本轮状态
  ↓
2. 加载/构建 messages
  ↓
3. 构建或恢复 system prompt
  ↓
4. preflight context compression
  ↓
5. 进入 while tool-calling loop
  ↓
6. 构建 api_messages
  ↓
7. 调用模型
  ↓
8. 判断模型输出
     ├── 有 tool_calls → 执行工具 → 工具结果加入 messages → 回到第 6 步
     └── 无 tool_calls → 得到 final_response → 保存会话 → 返回
```

### 进入主循环前的准备

Hermes 每一轮对话都不是直接把用户输入丢给模型，而是先做一系列工程化准备：

- 安装 safe stdio
- 确保 session DB 存在
- 恢复 primary runtime
- 清洗用户输入中的异常字符
- 生成 task_id
- 重置本轮 retry counters
- 重置本轮 iteration budget
- 从 conversation_history 构造 messages
- 把当前 user message append 到 messages
- 构建或恢复 system prompt
- 预检查是否需要上下文压缩
- 触发 plugin pre_llm_call
- memory provider prefetch

### 主循环核心逻辑

```
while api_call_count < max_iterations and iteration_budget.remaining > 0:
    build_api_messages()
    response = call_model()

    if response.has_tool_calls:
        append_assistant_tool_call_message()
        execute_tools()
        append_tool_results()
        continue
    else:
        append_final_assistant_message()
        break
```

Hermes 默认 iteration budget 是 90，可通过 `agent.max_turns` 配置。子 Agent 有独立 budget，耗尽时会停止并返回已完成工作的总结。

### 两个关键概念：messages vs api_messages

- `messages`：内部真实会话历史，会持久化
- `api_messages`：本次发给模型的副本，会被清洗、注入、裁剪

外部 memory prefetch 和 plugin pre_llm_call 的内容只注入到 api_messages，不修改原始 messages，因此不会泄露到 session persistence。

## 4. 关键模块拆解

### AIAgent（run_agent.py）

**职责：** Agent Runtime Kernel，负责整个 Agent 的运行调度。

**输入：** 用户消息、会话历史、系统配置。

**输出：** 最终响应、更新后的会话消息、执行元数据。

**关键设计：**

- `AIAgent.__init__()` 已经变成 thin wrapper，真正初始化逻辑在 `agent/agent_init.py` 的 `init_agent()`，包含 60+ 参数、约 1400 行属性初始化
- `chat()` 是简单接口，只返回最终字符串；`run_conversation()` 是完整接口，返回 messages、metadata、usage
- Agent 运行时需要的所有状态都挂在 `self` 上，后续的 `run_conversation()` 围绕这个 `self` 做循环调度

**可迁移点：** Agent Core 和 Tool Implementation 应该解耦，AIAgent 不直接依赖工具实现，只依赖工具 registry。

### Prompt Builder（agent/prompt_builder.py）

**职责：** Agent 的"大脑装配器"，决定模型不是裸 LLM，而是一个有身份、有记忆、有技能、有项目规则的长期 Agent。

**输入：** session 配置、workspace 文件、memory 快照、skills 索引。

**输出：** 组装好的 system prompt。

**关键设计：**

Prompt 分层组装：

1. SOUL.md（Agent 身份人格）
2. Tool-aware behavior guidance（工具行为指导）
3. Honcho static block
4. Optional system message
5. Frozen MEMORY snapshot（长期记忆快照）
6. Frozen USER profile snapshot（用户画像快照）
7. Skills index（技能索引）
8. AGENTS.md / .cursorrules（项目上下文文件）
9. timestamp / session id / platform hint

核心思想：稳定信息进 cached system prompt，临时信息每次 API call 时动态注入。system prompt 每个 session 构建一次，后续尽量复用，以保持 prompt cache 稳定。

**可迁移点：** 不要把 Agent 身份写死在代码里，应该抽成可配置的 persona / role / system profile。每个 Agent 都应该有自己的 SOUL.md 或 ROLE.md。

### Tool System（tools/registry.py、model_tools.py、toolsets.py）

**职责：** 决定 Agent "能做什么"。

**输入：** 模型返回的 tool_calls。

**输出：** 工具执行结果。

**关键设计：**

工具不是写死在 Agent 里，而是每个 tools/*.py 自注册到 registry：

- tools/file_tools.py → registry.register("read_file", ...)
- tools/web_tools.py → registry.register("web_search", ...)
- tools/terminal_tool.py → registry.register("terminal", ...)

registry 统一保存所有 ToolEntry，model_tools 生成 schema 给模型，模型返回 tool_call 后 handle_function_call 分发到具体 handler。

工具分两层：普通工具层（文件、终端、浏览器、Web、MCP）和 Agent 内核工具层（memory、todo、session_search、delegate_task、clarify）。

**可迁移点：** Agent 不直接依赖工具实现，Agent 只依赖工具 registry，这样才能做到可扩展、可测试、可插拔。

### Tool Executor（agent/tool_executor.py）

**职责：** 工具执行器，支持顺序和并发两种执行模式。

**输入：** 模型返回的 tool_calls 列表。

**输出：** 工具执行结果，以 role="tool" 写回 messages。

**关键设计：**

- `execute_tool_calls_sequential()`：单个工具 / 交互式工具
- `execute_tool_calls_concurrent()`：多个互不冲突工具，使用 thread pool
- 并发执行时，收集结果后按照原始 tool-call 顺序 append 到 messages，避免 API 看到乱序 tool result

核心原则：执行可以并发，但写回消息历史必须有序。

**可迁移点：** 工具执行结果必须以 role="tool" 回填，工具可以并发但消息写回必须有序。

### Session Storage（hermes_state.py）

**职责：** 决定 Agent "能不能连续工作"。

**输入：** 会话消息、用户信息。

**输出：** 持久化的会话数据。

**关键设计：**

使用 `~/.hermes/state.db`（SQLite），主要表包括 sessions、messages、messages_fts、messages_fts_trigram、state_meta、schema_version。

关键特性：

- SQLite WAL mode：支持并发读 + 单写
- FTS5：跨 session 全文搜索
- trigram tokenizer：支持 CJK / substring search
- parent_session_id：压缩后 session lineage 追踪
- source tagging：区分 cli / telegram / discord 等来源

记忆分层：短期记忆（当前 messages）、中期记忆（session database，可搜索历史对话）、长期记忆（MEMORY.md / USER.md）。

**可迁移点：** 永久 history 和本轮 API context 必须分开，不要把所有临时检索内容都永久写进 history。

### Gateway（gateway/run.py、gateway/session.py、gateway/delivery.py）

**职责：** 决定 Agent "活在哪里"，长期运行进程，跨平台消息接入。

**输入：** 平台消息。

**输出：** Agent 响应，投递回对应平台。

**关键设计：**

Gateway 流程：平台消息 → Adapter.on_message() → MessageEvent → GatewayRunner._handle_message() → 鉴权 / session key / 创建 AIAgent → AIAgent.run_conversation() → delivery 发回平台。

支持的平台适配器包括 Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Mattermost、Email、SMS、DingTalk、Feishu、WeCom、Weixin、Webhook、API Server 等。

**可迁移点：** Agent 作为 daemon/gateway 长期运行，从任何平台发消息都能接着之前的上下文继续工作。

### Cron（cron/jobs.py、cron/scheduler.py）

**职责：** 决定 Agent "能不能主动做事"。

**输入：** 定时任务配置（jobs.json）。

**输出：** 定时执行结果，投递到目标平台。

**关键设计：**

Cron flow：Scheduler tick → load due jobs → create fresh AIAgent → inject attached skills → run job prompt → deliver response → update job state and next_run。

**可迁移点：** 对应定时运营任务、日报生成、风控巡检、指标异常检测、策略复盘等场景。

### Memory Manager（agent/memory_manager.py）

**职责：** 管理长期记忆和上下文压缩。

**输入：** 对话过程中的事实、偏好、经验。

**输出：** 结构化的记忆快照。

**关键设计：**

- 长期记忆通过 MEMORY.md / USER.md 持久化
- 上下文压缩在两类场景触发：调用模型前 preflight 发现上下文太大、API 报 context overflow
- preflight 在会话超过模型上下文窗口 50% 时触发压缩
- 压缩时先 flush memory，再把中间对话摘要化，保留最近 N 条消息，并保持 tool call/result 成对不拆

**可迁移点：** 压缩不是简单总结文本，而是要保证 session lineage、tool call pair、memory flush、最近上下文完整性。

## 5. 设计亮点

### Agent Core 和 Tool Implementation 解耦

AIAgent 不直接依赖工具实现，只依赖工具 registry。这让工具可以独立开发、测试和替换。

### 内部 messages 和 API messages 分离

持久会话历史保持干净可恢复，API 调用上下文可以注入、变形、优化。临时检索内容不会永久写进 history。

### System Prompt 稳定缓存

system prompt 每个 session 构建一次，后续尽量复用。稳定身份、工具说明、长期记忆放 system prompt；临时检索、插件上下文、本轮补充信息放 user message。

### Tool Call 先校验、限流、去重，再执行

模型只负责提出 tool call；Hermes Runtime 负责校验、限流、去重、执行、记录、再反馈给模型。

### 错误处理工程化

Agent 不稳定不是异常，而是常态。Hermes 的主循环里有大量错误恢复逻辑：空响应重试、thinking-only 响应 prefill、tool call JSON 修复、truncated response continuation、context overflow 压缩后重试、rate limit fallback、auth error fallback / refresh。

错误处理路径：错误分类 → 是否可重试 → 是否需要压缩 → 是否换 provider → 是否修复消息格式 → 是否保存 partial state → 是否给用户明确提示。

### Iteration Budget 硬控

防止 Agent 无限循环不只靠提示词，代码层有硬限制：max_iterations、iteration_budget、tool guardrails、empty response retry limit、fallback chain、compression retry limit。

## 6. 可迁移到个人项目的设计

- **任务对象封装**：把用户输入封装成任务对象，让整个执行链路有统一的数据载体
- **计划执行分离**：Planner 和 Executor 分离，各自独立演进
- **工具 Schema 驱动**：用 JSON Schema 描述工具参数，让模型能理解工具的使用方式
- **结构化工具结果**：工具调用结果包含成功/失败标记、结果数据、错误信息
- **执行轨迹保留**：记录每一步的输入输出摘要、工具调用记录、状态变化记录
- **Prompt 模板化**：系统提示、工具描述、任务上下文分开管理，按需组装
- **错误分级处理**：区分可重试错误和不可重试错误，分别处理
- **Session 与 Memory 分离**：session 保存原始对话历史，memory 保存提炼后的长期知识
- **Workspace 文件化**：Agent 的人格、规则、工具说明、用户画像外置成文件，可读可改可备份可迁移

## 7. 面试表达

### 表达一：整体理解

> 我在阅读 Hermes Agent 时，重点关注的不是某个函数怎么写，而是它如何把用户请求转化为一个可执行任务链路。Hermes 的核心是 AIAgent 这个 Runtime Kernel，所有入口（CLI、Gateway、API、Cron）最后都在调用 run_conversation()。这个方法内部是一个 Think-Act-Observe 循环：构建 system prompt → 调用模型 → 判断是否有 tool_calls → 有则执行工具并把结果写回 messages 继续循环，无则返回最终响应。外围还有 Prompt Builder 负责分层组装上下文，Tool Registry 负责工具自注册和分发，Session Storage 负责持久化会话，Memory 负责长期记忆。这种分层设计让 Agent 从 Demo 变成了可长期运行的 Runtime。

### 表达二：设计思想

> 从 Hermes 中我学到的最重要的设计思想是"分层管理"。Prompt 分层：稳定身份放 system prompt，临时上下文放 API messages，原始会话保持干净。工具分层：普通工具走 registry，Agent 内核工具（memory、todo、delegate_task）走特殊逻辑。记忆分层：短期是当前 messages，中期是可搜索的 session database（SQLite + FTS5），长期是 MEMORY.md / USER.md。错误处理也是分层的：先分类，再决定是否重试、是否压缩、是否换 provider。这种分层思想可以直接迁移到自己的 Agent 项目中。

## 8. 后续 TODO

- 待补充真实源码文件路径和关键函数调用链
- 待补充 AIAgent 初始化的完整参数列表
- 待补充 Tool Registry 的注册和分发源码细节
- 待补充 Session Storage 的表结构和查询逻辑
- 待补充 Gateway 的平台适配器实现细节
- 待补充 Multi-Agent / Kanban / Delegate 的源码实现

## 进阶阅读

- [Hermes Agent 高级用法与进阶玩法](/note/Source-Reading/hermes-agent-advanced) — 子代理驱动开发、Kanban 多代理协作、TDD、预提交审查、MCP、Cron、Skills、安全控制、TUI、Worktree 与跨平台网关
