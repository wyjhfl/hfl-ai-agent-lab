# OpenClaw 架构拆解

## 1. 项目定位

OpenClaw 的核心不是"接一个大模型聊天"，而是：

> 用 Gateway 统一接入多渠道消息，用 Agent Runtime 执行任务，用 Workspace/Memory 承载长期状态，用 Tools/Skills/Plugins 扩展能力，再用 Session/Queue/Sandbox/Security 控制可靠性和风险。

它的架构可以压缩成：

```
OpenClaw =
  Gateway 控制面
  + Channel 多渠道接入
  + Routing 路由决策
  + Session 会话状态
  + Agent Runtime 推理执行
  + Workspace 长期上下文
  + Memory 长期记忆
  + Tools 工具执行
  + Skills 行为说明
  + Plugins 能力扩展
  + Sandbox / Approval / Security 安全约束
```

OpenClaw 的形态更接近"Personal AI OS"，而不是聊天工具。它使用一个长期运行的 Gateway 管理 WhatsApp、Telegram、Slack、Discord、Signal、iMessage、WebChat 等消息表面，CLI、Web UI、macOS app 等控制端通过 WebSocket 连接 Gateway。

## 2. 整体架构

### Gateway

Gateway 是 OpenClaw 的中心，而不是模型是中心。Gateway 负责多渠道消息接入、WebSocket API、事件推送、健康检查、设备连接、节点连接、Session 管理入口、Agent 调度入口、Channel 生命周期管理。Gateway 暴露 typed WebSocket API，校验 inbound frames，并发出 `agent`、`chat`、`presence`、`health`、`heartbeat`、`cron` 等事件。

### Channel

不同接入来源的适配层。OpenClaw 支持 WhatsApp、Telegram、Slack、Discord、Signal、iMessage、WebChat、Email、SMS、DingTalk、Feishu、WeCom、Weixin、Webhook、API Server 等渠道。Channel Plugin 负责解析不同平台的消息格式，统一为内部 MessageEvent。

### Routing

OpenClaw 的路由是确定性的，不是模型自己决定"我该交给谁"。路由规则基于 channel、account、peer、guild、team、role 等信息做确定性匹配。优先级为：精确 peer 匹配 > thread 继承 > Discord guild+roles > Discord guild > Slack team > accountId > channel 通配 > default agent。

### Session

Session 负责会话和上下文管理。Session transcript 存在 `~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`。Queue mode 为 `steer` 时，新的 inbound message 会注入当前 run；`followup` 或 `collect` 时，会等当前 turn 结束后再开始新 turn。

### Agent Runtime

Agent Runtime 是任务执行核心。它使用一个 agent workspace 作为工具和上下文的唯一工作目录，并注入 AGENTS.md、SOUL.md、TOOLS.md、BOOTSTRAP.md、IDENTITY.md、USER.md 等文件。这些文件决定 agent 的操作指令、人格边界、工具说明、身份和用户画像。

### Workspace

每个 Agent 有自己的 workspace，包含 AGENTS.md（操作指令）、SOUL.md（人格边界）、TOOLS.md（工具说明）、USER.md（用户画像）、MEMORY.md（长期记忆）、memory/YYYY-MM-DD.md（每日记录）、skills/（技能目录）。

### Memory

OpenClaw 通过普通 Markdown 文件保存记忆。MEMORY.md 用于长期事实、偏好和决策，memory/YYYY-MM-DD.md 用于每日记录。模型只"记住"保存到磁盘的内容，没有隐藏状态。Session、Memory、Compaction 三层分离：Session 保存原始会话，Memory 保存长期价值，Compaction 压缩模型可见上下文。

### Tools

Agent 生成文本之外的动作都通过 tools 完成，例如读文件、运行命令、浏览网页、发送消息和操作设备。每个 Agent 可以有不同的 tool policy，通过 allow/deny 列表控制。

### Skills

Skills 是指导模型如何完成任务的说明。Skill 文件夹中的 SKILL.md 会进入模型上下文，能改变 Agent 行为。OpenClaw 可以 mid-session 刷新 skills。

### Plugins

Plugin 是进程内代码，与 Gateway 在同一个进程里运行，不是 sandboxed。插件通过 central registry 注册 provider、channel、tool、skill、speech、web search、media 等能力。插件系统分为 manifest discovery、enablement validation、runtime loading、surface consumption 四层。

### Compaction

上下文压缩机制，在长对话中保留目标、关键证据、已完成步骤和下一步计划，防止上下文溢出导致任务中断。

### Security

安全不是靠一句"不要做坏事"的 Prompt，而是靠访问控制、工具策略、沙箱、审批、隔离、审计共同组成防线。安全思路是 identity first、scope next、model last——先决定谁能触发 bot，再决定 bot 能在哪里行动，最后才考虑模型，因为要假设模型可能被操纵。

