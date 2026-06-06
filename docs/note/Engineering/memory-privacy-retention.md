# Memory Privacy Retention：Agent 记忆的隐私和留存怎么设计

## 这篇文章解决什么问题

长期记忆能让 Agent 更个性化，但也会带来隐私风险：不该记的内容被记住、敏感信息进入 Memory、用户要求删除但系统仍然检索到、旧偏好长期影响新任务、跨租户记忆泄漏。

Memory Privacy Retention 的目标是让 Agent 记忆可解释、可授权、可过期、可删除、可评测。

## 记忆分类

| 类型 | 例子 | 策略 |
|---|---|---|
| 用户偏好 | 语言风格、输出格式 | 可记，用户可编辑 |
| 项目事实 | 项目名称、技术栈、约束 | 需要来源和更新时间 |
| 敏感信息 | 身份证、手机号、密钥、健康信息 | 默认不记或脱敏后记 |
| 临时上下文 | 本次任务中间状态 | session 结束后过期 |
| 推断信息 | 模型猜测的用户画像 | 默认不写入长期记忆 |
| 安全标记 | 用户拒绝、权限、风险偏好 | 需要明确用途和保留期 |

## 写入门禁

记忆写入前要经过：

1. should_remember 判断；
2. PII / secret 检测；
3. 用户授权或产品策略；
4. 来源证据绑定；
5. retention policy；
6. memory confidence；
7. 可编辑和可删除记录。

模型不能因为一句话就把所有内容写入长期记忆。

## Retention Policy

| 策略 | 说明 |
|---|---|
| session-only | 会话结束后删除 |
| fixed ttl | 7 天、30 天、180 天后过期 |
| until changed | 用户偏好直到用户修改 |
| project lifetime | 项目结束或归档后过期 |
| legal / compliance | 按法规和企业策略保留 |
| user deletion | 用户请求删除后立即不可检索 |

## 删除和遗忘

真正的遗忘不只是从 UI 隐藏：

- 从 memory store 删除或标记 deleted；
- 从向量索引删除或更新 metadata；
- 失效 semantic cache；
- 后续 context builder 不再读取；
- eval case 验证 should_not_remember；
- audit 记录 deletion request，但不保留敏感明文。

## 评测样本

| 样本 | 检查 |
|---|---|
| should remember | 用户明确偏好是否被正确记住 |
| should not remember | 敏感或临时内容是否未写入 |
| update memory | 新偏好是否覆盖旧偏好 |
| forget request | 删除后是否无法检索和使用 |
| stale memory | 过期记忆是否不再影响回答 |
| cross tenant | A 租户记忆是否不会影响 B 租户 |
| injection | 外部文档是否不能诱导写入假记忆 |

## 面试表达模板

> 我不会把长期记忆做成简单的聊天记录向量库，而是设计 should_remember 门禁、PII/secret 检测、来源证据、retention policy、用户可编辑删除和遗忘评测。删除时不仅 UI 隐藏，还要处理 memory store、向量索引、缓存和 context builder，确保后续任务不会继续使用旧记忆。

## 常见误区

### 误区一：记得越多越智能

记错、记敏感、记过期，比不记更危险。

### 误区二：删除只是前端不展示

如果向量索引或缓存还在，模型仍可能用到已删除记忆。

### 误区三：外部内容也能写入长期记忆

RAG 文档、网页和工具结果属于不可信输入，不能直接诱导写入用户记忆。

## 相关链接

- [长期记忆系统设计](/note/AI-Agent/long-term-memory)
- [Agent Memory 评测](/note/Engineering/memory-evaluation-for-agents)
- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
- [LLM 数据治理](/note/Engineering/llm-data-governance)
- [Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing)
