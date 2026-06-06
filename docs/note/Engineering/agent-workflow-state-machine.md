# Agent Workflow 状态机设计：让 Agent 可控而不是自由发挥

## 这篇文章解决什么问题

很多 Agent Demo 看起来能完成任务，但一旦进入真实业务，就会出现三类问题：步骤不可控、失败不可恢复、结果不可解释。根因通常不是模型不够强，而是系统没有把任务执行过程显式建模。

Agent Workflow 状态机的目标是把“模型自由对话”改造成“受控任务推进”：每一步有状态、输入、输出、超时、重试、人工介入和审计记录。

## 为什么 Agent 需要状态机

传统聊天机器人只需要处理一轮输入和一轮输出。Agent 系统不同，它往往要经历需求理解、计划生成、工具调用、结果校验、人工审批、失败重试和最终交付。只要任务超过一步，就需要状态管理。

没有状态机时，系统通常会退化成：

- 模型每轮重新猜当前任务进度。
- 工具调用失败后不知道从哪里恢复。
- 用户刷新页面后任务上下文丢失。
- 面试时只能说“模型会自己规划”，无法解释工程可控性。
- 线上排障时只有一段对话日志，看不出任务卡在哪个环节。

状态机不是为了限制 Agent 能力，而是为了给 Agent 一个可靠的执行轨道。

## 基础状态模型

一个可上线的 Agent 任务至少可以拆成以下状态：

| 状态 | 含义 | 典型动作 |
|---|---|---|
| Created | 用户创建任务，尚未开始执行 | 保存任务、校验输入、生成 run_id |
| Queued | 等待 Worker 消费 | 排队、限流、优先级调度 |
| Planning | 生成计划或选择工作流 | 调 LLM、选择工具、拆分步骤 |
| WaitingApproval | 等待人工确认 | 展示高风险动作、收集审批结果 |
| RunningTool | 正在执行工具 | 调 API、读写文件、访问检索系统 |
| Validating | 校验工具结果和最终答案 | schema 校验、引用校验、Rubric 评测 |
| Completed | 任务完成 | 保存结果、更新指标、发送通知 |
| FailedRetryable | 可重试失败 | 记录错误、指数退避、进入重试队列 |
| FailedFinal | 不可恢复失败 | 输出失败原因、进入人工接管 |
| Cancelled | 用户取消或系统终止 | 停止 Worker、释放资源、记录原因 |

面试表达时，可以说：我没有让 Agent 完全靠自然语言记忆任务进度，而是把任务推进建模为状态机，每个状态都有允许的转移、超时策略和恢复策略。

## 状态转移设计

状态机最重要的不是状态列表，而是状态转移规则。每一次转移都应该回答四个问题：

1. 触发条件是什么？例如用户创建任务、Worker 获取任务、工具返回成功、审批通过。
2. 需要校验什么？例如权限、参数 schema、租户额度、工具风险等级。
3. 失败后怎么办？例如重试、降级、转人工、终止。
4. 记录什么证据？例如 run_id、step_id、tool_call_id、输入输出摘要、错误分类。

示例状态转移：

| From | Event | To | 校验点 |
|---|---|---|---|
| Created | enqueue | Queued | 用户权限、任务参数、配额 |
| Queued | worker_pick | Planning | 并发限制、幂等锁 |
| Planning | plan_ready | RunningTool | plan schema、工具权限 |
| Planning | high_risk_action | WaitingApproval | 风险等级、审批策略 |
| WaitingApproval | approved | RunningTool | 审批人、过期时间 |
| RunningTool | tool_success | Validating | 工具输出 schema、证据完整度 |
| RunningTool | tool_timeout | FailedRetryable | 重试次数、错误分类 |
| Validating | pass | Completed | 质量门槛、引用、成本 |
| Validating | low_confidence | WaitingApproval | 低置信度策略 |
| FailedRetryable | retry_budget_left | Queued | retry budget、退避时间 |
| FailedRetryable | retry_budget_exhausted | FailedFinal | 人工接管策略 |

## 数据表怎么设计

状态机通常需要至少三类表：Task、Run、Step。

| 表 | 作用 | 关键字段 |
|---|---|---|
| task | 用户视角的任务 | task_id、tenant_id、user_id、status、title、created_at |
| run | 一次执行尝试 | run_id、task_id、workflow_version、model、status、cost、latency |
| step | 具体步骤 | step_id、run_id、state、input_ref、output_ref、error_type、started_at、ended_at |
| tool_call | 工具调用记录 | tool_call_id、step_id、tool_id、args_hash、result_ref、risk_level |
| approval | 审批记录 | approval_id、step_id、approver、decision、reason、expired_at |

