# Hermes vs OpenClaw：Agent 架构差异怎么理解

## 这篇文章解决什么问题

源码阅读容易陷入两个问题：

- 只记录模块名，不理解系统定位。
- 只看单个项目，不知道不同 Agent 架构之间的设计差异。

这篇文章要回答：

- Hermes 更适合从哪个角度理解？
- OpenClaw 更适合从哪个角度理解？
- 二者在 Agent 架构上的重点有什么不同？
- 对个人项目设计有什么启发？

核心观点：**Hermes 更适合作为"Agent 工作流与高级用法"的学习样本，OpenClaw 更适合作为"复杂 Agent 系统分层"的学习样本。** 二者不是谁替代谁，而是强调的工程问题不同。

---

## 对比结论先行

从站内已有拆解内容看，两个项目的核心差异可以总结为：

- **Hermes 更偏向任务组织、代理协作、技能扩展和开发工作流。** 它的核心问题是"Agent 如何参与开发流程"——子代理派遣、Kanban 编排、TDD、预提交审查、MCP 集成、Cron 定时任务、Skills 技能系统。
- **OpenClaw 更偏向系统分层、会话、Runtime、Workspace、Memory、Tools、Security 和 Evaluation。** 它的核心问题是"复杂 Agent 系统如何分层"——Gateway 控制面、Channel 多渠道接入、确定性路由、Workspace 文件化、安全防线 8 层。

学 Hermes 可以帮助理解 Agent 怎么进入具体工作流。学 OpenClaw 可以帮助理解复杂 Agent 系统怎么拆层。

---

## 对比维度总览

| 维度 | Hermes | OpenClaw | 学习价值 |
|---|---|---|---|
| 系统定位 | 自改进 AI Agent，Agent 工程框架 | Personal AI OS，复杂 Agent 平台 | 理解不同规模的 Agent 系统设计目标 |
| 核心关注点 | 任务组织、开发工作流、多代理协作 | 系统分层、会话管理、安全边界 | 理解 Agent 工程的不同切入角度 |
| 任务组织方式 | 子代理派遣、Kanban 编排、计划系统 | 确定性路由、Session 隔离、Queue 管理 | 理解任务调度的不同策略 |
| Runtime 理解 | AIAgent 作为 Runtime Kernel，驱动 Think-Act-Observe 循环 | Agent Runtime 使用 workspace 驱动 | 理解 Runtime 的不同组织方式 |
| Tool / Skill | Tool Registry 自注册 + Skill 任务说明书 + MCP 外部接入 | Tool + Skill + Plugin 三层能力体系 | 理解工具系统的不同分层方式 |
| Workspace | 项目上下文文件（AGENTS.md、SOUL.md） | 每个 Agent 独立 workspace，文件化可审查 | 理解 Agent 上下文的不同管理方式 |
| Memory / State | 三层记忆：messages + session DB + MEMORY.md | 三层分离：Session + Memory + Compaction | 理解记忆系统的不同分层策略 |
| 安全边界 | 命令审批、密钥脱敏、PII 脱敏、工具集控制 | 8 层安全防线：Gateway Auth → Channel ACL → Routing → Tool Policy → Approval → Sandbox → Plugin Trust → Audit | 理解安全设计的不同深度 |
| Evaluation | TDD、预提交审查、两阶段审查 | Trace、Transcript、Audit Trail | 理解质量保障的不同方式 |
| 适合学习的人 | 想理解 Agent 如何参与开发流程的人 | 想理解复杂 Agent 系统如何分层的人 | 不同学习目标选择不同项目 |

---

## 系统定位差异

从站内已有拆解内容看，两个项目的系统定位有明显差异：

**Hermes 可以从以下角度理解：**

- 子代理驱动开发：每个任务派发新子代理，避免上下文污染。
- Kanban 多代理协作：Orchestrator + Worker 模式，任务分解、依赖管理、故障恢复。
- 计划系统：先写实施计划文档，再按计划执行。
- TDD / 预提交审查：RED-GREEN-REFACTOR 流程 + 提交前质量门禁。
- MCP / Skills / Cron：标准化工具接入 + 可复用能力包 + 定时任务。
- 安全控制：命令审批、密钥脱敏、工具集控制。

**OpenClaw 可以从以下角度理解：**

- Gateway：统一接入入口，管理多渠道消息、WebSocket API、事件推送。
- Channel：不同接入来源的适配层，统一为内部 MessageEvent。
- Routing：确定性路由，不是 LLM 决定，而是基于规则匹配。
- Session：会话和上下文管理，Queue mode 控制消息并发。
- Runtime：任务执行核心，使用 workspace 驱动。
- Workspace：每个 Agent 独立工作空间，文件化可审查。
- Memory：MEMORY.md + 每日记录，Session / Memory / Compaction 三层分离。
- Tools / Skills / Plugins：三层能力体系。
- Security：8 层安全防线。

**核心差异：** Hermes 更像"Agent 如何进入具体工作流"，OpenClaw 更像"复杂 Agent 系统如何分层"。

---

