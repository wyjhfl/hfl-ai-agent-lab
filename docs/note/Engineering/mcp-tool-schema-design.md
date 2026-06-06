# MCP Tool Schema 设计：让工具可发现、可控、可评测

## 这篇文章解决什么问题

很多 MCP Server Demo 只关注“能不能暴露一个工具”。但真实 Agent 平台更关心：工具能否被正确发现、参数是否清晰、风险是否可控、错误是否可恢复、输出是否能进入 Trace 和评测系统。

MCP Tool Schema 设计的目标是把工具从“一个函数”升级成“可治理能力”：有清晰语义、稳定参数、权限边界、风险等级、返回结构和测试样例。

## 好工具和坏工具的区别

| 类型 | 表现 | 后果 |
|---|---|---|
| 坏工具 | 名字模糊、参数随意、返回大段文本、错误不结构化 | 模型选错工具、参数乱填、前端无法展示、难以评测 |
| 好工具 | 名字明确、参数有限、输出结构化、错误可分类、风险可标注 | Agent 更容易正确调用，系统更容易审计和回归 |

工具 schema 是模型理解工具的入口，也是平台治理工具的入口。

## 工具命名原则

工具名应该描述能力，而不是描述内部实现。

| 不推荐 | 推荐 | 原因 |
|---|---|---|
| run | search_papers | run 太泛化 |
| process | extract_pdf_metadata | process 不知道处理什么 |
| call_api | create_support_ticket | 内部实现不重要，业务动作才重要 |
| db_query | query_user_accessible_documents | 需要体现权限边界 |

命名建议：动词 + 业务对象 + 限定条件。例如 search_workspace_documents、create_draft_email、summarize_selected_papers。

## 描述怎么写

工具描述要服务于模型决策。一个好描述应该说明：什么时候用、输入是什么、输出是什么、不能做什么。

推荐结构：

| 部分 | 示例 |
|---|---|
| 用途 | 在当前 workspace 中搜索用户有权限访问的论文或文档 |
| 适用场景 | 当用户需要基于已有资料回答、总结或引用时使用 |
| 限制 | 不会访问其他租户数据，不会返回全文，只返回候选证据摘要 |
| 输出 | 返回 document_id、title、snippet、score 和 permission_scope |

描述不要写成营销文案，也不要依赖隐含知识。模型只能根据 schema 和上下文选择工具。

## 参数设计原则

参数越自由，模型越容易填错。参数应该尽量结构化、枚举化、可校验。

| 原则 | 说明 |
|---|---|
| 少而明确 | 只暴露必要参数，内部可推导的不要让模型填 |
| 类型严格 | 字符串、数字、布尔、数组、枚举都要明确 |
| 范围有限 | limit、date_range、risk_level 要有边界 |
| 默认安全 | 默认只读、默认当前租户、默认最小返回量 |
| 避免万能参数 | 不要设计 raw_sql、shell_command、free_form_action 这类高风险参数 |

示例参数表：

| 参数 | 类型 | 说明 | 风险 |
|---|---|---|---|
| query | string | 用户问题或检索关键词 | 低 |
| workspace_id | string | 当前工作区，由系统注入，不建议模型自由填写 | 中 |
| limit | integer | 返回数量，建议 1-10 | 低 |
| document_types | enum array | paper、ticket、doc、note | 低 |
| include_archived | boolean | 是否包含归档文档，默认 false | 中 |

## 系统注入参数和模型参数分离

一个重要原则：不是所有参数都应该由模型填写。

| 参数来源 | 示例 |
|---|---|
| 模型填写 | query、summary_style、date_range |
| 系统注入 | tenant_id、user_id、workspace_id、request_id |
| 策略决定 | max_limit、allowed_tools、risk_level |
| 人工审批 | send_email、delete_file、charge_account |

租户、用户、权限、额度、风险等级这类字段应该由系统注入或策略层决定，不能让模型自己声明。

## 输出结构设计

工具输出不要只返回自然语言。建议返回结构化对象，方便前端展示、Trace、评测和后续步骤消费。

