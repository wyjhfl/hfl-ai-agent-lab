# Agent Audit Log Design：AI Agent 审计日志怎么设计

## 这篇文章解决什么问题

Agent 系统一旦接入真实业务，就会产生一个经典问题：**出了问题以后，怎么证明是谁、在什么时候、基于什么输入、调用了什么模型和工具、看到哪些证据、产生了什么结果**。

普通应用日志通常只记录接口请求和错误堆栈，但 Agent 系统还需要记录 Prompt、模型版本、RAG 证据、工具调用、审批决策、策略版本和输出结果。否则线上问题只能靠猜，合规审计也无法回答。

Agent Audit Log 的目标是建立一套“可追踪、可脱敏、可查询、不可随意篡改”的审计记录。

## Audit Log 和 Trace 的区别

| 类型 | 关注点 | 典型读者 |
|---|---|---|
| Trace | 调试一次 Agent 执行过程 | 开发、运维、评测人员 |
| Audit Log | 证明关键行为发生过且可追责 | 安全、合规、管理员、客户 |
| Metrics | 聚合指标和趋势 | 运营、SRE、产品 |
| Event Log | 状态变化和业务事件 | 后端、工作流系统 |

Trace 偏工程调试，Audit Log 偏证据与责任。两者可以共享 run_id，但字段和保留策略不同。

## 审计对象

Agent 审计至少覆盖这些对象：

| 对象 | 需要记录什么 |
|---|---|
| 用户请求 | user_id、tenant_id、role、入口、请求摘要 |
| Prompt | prompt_version、变量摘要、策略版本 |
| 模型调用 | model、route、tokens、成本、延迟、输出摘要 |
| RAG 证据 | document_id、chunk_id、ACL、citation、knowledge_version |
| 工具调用 | tool_name、schema_version、参数 hash、风险等级、结果 |
| MCP 调用 | server_id、tool_id、scope、schema_version、错误映射 |
| 审批 | approver、decision、reason、args_hash、expires_at |
| 安全策略 | 命中的策略、拦截原因、risk_level |
| 输出交付 | answer_hash、交付渠道、是否人工修改 |

不要把完整敏感内容直接写入审计日志。审计日志要能追踪事实，但也要避免二次泄漏。

## 字段设计

建议每条审计事件包含：

| 字段 | 说明 |
|---|---|
| audit_id | 全局唯一 ID |
| event_type | user.requested、tool.executed、approval.decided 等 |
| run_id | Agent 执行 ID |
| step_id | 步骤 ID |
| tenant_id | 租户 |
| actor_type | user、agent、system、admin |
| actor_id | 操作者 |
| target_type | document、tool、approval、model、ticket |
| target_id | 被操作对象 |
| action | read、write、execute、approve、reject、export |
| risk_level | low、medium、high、critical |
| policy_version | 策略版本 |
| input_hash | 输入摘要 hash |
| output_hash | 输出摘要 hash |
| metadata | 脱敏后的结构化信息 |
| created_at | 事件时间 |

审计日志要结构化，不能只是一段自然语言，否则后续很难查询和做合规报告。

## 内容脱敏策略

审计日志常见误区是“为了追踪，把所有原文都记录下来”。这会让审计系统本身变成敏感数据仓库。

建议：

- 保存 hash，不保存完整原文。
- 保存摘要，不保存敏感字段。
- 对手机号、邮箱、身份证、token、密钥做 mask。
- 对 RAG 证据保存 document_id / chunk_id，而不是全文。
- 对工具参数保存安全摘要和 args_hash。
- 需要还原原文时，通过受控权限查询原始系统。

审计日志不是数据湖，不能无限制收集所有内容。

## 不可篡改性

对于高风险业务，可以增加防篡改设计：

| 方式 | 说明 |
|---|---|
| append-only | 审计日志只追加，不更新删除 |
| hash chain | 每条日志包含上一条 hash |
| WORM 存储 | 写入后不可修改 |
| 分离权限 | 业务管理员不能直接改审计日志 |
| 定期归档 | 按日归档并生成校验摘要 |
| 异地备份 | 防止单点丢失 |

个人项目不一定都实现，但面试时能讲清楚这些原则，会明显提升生产意识。

## 查询场景

审计日志要支持问题追踪：

- 某个用户过去 24 小时触发了哪些高风险工具？
- 某次错误答案使用了哪些文档和 Prompt 版本？
- 某个 MCP Server schema 更新后有哪些调用失败？
- 某个审批人批准了哪些 critical 操作？
- 某个租户是否发生跨租户访问拦截？
- 某次数据导出是谁发起、谁审批、导出了哪些对象？

如果审计日志无法回答这些问题，说明字段还不够结构化。

## 与隐私合规的关系

Audit Log 也要遵守数据治理：

- 明确保留周期。
- 支持按租户导出审计记录。
- 支持用户删除请求后的可追踪匿名化。
- 将审计日志访问纳入审计。
- 对敏感审计查询做审批。
- 区分运营日志、调试 Trace 和合规审计日志。

“为了合规而记录”不能变成“记录后无人治理”。

## 面试表达模板

我会把 Agent 审计日志和普通 Trace 区分开。Trace 用来调试一次执行过程，Audit Log 用来证明关键行为和责任边界。审计日志会记录 run_id、tenant_id、actor、action、target、risk_level、policy_version、tool schema version、input/output hash 和脱敏 metadata。高风险操作采用 append-only 或 hash chain，避免事后篡改。这样出了问题可以追踪到模型版本、Prompt、证据、工具、审批和输出交付链路。

## 常见误区

### 误区一：日志越多越好

审计日志不是把所有原文都存下来。记录太多会造成敏感数据二次泄漏。

### 误区二：Trace 等于 Audit

Trace 更偏调试，Audit 更偏合规和追责。两者字段和保留策略不同。

### 误区三：只记录失败

成功的高风险操作同样需要审计，因为合规问题常常发生在“操作成功但不该发生”。

## 相关链接

- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [LLM 数据治理](/note/Engineering/llm-data-governance)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [Agent 事故复盘模板](/topics/agent-incident-postmortem-template)
