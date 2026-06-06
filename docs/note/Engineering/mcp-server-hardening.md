# MCP Server Hardening：把 MCP 工具服务做稳做安全

## 这篇文章解决什么问题

MCP Server 让外部工具、资源和上下文更容易接入 Agent。但“能接入”不等于“能上线”。一个 MCP Server 如果没有 schema 约束、权限边界、超时控制、错误映射、审计日志和安全测试，就可能成为 Agent 系统里最危险的部分。

MCP Server Hardening 的目标是：把 MCP Server 从“能被模型调用的脚本”升级成“可授权、可限流、可审计、可测试、可降级的工具服务”。

## MCP Server 风险地图

| 风险 | 示例 |
|---|---|
| 参数注入 | 模型把恶意路径、SQL、命令拼进参数 |
| 权限绕过 | 用户通过工具读取不属于自己的数据 |
| 数据泄漏 | 工具返回过多字段、密钥、内部路径 |
| 危险副作用 | 写文件、删数据、发通知、执行命令 |
| Schema 漂移 | 工具参数变了，Client 仍按旧 schema 调用 |
| 超时和资源耗尽 | 工具卡住导致 Agent 任务阻塞 |
| 错误不可解释 | Server 抛异常，Agent 无法做恢复 |
| 供应链风险 | 第三方工具更新后行为变化 |

这些风险不能只靠“模型会听话”解决，必须在 Server 侧做硬约束。

## 工具分级

MCP Server 内每个工具都应该有风险等级。

| 等级 | 示例 | 默认策略 |
|---|---|---|
| low | 读取公开配置、格式转换 | 可自动执行 |
| medium | 查询租户内数据、读取文档 | 需要权限和审计 |
| high | 写入业务状态、发送通知 | 需要审批 |
| critical | 删除、执行命令、生产变更 | 多级审批或默认禁用 |

风险等级应该写进工具元数据，并被 MCP Client / Gateway 读取，用于权限过滤和审批策略。

## 输入参数校验

不要相信模型生成的参数。

需要校验：

- 必填字段是否存在。
- 类型、枚举、长度、正则是否满足。
- 路径是否在允许目录内。
- URL 是否在允许域名内。
- SQL 是否只读、是否带 tenant 过滤。
- 数量、金额、时间范围是否超过阈值。
- user_id、tenant_id 是否来自系统上下文，而不是模型参数。

特别注意：tenant_id、user_id、role 这类安全字段不应该让模型自由填写，应由服务端注入。

## 输出最小化

工具返回给模型的内容越多，泄漏风险越高。

输出建议：

- 默认只返回任务需要的字段。
- 去掉密钥、token、内部路径、堆栈、原始 SQL。
- 大文件返回摘要和引用 ID，不直接返回全文。
- 错误信息做脱敏和分类。
- 对敏感字段做 mask。

如果模型只需要“工单是否存在”，就不要返回完整客户资料。

## 超时、重试和取消

MCP 工具必须有执行边界：

| 控制项 | 建议 |
|---|---|
| timeout | 每个工具配置最大执行时间 |
| retry | 只对可重试错误重试 |
| cancellation | Agent 任务取消时能停止工具执行 |
| concurrency | 按工具和租户限制并发 |
| rate limit | 防止模型循环调用压垮外部系统 |
| circuit breaker | 连续失败时暂停工具 |

没有超时的工具会拖垮整个 Agent Runtime。

## 错误映射

MCP Server 不应该把原始异常直接抛给模型。建议统一错误结构：

| 字段 | 说明 |
|---|---|
| error_code | PERMISSION_DENIED、INVALID_ARGS、TIMEOUT |
| retryable | 是否可重试 |
| user_visible_message | 可以展示给用户的安全信息 |
| developer_message | 给开发者看的脱敏诊断 |
| trace_id | 关联后端日志 |
| remediation | 建议下一步动作 |

这样 Agent 才能根据错误类型决定重试、改参数、请求审批、降级或转人工。

## 审计日志

MCP Server 至少记录：

- who：哪个用户、租户、Agent、run_id。
- what：调用哪个 tool、schema version。
- why：模型给出的调用理由或上游 step。
- input：脱敏参数摘要和 hash。
- output：结果状态、数量、摘要。
- risk：风险等级、是否审批。
- when：开始时间、结束时间、耗时。
- result：成功、失败、被拦截、超时。

这些日志要和 Agent Trace 对齐，否则事故发生后很难复盘。

## Schema 版本管理

MCP 工具 schema 需要版本：

- tool_name 不轻易变。
- schema_version 显式记录。
- 新增可选字段可以兼容。
- 删除字段、改类型、改语义属于 breaking change。
- Client / Gateway 做 schema diff。
- 生产环境可 pin 某个 schema version。

如果 Server 更新 schema 后 Client 没有感知，模型可能继续按旧参数调用，导致错误或危险行为。

## 安全测试清单

上线前至少测试：

- invalid args 是否被拒绝。
- 越权 tenant_id 是否被服务端覆盖或拒绝。
- 路径穿越是否被拦截。
- SSRF / 外部 URL 是否被 allowlist 限制。
- Prompt Injection 诱导工具泄漏是否失败。
- 高风险工具无审批是否不能执行。
- 超时工具是否被取消。
- Server 异常是否脱敏。
- Schema diff 是否被发现。
- 审计日志是否能还原一次调用。

## 面试表达模板

我会把 MCP Server 当成生产工具服务来治理，而不是简单暴露函数。每个工具都有 schema version、risk_level、权限策略、timeout、rate limit 和审计日志。tenant_id、user_id 由服务端上下文注入，不信任模型参数。错误返回统一映射成可重试、不可重试、需审批、需人工接管等类型，并和 Agent Trace 关联。这样 MCP 接入后既能扩展工具生态，也不会放大安全风险。

## 常见误区

### 误区一：MCP Server 能跑就算完成

能跑只是第一步。能被安全调用、能审计、能降级才适合上线。

### 误区二：工具参数由模型生成，所以错了也是模型问题

执行层必须校验参数。模型输出不是可信输入。

### 误区三：Server 只需要本地测试

还要做 Client contract test、Gateway policy test、注入样本和 schema diff 测试。

## 相关链接

- [MCP Server](/note/Engineering/mcp-server)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Client 测试](/note/Engineering/mcp-client-testing)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
