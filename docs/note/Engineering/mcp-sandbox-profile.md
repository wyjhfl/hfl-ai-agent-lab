# MCP Sandbox Profile：MCP 工具沙箱配置怎么设计

## 这篇文章解决什么问题

MCP Server 可能访问文件、网络、命令、浏览器、数据库和第三方 API。如果所有工具运行在同一权限环境里，一个工具被注入或供应链污染，就可能影响整个系统。

MCP Sandbox Profile 的目标是为不同工具定义可执行环境、文件边界、网络边界、命令权限、资源预算和审计规则。

## Profile 维度

| 维度 | 示例 |
|---|---|
| filesystem | 只读、临时目录、指定 workspace、禁止 home |
| network | 禁止网络、域名白名单、内网禁止、代理限制 |
| process | 禁止执行命令、允许固定二进制、超时限制 |
| secrets | 不注入 secret、只注入短期 token、scope 限制 |
| resource | CPU、内存、磁盘、并发、运行时长 |
| data | 输入输出大小限制、PII 扫描、结果脱敏 |
| audit | 记录文件访问、网络请求、命令、token scope |

## Profile 示例

| Profile | 适用工具 | 策略 |
|---|---|---|
| read_only_docs | 文档搜索 | 只读、无外网、无 secret |
| browser_limited | 浏览器自动化 | 域名白名单、截图脱敏、超时 |
| code_exec_safe | 代码运行 | 临时目录、无网络、资源限制 |
| api_write_approved | 外部写操作 | 短期 token、审批、审计 |
| admin_restricted | 高危管理工具 | 默认禁用、双人审批、强隔离 |

## 执行流程

1. Tool Registry 定义 tool_id 和 risk_level；
2. Gateway 根据 policy 选择 sandbox_profile；
3. Token Exchange 只签发匹配 profile 的 scope；
4. Executor 在沙箱内执行；
5. 记录文件、网络、命令和输出 hash；
6. 结果经过 output safety filter；
7. 异常触发 sandbox_blocked 或 policy_denied。

## 面试表达模板

> 我会为 MCP 工具设计 sandbox profile，而不是让所有 Server 共用同一个运行环境。不同 profile 控制文件、网络、进程、secret、资源和审计。例如代码执行工具默认无网络、临时目录和资源限制；外部写操作必须绑定短期 token、审批和审计。

## 常见误区

### 误区一：MCP 工具只要 schema 安全就够了

schema 只能约束参数，不能约束工具运行时访问文件、网络或命令。

### 误区二：所有工具共享同一环境

共享环境会放大供应链、注入和越权风险。

### 误区三：沙箱阻断不进入观测

sandbox_blocked 是重要安全信号，应进入 MCP observability 和告警。

## 相关链接

- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [MCP Token Exchange](/note/Engineering/mcp-token-exchange)
- [MCP Observability Metrics](/note/Engineering/mcp-observability-metrics)
- [MCP 供应链风险](/note/Engineering/mcp-supply-chain-risk)