| 字段 | 作用 |
|---|---|
| status | success、partial、empty、error |
| data | 业务数据列表或对象 |
| evidence | 可引用证据、来源、时间 |
| warnings | 权限截断、结果不完整、数据过期 |
| next_actions | 可选的后续动作建议 |
| error | 结构化错误信息 |
| trace | tool_call_id、latency、source、cache_hit |

RAG 检索工具尤其要返回证据 ID、片段、分数和权限范围，而不是只返回拼接后的文本。

## 错误结构设计

工具错误要能被 Agent 决策，而不是只给一段异常字符串。

| 错误类型 | Agent 应该怎么做 |
|---|---|
| invalid_args | 修复参数后重试 |
| permission_denied | 停止调用并解释权限不足 |
| rate_limited | 等待或降级 |
| timeout | 可重试或转人工 |
| not_found | 询问用户补充信息或返回无结果 |
| external_service_error | 降级、稍后重试、记录告警 |
| unsafe_action_blocked | 不执行，进入审批或拒绝 |

结构化错误能显著提升 Agent 的恢复能力。

## 风险等级和审批策略

工具应该有风险标签。风险等级不是写给模型看的装饰，而是策略层控制执行的依据。

| 风险等级 | 示例 | 策略 |
|---|---|---|
| read_low | 搜索公开文档、读取当前任务状态 | 可自动执行 |
| read_sensitive | 读取用户私有文档、客户工单 | 需要权限过滤和审计 |
| write_low | 创建草稿、保存分析结果 | 可自动执行但要记录 |
| write_high | 发送邮件、创建工单、修改客户数据 | 需要人工审批或强策略 |
| destructive | 删除文件、取消订单、批量修改权限 | 默认禁止或强审批 |

MCP Gateway 或 Tool Registry 应该根据风险等级、租户、角色和上下文决定是否放行。

## Schema 版本管理

工具 schema 一旦被 Agent、测试和前端依赖，就不能随意修改。

建议：

- 为每个工具设置 tool_id 和 schema_version。
- 新增可选字段通常是兼容变更。
- 删除字段、改类型、改含义属于破坏性变更。
- 破坏性变更需要新版本工具或迁移窗口。
- 每个版本都要保留示例输入、示例输出和回归测试。

面试中可以说：我把 MCP 工具当成外部契约管理，而不是随手暴露函数。schema 改动要像 API 改动一样走版本和回归测试。

## 测试清单

| 测试 | 检查点 |
|---|---|
| Schema Test | 参数类型、必填字段、枚举和默认值 |
| Happy Path | 正常输入能返回结构化结果 |
| Invalid Args | 错误参数能返回 invalid_args |
| Permission Test | 越权租户、越权 workspace 被拒绝 |
| Empty Result | 无结果时返回 empty 而不是异常 |
| Timeout Test | 超时能被分类和记录 |
| Prompt Injection Test | 工具返回内容中的恶意指令不会被当成系统指令 |
| Trace Test | tool_call_id、latency、error_type 完整记录 |

工具测试不只是测函数，还要测模型是否能根据描述正确选择工具。

## 面试表达模板

我设计 MCP 工具时会把 schema 当成契约，而不是只暴露函数。工具名要体现业务能力，描述要说明适用场景和限制，参数要尽量枚举化和可校验，租户、用户、权限这类字段由系统注入。输出要结构化，包含 status、data、evidence、warnings、error 和 trace。高风险工具会标注 risk_level，并由策略层或人工审批控制执行。

## 常见误区

### 误区一：工具越通用越好

万能工具会让模型承担太多决策，也会放大安全风险。生产系统更适合小而清晰的工具。

### 误区二：返回文本最简单

返回文本适合人读，不适合系统消费。结构化输出才能支持前端渲染、自动评测和后续工具调用。

### 误区三：权限写在 Prompt 里就够了

权限必须在工具执行层和网关层校验。Prompt 只能提醒模型，不能作为安全边界。