### Multi-Agent

多 Agent 不是"多个模型一起聊天"，而是"多个隔离的大脑，根据路由规则接收不同来源的消息，并拥有各自的 workspace、session、工具策略和身份边界"。AgentId = 哪个 Agent / 哪个大脑，SessionKey = 这个 Agent 下的哪段会话上下文。

## 3. 核心运行链路

### 单 Agent 消息处理流程

```
外部消息
  ↓
Channel Plugin 解析平台消息
  ↓
Gateway inbound pipeline
  ↓
Routing Resolver 确定 agentId
  ↓
加载 Agent 定义（workspace、sessionStore、model config、tool policy）
  ↓
生成 sessionKey（agent:<agentId>:<channel>:<scope>:<id>）
  ↓
进入 Agent 的 session queue
  ↓
加载 workspace 文件（AGENTS.md、SOUL.md、USER.md、MEMORY.md、skills）
  ↓
使用 Agent 的 tool policy / model / sandbox
  ↓
Agent Runtime 执行（model/tool loop）
  ↓
回复回原 channel
```

### 多 Agent 路由流程

```
外部消息
  ↓
Channel Plugin
  ↓
Gateway
  ↓
Routing Resolver
  ├─ peer binding?
  ├─ thread parent binding?
  ├─ guild + role?
  ├─ team?
  ├─ accountId?
  ├─ channel wildcard?
  └─ default agent?
  ↓
Resolved Agent
  ├─ agentId
  ├─ workspace
  ├─ sessionStore
  ├─ model config
  ├─ tool policy
  ├─ sandbox policy
  └─ identity
  ↓
SessionKey → Agent Runtime → Reply
```

### 安全流程

```
外部消息
  ↓
Channel Access Control（pairing、allowlist、requireMention）
  ↓
Gateway（local bind、auth token）
  ↓
Routing（agentId、sessionKey、per-agent policy）
  ↓
Agent Runtime（prompt guardrails、memory/skills/tools context）
  ↓
Tool Call → Tool Policy（allow/deny、fs.workspaceOnly、exec.security）
  ↓
Approval（ask always / allowlist / exact context）
  ↓
Sandbox（Docker / SSH / OpenShell、workspaceAccess none/ro/rw）
  ↓
Execution → Logs / Transcript / Audit
```

## 4. 关键模块拆解

### Gateway

**职责：** 统一接入入口，管理多渠道消息、WebSocket API、事件推送、设备连接、Session 管理、Agent 调度。

**输入：** 多渠道消息（WhatsApp、Telegram、Slack、Discord 等）。

**输出：** 统一的 MessageEvent，分发给对应 Agent。

**关键设计：** Gateway 是控制面和 policy surface。Gateway 配置支持热更新，大多数字段可以无停机热应用（agent、agents、models、routing、bindings、session、messages、tools、skills 等），而 gateway.*、plugins 等底层基础设施变更需要重启。

**可迁移点：** 多 Agent 项目不要一开始就让前端直接调用某个 Agent，应该有一个类似 Gateway 的中枢层，统一接收任务、鉴权、日志、路由、状态管理、推送执行过程。

### Channel

**职责：** 不同接入来源的适配层，把不同平台的消息格式统一为内部 MessageEvent。

**输入：** 各平台原始消息。

**输出：** 统一的 MessageEvent。

**关键设计：** Channel Access Control 控制谁能 DM bot、哪些群能触发 bot、群里是否必须 @ bot、是否使用 allowlist。原则是默认 pairing、群聊 requireMention、关键群聊 allowlist、多人环境 DM 隔离。

**可迁移点：** 不同来源的任务请求应该有统一的接入层，而不是每种来源写一套独立逻辑。

### Routing

**职责：** 确定性路由，根据 channel、account、peer、guild、team、role 等信息选择 Agent。

**输入：** MessageEvent 中的路由信息。

**输出：** agentId。

**关键设计：** 路由是确定性的，不是 LLM 决定。优先级为精确 peer 匹配 > thread 继承 > Discord guild+roles > Slack team > accountId > channel 通配 > default agent。"越具体越优先"。

**可迁移点：** 多 Agent 路由不要一开始就完全交给 LLM。先做规则化、可测试的路由，LLM 可以参与意图识别，但最终路由必须落到结构化状态里。

### Session

**职责：** 会话和上下文管理，控制并发和消息顺序。

**输入：** 消息和 agentId。

**输出：** 会话上下文。

**关键设计：** SessionKey 是 routing/context selection，不是 per-user auth boundary。Queue mode 控制消息并发：steer 模式新消息注入当前 run，followup/collect 模式等当前 turn 结束。

**可迁移点：** 项目必须有 task_id、session_id、agent_run_id、trace_id，同一个业务任务的执行链路要串行可追踪。

