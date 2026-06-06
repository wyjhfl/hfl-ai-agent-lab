# Tool Risk Classification：Agent 工具风险分级怎么设计

## 这篇文章解决什么问题

Agent 一旦能调用工具，就不再只是生成文本。它可能读文件、查数据库、发邮件、创建工单、执行命令、修改配置、调用支付或删除数据。不同工具的风险完全不同，不能都用同一套调用策略。

Tool Risk Classification 的目标是：给每个工具定义风险等级、权限边界、审批要求、审计字段和回滚策略。

## 风险等级建议

| 等级 | 特征 | 例子 | 默认策略 |
|---|---|---|---|
| R0 只读低风险 | 公开或低敏数据读取 | 查询公开文档、获取天气 | 可直接调用，记录 trace |
| R1 只读敏感 | 读取内部数据但无副作用 | 查客户信息、查成本账单 | 需要权限校验和脱敏 |
| R2 可逆写操作 | 有副作用但可回滚 | 创建草稿、生成报告、创建待审批任务 | 需要参数校验和审计 |
| R3 高影响操作 | 影响用户、业务或资金 | 发邮件、提交工单、修改配置 | 需要人工审批和执行层校验 |
| R4 危险操作 | 不可逆或高安全风险 | 删除数据、执行命令、转账、外发敏感文件 | 默认禁用或强审批 + 沙箱 |

## 工具注册字段

工具注册时建议记录 tool_id、version、risk_level、owner、allowed_roles、requires_approval、approval_policy、arg_schema_hash、side_effect、rollback_supported、audit_required、timeout_ms。

这些字段不要只写在 README 里，而要进入 Tool Registry、MCP Gateway 或 Agent Control Plane，成为运行时策略判断依据。

## 风险判断维度

| 维度 | 问题 |
|---|---|
| 数据敏感度 | 是否读取 PII、商业机密、合同、账单、代码？ |
| 副作用范围 | 是否会改变数据库、发消息、改配置、触发外部流程？ |
| 可逆性 | 操作失败或误执行后是否能回滚？ |
| 外部可见性 | 是否会通知客户、发送邮件、公开发布？ |
| 权限边界 | 是否跨租户、跨 workspace、跨系统？ |
| 成本影响 | 是否可能触发高成本 API、批量任务、长时间运行？ |
| 安全影响 | 是否能执行命令、访问网络、读取文件、调用高权接口？ |

## 调用策略

### R0 / R1

- 自动调用；
- 强制 schema 校验；
- 记录 tool_call_id；
- R1 必须做权限和脱敏。

### R2

- 自动生成草稿或待确认对象；
- 必须可幂等；
- 需要回滚或取消机制；
- 记录输入输出 hash。

### R3

- 模型只能提出操作建议；
- 策略层生成审批卡片；
- 人工审批后执行层重新校验参数 hash；
- 审计日志 append-only。

### R4

- 默认禁用；
- 仅在受控环境和白名单任务中开放；
- 需要双人审批、沙箱、最小权限和完整审计；
- 必须有演练和应急止血开关。

## 和 MCP 的关系

MCP Server 暴露工具时，也应该携带或映射风险信息。即使第三方 MCP Server 没有提供 risk_level，Client 或 Gateway 也要补一层本地 policy：

- 不信任工具描述中的“安全”声明；
- 对未知工具默认高风险；
- schema diff 后重新评估风险；
- 高风险工具必须经过 Gateway 审批和审计。

## 面试表达模板

> 我不会把所有工具都当成普通函数调用，而是按只读、敏感读取、可逆写、高影响写和危险操作做风险分级。模型只能提出调用意图，真正执行前由策略层校验角色、租户、参数、风险等级和审批状态，高风险工具还要记录 args hash 和审计事件，防止模型绕过审批直接执行。

## 常见误区

### 误区一：工具 schema 写清楚就安全

schema 只能约束参数格式，不能决定用户是否有权限、操作是否高风险、是否需要审批。

### 误区二：只按工具名判断风险

同一个工具在不同参数下风险可能不同。例如 export_report 导出公开统计是 R1，导出客户明细可能是 R3。

### 误区三：审批只在前端做

执行层必须重新校验审批状态和参数 hash，否则模型或调用方可能绕过前端直接调用接口。

## 相关链接

- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