## 任务组织方式差异

**Hermes 的任务组织方式：**

- 更容易从任务推进、开发流程、子代理协作角度理解。
- 适合观察 Agent 如何把复杂开发任务拆成可执行步骤。
- delegate_task 支持单任务、批量并行、leaf / orchestrator 角色分离。
- Kanban 编排支持 Orchestrator 分解任务 → Worker 并行执行 → 人工审查。
- 计划系统鼓励先写实施计划文档，再按计划执行。
- 适合学习 AI 编程工作流。

**OpenClaw 的任务组织方式：**

- 更容易从系统入口、会话管理、运行时、工具调用、工作区和安全治理角度理解。
- 路由由确定性规则决定：精确 peer 匹配 > thread 继承 > guild+roles > team > accountId > channel 通配 > default agent。
- Session Queue 控制消息并发：steer 模式新消息注入当前 run，followup/collect 模式等当前 turn 结束。
- 多 Agent 隔离边界三层：Workspace 隔离、Session 隔离、Tool / Credential 隔离。
- 适合学习 Agent 系统架构。

**核心差异：** Hermes 的任务组织更偏"工作流编排"，OpenClaw 的任务组织更偏"系统级路由和隔离"。

---

## Runtime 差异

从站内已有拆解内容看，两个项目对 Runtime 的理解角度不同：

| 问题 | Hermes 视角 | OpenClaw 视角 |
|---|---|---|
| 谁接管任务 | AIAgent 作为 Runtime Kernel，所有入口最终调用 run_conversation() | Agent Runtime 使用 workspace 驱动，Gateway 分发给对应 Agent |
| 谁推进步骤 | while tool-calling loop，iteration budget 硬控 | Agent Runtime 执行 model/tool loop，Session Queue 控制并发 |
| 谁调用工具 | Tool Registry 自注册，handle_function_call 分发执行 | Tool Policy 控制 allow/deny，Approval 决定是否需要人工确认 |
| 谁记录状态 | messages 持久化 + session DB + MEMORY.md | Session transcript jsonl + MEMORY.md + 每日记录 |
| 谁处理异常 | 错误分类 → 重试 → 压缩 → 换 provider → 修复格式 → 保存 partial state | 安全流程：Channel ACL → Gateway Auth → Routing → Tool Policy → Approval → Sandbox → Audit |
| 谁产生最终结果 | 无 tool_calls 时得到 final_response，保存会话并返回 | Agent Runtime 执行完成后回复回原 channel |

**核心差异：** Hermes 的 Runtime 更像"任务执行循环引擎"，OpenClaw 的 Runtime 更像"系统级任务执行节点"，嵌入在 Gateway → Routing → Session → Runtime 的完整链路中。

---

## Tool / Skill 差异

**Hermes 的工具体系：**

