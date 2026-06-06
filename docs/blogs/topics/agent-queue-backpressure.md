# Agent Queue 与 Backpressure：长任务系统如何不被压垮

## 这篇文章解决什么问题

Agent 系统一旦进入真实使用，就会出现批量文档入库、多步骤分析、研究报告生成、浏览器自动化、多 Agent 协作和批量评测。所有请求都同步执行，会导致 API 超时、Worker 被打满、数据库连接耗尽、工具服务被打爆、用户重复提交和失败后无法恢复。

Queue 与 Backpressure 的目标是让 Agent 长任务可排队、可限流、可恢复、可观测。

## 基本架构

```text
Client
  ↓
API Server
  ↓ create task
Task DB
  ↓ enqueue
Queue / Redis / Broker
  ↓ consume
Worker Pool
  ↓ call
LLM / Tools / MCP / RAG
  ↓ update
Task State + Trace
```

API 只负责创建任务和返回 task_id，真正执行交给 Worker。

## 任务状态机

```text
queued → running → waiting_approval → running → succeeded
                  ↘ failed_retryable → queued
                  ↘ failed_terminal
                  ↘ cancelled
                  ↘ paused
```

状态机比简单 status 字符串更可靠，因为它定义了哪些状态可以流转，哪些状态不能跳转。

## Backpressure 是什么

Backpressure 指系统在压力过大时主动减速，而不是让所有请求继续进入执行层。

| 信号 | 说明 |
|---|---|
| queue_depth | 队列积压数量 |
| worker_busy_ratio | Worker 忙碌比例 |
| llm_rate_limit | 模型限流接近上限 |
| tool_error_rate | 外部工具错误率升高 |
| db_connection_usage | 数据库连接接近耗尽 |
| p95_task_latency | 任务延迟变高 |
| retry_storm | 失败重试过多 |

当这些信号异常时，系统应该限流、降级、暂停低优先级任务或提示用户稍后再试。

## 优先级队列

| 优先级 | 示例 |
|---|---|
| P0 | 用户正在等待的交互任务 |
| P1 | 付费用户任务、生产告警修复 |
| P2 | 普通后台分析 |
| P3 | 批量离线评测、预计算 |

队列要支持 priority，否则低价值批处理可能拖垮在线任务。

## 幂等设计

用户可能重复点击，也可能网络重试。创建任务时需要 idempotency_key。如果同一个 key 已经存在，就返回已有 task_id，而不是创建重复任务。

## 重试策略

| 错误类型 | 策略 |
|---|---|
| LLM rate limit | exponential backoff |
| tool timeout | 小次数重试，保留错误 |
| schema validation | 不重试，进入修复或失败 |
| permission denied | 不重试，直接失败 |
| user approval timeout | 暂停或取消 |
| external 5xx | backoff + circuit breaker |

## Circuit Breaker

当某个外部工具持续失败时，不要继续把任务打过去。closed 表示正常调用，open 表示暂停调用，half-open 表示少量探测恢复。

## Worker 并发控制

需要按资源类型控制并发：LLM 并发、浏览器实例并发、文件解析并发、数据库写入并发、MCP Server 调用并发、tenant 级并发。不要只设置一个全局 worker 数量。

## 观测指标

- queue_depth_by_priority
- task_wait_time
- task_run_time
- retry_count
- dead_letter_count
- cancellation_rate
- approval_wait_time
- worker_utilization
- backpressure_trigger_count

## 用户体验

长任务不能只显示 loading。前端应该展示 task_id、当前状态、当前步骤、预计等待时间、是否可取消、是否需要审批、失败原因和重试入口。

## 面试表达

> 我会把 Agent 长任务设计成异步队列，而不是让 API 同步跑到底。API 创建 task 并返回 task_id，Worker 消费队列执行，每一步写入任务状态和 Trace。系统要有优先级队列、幂等键、重试分类、死信队列和 backpressure。压力过大时，根据 queue_depth、worker_busy_ratio、LLM rate limit、工具错误率和数据库连接使用率触发限流、降级或暂停低优先级任务。

## 相关链接

- [异步任务与长任务处理](/note/Engineering/async-task)
- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [Agent UI 产品化设计](/topics/agent-ui-product-design)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
