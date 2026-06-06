# 长期记忆系统设计：用户偏好、项目事实和可遗忘机制

## 这篇文章解决什么问题

Agent 需要记忆，但“记住所有聊天记录”不是长期记忆。真正可用的长期记忆系统要解决：

- 记什么。
- 不记什么。
- 怎么更新。
- 怎么检索。
- 怎么遗忘。
- 怎么避免记错。
- 怎么保护隐私。

长期记忆的目标不是让 Agent 更会聊天，而是让它在长期任务中保持一致性和个性化，同时不污染上下文。

## 记忆类型

| 类型 | 例子 | 是否适合长期保存 |
|---|---|---|
| 用户偏好 | 喜欢中文回答、偏好简洁总结 | 适合 |
| 项目规则 | 不提交 dist、提交前跑 build | 适合 |
| 稳定事实 | 项目使用 VitePress、分支是 master | 适合 |
| 临时状态 | 当前正在编辑哪个文件 | 不适合长期 |
| 敏感信息 | API Key、身份证、密码 | 不应保存 |
| 未验证结论 | “某功能已完成”但没有证据 | 不应直接保存 |

## Memory 和 State 的区别

| 概念 | 生命周期 | 例子 |
|---|---|---|
| State | 当前任务内 | 当前 step、pending approval、tool result |
| Memory | 跨任务复用 | 用户偏好、项目规则、稳定架构 |
| Trace | 历史审计 | run、step、tool_call、error |

不要把 Trace 全量当 Memory，也不要把临时 State 写进长期记忆。

## 记忆写入流程

建议采用“候选记忆 -> 验证 -> 写入”的流程：

```text
Conversation / Tool Result
  ↓
Memory Candidate
  ↓
Validation
  ↓
Storage
  ↓
Retrieval
```

写入前要判断：

- 这条信息是否稳定？
- 是否未来会复用？
- 是否有证据？
- 是否包含敏感数据？
- 是否需要用户确认？

## 记忆结构

```json
{
  "id": "mem_001",
  "type": "project_rule",
  "content": "hfl-ai-agent-lab 构建前需要运行 npm run docs:build",
  "source": "repo/package.json",
  "confidence": 0.95,
  "created_at": "2026-06-06",
  "last_used_at": "2026-06-06",
  "ttl": null,
  "visibility": "project"
}
```

字段重点：

- `type`：记忆类型。
- `source`：证据来源。
- `confidence`：置信度。
- `ttl`：是否过期。
- `visibility`：用户级、项目级、组织级。

## 检索策略

长期记忆不应该每次全量进入上下文。应该按任务检索：

- 当前项目相关。
- 当前用户相关。
- 当前任务类型相关。
- 最近使用过。
- 高置信度。

检索后还要压缩，只把必要信息放进上下文。

## 遗忘机制

长期记忆必须支持遗忘：

- 用户主动删除。
- TTL 过期。
- 事实被新证据覆盖。
- 低置信度记忆长期不用。
- 隐私数据误存后清理。

没有遗忘机制，Memory 会变成上下文污染源。

## 隐私和安全

不应保存：

- 密钥。
- token。
- 密码。
- 身份证。
- 手机号等敏感个人信息。
- 未经授权的业务数据。

对用户偏好和项目规则可以保存，但要可查看、可编辑、可删除。

## 面试表达

可以这样讲长期记忆：

> 我不会把完整聊天记录当长期记忆。长期记忆应该保存稳定、可复用、有证据的信息，比如用户偏好、项目规则和稳定事实；临时执行状态放 State，历史过程放 Trace。写入 Memory 前要做候选提取、敏感信息过滤、证据校验和置信度判断。检索时按当前任务取相关记忆，不全量塞进上下文。记忆还要支持 TTL、覆盖和用户删除，否则长期使用后会污染上下文。

## 相关链接

- [Memory / Persistence](/note/AI-Agent/memory)
- [Context Engineering](/note/AI-Agent/context-engineering)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)