不要把所有内容塞进一张聊天记录表。聊天记录适合展示，但不适合做恢复、审计和指标分析。真正的 Agent 工程记录应该围绕任务、运行、步骤和工具调用建模。

## 幂等与恢复

长任务 Agent 很容易遇到进程重启、网络超时、工具重复调用、用户刷新页面等问题。状态机必须配合幂等设计。

关键做法：

- 为每次任务创建稳定的 task_id 和 run_id。
- 每个工具调用生成 tool_call_id 和 idempotency_key。
- Worker 执行前先获取状态锁，避免多个 Worker 同时推进同一任务。
- 外部副作用动作必须先记录 intent，再执行工具，最后记录 result。
- 重试时从最后一个可恢复状态继续，而不是从头重新跑。
- 对发邮件、扣款、写数据库、删除文件等动作设置强审批或人工确认。

面试中可以强调：我把“是否可以重试”作为错误分类的一部分，而不是简单捕获异常后无限重试。

## 状态机和 LLM 的边界

LLM 可以参与状态机，但不应该拥有状态机的最终控制权。

适合交给 LLM 的部分：

- 理解用户意图。
- 生成候选计划。
- 从工具列表中推荐下一步。
- 总结工具结果。
- 给出失败原因解释。

不应该交给 LLM 的部分：

- 是否有权限调用高风险工具。
- 是否可以跨租户访问数据。
- 是否可以跳过审批。
- 是否可以删除生产数据。
- 是否可以忽略状态转移规则。

一句话：LLM 可以建议下一步，系统策略决定能不能执行下一步。

## 与多 Agent 的关系

多 Agent 并不意味着状态机消失。相反，多 Agent 更需要状态机。否则多个角色之间会出现职责不清、循环讨论、重复调用工具和结果覆盖。

常见做法：

| Agent 角色 | 对应状态 |
|---|---|
| Coordinator | Planning、Routing |
| Researcher | RunningTool、ContextBuilding |
| Analyst | Validating、Scoring |
| Executor | ToolExecution、SideEffectAction |
| Reviewer | Validation、HumanApproval |

多 Agent 系统的关键不是“有几个角色”，而是每个角色在哪些状态下可以行动、能读哪些上下文、能调用哪些工具、输出什么 schema。

## 前端应该展示什么

状态机不是后端内部细节，也应该转化为用户可理解的任务进度。

前端可以展示：

- 当前任务状态：排队中、规划中、执行中、等待确认、生成结果、失败。
- 当前步骤说明：正在检索文档、正在调用数据分析工具、正在校验引用。
- 可操作按钮：取消、重试、批准、驳回、转人工。
- 失败原因：权限不足、工具超时、无可用证据、模型输出不符合格式。
- Trace 摘要：关键工具调用、引用来源、审批记录。

这会显著提升 Agent 产品的可信度，因为用户不再面对一个黑盒聊天框。

## 发布前检查清单

| 检查项 | 问题 |
|---|---|
| 状态完整性 | 是否覆盖创建、排队、执行、审批、成功、失败、取消？ |
| 转移合法性 | 是否定义了哪些状态可以转到哪些状态？ |
| 幂等 | 重试是否会造成重复副作用？ |
| 超时 | 每个长步骤是否有 timeout？ |
| 错误分类 | 失败是否区分可重试、不可重试、需人工？ |
| 审批 | 高风险状态是否必须经过人工确认？ |
| Trace | 每次状态转移是否可审计？ |
| 指标 | 是否能统计成功率、失败率、平均耗时、重试次数？ |

## 面试表达模板

可以这样讲：

我在设计 Agent 系统时，不会让模型完全自由推进任务，而是把任务抽象成状态机。用户创建任务后进入队列，Worker 根据当前状态推进计划生成、工具调用、结果校验和人工审批。每一次状态转移都会记录 run_id、step_id、工具调用、错误类型和耗时。这样系统失败后可以断点恢复，也可以做 Trace、指标统计和面试复盘。

## 常见误区

### 误区一：有 LangGraph 就等于有状态机

框架可以帮助表达图和状态，但真正的工程能力在于你是否设计了状态字段、转移规则、幂等键、错误分类、审批策略和数据库记录。

### 误区二：状态越多越专业

状态不是越多越好。状态应该围绕可观测、可恢复、可审批和可统计来设计。无法触发动作、无法影响策略、无法产生指标的状态通常可以合并。

### 误区三：所有失败都进入 Failed

生产系统需要区分 retryable、user_fixable、approval_required、final_failure。否则系统无法自动恢复，也无法给用户清晰反馈。
