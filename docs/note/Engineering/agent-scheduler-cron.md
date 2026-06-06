# Agent Scheduler 与 Cron：定时任务型 Agent 怎么设计

## 这篇文章解决什么问题

很多 Agent 不只是被用户实时触发，还需要在固定时间或事件后自动运行：每天生成运营日报、每小时巡检知识库、每周跑评测集、每 10 分钟检查 MCP Server 健康、在用户提交工单后 30 分钟回访。

这类系统不能只靠一个 while true sleep。生产级 Agent Scheduler 要解决：任务定义、触发规则、去重、并发、租户隔离、失败重试、人工接管、Trace、成本预算和发布回滚。

## Scheduler 与普通队列的区别

| 组件 | 关注点 |
|---|---|
| Queue | 已经产生的任务如何排队和执行 |
| Scheduler | 什么时候产生任务、产生多少、是否跳过 |
| Worker | 具体执行任务 |
| Control Plane | 管理任务配置、预算、灰度和启停 |

Scheduler 是任务的“入口治理”。它决定哪些周期任务进入队列，以及进入队列前是否满足策略。

## 常见任务类型

| 类型 | 示例 |
|---|---|
| 定时报表 | 每天 9 点生成业务日报 |
| 周期巡检 | 每 5 分钟检查 MCP Server health |
| 延迟任务 | 用户提交后 30 分钟做跟进 |
| 批量评测 | 每晚跑一次 regression eval |
| 数据同步 | 每小时同步文档、CRM、工单数据 |
| 过期清理 | 清理过期审批、缓存、临时文件 |
| 监控触发 | 指标超过阈值后发起诊断 Agent |
| 运营提醒 | 高风险任务等待审批超过 SLA 后提醒 |

这些任务看似简单，但一旦多租户、多版本、多 worker 并发执行，就需要完整治理。

## 任务定义模型

| 字段 | 说明 |
|---|---|
| schedule_id | 调度配置 ID |
| tenant_id | 租户 |
| agent_id | 要触发哪个 Agent |
| trigger_type | cron、interval、delay、event |
| trigger_rule | cron 表达式或事件条件 |
| payload_template | 任务输入模板 |
| idempotency_key_template | 去重键模板 |
| enabled | 是否启用 |
| max_concurrency | 最大并发 |
| budget_policy | token、成本、执行时长预算 |
| retry_policy | 重试次数、退避、死信策略 |
| owner | 配置负责人 |
| release_stage | dev、staging、canary、prod |

定时任务也要有 owner。无人负责的周期任务最终会变成不可控成本和噪音。

## 幂等与去重

Scheduler 最大的问题之一是重复触发：服务重启、时钟漂移、多个 scheduler 实例同时扫描，都可能产生重复任务。

建议使用幂等键：

~~~text
idempotency_key = tenant_id + schedule_id + window_start + payload_hash
~~~

任务入队时对幂等键做唯一约束。如果已经存在同一窗口任务，就跳过或合并。

| 周期 | window_start |
|---|---|
| 每 5 分钟 | 2026-06-06T10:05:00 |
| 每小时 | 2026-06-06T10:00:00 |
| 每天 | 2026-06-06 |
| 每周 | 2026-W23 |

不要只靠内存变量记录“上次执行时间”，因为重启后会丢失。

## 并发控制

不同 schedule 要有不同并发策略：

| 场景 | 策略 |
|---|---|
| 日报生成 | 同租户同 schedule 同一时间只允许一个 |
| MCP 巡检 | 可并发但限制 server 数量 |
| 批量评测 | 限制全局并发和模型预算 |
| 数据同步 | 同数据源串行，避免版本冲突 |
| 用户回访 | 可按用户并发，但限制租户配额 |

并发控制建议在队列和 worker 层都做。Scheduler 只负责少产生无效任务，Worker 仍要做最终保护。

## 失败处理

周期任务失败后，不要无脑重试。

| 失败类型 | 处理方式 |
|---|---|
| 临时网络错误 | 指数退避重试 |
| 外部系统限流 | 延迟重试并降低并发 |
| 权限错误 | 不重试，进入配置错误 |
| Prompt / schema 错误 | 进入 release gate 修复 |
| 成本超预算 | 停止后续任务并报警 |
| 连续失败 | 熔断 schedule，通知 owner |

一个好的 Scheduler 应该有 dead letter queue 和 schedule-level circuit breaker。

## Trace 设计

每次调度都应该产生 Trace：

| 事件 | 内容 |
|---|---|
| schedule.tick | 扫描时间、命中的 schedule 数量 |
| schedule.matched | 触发规则、window、payload 摘要 |
| schedule.skipped | 因禁用、预算、并发、幂等跳过 |
| job.enqueued | 创建的 job_id、queue、priority |
| schedule.failed | 调度失败原因 |
| schedule.disabled | 熔断或人工停用原因 |

这样才能解释“为什么某个 Agent 没有按时执行”或“为什么突然产生大量任务”。

## 与 Agent Control Plane 的关系

Scheduler 配置建议进入 Control Plane：

- 哪些 Agent 允许被定时触发。
- 哪些租户开启哪些 schedule。
- 每个 schedule 的预算和并发。
- cron 变更是否需要审批。
- schedule 的灰度和回滚。
- schedule 失败后自动熔断策略。

定时任务会持续消耗资源，因此必须和预算、限流、告警绑定。

## 面试表达模板

我会把定时 Agent 拆成 Scheduler、Queue、Worker 和 Control Plane。Scheduler 只负责按 cron / interval / event 产生任务，入队时用 tenant_id、schedule_id、window_start 和 payload_hash 做幂等键，避免重复触发。Worker 执行时仍然校验并发、预算和权限。每次 schedule tick、skip、enqueue、failure 都写 Trace，这样可以排查任务为什么没跑、为什么重复跑或为什么成本异常。

## 常见误区

### 误区一：定时任务就是 cron 调接口

cron 只是触发方式。生产系统还需要幂等、并发、预算、失败和观测。

### 误区二：Scheduler 只有一个实例就不会重复

部署、重启、故障恢复后仍可能重复。幂等键和数据库唯一约束更可靠。

### 误区三：周期任务失败就一直重试

持续失败可能造成成本暴涨和外部系统压力，需要熔断和 owner 通知。

## 相关链接

- [异步任务与长任务处理](/note/Engineering/async-task)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
