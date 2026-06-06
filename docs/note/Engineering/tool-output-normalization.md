# Tool Output Normalization：Agent 工具返回怎么标准化

## 这篇文章解决什么问题

Agent 调用工具后，工具返回经常形态不一致：有的返回字符串，有的返回 JSON，有的返回 HTML，有的直接抛异常，有的把错误写在 success 字段里。模型看到这些结果后很难稳定推理，前端、Trace、评测和回放也很难复用。

Tool Output Normalization 的目标是把所有工具结果转换成统一结构，让 Agent 能稳定消费、系统能审计、失败能回放。

## 为什么不能直接把工具原始输出给模型

| 原始输出问题 | 影响 |
|---|---|
| 字段命名不一致 | 模型和前端都需要猜含义 |
| 错误格式不统一 | 重试、降级、告警无法自动化 |
| 结果过长 | 挤占上下文窗口 |
| 包含敏感信息 | 进入 Trace、评测集或模型上下文造成泄漏 |
| 没有版本 | 工具 schema 变更后回放不稳定 |
| 没有证据引用 | 答案无法定位到原始来源 |

## 推荐标准结构

| 字段 | 说明 |
|---|---|
| tool_call_id | 工具调用唯一 ID |
| tool_name | 工具名 |
| schema_version | 工具输入输出 schema 版本 |
| status | success、partial、failed、timeout、denied |
| risk_level | R0-R4 工具风险等级 |
| key_fields | 模型需要读取的关键字段 |
| evidence_refs | 原始数据、文件、网页、数据库行或 chunk 引用 |
| display | 给用户展示的安全摘要 |
| error | 统一错误结构 |
| retry_policy | 是否可重试、重试条件、最大次数 |
| redaction | 脱敏版本和被隐藏字段 |
| raw_ref | 原始结果存储引用，不直接塞给模型 |

## 错误结构

| 字段 | 示例 | 作用 |
|---|---|---|
| code | TOOL_TIMEOUT | 机器可读错误码 |
| message | 工具调用超时 | 给人看的短消息 |
| retryable | true / false | 决定是否自动重试 |
| user_action_required | true / false | 是否需要用户补充输入 |
| safe_to_show | true / false | 是否能显示给用户 |
| root_cause_hint | upstream_timeout | 便于排障分类 |

## Normalizer 放在哪里

推荐链路：

1. Tool Adapter 接收原始输出。
2. Normalizer 统一 status、字段、错误和证据引用。
3. Redactor 对敏感字段脱敏。
4. Summarizer 生成模型可读摘要。
5. Trace Recorder 保存规范化结果和 raw_ref。
6. Policy Layer 决定是否进入下一步。

不要让每个 Agent prompt 自己解释不同工具输出，这会导致系统不可控。

## 示例

原始输出可能是：

- HTTP 500 文本
- 数据库查询结果数组
- MCP 工具 JSON-RPC error
- 第三方 API 的分页响应

统一后，模型只需要看到：

| 字段 | 值 |
|---|---|
| status | failed |
| code | UPSTREAM_500 |
| retryable | true |
| display | 上游服务暂时不可用 |
| next_action | 稍后重试或切换备用工具 |

## 和 Tool Call Replay 的关系

Tool Call Replay 需要保存原始输入、策略、审批和结果快照；Tool Output Normalization 负责让结果快照结构一致。两者配合后，线上失败可以被 dry replay、mock replay 和 live replay 复现。

## 面试表达

可以这样讲：

> 我不会让模型直接读各种工具的原始返回，而是做了一层 Tool Output Normalizer。它把工具结果统一成 status、key_fields、evidence_refs、error、retry_policy 和 redaction。这样 Agent 后续推理、前端展示、审计日志、失败回放和评测断言都能复用同一种结构。

## 落地检查清单

- [ ] 每个工具是否都有 schema_version？
- [ ] 成功、失败、超时、拒绝是否有统一 status？
- [ ] 错误是否包含 retryable 和 user_action_required？
- [ ] 是否把原始结果放到 raw_ref，而不是全量塞给模型？
- [ ] 是否记录脱敏策略和 evidence_refs？
