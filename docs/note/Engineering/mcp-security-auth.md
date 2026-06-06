# MCP 安全与授权：不要把工具协议当成可信边界

## 这篇文章解决什么问题

MCP 让 Agent 更容易接入外部工具、资源和提示词，但协议接入不等于安全。一个 MCP Server 可能暴露文件、数据库、浏览器、内部 API 或生产系统，如果缺少授权和审计，Agent 的一次错误工具调用就可能造成真实副作用。

MCP 安全的核心观点：MCP 是连接协议，不是信任边界。真正的安全边界要由 Host、Gateway、权限策略、审批、沙箱和审计共同建立。

## MCP 风险地图

| 风险 | 示例 | 控制方式 |
|---|---|---|
| 工具越权 | 普通用户调用管理员工具 | role / scope / tenant filter |
| 数据泄漏 | 读取不属于当前租户的资源 | resource ACL、metadata filter |
| 危险副作用 | 删除文件、发邮件、写生产库 | approval、idempotency、dry-run |
| Prompt Injection | 工具返回诱导模型忽略规则 | 结果降权、内容隔离 |
| Secret 泄漏 | token 暴露给模型上下文 | secret boundary、结果脱敏 |
| Schema 欺骗 | Server 返回变化后的危险 schema | schema pinning、版本校验 |
| 供应链风险 | 安装不可信 MCP Server | allowlist、签名、review |
| 审计缺失 | 不知道谁调了什么工具 | call log、trace、result digest |

## 最小权限模型

MCP 工具权限至少应该包含：

- user_id：谁在发起任务。
- tenant_id / workspace_id：属于哪个租户和工作区。
- role：用户角色。
- task_type：当前任务类型。
- tool_scope：工具允许访问的数据范围。
- risk_level：工具风险等级。
- environment：dev、staging、production。

模型不应该自己判断权限。模型只能提出 tool_call 意图，真正权限判断必须在系统层完成。

## Scope 设计

| Scope | 示例 |
|---|---|
| read:docs | 读取当前 workspace 文档 |
| read:tickets | 查询工单 |
| write:tickets | 创建或更新工单 |
| send:email | 发送邮件 |
| exec:shell | 执行命令 |
| admin:users | 管理用户 |

scope 应该细到业务动作，而不是只有 read/write 两类。

## 高风险工具默认策略

| 风险等级 | 策略 |
|---|---|
| L0 | 只读、公开数据，可自动执行 |
| L1 | 只读、租户内数据，需要权限过滤 |
| L2 | 写入低风险业务对象，需要幂等和审计 |
| L3 | 外发消息、修改关键数据，需要人工审批 |
| L4 | shell、付款、删除、生产变更，默认禁用或强审批 |

## Secret Boundary

不要把 API token、数据库密码、OAuth refresh token 放进模型上下文。Secret 应该只存在于 MCP Gateway 或受控工具执行层。模型只看到工具描述和参数 schema，看不到凭证。

## 工具结果脱敏

工具返回结果进入模型前要做 sanitizer：

- 去除 token、cookie、Authorization header。
- 对手机号、邮箱、身份证等做脱敏。
- 大结果只返回摘要和 result_digest。
- 标记外部内容为 untrusted evidence。

## Schema Pinning

MCP Server 的工具 schema 可能升级。生产环境建议对关键工具做 schema pinning：Agent 本轮使用的 schema_version 必须和 Gateway 审核过的版本一致。schema 变化要进入变更审查和回归测试。

## 审计日志

每次工具调用至少记录：

```text
call_id
run_id
step_id
user_id
tenant_id
server_id
tool_id
schema_version
args_hash
approval_id
status
duration_ms
error_type
result_digest
```

日志中不要保存完整敏感参数，可以保存 hash、摘要和脱敏字段。

## 红队样本

- 用户诱导 Agent 调用管理员工具。
- RAG 文档要求 Agent 读取其他租户数据。
- MCP 工具返回中包含“忽略系统指令”。
- 工具 schema 升级后新增危险参数。
- 低权限用户尝试执行 shell。
- 高风险工具绕过 approval。

这些样本应该进入 adversarial eval 和 regression gate。

## 面试表达

> 我不会把 MCP 协议本身当成安全边界。MCP 只是工具和资源接入方式，真正的安全要在 Host 或 Gateway 层实现。我的设计会按 user、tenant、role、task_type、scope、risk_level 过滤工具；高风险工具需要 approval 和 idempotency；secret 不进入模型上下文；工具结果要脱敏并标记为非可信证据；每次调用记录 server_id、tool_id、schema_version、args_hash、approval_id 和 result_digest。这样即使模型被注入诱导，也不能越过系统层权限。

## 相关链接

- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [MCP Client 工程化](/note/Engineering/mcp-client-engineering)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent 红队演练](/note/Engineering/agent-red-team-playbook)
