# Agent 协议全景：MCP、A2A、Function Calling、Tools、Plugins 怎么区分

## 这篇文章解决什么问题

Agent 生态里有很多容易混淆的词：

- Function Calling
- Tools
- MCP
- A2A
- Plugin
- Skill
- Hook
- Agent SDK

这些东西不是同一层。混在一起会导致架构设计不清楚：到底是模型调用工具、Agent 之间通信，还是宿主应用管理扩展能力？

这篇文章用分层方式梳理 Agent 协议和扩展机制。

## 一句话区分

| 名称 | 解决的问题 |
|---|---|
| Function Calling | 模型如何表达“我要调用某个函数” |
| Tools | Agent 可调用的外部能力 |
| MCP | 工具、资源、Prompt 如何被标准化暴露给 Agent Host |
| A2A | Agent 与 Agent 之间如何协作和传递任务 |
| Plugin | 应用如何安装和管理扩展能力 |
| Skill | Agent 如何复用一套操作流程和领域知识 |
| Hook | Agent 执行关键节点如何被拦截、审批或审计 |
| Agent SDK | 如何构建 Agent Runtime、tools、handoff、tracing |

## 分层模型

```text
User / Business Task
  ↓
Agent Runtime
  ↓
Function Calling / Tool Intent
  ↓
Tool Layer / MCP Server
  ↓
External Systems

Agent Runtime ↔ A2A ↔ Other Agent Runtime

Host App ↔ Plugin / Skill / Hook
```

关键是分清：模型、Agent、工具服务、宿主应用、外部系统分别负责什么。

## Function Calling

Function Calling 是模型输出结构化工具调用意图的能力。它通常回答：

- 调哪个函数？
- 参数是什么？
- 是否需要继续推理？

它不负责：

- 工具鉴权。
- 参数最终校验。
- 真实执行。
- 审计日志。
- 跨应用工具发现。

这些需要业务系统或工具层处理。

## Tools

Tools 是 Agent 能调用的外部能力。

工具可以是：

- 查询数据库。
- 检索知识库。
- 调用 API。
- 生成图表。
- 创建工单。
- 请求人工审批。

工具设计重点：

- schema。
- 描述。
- 参数校验。
- 权限。
- 错误分类。
- 幂等。
- Trace。

## MCP

MCP 解决工具和上下文接入标准化问题。它强调 Host、Client、Server 的关系：

- Host 是 Agent 应用。
- Client 连接 MCP Server。
- Server 暴露 Tools、Resources、Prompts。

MCP 适合：

- 多工具接入。
- 多应用复用工具。
- 标准化资源访问。
- 把外部系统包装成 Agent 可用能力。

MCP 不是替代 Function Calling，而是补充工具生态。

## A2A

A2A 关注 Agent 与 Agent 之间的协作。它适合跨系统、跨团队、跨 Agent Runtime 的任务交接。

它解决的问题更像：

- 一个 Agent 如何发现另一个 Agent。
- 如何描述任务。
- 如何传递状态和结果。
- 如何处理长任务和异步协作。

A2A 不应该用来替代本地函数调用。只有当确实是“Agent 与 Agent 协作”时才有价值。

## Plugin

Plugin 是应用层扩展机制。它关注：

- 安装。
- 权限声明。
- 版本。
- UI 入口。
- 更新。
- 卸载。

插件可以内置 MCP Server、Skills、命令、UI 页面，但它本身不是工具调用协议。

## Skill

Skill 是 Agent 的可复用操作手册。它关注：

- 什么时候触发。
- 按什么步骤做。
- 读哪些参考文件。
- 用哪些脚本。
- 如何验收。

Skill 不一定暴露外部工具。它更多是“流程和知识”的封装。

## Hook

Hook 是治理机制。它在关键节点拦截：

- 工具调用前。
- 写文件前。
- 提交代码前。
- 高风险操作前。
- 输出给用户前。

Hook 适合做：

- 安全审批。
- 审计。
- 禁止危险命令。
- 自动格式化。
- 输出过滤。

## 选型表

| 需求 | 应该考虑 |
|---|---|
| 让模型输出结构化调用 | Function Calling |
| 给 Agent 一个外部能力 | Tool |
| 标准化接入多个外部工具 | MCP |
| 多个 Agent 跨系统协作 | A2A |
| 给应用安装扩展能力 | Plugin |
| 让 Agent 复用工作流 | Skill |
| 控制高风险动作 | Hook |
| 快速搭 Agent Runtime | Agent SDK |

## 面试表达

可以这样讲 Agent 协议：

> 我会按层次区分这些概念。Function Calling 是模型表达工具调用意图，Tool 是 Agent 可调用能力，MCP 是 Host 和外部工具/资源之间的标准化接入协议，A2A 是 Agent 与 Agent 之间的协作协议。Plugin 是应用扩展机制，Skill 是 Agent 复用流程和知识的操作手册，Hook 是执行过程中的治理拦截点。设计系统时不能把它们混成一层，而要先判断问题是工具调用、工具发现、Agent 协作、应用扩展还是安全治理。

## 相关链接

- [Tool System 横向对比](/topics/tool-system-comparison)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [Skills 编写](/note/AI-Tools/skill-authoring)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)

## 参考资料

- [Model Context Protocol Architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- [Model Context Protocol Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [Google A2A protocol](https://github.com/google-a2a/A2A)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