- 更容易从 Skill、MCP、Cron、开发辅助能力角度理解工具扩展。
- Tool Registry 自注册：tools/*.py 自注册到 registry，model_tools 生成 schema 给模型。
- 工具分两层：普通工具层（文件、终端、浏览器、Web、MCP）和 Agent 内核工具层（memory、todo、session_search、delegate_task、clarify）。
- Skill 不是工具本身，更像"任务说明书 + 工作流协议 + 可加载知识包"。
- MCP 作为原生客户端，支持连接 filesystem、GitHub、remote API 等外部工具。
- Plugin 有三个发现来源：~/.hermes/plugins/、.hermes/plugins/、pip entry points。

**OpenClaw 的工具体系：**

- 更容易从 Tools、权限、安全、系统边界角度理解工具接入。
- Tool：具体执行动作（读文件、执行命令、发消息）。
- Skill：任务方法论和流程说明（SKILL.md 进入模型上下文，能改变 Agent 行为）。
- Plugin：进程内代码，通过 central registry 注册 provider、channel、tool、skill 等能力。
- Plugin 有风险等级：Skill 是 prompt/文档层风险，Tool 是可执行动作风险，Plugin 是进程内代码风险。
- 每个 Agent 可以有不同的 tool policy，通过 allow/deny 列表控制。

**核心差异：** Hermes 的工具体系更偏"能力扩展和开发辅助"，OpenClaw 的工具体系更偏"权限控制和系统边界"。Tool / Skill 不只是函数调用，而是 Agent 能力边界。

---

## Workspace 与 Memory 差异

**Workspace 差异：**

- Workspace 解决"任务中间产物和文件上下文"。
- Hermes 更适合观察工作流中的上下文组织：项目上下文文件（AGENTS.md、SOUL.md）进入 system prompt，稳定信息 cached，临时信息动态注入。
- OpenClaw 更适合理解 Workspace 在系统层的职责边界：每个 Agent 有独立 workspace，包含 AGENTS.md、SOUL.md、TOOLS.md、USER.md、MEMORY.md、skills/，文件化可读、可改、可备份、可迁移、可审计。

**Memory 差异：**

- Memory 解决"长期信息、状态摘要、偏好和可复用经验"。
- Hermes 的三层记忆：短期（当前 messages）、中期（session database SQLite + FTS5，可搜索历史对话）、长期（MEMORY.md / USER.md）。
- OpenClaw 的三层分离：Session（原始会话历史）、Memory（提炼后的长期知识）、Compaction（压缩模型可见上下文）。
- 二者都强调 Session 和 Memory 的分离，但 Hermes 更侧重可搜索的 session database，OpenClaw 更侧重文件化的 Memory 体系。

---

## Security 与 Evaluation 差异

**Security 差异：**

- 复杂 Agent 系统必须考虑安全边界。
- Hermes 提醒我们 AI 编程工作流需要约束：命令审批模式（manual / smart / off）、密钥与 PII 脱敏、工具集控制、按平台启用/禁用工具。
- OpenClaw 提醒我们复杂 Agent 平台需要系统化安全设计：8 层安全防线（Gateway Auth → Channel ACL → Routing / Session Isolation → Tool Policy → Exec Approval → Sandbox → Plugin / Skill Trust → Logging / Audit）。
- 核心思想一致：Prompt 规则只是软约束，不能替代硬边界。真正的防护来自工具权限、审批、沙箱、审计。

**Evaluation 差异：**

- Hermes 更侧重开发流程中的质量保障：TDD（RED-GREEN-REFACTOR）、预提交审查（diff → 安全扫描 → 基线测试 → 自检清单 → 独立审查者 → 自动修复循环）、两阶段审查（规格审查 + 代码质量审查）。
- OpenClaw 更侧重系统级的可观测性：Session transcript、Logging、Audit Trail。
- 二者都强调执行过程需要记录，但 Hermes 更偏"开发质量门禁"，OpenClaw 更偏"系统审计和追踪"。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

- 可以借鉴 OpenClaw 的分层思路，把 RAG 查询链路拆成 API、Service、Trace、Evaluation。
- 可以借鉴 Hermes 的任务推进思路，设计清晰的开发迭代步骤。
- RAG 查询可以设计成可追踪的 run，每个阶段记录 step 和 tool_call。

**项目 B（多 Agent 运营中台 Copilot）：**

- 可以借鉴 OpenClaw 的 Runtime / Tool / Workspace / Memory / Security 分层。
- 可以借鉴 Hermes 的多代理协作和开发工作流表达。
- 多 Agent 需要确定性路由、隔离 workspace、隔离 session、隔离工具权限。

---

## 面试表达

我读源码不会只记模块名，而会比较系统定位和设计取舍。在学习和架构抽象层面，Hermes 更适合理解 Agent 如何进入开发工作流——子代理派遣、Kanban 编排、TDD、预提交审查、MCP 集成、Skills 技能系统。OpenClaw 更适合理解复杂 Agent 系统如何分层——Gateway 控制面、确定性路由、Workspace 文件化、Session / Memory / Compaction 三层分离、8 层安全防线。

对生产级 Agent 来说，我更关注 Runtime、Tool、Workspace、Memory、Security、Trace 和 Evaluation 如何组合。Runtime 不是模型，而是任务执行引擎；Tool 不是函数调用，而是能力边界；Workspace 不是聊天记录，而是 Agent 的可审查工作空间；Memory 不是所有历史，而是提炼后的长期知识。

这种横向对比能帮助我从"会用框架"转向"能设计系统"。面试中，我可以根据岗位需求选择不同的表达角度：如果面试官关注开发工作流，我用 Hermes 的思路表达；如果面试官关注系统架构，我用 OpenClaw 的思路表达。

---

## 常见误区

- 把两个项目简单比较成谁更好——它们解决的问题不同。
- 只记模块名，不理解设计目标——模块名不等于设计价值。
- 把 Tool / Skill 当普通函数调用——Tool 是能力边界，Skill 是方法论。
- 不关注 Workspace 和 Memory 边界——所有上下文混在一起会导致系统不可控。
- 不关注安全和评测——Agent 能调用工具后，安全风险成倍增加。
- 不考虑项目适用场景——不同规模的项目需要不同的架构策略。
- 把源码阅读写成流水账——源码阅读的目标是抽象设计思想，不是记录代码细节。

---

## 更好的学习方式

| 不推荐方式 | 更好的方式 |
|---|---|
| 逐行记录源码 | 提炼设计思想和可迁移模式 |
| 只看一个项目 | 横向对比不同项目的设计取舍 |
| 只记模块名 | 理解每个模块解决什么工程问题 |
| 把所有项目混在一起 | 按维度对比：Runtime、Tool、Memory、Security |
| 不关注适用场景 | 理解不同项目的定位和适用范围 |
| 不考虑迁移价值 | 提炼可迁移到个人项目的设计模式 |
| 不做面试表达准备 | 把架构理解整理成可表达的面试话术 |
| 只看代码不看文档 | 结合代码和文档理解设计意图 |

---

## 后续 TODO

- 补充 Hermes / OpenClaw 架构图对比。
- 补充 Runtime / Tool / Memory 的细粒度对比。
- 补充面试口述稿。
- 补充对项目 B 架构设计的迁移清单。
