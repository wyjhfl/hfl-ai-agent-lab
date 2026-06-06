# Agent 失败恢复与幂等设计：让长任务失败后能继续

## 这篇文章解决什么问题

生产级 Agent 和普通聊天机器人最大的区别之一，是它经常要执行长任务：

- 读取多个文件。
- 调用多个工具。
- 写数据库。
- 生成中间结果。
- 等待人工审批。
- 失败后继续执行。

如果没有失败恢复机制，Agent 一旦中途断掉，就只能让用户重来。更糟糕的是，重来可能重复发送邮件、重复创建工单、重复扣费、重复写入外部系统。

这篇文章关注 Agent 长任务的可靠性设计：状态机、幂等、重试、断点续跑、补偿和人工介入。

## Agent 失败的常见来源

| 失败来源 | 例子 | 风险 |
|---|---|---|
| 模型失败 | 超时、限流、输出不符合 schema | 任务停在中间 |
| 工具失败 | API 500、网络断开、权限不足 | 数据不一致 |
| 外部系统失败 | 数据库锁、第三方服务不可用 | 重试放大故障 |
| 用户中断 | 关闭页面、取消任务 | 状态不明确 |
| 人审延迟 | 审批迟迟不处理 | worker 被占用 |
| 代码部署 | 服务重启、worker 被杀 | 内存状态丢失 |
| 并发冲突 | 两个 worker 抢同一任务 | 重复执行 |

真实系统默认会失败。设计时不要假设一次执行成功。

## 核心原则

### 1. 状态必须持久化

不要把任务状态只放在内存里。最小状态模型：

| 表 / 对象 | 关键字段 |
|---|---|
| task | id、user_id、goal、status、created_at、updated_at |
| run | id、task_id、status、attempt、started_at、finished_at |
| step | id、run_id、name、status、input_hash、output_ref、error_type |
| tool_call | id、step_id、tool_name、args_hash、status、idempotency_key |
| approval | id、task_id、risk_level、status、reviewer、decision |

如果系统重启后无法从数据库恢复执行点，就不是可靠长任务 Agent。

### 2. 每个副作用动作必须有幂等键

副作用动作包括：

- 创建工单。
- 发送邮件。
- 写入 CRM。
- 扣减额度。
- 创建文件。
- 调用外部执行系统。

幂等键可以由任务、步骤、工具、参数哈希组成：

```text
idempotency_key = hash(task_id + step_name + tool_name + normalized_args)
```

工具执行前先查：

```text
if tool_call with same idempotency_key already succeeded:
  return previous_result
else:
  execute tool and persist result
```

### 3. 重试要分类

不是所有失败都应该重试。

| 错误类型 | 是否重试 | 处理 |
|---|---|---|
| 网络超时 | 可以 | 指数退避 |
| 429 限流 | 可以 | 等待 retry-after 或切模型 |
| 5xx | 可以 | 有上限重试 |
| 401 / 403 | 不应盲重试 | 刷新授权或提示用户 |
| schema 校验失败 | 可以少量修复 | 最多 1-2 次 |
| 参数错误 | 不应重试 | 回到规划或人工处理 |
| 高风险动作被拒绝 | 不应重试 | 标记终止或改方案 |

无限重试是线上事故来源。

### 4. Step 要小而可恢复

不要把整个任务写成一个巨大步骤：

```text
bad: run_agent_task()
```

应该拆成：

```text
1. parse_user_goal
2. retrieve_context
3. plan_steps
4. draft_tool_args
5. request_approval
6. execute_tool
7. verify_result
8. generate_summary
```

每个 step 都有输入、输出、状态和错误。这样失败后能从最近成功点继续。

## 状态机设计

一个通用任务状态机：

```text
PENDING
  -> RUNNING
  -> WAITING_APPROVAL
  -> RUNNING
  -> SUCCEEDED
  -> FAILED
  -> CANCELLED
  -> COMPENSATING
  -> PARTIAL_SUCCEEDED
```

关键点：

- `WAITING_APPROVAL` 不应该占用 worker。
- `CANCELLED` 后不能继续执行副作用工具。
- `PARTIAL_SUCCEEDED` 要告诉用户哪些动作已完成。
- `COMPENSATING` 用于撤销或修复部分副作用。

## 断点续跑流程

```text
worker starts
  -> claim pending/runnable task
  -> load latest run state
  -> find first non-success step
  -> check cancellation / approval
  -> execute step with idempotency key
  -> persist output
  -> move to next step
```

claim 任务时要避免并发 worker 重复执行：

- 数据库行锁。
- compare-and-swap 状态更新。
- lease / heartbeat。
- stale running 回收。

## 补偿设计

有些动作不能简单回滚，比如邮件已经发出。补偿不是撤销时间，而是做后续修复动作：

| 原动作 | 可能补偿 |
|---|---|
| 创建错误工单 | 关闭工单并写明原因 |
| 发错通知 | 发送更正通知 |
| 写入错误标签 | 创建修正记录 |
| 扣费失败后部分完成 | 标记人工审核 |
| 外部系统部分成功 | 生成 reconciliation 任务 |

设计工具时要记录是否可补偿：

```json
{
  "tool": "create_ticket",
  "side_effect": true,
  "idempotent": true,
  "compensating_tool": "close_ticket"
}
```

## 人工介入点

需要人工介入的情况：

- 高风险动作。
- 连续重试失败。
- 模型置信度低。
- 证据冲突。
- 权限不足。
- 外部系统返回不一致。

人工介入不是失败，而是可靠系统的一部分。参考：[Human-in-the-loop](/note/AI-Agent/human-in-the-loop)。

## Trace 里要记录什么

失败恢复离不开 Trace：

- 当前 task_status。
- 每个 step 的输入摘要和输出摘要。
- idempotency_key。
- retry_count。
- error_type。
- fallback_strategy。
- human_decision。
- resume_from_step。
- compensation_result。

没有 Trace，恢复只是猜测。

## 面试表达模板

> 我会把 Agent 长任务设计成可持久化状态机，而不是一次性内存循环。任务、运行、步骤、工具调用和审批都落库；每个副作用工具都有幂等键，避免重试时重复创建工单或重复发送消息。失败会按错误类型分类处理：网络、限流、5xx 可以指数退避；权限和参数错误不盲目重试；高风险动作进入人工审批。系统重启后 worker 可以从最近成功 step 继续执行，必要时进入补偿流程。所有重试、降级、审批和恢复点都会写入 Trace，便于审计和排查。

## 项目落地清单

- [ ] task/run/step/tool_call 表设计完成。
- [ ] 副作用工具有 idempotency_key。
- [ ] worker claim 有锁或 lease。
- [ ] running 超时任务可回收。
- [ ] step 输出持久化。
- [ ] retry 有分类和上限。
- [ ] approval 不占用 worker。
- [ ] cancellation 能阻止后续副作用。
- [ ] compensation 策略明确。
- [ ] Trace 能还原恢复过程。

## 相关链接

- [异步任务与长任务处理](/note/Engineering/async-task)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Human-in-the-loop](/note/AI-Agent/human-in-the-loop)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [生产级 Agent 治理清单](/topics/production-agent-governance-checklist)
