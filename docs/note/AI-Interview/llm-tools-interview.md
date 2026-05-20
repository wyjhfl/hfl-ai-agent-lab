# LLM 工具调用面试题

## 高频问题地图

- 什么是 Function Calling？
- LLM 是如何学会调用工具的？
- Function Calling 和 Tools 有什么区别？
- 什么是 MCP？
- MCP 由哪些部分组成？
- MCP 和 Function Calling 有什么区别？
- 什么是 Skill？
- Function Calling、Skill、MCP 三者有什么区别？
- 什么是 A2A 协议？
- SSE 和 WebSocket 有什么区别？
- WebRTC 在 AI 对话流中有什么价值？
- LLM 网关解决什么问题？
- 工具调用如何做权限控制？
- 工具调用如何做安全审查？

## 核心概念速记

**Function Calling**：LLM 根据用户请求，生成结构化的函数调用请求（函数名 + 参数 JSON），由外部系统执行后把结果返回给模型。模型不直接执行函数，只输出调用意图。

**Tools**：Function Calling 的演进形式。一个请求可以声明多个工具，模型自主决定调用哪个工具、是否调用、调用顺序。比单个 Function Calling 更灵活。

**MCP（Model Context Protocol）**：Anthropic 提出的标准化协议，定义模型和外部工具/数据源之间的通信规范。组成部分包括 Host（宿主应用）、Client（协议客户端）、Server（工具/数据提供方）、Transport（通信层）。

**Skill**：比 Tool 更高层的概念。Tool 解决"能不能做"，Skill 解决"怎么做得专业"。Skill 包含任务流程、方法论、质量检查清单，是可复用的任务说明书。

**A2A（Agent-to-Agent）**：Google 提出的 Agent 间通信协议，让不同 Agent 可以发现彼此、协商任务、交换结果。

**SSE（Server-Sent Events）**：服务端单向推送的流式传输协议，适合 LLM token 流式输出。基于 HTTP，轻量简单。

**WebSocket**：全双工双向通信协议，适合需要实时交互的场景。比 SSE 重，但支持双向。

**WebRTC**：浏览器端到端实时通信协议，支持音视频和数据传输。在 AI 对话中可用于语音交互场景。

**LLM 网关**：统一管理多个 LLM 提供商的中间层，负责路由、负载均衡、降级、限流、计费、审计。

## 标准回答模板

后续补充正式回答模板。

## 面试官追问

后续补充追问。

## 工程化理解

工具调用面试题要能讲清楚工程化细节：

- 工具注册：如何定义工具 schema（JSON Schema）、如何让模型理解工具用途
- 调用安全：参数校验、权限检查、敏感操作审批、执行沙箱
- 结果处理：结构化 ToolResult、成功/失败标记、错误信息回传
- 协议选型：MCP vs 直接 Function Calling vs 自定义协议的适用场景

## 常见误区

- 认为 Function Calling 是模型在执行函数：模型只输出调用意图，真正执行的是外部系统
- 混淆 MCP 和 Function Calling：MCP 是通信协议标准，Function Calling 是模型能力
- 不做工具调用的安全审查：工具调用可能执行危险操作，需要权限控制和审批机制
- 认为 SSE 和 WebSocket 可以互换：SSE 适合单向推送，WebSocket 适合双向交互，场景不同

## 背诵版总结

后续补充。

## 后续补充

- 标准回答模板
- 面试官追问及应对
- 背诵版总结
- MCP 协议细节
- A2A 协议细节
- LLM 网关架构设计
