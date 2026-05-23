# Hermes Agent 高级用法与进阶玩法

## 这篇文章解决什么问题

基础 Hermes 拆解主要回答"它是什么、整体架构怎么运行"。这篇文章回答一个更实际的问题：如何用 Hermes 组织复杂开发任务、自动化任务、多代理协作和工程质量保障。

Hermes 的价值不只是聊天，而是把计划、执行、审查、调度、工具、技能、安全和跨平台入口组合成一套 Agent Harness。理解这些高级用法，才能真正理解 Hermes 从"AI 助手"到"Agent 工程框架"的跃迁。

## 高级能力总览

| 能力方向 | 代表功能 | 解决的问题 |
|---|---|---|
| 子代理驱动开发 | delegate_task、两阶段审查 | 隔离上下文、保证任务质量 |
| 多代理协作 | Kanban 编排、Orchestrator + Worker | 复杂任务的并行执行和依赖管理 |
| 计划系统 | 实施计划文档、任务拆分 | 先计划后执行，避免盲目操作 |
| 质量保障 | TDD、预提交审查、系统化调试 | 代码质量、回归防护、根因分析 |
| 实验验证 | Spike 一次性原型 | 技术选型前快速验证可行性 |
| 事件驱动 | Webhook 订阅、Cron 定时任务 | 从被动聊天升级为主动自动化 |
| 工具集成 | MCP 服务器、自定义工具 | 标准化接入外部工具和数据源 |
| 配置管理 | Profiles、Credential Pools、Sessions | 多环境隔离、凭证轮换、会话管理 |
| 技能系统 | Skills 安装与管理 | 可复用能力包，沉淀经验 |
| 安全控制 | 命令审批、密钥脱敏、PII 脱敏 | 系统层安全防护 |
| 交互扩展 | Voice、TUI、Worktree、跨平台网关 | 多入口、多模态、并行编辑 |

## 子代理驱动开发：把任务拆给 fresh context

每个任务派发一个新的子代理，避免上下文污染。任务执行后经过两阶段审查：

1. **规格审查**：检查是否符合原始需求
2. **代码质量审查**：检查实现质量

两个审查都通过后才继续下一个任务。最后进行集成审查。

```python
delegate_task(
    goal="实现用户认证模块",
    context="完整的任务描述、文件路径、技术栈信息...",
    toolsets=["terminal", "file"]
)
```

**工程化理解**：这类模式适合多步骤功能实现。关键不是"多开几个 Agent"，而是让每个子代理有清晰任务边界、输入上下文和审查标准。没有审查标准的子代理派遣只是"多开几个聊天窗口"。

## Kanban 多代理协作：Orchestrator + Worker

### Orchestrator 编排器模式

- 分解任务
- 分配给不同专业代理
- 管理依赖关系和执行顺序
- 处理故障恢复

### Worker 工人模式

- 接收任务
- 在隔离工作空间中执行
- 通过心跳报告进度
- 完成或阻塞任务

### 关键设计

- **工作空间隔离**：每个 Worker 有独立的工作目录，避免文件冲突
- **租户隔离**：不同代理的配置、会话、记忆相互隔离
- **依赖管理**：任务之间的依赖关系由 Orchestrator 管理
- **人工审查流程**：关键节点需要人工确认
- **自动重试和故障恢复**：失败任务自动重试，超过次数后上报

**核心观点**：Kanban 多代理协作的核心是"任务编排系统"，不是多个 Agent 自由聊天。

## 实施计划系统：先计划后执行

Hermes 鼓励在动手之前先写实施计划文档：

```markdown
# 功能名称实施计划

目标：一句话描述
架构：2-3 句话描述方法
技术栈：关键技术 / 库

## 任务 1：描述性名称

目标：这个任务完成什么

文件：
- 创建：exact/path/to/file.py
- 修改：exact/path/to/existing.py:45-67
- 测试：tests/path/to/test.py

步骤：
1. 写失败的测试
2. 运行测试验证失败
3. 写最小实现
4. 运行测试验证通过
5. 提交
```

**关键原则**：

- 每个任务控制在 2-5 分钟专注工作
- 文件路径要精确
- 命令和预期输出要明确
- 每个任务必须有验证步骤

## TDD：RED-GREEN-REFACTOR

Hermes 的开发流程以 TDD 为核心：

1. **RED**：写失败的测试
2. **验证 RED**：确认失败原因符合预期
3. **GREEN**：写最小实现让测试通过
4. **验证 GREEN**：运行测试确认通过
5. **REFACTOR**：保持测试绿色前提下清理代码

核心原则："没有失败的测试就不能写生产代码。"

**为什么这对 Agent 自动开发重要**：

- 防止 Agent 直接生成大段不可验证的代码
- 让任务结果有明确验收标准
- 降低回归风险

## 系统化调试：四阶段根因分析

