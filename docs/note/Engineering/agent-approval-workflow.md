# Agent Approval Workflow：高风险工具调用如何做审批闭环

## 这篇文章解决什么问题

很多 Agent 项目在 Demo 阶段会把“工具调用”做得很顺：模型决定调用什么工具，系统执行工具，然后把结果返回给模型。但一旦工具会改数据库、发邮件、创建工单、执行命令、调用支付、读写客户资料，问题就变成：**哪些动作可以自动执行，哪些动作必须审批，审批前后如何保留证据，审批失败后任务如何恢复**。

Agent Approval Workflow 的目标不是让所有动作都变慢，而是把高风险动作从“模型一句话直接执行”变成“模型提出计划、系统校验风险、用户或运营审批、执行层硬约束、Trace 可审计”的闭环。

## 什么时候需要审批

审批不是为了装流程，而是为了控制不可逆或高影响操作。

| 场景 | 是否建议审批 | 原因 |
|---|---|---|
| 只读查询公开资料 | 通常不需要 | 风险低，失败可重试 |
| 查询租户内业务数据 | 视权限而定 | 需要 tenant / role 校验 |
| 写入草稿、生成报告 | 可自动执行 | 可以撤销，影响有限 |
| 发送外部邮件、通知客户 | 建议审批 | 可能造成误触达 |
| 创建、关闭、升级工单 | 建议审批或规则审批 | 影响业务流程 |
| 修改数据库、删除文件 | 必须审批 | 高风险、可能不可逆 |
| 执行 shell、部署、迁移 | 必须强审批 | 安全和生产风险高 |
| 跨系统调用支付、合同、权限 | 必须多级审批 | 合规、财务和权限风险 |

一个可上线 Agent 不能只依赖提示词说“危险操作前要问用户”，而要在工具执行层强制检查审批状态。

## 审批工作流分层

| 层 | 责任 |
|---|---|
| 模型层 | 生成意图、解释理由、提出候选动作 |
| Policy 层 | 根据工具、租户、角色、参数、数据等级判断风险 |
| 审批层 | 收集审批人、审批理由、过期时间和决策 |
| 执行层 | 只执行已授权、未过期、参数一致的动作 |
| Trace 层 | 记录提议、风险、审批、执行和结果 |
| 评测层 | 回放审批绕过、参数篡改和误拒绝样本 |

关键点是：模型只能“提议”，不能自己证明自己安全。审批状态必须由系统保存并由执行层验证。

## 数据模型建议

可以把审批建模成独立资源，而不是散落在任务状态里。

| 表 / 对象 | 字段 |
|---|---|
| approval_request | approval_id、run_id、step_id、tool_name、risk_level、requested_by、tenant_id、status |
| approval_snapshot | tool_args_hash、tool_args_preview、evidence_ids、policy_version、prompt_version |
| approval_decision | approver_id、decision、reason、decided_at、expires_at |
| execution_guard | approval_id、args_hash、executed_at、executor、result_status |

最重要的是保存 tool_args_hash。审批通过的是某一次具体参数，而不是“允许模型以后任意调用这个工具”。如果审批后参数发生变化，必须重新审批。

## 状态机设计

一个高风险工具调用可以按下面状态推进：

1. Proposed：模型提出工具调用。
2. PolicyChecking：系统判断风险等级和审批策略。
3. WaitingApproval：等待用户、运营或管理员审批。
4. Approved：审批通过，记录有效期和参数哈希。
5. Rejected：审批拒绝，任务进入替代路径或结束。
6. Executing：执行层校验审批后调用工具。
7. Executed：执行完成，记录结果。
8. Expired：审批超时，需要重新发起。
9. Revoked：审批被撤销，禁止执行。

Agent 主任务状态可以进入 WaitingApproval，同时前端展示审批卡片：动作摘要、风险原因、参数预览、影响范围、可选按钮。

## 审批卡片应该展示什么

审批 UI 不应该只显示“Agent 想调用工具，是否同意”。它至少应该展示：

- 任务目标：这次工具调用服务于什么任务。
- 工具名称：调用哪个工具，工具风险等级是什么。
- 参数摘要：将修改什么资源、影响哪些对象。
- 数据来源：模型依据哪些证据生成这个动作。
- 风险解释：为什么需要审批。
- 替代方案：拒绝后系统会怎么做。
- 有效期：审批多久内有效。
- 审计信息：审批人、审批时间、审批理由。

如果是写操作，还应展示“执行前 diff”或“预览结果”。例如发送邮件前展示收件人、主题、正文、附件；关闭工单前展示工单号、原因和影响。

## 执行层硬约束

工具执行层必须做硬校验：

~~~python
if tool.risk_level in {"high", "critical"}:
    approval = approval_store.get(approval_id)
    assert approval.status == "approved"
    assert approval.tool_name == tool.name
    assert approval.tenant_id == request.tenant_id
    assert approval.args_hash == hash_args(request.args)
    assert approval.expires_at > now()
~~~

这段校验不能只放在 Prompt，也不能只放在前端。因为模型可能被 Prompt Injection 诱导，前端也可能被绕过，真正的边界必须在服务端执行层。

## 审批策略配置

审批策略建议由 Control Plane 管理：

| 策略 | 示例 |
|---|---|
| risk_level | read=auto、write=approval、delete=multi_approval |
| role_policy | viewer 只能读，operator 可审批普通写，admin 可审批高风险 |
| tenant_policy | 企业租户可自定义审批人和阈值 |
| amount_policy | 金额、数量、影响用户数超过阈值升级审批 |
| time_policy | 夜间、节假日、发布冻结期提高审批等级 |
| tool_policy | 某些工具永远需要人工确认 |

不要把审批规则写死在工具函数里，否则后续很难按租户、业务线和风险等级调整。

## Trace 记录

每次审批都要进入 Trace：

| 事件 | 内容 |
|---|---|
| tool.proposed | 模型提出的工具、参数、理由 |
| policy.checked | 风险等级、命中的策略、是否需要审批 |
| approval.requested | 审批卡片摘要、审批人范围、过期时间 |
| approval.decided | 通过 / 拒绝、审批人、理由 |
| tool.executed | 执行结果、耗时、错误 |
| approval.bypassed_blocked | 发现绕过尝试并拦截 |

这些 Trace 可以用于事故复盘、合规审计和回归测试。

## 测试清单

上线前至少覆盖这些测试：

- 高风险工具无审批时不能执行。
- 审批通过后参数变化不能执行。
- 审批过期后不能执行。
- 租户 A 的审批不能用于租户 B。
- viewer 不能审批 write / delete 工具。
- Prompt Injection 诱导“跳过审批”会被拦截。
- 审批拒绝后任务能进入替代路径。
- 审批 Trace 能完整还原决策过程。

## 面试表达模板

我不会让 Agent 直接执行高风险工具，而是把工具调用拆成“模型提议、策略判断、人工审批、执行层校验、Trace 审计”五步。审批通过的是某一次具体参数，因此我会保存工具参数哈希和审批有效期，执行时再次校验 tenant、role、tool、args_hash 和 expires_at。这样即使模型被注入诱导，也无法绕过服务端审批边界。

## 常见误区

### 误区一：只要 Prompt 写“危险操作前询问用户”就够了

不够。Prompt 是软约束，执行层校验才是硬边界。

### 误区二：审批就是弹一个确认框

审批卡片必须有动作摘要、参数预览、风险原因、证据来源和审计记录，否则用户无法做有效判断。

### 误区三：审批通过后参数可以继续改

不可以。审批绑定的是具体参数哈希，参数变化必须重新审批。

## 相关链接

- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
