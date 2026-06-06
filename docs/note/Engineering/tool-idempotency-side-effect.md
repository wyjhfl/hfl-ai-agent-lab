# Tool Idempotency Side Effect：Agent 工具幂等和副作用怎么设计

## 这篇文章解决什么问题

Agent 调用工具时，失败重试、回放、网络超时、用户重复点击、模型重复规划都可能导致同一个操作执行多次。如果工具是只读查询，问题不大；但如果工具会发消息、创建工单、扣费、删除数据、修改配置，就必须设计幂等和副作用边界。

Tool Idempotency Side Effect 的目标是让工具调用可重试、可回放、可审计，同时避免重复副作用。

## 副作用分类

| 类型 | 例子 | 策略 |
|---|---|---|
| no side effect | 查询公开数据 | 可自动重试 |
| local reversible | 创建草稿、临时文件 | 可回滚、可覆盖 |
| business reversible | 创建工单、更新状态 | 需要幂等键和补偿 |
| external visible | 发邮件、发消息、通知客户 | 需要审批和去重 |
| irreversible | 删除数据、转账、执行命令 | 默认禁用或强审批 |

## 幂等键设计

工具调用应生成 idempotency_key，至少包含：

- tenant_id；
- user_id 或 actor；
- run_id；
- tool_id；
- args_hash；
- business_target；
- operation_type；
- time_window。

对于外部可见动作，幂等键不能只用随机 UUID，否则重试时无法识别重复操作。

## 执行前检查

1. 参数 schema 校验；
2. tool risk classification；
3. 权限和租户校验；
4. 幂等键查重；
5. 审批状态和 args_hash 校验；
6. side_effect_policy 校验；
7. budget 和 rate limit 校验。

## 重试策略

| 错误 | 是否重试 | 原因 |
|---|---|---|
| 网络超时但未知是否执行 | 谨慎重试，先查幂等记录 | 可能已经产生副作用 |
| 4xx 参数错误 | 不重试 | 重试也不会成功 |
| 429 限流 | 延迟重试 | 需要 backoff 和预算 |
| 5xx 临时故障 | 可重试 | 需限制次数 |
| 审批缺失 | 不重试 | 进入 WaitingApproval |
| 幂等冲突 | 返回已有结果 | 不重复执行 |

## 面试表达模板

> 我不会让 Agent 工具随意重试。每个有副作用的工具都会定义 side_effect 类型和 idempotency_key，执行前校验权限、审批、args_hash 和幂等记录。遇到超时不会盲目重试，而是先查询操作是否已经生效，避免重复发消息、重复创建工单或重复扣费。

## 常见误区

### 误区一：工具失败就让模型再试一次

对有副作用工具，重试可能比失败更危险。

### 误区二：幂等只靠数据库唯一键

幂等键要表达业务目标和参数 hash，不能只靠自增 ID。

### 误区三：回放工具时忽略副作用

Run Replay 和 Tool Replay 默认应 mock 高风险副作用，live replay 必须重新审批。

## 相关链接

- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
- [Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [Agent Run Replay](/note/Engineering/agent-run-replay)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