Hermes 的调试流程分四个阶段：

1. **根因调查**：收集证据，定位问题源头
2. **模式分析**：分析错误模式，寻找共性
3. **假设和测试**：提出假设，设计验证实验
4. **实现修复**：基于验证结果实施修复

核心原则："没有根因调查就不能尝试修复。"

这能避免 Agent 在没有证据的情况下反复试错、越修越乱。

## 预提交代码审查：提交前质量门禁

提交前的审查流程：

1. 获取 diff
2. 静态安全扫描
3. 基线测试和代码检查
4. 自检清单
5. 独立审查者子代理
6. 评估结果
7. 自动修复循环，最多 2 次
8. 提交

**安全扫描重点**：

- 硬编码密钥
- Shell 注入
- 危险 eval / exec
- 不安全反序列化
- SQL 注入

这是把 Agent 开发从"能改代码"提升到"可控提交"的关键环节。

## Spike 实验：用一次性原型降低风险

Spike 是一种快速验证技术方案的实验方法：

**核心方法**：分解 → 研究 → 构建 → 判定

**判定结果**：

- **VALIDATED**：方案可行，可以进入正式计划
- **PARTIAL**：部分可行，需要调整方案
- **INVALIDATED**：方案不可行，需要换方向

**适用场景**：

- 技术选型前验证
- 比较 A vs B 方案
- 在正式 commit 前快速验证可行性

## 事件驱动 Agent：Webhook + Cron

### Webhook 订阅

支持场景：GitHub issue / PR、Stripe 支付事件、CI/CD 构建通知、IoT 传感器事件、监控告警。

```bash
hermes webhook subscribe github-issues \
  --events "issues" \
  --prompt "New GitHub issue #{issue.number}: {issue.title}" \
  --deliver telegram \
  --deliver-chat-id "<CHAT_ID>"
```

特性：HMAC-SHA256 签名验证、模板支持 dot notation、直接投递模式、持久化订阅配置。

### Cron 定时任务

调度方式：间隔、自然语言、Cron 表达式、ISO 时间戳。

任务类型：Agent 驱动、脚本驱动。

高级能力：任务链、工作目录、多平台投递、上下文来自其他任务。

## MCP 集成：把外部工具接入 Hermes

Hermes 作为原生 MCP 客户端，支持连接 filesystem、GitHub、remote API 等外部工具。

核心特性：

- 工具自动发现和注册
- 命名约定：`mcp_{server}_{tool}`
- 环境变量过滤
- 错误消息中的凭证脱敏
- 自动重连和指数退避
- Sampling 支持

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path"

  github:
    command: "npx"
    args:
      - "-y"
      - "@modelcontextprotocol/server-github"
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PERSONAL_ACCESS_TOKEN}"

  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ${REMOTE_API_TOKEN}"
```

## Profiles、Credential Pools 与 Sessions

### Profiles

运行多个独立 Hermes 实例。每个配置文件有独立配置、会话、技能和记忆。适合不同项目、不同模型提供商、隔离实验环境。

### Credential Pools

自动轮换多个 API Key，避免速率限制。凭证耗尽时自动切换，多提供商支持，安全存储在 auth.json。

### Sessions

会话管理支持列表、浏览、导出、重命名、删除、清理、统计。会话内支持 new、clear、retry、undo、title、compress、branch、resume、goal 等命令。会话管理对长期任务和上下文控制至关重要——它让 Agent 能在中断后恢复，而不是每次都从零开始。

## Skills 技能系统：可复用能力包

技能可以安装、搜索、检查更新、发布、卸载。支持通过 GitHub 仓库作为技能源。

技能覆盖方向：软件开发、MCP、数据科学、DevOps、GitHub、研究、生产力。

Skills 的价值是把可复用经验沉淀成能力包，而不是每次重新写 Prompt。一个团队积累的 Skills 就是这个团队的 Agent 工程经验库。

## 安全与隐私控制

### 命令审批模式

- **manual**：始终提示用户确认
- **smart**：由模型判断风险等级
- **off**：跳过审批，风险高

### 密钥与 PII 脱敏

```bash
hermes config set security.redact_secrets true
hermes config set privacy.redact_pii true
```

### 工具集控制

按平台启用 / 禁用工具，细粒度权限管理，高风险操作必须有人确认。

**核心原则**：不要把安全控制只交给 Prompt，必须用系统层权限和审计兜底。Prompt 层面的限制可以被注入攻击绕过，系统层的权限检查是强制性的。

## Voice、TUI、Worktree 与跨平台网关

### Voice

支持 STT / TTS，多提供商，语音命令交互。

### TUI

Hermes TUI 的技术架构：

```text
hermes --tui
  └─ Node (Ink) -- stdio JSON-RPC -- Python (tui_gateway)
       └─ AIAgent + tools + sessions
