[ChatGPT](https://chatgpt.com/)





- 
- 
  - 
- 
- 
- 
  - 
- 



- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 

我会先按“导师拆源码”的方式搭一套模块化路线：先讲整体架构与运行链路，再逐层拆核心目录、核心类、Agent loop、工具调用、上下文/记忆、任务调度与扩展点。接着我会先做第 1 模块讲解，后续你可以让我继续进入下一模块。

Thought for 50s

可以。我们就按你之前 **OpenClaw 拆解式** 的节奏来：**先总架构 → 再源码地图 → 再核心链路 → 再逐模块拆源码 → 最后总结可迁移到你项目 B 的设计点**。

我没有在你的文件库里搜到你本地的 Hermes 源码副本，所以这一轮先基于 **NousResearch/hermes-agent 官方公开仓库与开发文档** 来拆。Hermes Agent 当前是一个自托管、可长期运行的 Agent，它强调 memory、skills、session search、跨平台 gateway、cron 自动化与工具调用闭环；官方 README 也把它定位成“self-improving AI agent”，支持 CLI、Telegram/Discord/Slack/WhatsApp/Signal 等入口，并有内置学习循环、记忆、技能、定时任务和 subagent delegation。

------

# Hermes Agent 拆解教学总计划

## 第 0 讲：先建立整体认知

目标：先回答一个问题：**Hermes 到底不是普通聊天机器人，它到底多了什么？**

要讲清楚：

1. Hermes 的产品定位
2. Hermes 的运行形态：CLI、Gateway、API Server、Python Library、Cron
3. Hermes 的核心闭环：用户输入 → Agent Loop → 工具调用 → 记忆/会话保存 → 下次继续变强
4. 它和 OpenClaw / 普通 Agent Demo 的区别

核心文件：

```
README.md
website/docs/developer-guide/architecture.md
run_agent.py
cli.py
gateway/run.py
```

------

## 第 1 讲：整体架构拆解，也就是今天先讲这一讲

目标：画清楚 Hermes 的“主干”。

官方架构文档给出的主链路是：

```
Entry Points
  ├── CLI
  ├── Gateway
  ├── ACP
  ├── Batch Runner
  ├── API Server
  └── Python Library

        ↓

AIAgent / run_agent.py
  ├── Prompt Builder
  ├── Provider Resolution
  ├── Tool Dispatch
  ├── Compression & Caching
  └── Tool Registry

        ↓

Session Storage + Tool Backends
  ├── SQLite + FTS5
  ├── Terminal
  ├── Browser
  ├── Web
  ├── MCP
  ├── File
  └── Vision
```

官方文档明确把 `run_agent.py` 里的 `AIAgent` 放在中枢位置，入口层包括 CLI、Gateway、ACP、Batch Runner、API Server、Python Library；AIAgent 内部再连接 prompt builder、provider resolution、tool dispatch、tool registry、compression/caching，最后落到 SQLite session storage 和各种工具后端。

------

## 第 2 讲：AIAgent 核心循环拆解

目标：拆 `run_agent.py`。

重点讲：

```
AIAgent.__init__()
AIAgent.chat()
AIAgent.run_conversation()
_interruptible_api_call()
tool_calls 解析
tool 执行循环
最终响应返回
```

这一讲要重点理解：

```
用户输入
  ↓
追加 user message
  ↓
构建 system prompt
  ↓
选择 provider / API mode
  ↓
调用模型
  ↓
模型返回 tool_calls？
  ├── 是：执行工具，结果塞回 messages，继续循环
  └── 否：返回 final response，保存 session
```

官方 Agent Loop 文档说明，`AIAgent` 负责 prompt assembly、provider/API mode 选择、可中断模型调用、工具执行、对话历史维护、压缩、重试、fallback model、iteration budget 与 memory flush。

------

## 第 3 讲：Prompt Assembly 拆解

目标：拆 `agent/prompt_builder.py`。

重点理解 Hermes 为什么不是每次都简单拼一个 system prompt，而是分成：

```
稳定层：可缓存 system prompt
临时层：每次 API call 动态注入
```

它的 prompt 层大致包括：

```
SOUL.md
工具行为指导
Honcho 静态块
用户自定义 system message
MEMORY snapshot
USER profile snapshot
Skills index
AGENTS.md / .cursorrules / .cursor/rules
timestamp / session id
platform hint
```

官方文档明确说 Hermes 有意区分“cached system prompt state”和“ephemeral API-call-time additions”，因为这影响 token 使用、prompt caching、session continuity 和 memory correctness。

------

## 第 4 讲：工具系统拆解

目标：拆 `tools/registry.py`、`model_tools.py`、`toolsets.py`。

重点理解：

```
工具不是写死在 Agent 里
而是每个 tools/*.py 自注册到 registry
model_tools.py 负责收集 schema
AIAgent 根据模型返回的 tool_calls 调用 handle_function_call()
```

官方文档说 Hermes tools 是 self-registering functions，按 toolset 分组，通过 central registry/dispatch system 执行；每个 tool module 会在 import 时调用 `registry.register(...)` 注册自己。

------

## 第 5 讲：Session / Memory / Recall 拆解

目标：拆 `hermes_state.py`、`agent/memory_manager.py`、memory provider。

重点理解三种“记忆”：

```
1. 当前对话 messages
2. session storage：SQLite + FTS5，可搜索历史会话
3. MEMORY.md / USER.md：持久化用户事实与偏好
```

Hermes 的 session storage 使用 `~/.hermes/state.db`，包含 sessions、messages、messages_fts、messages_fts_trigram、state_meta、schema_version 等表；FTS5 用于跨会话全文搜索，session lineage 用于压缩后父子 session 追踪。

------

## 第 6 讲：Gateway 拆解

目标：拆 `gateway/run.py`、`gateway/session.py`、`gateway/platforms/*`。

重点理解：

```
平台消息
  ↓
Adapter.on_message()
  ↓
MessageEvent
  ↓
GatewayRunner._handle_message()
  ↓
鉴权 / session key / 创建 AIAgent
  ↓
AIAgent.run_conversation()
  ↓
delivery 发回平台
```

官方架构文档给出的 gateway flow 是：platform event → adapter → MessageEvent → GatewayRunner → authorize user → resolve session key → create AIAgent with session history → run_conversation → deliver response。

------

## 第 7 讲：Cron 自动化拆解

目标：拆 `cron/jobs.py`、`cron/scheduler.py`。

重点理解：

```
定时任务不是普通提醒
而是定时创建一个 fresh AIAgent
给它 job prompt + skills context
让它独立完成任务
再投递到目标平台
```

官方文档的 cron flow 是：scheduler tick → load due jobs → create fresh AIAgent → inject attached skills → run job prompt → deliver response → update job state and next_run。

------

## 第 8 讲：Skills 系统拆解

目标：拆 `skills/`、`optional-skills/`、`agent/skill_commands.py`、`hermes_cli/skills_config.py`。

重点理解：

```
Skill 不是工具本身
Skill 更像“任务说明书 + 工作流协议 + 可加载知识包”
```

也就是说，tool 解决“能不能做”，skill 解决“怎么做得专业”。

------

## 第 9 讲：Plugin / MCP / Provider 扩展拆解

目标：拆：

```
hermes_cli/plugins.py
tools/mcp_tool.py
hermes_cli/runtime_provider.py
hermes_cli/auth.py
```

重点理解：

```
Provider 负责模型来源
MCP 负责外部工具接入
Plugin 负责扩展 Hermes 自身能力
```

官方文档说明 Plugin 有三个发现来源：`~/.hermes/plugins/`、`.hermes/plugins/`、pip entry points；插件可以注册 tools、hooks、CLI commands；memory provider 和 context engine 是两种专用 plugin 类型。

------

## 第 10 讲：多 Agent / Kanban / Delegation 拆解

目标：拆：

```
tools/delegate_tool.py
kanban 相关模块
run_agent.py 中 delegate_task 拦截逻辑
```

重点理解：

```
Hermes 早期核心仍是单 Agent loop
但通过 delegate_task / subagent / kanban board
逐步发展成可持久化、多 worker、可恢复的多 Agent 协作系统
```

2026 年 5 月 7 日发布的 v0.13.0 “Tenacity Release” 特别强调 Multi-agent Kanban、heartbeat、reclaim、zombie detection、retry budget、hallucination gate、gateway auto-resume、checkpoints v2 等能力。

------

# 第 1 讲：Hermes Agent 总架构拆解

## 1. 先给一句总判断

Hermes Agent 的核心不是“一个会调用工具的聊天机器人”，而是：

> 一个长期运行在本地或服务器上的 Agent Runtime。
> 它把聊天入口、模型调用、工具系统、记忆系统、技能系统、定时任务、跨平台消息网关和插件扩展整合成一个完整 Agent 操作系统。

普通 Agent Demo 通常是：

```
用户输入 → LLM → tool call → 返回结果
```

Hermes 更像：

```
用户输入
  ↓
入口层：CLI / Telegram / Discord / API / Cron / Python Library
  ↓
会话层：找到对应 session、用户、平台、历史上下文
  ↓
Agent Runtime：AIAgent.run_conversation()
  ↓
Prompt 系统：SOUL + MEMORY + USER + Skills + AGENTS.md + platform hint
  ↓
Provider 系统：OpenRouter / Anthropic / OpenAI / local endpoint / fallback
  ↓
Tool 系统：terminal / browser / web / file / MCP / delegate / vision
  ↓
Memory & Session：SQLite + FTS5 + MEMORY.md + USER.md
  ↓
结果投递：CLI 输出 / 平台回复 / Cron 投递 / API 返回
```

你要抓住一句话：

> Hermes 的主线是 `AIAgent`，外围所有东西都是在给 `AIAgent` 提供入口、上下文、工具、记忆、投递和恢复能力。

------

## 2. 第一层：Entry Points，入口层

Hermes 不是只有一个命令行入口。官方架构里列了这些入口：

```
CLI
Gateway
ACP
Batch Runner
API Server
Python Library
```

也就是说，用户可以从不同地方触发同一个 Agent Runtime：

```
cli.py                  # 终端交互入口
gateway/run.py          # Telegram / Discord / Slack 等消息平台入口
acp_adapter/            # IDE/ACP 集成入口
batch_runner.py         # 批量任务/轨迹生成入口
API Server              # OpenAI-compatible API 入口
Python Library          # 直接 import AIAgent 使用
```

官方 Python Library 文档也说明，可以直接：

```
from run_agent import AIAgent

agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
)

response = agent.chat("What is the capital of France?")
```

`chat()` 会在内部处理完整 conversation loop，包括工具调用、重试等，然后只返回最终文本。

这说明 Hermes 的设计很像一个“可嵌入 Agent Runtime”，而不是只能在 CLI 里跑。

------

## 3. 第二层：AIAgent，真正的心脏

官方文档把 `run_agent.py` 里的 `AIAgent` 定义为核心 orchestration engine。它负责：

```
构建 system prompt
选择 provider / API mode
发起模型调用
解析 tool_calls
执行工具
维护 messages
处理 compression
处理 retry / fallback
处理 callbacks
处理 memory flush
处理 session persistence
```

它支持三个 API mode：

```
chat_completions       # OpenAI-compatible endpoint
codex_responses        # OpenAI Responses / Codex format
anthropic_messages     # Anthropic Messages API
```

这点很重要，因为 Hermes 不想绑定某一个模型厂商。它的内部消息统一成 OpenAI-style message 格式，然后在调用不同 provider 前后做格式转换。官方 Agent Loop 文档明确说明，三种模式最终都会汇聚到同一种内部 message format。

你可以把 AIAgent 理解成：

```
AIAgent = Agent Runtime Kernel
```

就像操作系统内核一样，CLI、Gateway、Cron、API 都只是不同 shell。

------

## 4. 第三层：Prompt Builder，决定 Agent “是谁、知道什么、该怎么做”

Hermes 的 prompt 不是一句简单 system prompt，而是分层组装。

核心文件：

```
agent/prompt_builder.py
run_agent.py
tools/memory_tool.py
```

Prompt 大致是这样拼的：

```
Layer 1: SOUL.md
Layer 2: Tool-aware behavior guidance
Layer 3: Honcho static block
Layer 4: optional system message
Layer 5: MEMORY snapshot
Layer 6: USER profile snapshot
Layer 7: skills index
Layer 8: AGENTS.md / .cursorrules / .cursor/rules
Layer 9: timestamp / session id
Layer 10: platform hint
```

这里的关键不是“内容多”，而是设计思想：

```
稳定信息 → 进入 cached system prompt
临时信息 → 每次 API call 时动态注入
```

这样做的原因是降低 token 成本、提高 prompt cache 命中、保证 session continuity，同时避免 memory 在上下文压缩时丢失。官方文档也强调这是 Hermes 重要设计选择之一。

------

## 5. 第四层：Tool System，决定 Agent “能做什么”

核心文件：

```
model_tools.py
toolsets.py
tools/registry.py
tools/*.py
```

Hermes 工具系统的设计不是：

```
在 run_agent.py 里写一堆 if tool_name == ...
```

而是：

```
每个工具文件自己注册
registry 统一收集
model_tools 生成 schema 给模型
模型返回 tool_call
handle_function_call 分发到具体 handler
```

简化理解：

```
tools/file_tools.py
  ↓ registry.register("read_file", ...)
tools/web_tools.py
  ↓ registry.register("web_search", ...)
tools/terminal_tool.py
  ↓ registry.register("terminal", ...)

        ↓

tools/registry.py
  保存所有 ToolEntry

        ↓

model_tools.py
  get_tool_definitions()
  handle_function_call()

        ↓

run_agent.py
  执行模型返回的 tool_calls
```

官方 Tools Runtime 文档说明，每个 tool module 会在 import 时调用 `registry.register(...)`，声明 name、toolset、schema、handler、check_fn、requires_env、description 等；`model_tools.py` 负责导入/发现工具模块，并构建给模型使用的 schema list。

这套设计你后面做项目 B 多 Agent 也可以借鉴：

```
Agent 不直接依赖工具实现
Agent 只依赖工具 registry
```

这样才能做到可扩展、可测试、可插拔。

------

## 6. 第五层：Session Storage，决定 Agent “能不能连续工作”

Hermes 的 session 不是简单存在内存里。

核心文件：

```
hermes_state.py
gateway/session.py
```

官方 session storage 使用：

```
~/.hermes/state.db
```

主要表：

```
sessions
messages
messages_fts
messages_fts_trigram
state_meta
schema_version
```

这里面有几个非常关键的设计：

```
SQLite WAL mode             # 支持并发读 + 单写
FTS5                        # 跨 session 全文搜索
trigram tokenizer           # 支持 CJK / substring search
parent_session_id           # 压缩后 session lineage
source tagging              # 区分 cli / telegram / discord 等来源
```

这说明 Hermes 的“记忆”分层很清楚：

```
短期记忆：当前 messages
中期记忆：session database，可搜索历史对话
长期记忆：MEMORY.md / USER.md
```

这比很多 Agent Demo 的“把历史消息塞进 prompt”成熟得多。

------

## 7. 第六层：Gateway，决定 Agent “活在哪里”

Hermes 的 Gateway 是长期运行进程。

核心文件：

```
gateway/run.py
gateway/session.py
gateway/delivery.py
gateway/platforms/*
```

Gateway 做的事情包括：

```
接收平台消息
统一封装成 MessageEvent
做用户授权
解析 session key
加载历史 session
创建 AIAgent
调用 run_conversation()
把结果发回平台
```

官方架构文档列出的平台适配器已经很多，包括 Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Mattermost、Email、SMS、DingTalk、Feishu、WeCom、Weixin、Webhook、API Server 等。

所以 Hermes 的形态不是：

```
我打开终端，它才活着
```

而是：

```
它作为一个 daemon/gateway 长期运行
你从任何平台给它发消息
它能接着之前的上下文继续工作
```

------

## 8. 第七层：Cron，决定 Agent “能不能主动做事”

普通聊天机器人是被动的：

```
用户问 → 它答
```

Hermes 的 cron 让它可以主动执行周期任务：

```
每天总结
每周审计
定时备份
定时检查某个网站
定时跑脚本
定时投递到 Telegram/Discord/Slack
```

官方 cron flow 是：

```
Scheduler tick
  ↓
load due jobs from jobs.json
  ↓
create fresh AIAgent
  ↓
inject attached skills as context
  ↓
run job prompt
  ↓
deliver response to target platform
  ↓
update job state and next_run
```

这和你后面做多 Agent 运营中台很相关，因为它对应：

```
定时运营任务
日报生成
风控巡检
指标异常检测
策略复盘
```

------

# 这一讲你要记住的核心结论

Hermes Agent 的架构可以用一句话概括：

```
多入口触发 AIAgent，
AIAgent 通过 Prompt + Provider + Tool Registry 完成任务，
再通过 Session + Memory + Skills + Gateway + Cron 形成长期运行闭环。
```

更像工程化 Agent Runtime，而不是一个单文件 Agent demo。

源码阅读顺序我建议你这样来：

```
1. website/docs/developer-guide/architecture.md
2. run_agent.py
3. agent/prompt_builder.py
4. model_tools.py
5. tools/registry.py
6. hermes_state.py
7. gateway/run.py
8. cron/scheduler.py
9. skills/
10. tools/delegate_tool.py
```

下一步我们就进入 **第 2 讲：`run_agent.py` / AIAgent 核心循环源码拆解**。这一讲会重点拆：

```
AIAgent.__init__()
chat()
run_conversation()
API mode 选择
tool_calls 循环
iteration budget
callback surfaces
compression / persistence
```



下面的讲解直接进入重点版本模式，可以进入下一讲了



好的，后面我都按“重点版”走：不做逐行啰嗦，只抓核心链路、关键函数、设计意图和你能迁移到项目里的点。现在进入第 2 讲：`AIAgent / run_agent.py` 核心循环。

已思考 29s

好的，进入 **重点版第 2 讲：`AIAgent / run_agent.py` 核心循环拆解**。

这一讲只抓主干，不做逐行解释。

------

# 第 2 讲：AIAgent 核心循环重点版

## 0. 先给结论

Hermes Agent 的核心不是工具，也不是 Gateway，而是：

```
AIAgent.run_conversation()
```

所有入口最后都在调用它：

```
CLI / Gateway / API / Cron / Python Library
        ↓
AIAgent.run_conversation()
        ↓
模型调用 + 工具调用 + 上下文维护 + 记忆持久化
```

官方文档也明确说，`AIAgent` 负责 system prompt 组装、provider/API mode 选择、可中断模型调用、工具执行、OpenAI 格式消息历史维护、压缩、重试、fallback、父子 Agent iteration budget 等核心职责。

------

# 1. 现在源码已经拆成了多文件

你不要再只盯着 `run_agent.py` 一个文件看。

现在的结构更像这样：

```
run_agent.py
  └── AIAgent 类壳子
        ├── __init__() → 转发到 agent/agent_init.py
        ├── run_conversation() → 转发到 agent/conversation_loop.py
        ├── _execute_tool_calls() → 转发到 agent/tool_executor.py
        └── 一堆 runtime helper / wrapper
```

源码里 `AIAgent.__init__()` 已经变成 thin wrapper，真正初始化逻辑在 `agent.agent_init.init_agent()`；官方源码注释也说明这是为了把原本很长的初始化逻辑从 `run_agent.py` 中抽出去。

`agent/agent_init.py` 也明确说：`AIAgent.__init__` 原来是代码库里最长的方法之一，包含 60+ 参数、约 1400 行属性初始化、provider 自动检测、credential resolution、context engine bootstrap 等，现在被抽成 `init_agent(agent, ...)`。

所以你读源码时，要按这个顺序：

```
1. run_agent.py               看 AIAgent 外壳
2. agent/agent_init.py        看初始化
3. agent/conversation_loop.py 看主循环
4. agent/tool_executor.py     看工具执行
```

------

# 2. AIAgent 初始化到底做什么？

`__init__()` 不是真正执行任务，它是在准备 Agent Runtime。

重点准备这些东西：

```
模型与 provider
API mode
toolsets
session_id
callbacks
memory manager
context compressor
iteration budget
checkpoint manager
platform / user / chat 信息
fallback model chain
```

你可以把它理解成：

```
AIAgent.__init__()
= 创建一个可运行 Agent 实例
= 装配模型、工具、记忆、会话、回调、压缩器、fallback、平台上下文
```

重点不是“初始化一个类”，而是：

> Hermes 把 Agent 运行时需要的所有状态都挂在 `self` 上，后面的 `run_conversation()` 就围绕这个 `self` 做循环调度。

------

# 3. `chat()` 和 `run_conversation()` 的区别

官方文档里给了两个入口：

```
response = agent.chat("Fix the bug in main.py")
```

和：

```
result = agent.run_conversation(
    user_message="Fix the bug in main.py",
    system_message=None,
    conversation_history=None,
    task_id="task_abc123"
)
```

`chat()` 是简单接口，只返回最终字符串；`run_conversation()` 是完整接口，返回 messages、metadata、usage 等更多信息。

重点理解：

```
chat()
  ↓
包装 run_conversation()
  ↓
只取 final_response 返回
```

所以源码拆解时，真正看的是：

```
run_conversation()
```

不是 `chat()`。

------

# 4. `run_conversation()` 主链路

`agent/conversation_loop.py` 明确说明：这个文件是从 `run_agent.AIAgent` 抽出来的核心 conversation loop，原本是 `run_conversation` 的约 3900 行主体，负责一个用户回合中的模型调用、工具分发、重试、fallback、压缩、后置 hooks、记忆/技能 review nudge 等。

核心流程可以压缩成这张图：

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

这就是 Hermes Agent 的心脏。

------

# 5. 第一段：进入主循环前做什么？

进入模型调用前，Hermes 会做一堆“工程化准备”。

重点包括：

```
安装 safe stdio
确保 session DB 存在
恢复 primary runtime
清洗用户输入中的异常字符
生成 task_id
重置本轮 retry counters
重置本轮 iteration budget
从 conversation_history 构造 messages
把当前 user message append 到 messages
构建或恢复 system prompt
预检查是否需要上下文压缩
触发 plugin pre_llm_call
memory provider prefetch
```

源码里可以看到，`run_conversation()` 一开始会调用 `_install_safe_stdio()`、`agent._ensure_db_session()`，然后设置 runtime main provider/model、设置 session log context、恢复 primary runtime、清理用户输入、生成 task_id、重置 retry counters 和 iteration budget。

这里你要记住一个核心点：

> Hermes 每一轮对话都不是直接把用户输入丢给模型，而是先恢复会话、修复状态、准备 prompt、准备工具、准备记忆，再调用模型。

这就是 Agent Runtime 和普通 LLM wrapper 的区别。

------

# 6. 第二段：System Prompt 不是每轮乱拼

Hermes 有一个很关键的设计：

```
system prompt 每个 session 构建一次
后续尽量复用
```

原因是为了稳定 prompt cache。

源码注释写得很清楚：Hermes 的 invariant 是 system prompt 在每个 session 中只构建一次，并在每一轮原样重放，这样上游 prompt cache 的前缀才能保持稳定。

这点很重要。

普通 Agent 常见写法：

```
system_prompt = build_system_prompt(memory, tools, time, context)
```

每轮都重建，结果是：

```
前缀不稳定
prompt cache 命中率差
memory 变化可能污染历史上下文
跨平台 gateway 每次重建 Agent 时容易上下文不一致
```

Hermes 的方式是：

```
第一次构建 system prompt
  ↓
存到 session DB
  ↓
后续轮次从 session DB 恢复
  ↓
只把临时上下文注入 user message
```

所以这一点你要重点学：

> 稳定身份、工具说明、长期记忆放 system prompt；临时检索、插件上下文、本轮补充信息放 user message。

------

# 7. 第三段：主循环 while

核心循环大致是：

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

源码里主循环条件就是围绕 `agent.max_iterations` 和 `agent.iteration_budget.remaining` 做的；每轮都会增加 `api_call_count`，并消费 iteration budget。

官方文档也说，Hermes 默认 iteration budget 是 90，可通过 `agent.max_turns` 配置；子 Agent 有独立 budget，并且在耗尽时会停止并返回已完成工作的总结。

所以 Hermes 防止 Agent 无限循环的方式不是只靠提示词，而是代码层有硬限制：

```
max_iterations
iteration_budget
tool guardrails
empty response retry limit
fallback chain
compression retry limit
```

------

# 8. 第四段：构建 API Messages

每一轮模型调用前，Hermes 会从内部 `messages` 构建一份 `api_messages`。

注意这里有两个概念：

```
messages       内部真实会话历史，会持久化
api_messages   本次发给模型的副本，会被清洗、注入、裁剪
```

这非常关键。

源码中会把外部 memory prefetch 和 plugin pre_llm_call 的内容注入到当前 user message，但只是 API-call-time 注入，不修改原始 `messages`，因此不会泄露到 session persistence。

这说明 Hermes 有一个非常成熟的分层：

```
持久会话历史：干净、可恢复
API 调用上下文：可注入、可变形、可优化
```

你以后做项目 B 的 Agent Runtime，也要学这一点：

> 不要把所有临时检索内容都永久写进 history。
> 永久 history 和本轮 API context 必须分开。

------

# 9. 第五段：调用模型

Hermes 支持多种 API mode：

```
chat_completions
codex_responses
anthropic_messages
```

官方文档说明，这三种模式由 provider selection、explicit args、base URL heuristics 共同决定；不同模式服务于 OpenAI-compatible endpoints、OpenAI Responses/Codex 格式、Anthropic Messages API。

所以 Hermes 的模型层不是简单：

```
client.chat.completions.create(...)
```

而是：

```
根据 provider / base_url / model
  ↓
选择 API mode
  ↓
构建对应请求格式
  ↓
调用对应 transport
  ↓
再统一回 Hermes 内部 message format
```

设计重点：

> 内部统一，外部适配。

这也是 Agent 框架必须具备的能力。

------

# 10. 第六段：处理模型返回

模型返回后，Hermes 重点判断：

```
是否有 tool_calls？
```

## 情况 A：有 tool_calls

流程是：

```
assistant_message.tool_calls
  ↓
校验 JSON 参数
  ↓
cap delegate_task 数量
  ↓
deduplicate tool calls
  ↓
构造 assistant_msg
  ↓
执行工具
  ↓
把每个工具结果 append 成 role="tool"
  ↓
继续下一轮模型调用
```

源码里能看到，对 tool calls 会做 `cap_delegate_task_calls` 和 `deduplicate_tool_calls`，然后 append assistant message，再调用 `agent._execute_tool_calls(...)`。

这一步的关键不是“调用工具”，而是：

> 模型只负责提出 tool call；Hermes Runtime 负责校验、限流、去重、执行、记录、再反馈给模型。

## 情况 B：没有 tool_calls

那就是最终回答：

```
strip think blocks
append final assistant message
persist session
return final_response
```

源码中最终会清理 thinking-only prefill、empty-response retry scaffolding 等内部消息，然后 append final message，并把 `_turn_exit_reason` 标记为 text response。

------

# 11. 第七段：工具执行器怎么设计？

工具执行逻辑不在主循环里硬写，而是在：

```
agent/tool_executor.py
```

它提供两类执行：

```
execute_tool_calls_sequential()
execute_tool_calls_concurrent()
```

官方源码注释写明：这个模块负责 sequential 和 concurrent tool-call dispatch，`run_agent` 保留 thin wrappers。

工具执行分两种：

```
单个工具 / 交互式工具 → sequential
多个互不冲突工具 → concurrent
```

并发工具执行时，Hermes 会用 thread pool，收集结果后再按照原始 tool-call 顺序 append 到 messages，避免 API 看到乱序 tool result。

这个设计很关键：

> 执行可以并发，但写回消息历史必须有序。

否则模型下一轮读到的 tool result 顺序会错，容易导致推理混乱。

------

# 12. 第八段：特殊工具不是全部走 registry

大多数工具会走：

```
handle_function_call()
```

但 Hermes 对一些 Agent 级工具做了特殊分发：

```
todo
session_search
memory
clarify
delegate_task
context engine tools
memory provider tools
```

源码里可以看到，`execute_tool_calls_sequential()` 会对 `todo`、`session_search`、`memory`、`clarify`、`delegate_task`、context engine tools、memory manager tools 分别走特殊逻辑；普通工具才落到 `handle_function_call()`。

这说明 Hermes 工具分两层：

```
普通工具层：文件、终端、浏览器、Web、MCP
Agent 内核工具层：memory、todo、session_search、delegate_task、clarify
```

重点理解：

> 有些工具是外部能力，有些工具是 Agent 自我管理能力。

这也是 Hermes 和普通工具调用 Demo 的区别之一。

------

# 13. 第九段：错误处理是 Hermes 的工程化核心

Hermes 的主循环里有很多错误恢复逻辑，重点包括：

```
空响应重试
thinking-only 响应 prefill
tool call JSON 修复
truncated response continuation
truncated tool call 拒绝执行
context overflow 压缩后重试
rate limit fallback
auth error fallback / refresh
provider malformed stream retry
non-retryable error 直接终止
```

官方文档也说，fallback 会在 primary model 失败时检查 `fallback_providers`，然后按顺序尝试 fallback；401/403 会先尝试 credential refresh。

这里你要学到的是：

> Agent 不稳定不是异常，而是常态。
> 成熟 Agent Runtime 的核心价值，就是把这些失败路径工程化。

普通 Agent Demo 往往只写：

```
try:
    response = llm.call(...)
except:
    return "error"
```

Hermes 是：

```
错误分类
  ↓
是否可重试
  ↓
是否需要压缩
  ↓
是否换 provider
  ↓
是否修复消息格式
  ↓
是否保存 partial state
  ↓
是否给用户明确提示
```

------

# 14. 第十段：上下文压缩和持久化

Hermes 会在两类场景压缩：

```
1. 调用模型前 preflight 发现上下文太大
2. API 报 context overflow / payload too large
```

官方文档说明，preflight 会在会话超过模型上下文窗口 50% 时触发压缩；Gateway auto-compression 在超过 85% 时更激进地运行。压缩时会先 flush memory，再把中间对话摘要化，保留最近 N 条消息，并保持 tool call/result 成对不拆。

源码里也能看到 preflight compression：在进入主循环前，会估算 messages、system prompt、tools 的 token 数，如果超过阈值，就调用 `_compress_context()`，并在压缩后清空 `conversation_history` 引用，避免写入新 session 时跳过压缩后的消息。

这个设计你也要学：

> 压缩不是简单总结文本，而是要保证 session lineage、tool call pair、memory flush、最近上下文完整性。

------

# 15. 用伪代码还原 Hermes 主循环

你可以把 `run_conversation()` 理解成下面这个伪代码：

```
def run_conversation(user_message, conversation_history=None):
    ensure_session()
    restore_primary_runtime()
    reset_turn_state()
    
    messages = list(conversation_history or [])
    messages.append({"role": "user", "content": user_message})
    
    system_prompt = restore_or_build_system_prompt()
    messages = maybe_preflight_compress(messages, system_prompt)
    
    while budget_remaining():
        api_messages = build_api_messages(
            system_prompt=system_prompt,
            messages=messages,
            ephemeral_memory_context=prefetch_memory(),
            plugin_context=pre_llm_call_hooks(),
        )
        
        response = call_model(api_messages, tools)
        
        if response.tool_calls:
            assistant_msg = build_assistant_tool_call_message(response)
            messages.append(assistant_msg)
            
            tool_results = execute_tool_calls(response.tool_calls)
            messages.extend(tool_results)
            
            continue
        
        final_response = extract_final_text(response)
        messages.append({"role": "assistant", "content": final_response})
        persist_session(messages)
        
        return {
            "final_response": final_response,
            "messages": messages,
            "completed": True,
        }
    
    return handle_budget_exhausted(messages)
```

这就是 Hermes Agent 的主骨架。

------

# 16. 这一讲最重要的 5 个源码点

你后面读源码，优先抓这 5 个点：

```
1. AIAgent.__init__()
   看 Agent Runtime 初始化了哪些状态

2. run_conversation()
   看一轮用户输入如何驱动完整 Agent loop

3. _restore_or_build_system_prompt()
   看 system prompt 如何缓存、恢复、保持稳定

4. _execute_tool_calls()
   看工具如何顺序/并发执行，如何把结果写回 messages

5. error / compression / fallback 分支
   看 Hermes 如何保证长任务不中断、会话不丢失
```

------

# 17. 你真正应该学走的设计点

如果你后面做自己的多 Agent 项目，不要只学“会调用工具”。

要学 Hermes 这几个架构点：

```
1. Agent Core 和 Tool Implementation 解耦
2. 内部 messages 和 API messages 分离
3. system prompt 稳定缓存，临时上下文注入 user message
4. tool call 先校验、限流、去重，再执行
5. 工具执行结果必须以 role="tool" 回填
6. 工具可以并发，但消息写回必须有序
7. iteration budget 必须代码层硬控
8. context compression 必须保留最近上下文和 tool pair
9. fallback / retry / empty response / truncated response 都要有工程化处理
10. session persistence 要覆盖正常返回、异常返回、partial 返回
```

一句话总结：

```
Hermes 的 AIAgent 不是一个“调用模型的类”，
而是一个“可恢复、可压缩、可工具调用、可跨平台运行的 Agent 执行内核”。
```

------

下一讲进入 **第 3 讲：Prompt Builder 重点版拆解**，重点讲：

```
SOUL.md
MEMORY.md
USER.md
Skills index
AGENTS.md / .cursorrules
platform hint
ephemeral system prompt
prompt cache 稳定性
```



好的继续



已思考 11s

好的，继续进入 **重点版第 3 讲：Prompt Builder 拆解**。

------

# 第 3 讲：Prompt Builder 重点版

这一讲只回答一个核心问题：

```
Hermes Agent 到底是怎么“组装大脑”的？
```

也就是：

```
模型本身只是 LLM
Prompt Builder 决定 Hermes 是谁、知道什么、遵守什么规则、能用什么技能、当前处在什么项目环境里
```

------

# 1. Prompt Builder 在架构中的位置

上一讲我们说过主链路是：

```
用户输入
  ↓
AIAgent.run_conversation()
  ↓
构建 system prompt
  ↓
调用模型
  ↓
工具调用 / 最终回答
```

这里的 **构建 system prompt** 就主要落在：

```
agent/prompt_builder.py
```

官方文档也明确把 Prompt Assembly 定义为 Hermes 构建 system prompt、保持 prompt cache 稳定、注入临时上下文的核心机制。

所以你可以这样理解：

```
run_agent.py / conversation_loop.py 负责“跑起来”
prompt_builder.py 负责“让 Agent 成为什么样的 Agent”
```

------

# 2. Hermes 的 Prompt 不是一整段，而是分层拼装

Hermes 的 system prompt 大致按这个顺序组装：

```
1. Agent identity / SOUL.md
2. Tool-aware behavior guidance
3. Honcho static block
4. Optional system message
5. Frozen MEMORY snapshot
6. Frozen USER profile snapshot
7. Skills index
8. Context files: AGENTS.md / .cursorrules / .cursor/rules
9. 时间、session、平台等临时提示
```

官方 Prompt Assembly 文档里也列出了这个顺序：先加载 `SOUL.md` 或默认身份，再加入工具行为指导、Honcho block、系统消息、MEMORY 快照、USER 快照、skills index、项目上下文文件等。

你要抓住重点：

```
Hermes 的 prompt = 身份层 + 行为层 + 记忆层 + 技能层 + 项目上下文层 + 临时运行层
```

------

# 3. 第一层：SOUL.md，Agent 的身份人格

Hermes 会优先读取：

```
~/.hermes/SOUL.md
```

如果没有，就使用 `prompt_builder.py` 里的默认身份。官方文档说明，`SOUL.md` 是 Hermes system prompt 的第一个部分，用来定义 Agent identity。

源码里的默认身份大致表达的是：

```
You are Hermes Agent...
helpful, knowledgeable, direct...
can answer questions, write code, analyze information, execute actions via tools...
```

`prompt_builder.py` 中确实有 `DEFAULT_AGENT_IDENTITY`，用于没有自定义 `SOUL.md` 时作为默认身份。

这一层的作用不是解决具体任务，而是确定：

```
这个 Agent 是谁？
它的默认表达风格是什么？
它的基础行为边界是什么？
```

对你做项目 B 的启发是：

```
不要把 Agent 身份写死在代码里
应该抽成可配置的 persona / role / system profile
```

比如你的运营中台多 Agent 可以设计成：

```
Supervisor Agent:
  负责拆任务、调度、验收

Data Analyst Agent:
  负责指标分析、异常检测

Content Agent:
  负责生成运营文案

Risk Agent:
  负责合规检查和风险提示
```

每个 Agent 都应该有自己的 `SOUL.md` 或 `ROLE.md`。

------

# 4. 第二层：Tool-aware behavior guidance，工具行为指导

这一层告诉模型：

```
什么时候该用工具
怎么用工具
工具失败怎么办
不要假装执行过工具
不要编造文件内容
不要跳过必要验证
```

这层非常关键。

因为工具 schema 只告诉模型：

```
有哪些工具
参数是什么
```

但 tool guidance 告诉模型：

```
什么情况下应该调用
调用后如何解释结果
调用失败如何恢复
```

你可以这样理解：

```
Tool schema = 工具说明书
Tool guidance = 工具使用规范
```

如果没有这一层，Agent 很容易出现：

```
能不用工具就乱答
用了工具但不看结果
工具失败后硬编
重复调用同一个工具
```

所以 Hermes 的 Prompt Builder 不只是拼“身份”，还在拼“操作规范”。

------

# 5. 第三层：MEMORY snapshot，长期记忆快照

Hermes 会把长期记忆注入 system prompt。

这里的重点是 **snapshot**。

它不是每次工具返回一个 memory 就立刻乱塞，而是把当前记忆状态整理成一个稳定快照。官方 Prompt Assembly 文档把这一层叫 frozen MEMORY snapshot。

你可以理解成：

```
MEMORY.md
  ↓
读取当前长期记忆
  ↓
形成 frozen snapshot
  ↓
放入 system prompt
```

作用是让 Agent 记住：

```
用户长期偏好
用户项目背景
用户反复强调的规则
用户长期目标
```

但是注意，长期记忆不等于聊天历史。

Hermes 至少有三层上下文：

```
当前 messages:
  当前会话短期上下文

Session DB:
  可搜索的历史会话

MEMORY / USER:
  长期稳定事实和偏好
```

这点和普通 RAG 很不一样。

普通 RAG 是：

```
临时检索相关片段 → 塞给模型
```

Hermes 的 memory 更像：

```
长期人格化上下文 → 参与 Agent 的持续行为
```

------

# 6. 第四层：USER profile snapshot，用户画像快照

`USER` 层和 `MEMORY` 层容易混。

可以这样区分：

```
MEMORY:
  和任务、项目、偏好、经验相关的长期记忆

USER:
  更偏用户画像、用户身份、用户稳定属性、交互偏好
```

例如：

```
用户正在做 AI Agent 项目
用户喜欢导师式拆解
用户偏好“重点版”讲解
用户目标是大模型开发 / Agent 开发求职
```

这类东西更适合放到 USER profile 或 memory provider 里。

对你来说，这就是为什么我后续讲解会按：

```
重点版
源码主链路
项目可迁移点
面试表达
```

来讲，因为这是你的长期学习偏好。

------

# 7. 第五层：Skills index，技能索引

Hermes 的 skill 不是普通 tool。

重点区别：

```
Tool:
  具体能力，比如读文件、执行终端、搜索网页、打开浏览器

Skill:
  做某类任务的方法论、流程、约束、最佳实践
```

所以 Skills index 的作用是告诉 Agent：

```
当前有哪些可用技能包
每个技能适合什么任务
什么时候应该加载/使用
```

官方 Prompt Assembly 文档明确把 `skills index` 放在 cached system prompt 的组成部分里。

可以这样理解：

```
工具让 Agent 有手
Skill 让 Agent 有经验
Memory 让 Agent 有长期记忆
Prompt Builder 把这三者组织成可工作的“大脑”
```

对项目 B 的启发很大。

你后面可以设计：

```
运营日报生成 Skill
用户分群分析 Skill
活动复盘 Skill
异常指标诊断 Skill
投放策略建议 Skill
竞品分析 Skill
SQL 分析 Skill
```

每个 Skill 不一定是代码，而可以是：

```
任务边界
分析步骤
需要调用哪些工具
输出格式
质量检查清单
失败恢复策略
```

------

# 8. 第六层：项目上下文文件

Hermes 会读取项目里的上下文文件，比如：

```
AGENTS.md
.cursorrules
.cursor/rules/*.mdc
```

这些文件告诉 Agent：

```
当前项目怎么开发
代码风格是什么
测试命令是什么
目录结构是什么
哪些规则不能违反
```

官方 Prompt Assembly 文档也把这些 context files 放进 system prompt 组装顺序里。

这对编程 Agent 特别重要。

比如一个项目可以写：

```
AGENTS.md:
  - 后端使用 FastAPI
  - 数据库使用 PostgreSQL
  - 所有新增接口必须写测试
  - 运行测试命令是 pytest
  - 不要直接修改 migrations
  - 不允许绕过权限校验
```

这样 Agent 在读代码之前，就已经知道项目规则。

不过这里也有一个风险：项目上下文文件可能污染 Agent 指令。近期 GitHub issue 里就有人指出，Hermes 存在从工具参数附近追加不相关 `AGENTS.md` / `CLAUDE.md` / `.cursorrules` 的上下文污染风险；另一个近期 issue 也提到 `prompt_builder.py` 的上下文 prompt-injection scanner 可能漏掉多词变体。

所以这一层的工程重点是：

```
项目上下文很有用
但必须做边界控制、路径控制、注入检测
```

------

# 9. 第七层：临时上下文不要污染长期 history

Hermes 一个很成熟的设计是：

```
稳定内容进 system prompt
临时内容进 API-call-time 注入
```

官方文档明确强调 Hermes 会区分 cached system prompt 和 ephemeral API-call-time additions，因为这关系到 token 使用、prompt caching、session continuity 和 memory correctness。

这句话非常重要。

什么意思？

比如本轮工具检索到一段网页内容：

```
今天查到的网页搜索结果
```

它不应该直接永久写进系统身份。

再比如 gateway 平台提示：

```
当前消息来自 Telegram
用户可能希望短回复
```

这也不应该污染长期 system prompt。

正确做法是：

```
长期稳定规则 → system prompt
本轮动态上下文 → 当前 API messages
原始会话历史 → 保持干净
```

这就是 Hermes 的成熟点。

------

# 10. 为什么 Hermes 强调 Prompt Cache 稳定性？

因为如果 system prompt 每一轮都变，模型服务商的 prompt cache 命中率会下降。

Hermes 的设计倾向是：

```
每个 session 里 system prompt 尽量只构建一次
后续重复使用
```

这样有几个好处：

```
1. 降低长对话 token 成本
2. 减少系统提示漂移
3. 保持 Agent 身份稳定
4. 避免 memory 更新导致历史上下文混乱
5. 方便 session 恢复
```

官方 Context Compression and Caching 文档也说明，Hermes 有 prompt caching 与上下文压缩机制，用于管理长对话中的上下文窗口使用。

你做项目时也要记住：

```
不要每轮都重新拼一个完全不同的 system prompt
```

更好的方式是：

```
Session start:
  构建稳定 system prompt

Each turn:
  只注入本轮必要上下文
```

------

# 11. 用伪代码理解 Prompt Builder

可以把 Hermes 的 Prompt Builder 理解成：

```
def build_system_prompt(session, config, workspace):
    sections = []

    sections.append(load_soul_or_default_identity())

    sections.append(build_tool_behavior_guidance())

    if honcho_enabled():
        sections.append(load_honcho_static_block())

    if config.system_message:
        sections.append(config.system_message)

    sections.append(load_frozen_memory_snapshot())

    sections.append(load_frozen_user_profile_snapshot())

    sections.append(build_skills_index())

    sections.append(load_project_context_files(workspace))

    return join_sections(sections)
```

然后在每一轮 API 调用时：

```
def build_api_messages(system_prompt, clean_messages, ephemeral_context):
    api_messages = []

    api_messages.append({
        "role": "system",
        "content": system_prompt,
    })

    api_messages.extend(clean_messages)

    if ephemeral_context:
        inject_into_current_user_message(api_messages, ephemeral_context)

    return api_messages
```

核心思想就是：

```
system_prompt 稳定
api_messages 灵活
messages 保持干净
```

------

# 12. 对你项目 B 的迁移设计

你的多 Agent 运营中台可以直接借鉴 Hermes 的 Prompt Builder 分层。

建议你设计成这样：

```
prompts/
  base/
    supervisor.md
    analyst.md
    content_agent.md
    risk_agent.md

  memory/
    project_memory.md
    user_profile.md

  skills/
    daily_report.md
    campaign_review.md
    user_segmentation.md
    anomaly_diagnosis.md

  context/
    business_rules.md
    data_dictionary.md
    api_contract.md
    output_format.md
```

运行时拼装：

```
Agent Role Prompt
  + Tool Guidance
  + Project Memory
  + User Profile
  + Skill Index
  + Business Rules
  + Current Task Context
```

但是要分清：

```
稳定层：
  role prompt
  tool guidance
  business rules
  data dictionary
  output format

临时层：
  本轮用户问题
  本轮 SQL 查询结果
  本轮 RAG 片段
  本轮异常指标
  本轮外部搜索结果
```

不要把临时查询结果长期写进 system prompt。

------

# 13. 这一讲的核心总结

Hermes Prompt Builder 的核心不是“把一堆文本拼起来”，而是：

```
把 Agent 的身份、规则、记忆、技能、项目上下文、临时运行信息分层管理。
```

最重要的 5 个设计点：

```
1. SOUL.md 定义 Agent 身份
2. MEMORY / USER 提供长期上下文
3. Skills index 提供任务方法论入口
4. AGENTS.md / .cursorrules 提供项目级规则
5. 稳定 prompt 和临时上下文必须分离
```

一句话总结：

```
Hermes 的 Prompt Builder 是 Agent 的“大脑装配器”：
它决定模型不是裸 LLM，而是一个有身份、有记忆、有技能、有项目规则的长期 Agent。
```

------

下一讲进入 **第 4 讲：Tools Runtime 工具系统重点版拆解**，重点讲：

```
tools/registry.py
model_tools.py
toolsets.py
handle_function_call()
tool schema
tool dispatch
sequential / concurrent execution
普通工具 vs Agent 内核工具
```