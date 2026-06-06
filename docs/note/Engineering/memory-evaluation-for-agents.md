# Agent Memory 评测：记住不等于记对

## 这篇文章解决什么问题

长期记忆是 Agent 产品化的重要能力，但很多项目只实现把用户信息写进数据库，没有评测记忆质量。结果可能是记住了用户没有确认的内容、使用了过期记忆、保存了敏感信息，或者用户要求删除后仍然引用。

Memory Evaluation 的目标是衡量 Agent 是否在正确时间写入、检索、使用、更新和遗忘记忆。

## Memory 生命周期

```text
observe → propose memory → validate → write → retrieve → use → update → forget
```

| 阶段 | 常见错误 |
|---|---|
| observe | 把闲聊当事实 |
| propose | 记忆候选过多 |
| validate | 没有用户确认或证据 |
| write | 缺少来源、时间、置信度 |
| retrieve | 检索出无关记忆 |
| use | 在错误任务中使用记忆 |
| update | 新旧记忆冲突 |
| forget | 删除请求没有执行彻底 |

## 记忆数据结构

建议每条记忆至少记录：memory_id、user_id、type、content、source、confidence、status、sensitivity、created_at、updated_at、expires_at。

| 字段 | 作用 |
|---|---|
| type | 区分 preference、fact、project、constraint、negative_preference |
| source | 说明记忆来自哪次对话、文档或用户确认 |
| confidence | 区分强确认和弱推测 |
| status | active、superseded、deleted |
| sensitivity | normal、private、secret |
| expires_at | 支持短期记忆过期 |

没有 source、confidence、status 和 sensitivity 的记忆，很难评测和治理。

## 评测维度

| 维度 | 问题 |
|---|---|
| 写入准确率 | 应该记的有没有记？不该记的有没有乱记？ |
| 检索相关性 | 当前任务是否检索到相关记忆？ |
| 使用正确性 | 模型是否正确使用记忆，而不是机械套用？ |
| 更新能力 | 新信息是否覆盖旧记忆？ |
| 遗忘能力 | 用户删除后是否不再检索和使用？ |
| 安全性 | 是否保存敏感信息或被注入污染？ |
| 可解释性 | 是否能解释回答引用了哪条记忆？ |

## 测试集设计

### Should Remember

用户明确表达长期偏好，例如以后回答尽量用中文，并给出工程落地步骤。期望写入 preference，并在后续任务中使用。

### Should Not Remember

用户提出一次性需求，例如今天临时用英文写一封邮件。期望不要写入长期偏好。

### Update Memory

用户更新偏好时，旧记忆应变成 superseded，新记忆变成 active。

### Forget Memory

用户要求删除某条记忆后，检索和上下文都不应再包含它。

### Injection Memory

外部文档或网页试图让系统写入恶意记忆时，系统应拒绝。

## 指标

| 指标 | 说明 |
|---|---|
| memory write precision | 写入的记忆有多少是真的应该记 |
| memory write recall | 应该记的有多少被写入 |
| retrieval precision@k | 检索出的前 k 条有多少相关 |
| stale memory rate | 使用过期记忆的比例 |
| conflict resolution accuracy | 新旧冲突时是否选对 |
| forget compliance | 删除后是否完全不再使用 |
| sensitive memory leakage | 敏感记忆是否泄漏 |
| memory attribution rate | 回答中使用记忆是否可追溯 |

## Memory 与 RAG 的区别

| 维度 | Memory | RAG |
|---|---|---|
| 主要对象 | 用户偏好、项目状态、长期事实 | 外部知识文档 |
| 更新方式 | 对话和行为中增量更新 | 文档入库和版本管理 |
| 风险 | 隐私、过期、错误个性化 | 权限、引用、文档污染 |
| 评测重点 | 记忆是否该写、该用、该忘 | 召回、引用、答案忠实度 |

## 面试表达

> 我不会把 Agent Memory 只做成把对话写进数据库。长期记忆需要候选生成、证据校验、写入、检索、使用、更新和遗忘。每条记忆要有 type、source、confidence、status、sensitivity 和 expires_at。评测覆盖 should remember、should not remember、update、forget 和 injection 五类样本，指标包括 write precision、retrieval precision@k、stale memory rate、forget compliance 和 sensitive leakage。

## 相关链接

- [Memory / Persistence](/note/AI-Agent/memory)
- [长期记忆系统设计](/note/AI-Agent/long-term-memory)
- [Context Window 管理](/note/AI-Agent/context-window-management)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