```

TUI 提供：聊天流式传输、工具活动显示、审批提示、会话选择器、斜杠命令、自动完成、主题定制。

### Worktree Mode

隔离 git worktree，防止 git 冲突，支持多代理并行编辑，自动清理。

### 跨平台消息网关

支持 Telegram、Discord、Slack、WhatsApp、Email、SMS、飞书、企业微信、API Server、Webhooks 等平台。

同一个 Agent 能通过多个入口工作，但工具权限和审计仍然要统一控制。

## Delegation：委托任务与多层编排

`delegate_task` 可生成同步子代理，支持单任务、批量并行、leaf / orchestrator 角色分离。orchestrator 可嵌套，但受 `max_spawn_depth` 限制。

```python
delegate_task(
    goal="研究 GRPO 论文并写摘要",
    context="背景信息...",
    toolsets=["web", "file"]
)
```

批量示例：

```python
delegate_task(tasks=[
    {"goal": "任务 1", "toolsets": ["web"]},
    {"goal": "任务 2", "toolsets": ["file"]},
    {"goal": "任务 3", "toolsets": ["terminal"]}
])
```

## 进阶工作流组合

**组合一：计划 → 子代理驱动开发 → TDD → 预提交审查**

适合多步骤功能实现。先计划拆分任务，每个任务派子代理执行，TDD 保证质量，预提交审查做最后门禁。

**组合二：Kanban 编排 → 多代理并行 → 人工审查**

适合需要并行处理的复杂任务。Orchestrator 分解任务并分配，Worker 并行执行，关键节点人工审查。

**组合三：Spike 实验 → 验证想法 → 正式计划 → 实施**

适合技术选型或方案不确定时。先用 Spike 快速验证可行性，验证通过后再进入正式计划和实施。

**组合四：Webhook 订阅 → Cron 定时任务 → 跨平台投递**

适合事件驱动的自动化场景。Webhook 接收外部事件，Cron 定时执行任务，结果投递到多个平台。

**组合五：Profiles → Credential Pools → Skills**

适合多项目、多环境的 Agent 管理。不同项目用不同 Profile，凭证池自动轮换，Skills 沉淀可复用能力。

**组合六：MCP 集成 → 自定义工具 → 插件系统**

适合需要接入多种外部工具的场景。MCP 提供标准化接入，自定义工具处理特殊需求，插件系统实现扩展。

## 对个人项目的启发

- 复杂任务需要先计划再执行，不要让 Agent 盲目操作
- 子代理不是为了炫技，而是为了隔离上下文和职责
- 多代理协作要有任务看板、依赖管理和审查流程，不是多个 Agent 自由聊天
- 生产级 Agent 必须有权限、Trace、审查、测试和回滚
- Skills / MCP / Profiles 让 Agent 从一次性工具变成可扩展系统
- Webhook / Cron / 跨平台网关让 Agent 从聊天入口升级为事件驱动自动化系统

## 面试表达

可以这样表达：

> Hermes 不只是 AI 助手，而是一个 Agent 工程框架。它把子代理派遣、Kanban 多代理编排、TDD 工作流、预提交审查、MCP 工具集成、Webhook 事件驱动、Cron 定时任务、Skills 技能系统、安全控制和跨平台消息网关整合成一套完整的 Agent Harness。我从 Hermes 的高级用法中学到的核心理念是：Agent 的价值不在于"能聊天"，而在于能可控、可追踪、可扩展地执行复杂任务。

> 在多代理协作方面，Hermes 用 Orchestrator + Worker 模式，Orchestrator 负责任务分解和调度，Worker 在隔离工作空间中执行，通过心跳报告进度。关键不是"多开几个 Agent"，而是有明确的任务边界、依赖管理、审查流程和故障恢复机制。子代理派遣配合两阶段审查（规格审查 + 代码质量审查），保证每个任务的交付质量。

> 这些能力可以迁移到自己的 Agent 项目中：用计划系统做任务拆分，用 TDD 做质量保障，用预提交审查做提交门禁，用 Trace 做执行追踪，用 MCP 做工具标准化接入，用 Webhook 和 Cron 做事件驱动自动化。目标是把 Agent 从 demo 做成可运行、可追踪、可评估的生产级系统。

## 后续 TODO

- 补充真实源码路径和关键函数
- 补充架构图
- 补充 Hermes 高级工作流流程图
- 补充与 OpenClaw、Harness Engineering 的对比
- 后续整理成小红书 Day 3 内容

## 相关链接

- [Hermes Agent 源码拆解](/note/Source-Reading/hermes-agent) — 基础架构拆解
- [Harness Engineering 源码拆解](/note/Source-Reading/harness-engineering) — 工程框架拆解
- [OpenClaw 架构拆解](/note/Source-Reading/openclaw) — 多 Agent 架构拆解
