# Multi-Agent Handoff Protocol：多 Agent 交接协议怎么设计

## 这篇文章解决什么问题

多 Agent 系统里，一个 Agent 经常需要把任务交给另一个 Agent：Planner 交给 Researcher，Researcher 交给 Writer，Writer 交给 Reviewer，Reviewer 再交给 Executor。如果交接只是自然语言一句“请你继续”，上下文会丢、责任不清、输出不可验证。

Multi-Agent Handoff Protocol 的目标是把 Agent 之间的交接变成结构化协议：交接什么、为什么交接、完成标准是什么、有哪些证据、哪些约束不能违反。

## 为什么需要交接协议

| 问题 | 没有协议的后果 |
|---|---|
| 上下文丢失 | 下游 Agent 不知道任务边界 |
| 目标漂移 | 每个 Agent 按自己的理解重写目标 |
| 证据断链 | Research 证据无法支撑 Writer 输出 |
| 责任不清 | 失败后不知道哪个 Agent 出错 |
| 成本浪费 | 下游重复检索和重复推理 |
| 安全绕过 | 高风险约束没有传递 |

多 Agent 不是多个聊天机器人互相说话，而是多个受约束角色协作完成任务。

## Handoff 对象字段

建议定义结构化 handoff payload：

| 字段 | 说明 |
|---|---|
| handoff_id | 交接 ID |
| from_agent | 来源 Agent |
| to_agent | 目标 Agent |
| task_goal | 交接目标 |
| task_scope | 允许做什么、不允许做什么 |
| input_summary | 上游已完成内容摘要 |
| evidence_refs | 文档、工具结果、Trace 引用 |
| constraints | 安全、格式、成本、时间约束 |
| expected_output | 下游应产出什么 |
| acceptance_criteria | 验收标准 |
| deadline / budget | 时间和 token 预算 |
| risk_level | 风险等级 |
| state | pending、accepted、rejected、completed |

交接内容要结构化，不能只靠自然语言。

## 交接状态机

1. Proposed：上游提出交接。
2. Validating：系统校验目标 Agent 是否有权限和能力。
3. Accepted：下游接受任务。
4. Running：下游执行。
5. Completed：下游交付结果。
6. Rejected：下游拒绝，说明原因。
7. Escalated：交给 Supervisor 或人工。

如果下游拒绝任务，要记录是能力不足、信息不足、权限不足还是风险过高。

## 证据引用

交接时不要复制大量上下文，而要传 evidence_refs：

- document_id / chunk_id
- tool_call_id
- trace_id / step_id
- dataset_id
- decision_id
- approval_id

下游 Agent 可以按权限重新读取证据。这样能减少 token，也能保留证据链。

## 约束传递

关键约束必须显式传递：

- 不允许调用哪些工具。
- 不允许访问哪些数据。
- 输出必须引用证据。
- 预算上限是多少。
- 高风险结论必须转人工。
- 不确定时必须拒答。
- 不允许改变用户原始目标。

不要假设下游 Agent 会记得系统全局约束。交接协议要把本任务相关约束写清楚。

## 验收标准

每次 handoff 都要有 acceptance_criteria，例如：

| 场景 | 验收标准 |
|---|---|
| Researcher -> Writer | 至少 3 条证据，每条有来源 |
| Writer -> Reviewer | 检查事实、引用、格式和风险 |
| Planner -> Executor | 每个步骤有工具、参数和回滚方案 |
| Analyst -> Reporter | 输出结构化洞察、SQL 引用和异常说明 |

没有验收标准，多 Agent 输出会变成“看起来合理”。

## Trace 设计

每次交接记录：

- handoff.created
- handoff.validated
- handoff.accepted
- handoff.rejected
- handoff.completed
- handoff.escalated

Trace 中要能看到任务从哪个 Agent 流向哪个 Agent，以及每次交接时携带的目标、证据和约束。

## 面试表达模板

我不会让多 Agent 只靠自然语言聊天协作，而是设计结构化 handoff protocol。每次交接都有 from_agent、to_agent、task_goal、scope、evidence_refs、constraints、expected_output、acceptance_criteria、budget 和 risk_level。下游 Agent 可以接受、拒绝或升级任务，所有交接进入 Trace。这样多 Agent 协作可控、可审计，也能定位失败发生在哪个角色和哪次交接。

## 常见误区

### 误区一：多 Agent 越多越智能

Agent 越多，交接成本和失败点越多。没有协议，多 Agent 只会更混乱。

### 误区二：交接时把所有上下文都塞过去

应该传摘要和 evidence_refs，而不是无限复制上下文。

### 误区三：只定义角色，不定义验收

角色名不能保证质量，验收标准才能约束输出。

## 相关链接

- [Agent 编排模式](/topics/agent-orchestration-patterns)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [多 Agent 项目面试表达](/topics/multi-agent-interview)