### Agent Runtime

**职责：** 任务执行核心，使用 workspace 驱动。

**输入：** 会话消息、workspace 文件。

**输出：** Agent 响应。

**关键设计：** Agent Runtime 使用 workspace 作为工具和上下文的唯一工作目录，注入 AGENTS.md、SOUL.md、TOOLS.md、BOOTSTRAP.md、IDENTITY.md、USER.md 等文件。代码负责运行机制，Workspace 负责 Agent 个性和长期状态。

**可迁移点：** 给每个 Agent 设计自己的 workspace，每个 Agent 不只是"名字不同"，而是有独立的角色、记忆、工具边界和任务风格。

### Workspace

**职责：** 每个 Agent 的独立工作空间，承载人格、规则、记忆、技能。

**输入：** Agent 配置。

**输出：** Agent 运行时上下文。

**关键设计：** Workspace 文件化，包含 AGENTS.md（操作指令）、SOUL.md（人格边界）、TOOLS.md（工具说明）、USER.md（用户画像）、MEMORY.md（长期记忆）、skills/（技能目录）。可读、可改、可备份、可迁移、可审计、可版本管理。

**可迁移点：** 不要把所有 prompt 写死在代码里，把 Agent 角色、工具约束、长期记忆做成可配置的 workspace。

### Memory

**职责：** 长期记忆管理，与 Session 分离。

**输入：** 对话过程中的事实、偏好、经验。

**输出：** 结构化的记忆文件。

**关键设计：** MEMORY.md 用于长期事实、偏好和决策，memory/YYYY-MM-DD.md 用于每日记录。模型只"记住"保存到磁盘的内容，没有隐藏状态。Session（原始对话历史）、Memory（提炼后的长期知识）、Compaction（压缩模型可见上下文）三层分离。

**可迁移点：** 区分 session history、long-term memory、daily operational notes 和 RAG knowledge base。不要把所有聊天记录都丢进向量库当成记忆。

### Tools / Skills / Plugins

**职责：** 三层能力体系。Tool = 能做什么，Skill = 怎么做，Plugin = 怎么接入能力。

**输入：** Agent 能力需求。

**输出：** 执行结果。

**关键设计：**

- Tool：具体执行动作（读文件、执行命令、发消息）
- Skill：任务方法论和流程说明（SKILL.md 进入模型上下文，能改变 Agent 行为）
- Plugin：进程内代码，通过 central registry 注册 provider、channel、tool、skill 等能力

Plugin 有风险等级：Skill 是 prompt/文档层风险，Tool 是可执行动作风险，Plugin 是进程内代码风险（可能直接影响 Gateway runtime）。

**可迁移点：** Agent 不直接 import 数据库，Agent 调用 Tool，Tool 由 Plugin 注册，Skill 告诉 Agent 如何正确使用 Tool。

### Security

**职责：** 8 层安全防线。

**输入：** 安全策略配置。

**输出：** 安全执行环境。

**关键设计：**

安全防线 8 层：

1. Gateway Auth：谁能连接 Gateway 控制面
2. Channel Access Control：谁能通过消息渠道触发 Agent
3. Routing / Session Isolation：消息进入哪个 Agent，上下文是否隔离
4. Tool Policy：Agent 能调用哪些工具
5. Exec Approval：执行命令前是否需要人类批准
6. Sandbox：工具执行在宿主机还是隔离环境
7. Plugin / Skill Trust：插件和技能是否可信
8. Logging / Audit / Incident Response：出事后能否追踪

核心思想：Prompt 规则只是软约束，不能替代硬边界。真正的防护来自工具权限、审批、沙箱、审计。

**可迁移点：** 每个 Agent 独立 workspace、独立 tool policy，高危动作必须审批，所有外部输入都视为不可信，不让模型直接碰生产权限，日志必须可追踪。

### Multi-Agent

**职责：** 多 Agent 隔离和协作。

**输入：** 多个 Agent 配置和路由规则。

**输出：** 隔离的多 Agent 运行环境。

**关键设计：**

多 Agent 隔离边界三层：

1. Workspace 隔离：每个 Agent 有自己的 AGENTS.md、SOUL.md、USER.md、MEMORY.md、skills
2. Session 隔离：每个 Agent 有自己的 sessions.json 和 transcript jsonl
3. Tool / Credential 隔离：每个 Agent 可以有不同工具权限、auth store、sandbox

Delegate 是多 Agent 的组织化扩展：它拥有自己的身份、凭据、workspace、sessions 和明确授权，不能冒充人类，只能在 standing orders、tool policy、sandbox 和 audit trail 约束下代表 principal 工作。

Broadcast Groups 支持同一个 peer 在满足触发条件后让多个 Agent 同时运行。

