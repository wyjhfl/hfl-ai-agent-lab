# Agent Secret Management：Agent 密钥和凭证怎么治理

## 这篇文章解决什么问题

Agent 系统一旦接入工具、MCP Server、数据库、第三方 API 和企业内部系统，就会涉及大量密钥、Token、Cookie、OAuth 凭证和临时访问票据。很多 Demo 把密钥放在环境变量或配置文件里就结束了，但生产系统需要考虑：谁能用、能用多久、能访问什么、是否可撤销、是否进入 Trace、是否会被模型看到。

Agent Secret Management 的核心原则是：模型永远不应该直接看到真实密钥，工具执行层也只能拿到最小权限、最短生命周期、可审计的凭证。

## Secret 类型

| 类型 | 例子 | 风险 |
|---|---|---|
| 模型供应商 Key | OpenAI、Anthropic、Embedding API Key | 泄漏后造成成本和数据风险 |
| 工具服务 Token | GitHub、Notion、Slack、飞书、邮件服务 | 可能读取或修改外部业务数据 |
| 数据库凭证 | Postgres、Redis、Vector DB | 可能读写核心数据 |
| 用户授权 Token | OAuth access token、refresh token | 代表用户执行操作 |
| MCP Server 凭证 | server token、gateway token、session secret | 可能跨工具生态扩散风险 |
| 临时执行票据 | short-lived token、signed URL | 生命周期短但需要严格范围 |

## 基本架构

推荐把 Secret 分成 4 层：

1. Secret Store：存储真实密钥，例如 Vault、云厂商 Secret Manager 或加密数据库；
2. Policy Layer：判断当前 run、tenant、role、tool、risk_level 是否允许取用；
3. Token Broker：签发短期、最小权限的临时凭证；
4. Tool Executor：只在执行时拿凭证，执行后不写入模型上下文和普通日志。

模型看到的应该是工具能力描述和审批状态，而不是真实 secret。

## 最小权限设计

| 场景 | 不推荐 | 推荐 |
|---|---|---|
| 读取知识库 | 用全局数据库密码 | 按 tenant / workspace 签发只读 token |
| 调用第三方 API | 直接把用户 OAuth token 给模型 | 工具层持有 token，模型只生成操作意图 |
| 生成下载链接 | 永久公开 URL | 短期 signed URL + 权限校验 |
| MCP 工具调用 | 所有 server 共用一个 token | 按 server、tool、scope、run 签发 |
| 调试 Trace | 记录完整 header | 记录 hash、scope、过期时间和脱敏 metadata |

## Trace 和日志规则

Secret 相关日志必须遵守：

- 不记录明文 secret、access token、refresh token；
- 只记录 secret_id、scope、issuer、expires_at、hash 前缀；
- 错误堆栈中清洗 Authorization、Cookie、API Key；
- Prompt、RAG context、tool result 不得包含真实凭证；
- 回放工具调用时使用 mock secret 或重新授权；
- 审计日志记录谁在什么 run 中请求了什么 scope。

## 轮换和撤销

生产系统必须支持：

1. 定期轮换供应商 Key；
2. 用户撤销 OAuth 授权；
3. 某个 MCP Server 被禁用后立即失效相关 token；
4. 某个租户泄漏风险时批量撤销；
5. 事故后定位哪些 run 使用过相关 secret；
6. 灰度切换新 secret，不影响已有任务。

## 面试表达模板

> 我不会让模型直接接触真实密钥，而是把 Secret Store、Policy Layer、Token Broker 和 Tool Executor 分开。模型只生成操作意图，工具执行层按 tenant、role、tool、risk_level 签发短期最小权限 token。Trace 里只记录 secret_id、scope、expires_at 和 hash，不记录明文凭证，并支持轮换、撤销和事故追溯。

## 常见误区

### 误区一：环境变量就是 Secret 管理

环境变量只能解决本地配置问题，不能解决最小权限、审计、轮换、撤销和多租户隔离。

### 误区二：把 Token 放进 Prompt 让模型自己调用

模型上下文不可信，可能被注入、日志、回放或下游工具暴露。

### 误区三：只保护生产密钥

测试、预发、Demo、CI 中的密钥同样可能被提交、截图、日志或 Trace 泄漏。

## 相关链接

- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [Agent 审计日志设计](/note/Engineering/agent-audit-log-design)
