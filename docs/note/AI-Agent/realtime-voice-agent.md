# Realtime Voice Agent：低延迟语音 Agent 怎么设计

## 这篇文章解决什么问题

语音 Agent 不只是“语音转文字 + 调模型 + 文字转语音”。真正的 Realtime Voice Agent 需要处理：

- 低延迟。
- 打断。
- 多轮状态。
- 工具调用。
- 噪声和识别错误。
- 实时反馈。
- 安全和审批。

如果用普通 Chat API 串 STT/TTS，也能做 Demo，但很难得到自然的实时交互体验。

## 语音 Agent 的核心链路

```text
用户语音
  ↓
音频输入 / VAD
  ↓
Realtime Session
  ↓
模型推理 + 工具调用
  ↓
音频输出
  ↓
用户打断 / 继续
```

关键不是每一段语音都完整结束后再处理，而是边听、边理解、边响应。

## 和普通文本 Agent 的区别

| 维度 | 文本 Agent | 语音 Realtime Agent |
|---|---|---|
| 输入 | 完整文本 | 连续音频流 |
| 输出 | 文本或流式文本 | 实时音频 |
| 交互 | 回合制 | 可打断、可插话 |
| 延迟要求 | 秒级可接受 | 越低越自然 |
| 错误来源 | 模型理解 | 语音识别、噪声、打断、模型 |
| 状态管理 | 多轮消息 | 对话状态 + 音频状态 |

## 适合的项目场景

- 语音客服助手。
- 设备维修语音指导。
- 面试模拟官。
- 口语陪练。
- 驾驶/运动场景免手操作助手。
- 实时会议助手。

语音 Agent 适合“用户不方便打字、需要即时反馈”的场景。

## 工程设计要点

### 1. 会话状态

语音 Agent 需要记录：

- 当前用户意图。
- 最近识别文本。
- 已确认信息。
- 正在播放的回答。
- 是否被打断。
- 当前工具调用状态。

状态不能只存在模型上下文里，必须在应用层可见。

### 2. 打断处理

用户打断时要决定：

- 停止当前音频输出。
- 保留还是丢弃未播完内容。
- 是否取消正在执行的工具。
- 是否让模型重新规划回答。

打断是语音交互自然性的关键。

### 3. 工具调用

语音 Agent 也会调用工具：

- 查询订单。
- 创建工单。
- 检索知识库。
- 预约时间。
- 查询设备状态。

但高风险工具不应该因为语音交互就自动执行。仍然需要确认：

> 我将为你创建一条维修工单，是否确认？

### 4. 错误恢复

语音识别可能错。系统应该支持澄清：

- “你说的是 A 型号还是 B 型号？”
- “我没有听清故障代码，可以再说一遍吗？”
- “我准备创建工单，地址是……是否正确？”

### 5. 延迟优化

常见优化：

- 使用实时音频模型。
- 减少上下文长度。
- 工具结果结构化摘要。
- 简短回答优先。
- 长任务先确认，再后台处理。
- 对常见意图使用小模型或规则预分类。

## 语音 Agent 的安全边界

- 高风险操作必须二次确认。
- 语音识别不确定时不能执行写操作。
- 不在公共场景朗读敏感信息。
- 用户身份要验证。
- 工具调用要记录 Trace。
- 对话录音和转写要有隐私策略。

## 面试表达

可以这样讲 Realtime Voice Agent：

> 语音 Agent 不只是 STT + LLM + TTS。真正的 Realtime Voice Agent 要处理连续音频流、低延迟响应、用户打断、多轮状态和工具调用。工程上我会把会话状态放在应用层，记录当前意图、已确认信息、正在播放内容和工具调用状态。高风险工具仍然需要语音确认，识别不确定时要澄清。为了降低延迟，我会减少上下文、使用结构化工具结果、让常见意图走轻量路径，并把长任务转成后台任务。

## 相关链接

- [Agent Runtime](/note/AI-Agent/agent-runtime)
- [Context Engineering](/note/AI-Agent/context-engineering)
- [Tool Calling](/note/AI-Agent/tool-calling)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
- [AI Agent 项目选题库](/topics/ai-agent-project-ideas)

## 参考资料

- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [OpenAI Speech to text](https://platform.openai.com/docs/guides/speech-to-text)
- [OpenAI Text to speech](https://platform.openai.com/docs/guides/text-to-speech)