**可迁移点：** 多 Agent 系统不要先追求"智能调度"，先做好确定性路由、隔离 workspace、隔离 session、隔离工具权限。

## 5. 架构设计亮点

### Gateway 是中心，不是模型是中心

很多 Agent 项目一上来就把重点放在 LLM、Prompt、Tool Calling，但 OpenClaw 的核心入口是 Gateway。这让系统更像"系统"，而不是几个 Agent 脚本拼起来。

### 确定性路由优先，LLM 决策后置

路由由系统规则决定，模型不负责选择 channel，也不负责决定消息应该发给谁。第一版必须可控、可解释、可测试。

### Workspace 文件化，让 Agent 可审查、可迁移、可训练

用文件承载 Agent 行为和长期上下文，可读、可改、可备份、可迁移、可审计、可版本管理。

### Session、Memory、Compaction 三层分离

不把"聊天记录""长期记忆""上下文压缩"混在一起。Session 保存原始会话，Memory 保存长期价值，Compaction 压缩模型可见上下文。

### Plugin 不是工具集合，而是能力所有权边界

插件是能力拥有者，系统消费的是能力契约。不是随便 import 一个文件，而是通过 central registry 注册能力。

### 安全是产品架构的一部分

安全不是事后补丁，而是贯穿 Gateway、Channel、Tool、Plugin、Sandbox、Approval。Prompt guardrails 只是软指导，硬约束来自 tool policy、exec approvals、sandboxing、channel allowlists。

## 6. 可迁移到个人项目的设计

- **Gateway 思想**：做一个 Agent Control Plane，统一接收任务、鉴权、日志、路由、状态管理、推送执行过程
- **确定性路由**：多 Agent 不靠随机协作，靠确定性编排。LLM 可以参与意图识别，但最终路由必须落到结构化状态里
- **Workspace 文件化**：给每个 Agent 独立角色配置，每个 Agent 有自己的 AGENTS.md、TOOLS.md、MEMORY.md
- **Memory 分层**：区分 RAG 知识库、Session History、Business Memory、Run Summary
- **Tools / Skills / Plugins 分层**：Agent 不直接 import 数据库，Agent 调用 Tool，Tool 由 Plugin 注册，Skill 告诉 Agent 如何正确使用 Tool
- **安全分级**：查询指标（自动执行）→ 生成分析报告（自动执行）→ 生成活动方案（自动生成草案）→ 创建运营任务（需要确认）→ 发送用户通知（必须审批）→ 修改预算（必须审批）→ 删除数据（禁止）
- **Session / Queue 思想**：任务状态必须可恢复，每一步都写入数据库，形成可审计的执行链路
- **Delegate 思想**：高风险 Agent 必须有身份边界，不同 Agent 有不同权限集

## 7. 面试表达

### 表达一：系统分层

> 我在拆解 OpenClaw 时，重点关注它如何把复杂 Agent 系统拆成多个层次。OpenClaw 的核心不是模型，而是 Gateway + Runtime + Workspace + Tools 的系统化组合。Gateway 是中心，统一接入多渠道消息；Agent Runtime 使用 workspace 驱动，每个 Agent 有独立的人格、规则、记忆和工具边界；Routing 是确定性的，不是让 LLM 随便决定；Session、Memory、Compaction 三层分离，避免把聊天记录、长期记忆和上下文压缩混在一起。这种分层设计让系统更像"操作系统"，而不是几个 Agent 脚本拼起来。

### 表达二：多 Agent 与安全

> OpenClaw 给我最大的启发是多 Agent 的隔离设计和安全边界。多 Agent 不是多个聊天角色，而是多个隔离的 workspace、session、memory、tool policy。每个 Agent 有自己的身份、凭据、工具权限，路由由确定性规则决定。安全方面，OpenClaw 的思路是 identity first、scope next、model last——先决定谁能触发 bot，再决定 bot 能在哪里行动，最后才考虑模型，因为要假设模型可能被操纵。Prompt 规则只是软约束，真正的防护来自工具权限、审批、沙箱和审计。这套设计思路可以直接迁移到自己的多 Agent 项目中。

## 8. 后续 TODO

- 待补充 OpenClaw 的真实源码文件路径和关键函数
- 待补充 Gateway 的 WebSocket API 实现细节
- 待补充 Routing Resolver 的匹配逻辑源码
- 待补充 Agent Runtime 的 workspace 加载流程
- 待补充 Sandbox 的 Docker/SSH/OpenShell 实现
- 待补充 Plugin 的 manifest discovery 和 runtime loading 流程
- 待补充 Compaction 的具体压缩策略
- 待补充 Delegate 的身份和凭据管理实现

## 专题阅读

- [OpenClaw 架构拆解：复杂 Agent 系统怎么分层](/topics/openclaw-architecture)
