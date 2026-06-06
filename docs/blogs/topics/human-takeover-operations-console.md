# Human Takeover 运营台：Agent 什么时候交给人

## 这篇文章解决什么问题

生产级 Agent 不能假设自己能解决所有问题。很多场景必须支持人工接管：

- 用户很生气，需要人工客服。
- Agent 连续失败。
- 工具调用风险高。
- 检索证据冲突。
- 模型置信度低。
- 业务流程需要人工审批。
- 用户明确要求转人工。

Human Takeover 的目标不是“Agent 失败了才找人”，而是把人作为系统可靠性的一部分。

## 什么时候接管

| 触发条件 | 示例 |
|---|---|
| 用户主动要求 | “转人工” |
| 低置信度 | 检索不到证据，模型不确定 |
| 连续失败 | 同一任务重试 3 次失败 |
| 高风险动作 | 付款、删除、外发邮件 |
| 情绪风险 | 投诉、威胁、强烈负面情绪 |
| 权限不足 | 用户请求需要管理员确认 |
| 策略命中 | 安全、合规、隐私边界 |
| SLA 超时 | Agent 长任务卡住 |

## 接管队列

运营台需要一个队列：

```text
handoff_id
user_id
conversation_id
task_id
run_id
reason
risk_level
priority
summary
suggested_action
status
assignee
created_at
```

不是把完整聊天记录丢给人工，而是给人工一个可操作摘要。

## 接管摘要

Agent 应该生成：

- 用户诉求。
- 已尝试步骤。
- 当前卡点。
- 关键证据。
- 风险点。
- 推荐处理动作。
- 需要人工确认的问题。

示例：

```text
用户想取消已发货订单。Agent 已查询订单状态，发现订单已出库。根据规则需要人工确认是否拦截物流。建议客服确认用户是否接受退货流程。
```

## 人工操作

运营台至少支持：

- 查看任务 Trace。
- 查看检索证据。
- 查看工具调用。
- 接管对话。
- 修改 Agent 草稿。
- 审批或拒绝工具动作。
- 标记问题类型。
- 关闭或重新运行任务。
- 把案例加入评测集。

## Agent 与人工协作模式

| 模式 | 说明 |
|---|---|
| Agent Draft, Human Send | Agent 写草稿，人发送 |
| Agent Diagnose, Human Decide | Agent 分析，人决策 |
| Human Takeover | 人完全接管对话 |
| Human Approve Tool | 人审批工具动作 |
| Human Label Failure | 人标注失败类型 |
| Agent Assist Human | 人工处理时 Agent 提供建议 |

## SLA 和优先级

优先级可以由：

- 用户等级。
- 风险等级。
- 情绪风险。
- 任务金额。
- 等待时间。
- 是否影响生产。

运营台要显示超时任务。

## 反馈闭环

人工处理结果要回流：

- 用户真实诉求。
- Agent 失败类型。
- 正确处理动作。
- 是否需要新增规则。
- 是否需要新增评测样本。
- 是否需要更新知识库。

Human Takeover 是高价值数据来源。

## 面试表达模板

> 我会把 Human Takeover 设计成 Agent 系统的一部分，而不是失败后的人工兜底。接管触发条件包括用户主动要求、低置信度、连续失败、高风险动作、情绪风险、权限不足和 SLA 超时。系统会创建 handoff 任务，包含 user、task、run、reason、risk、priority、summary 和 suggested_action。运营台让人工查看 Trace、证据、工具调用、Agent 草稿，并能接管对话、审批工具、重跑任务或标注失败类型。人工处理结果会回流到反馈闭环和评测集。

## 项目落地清单

- [ ] 定义接管触发条件。
- [ ] 有 handoff 队列表。
- [ ] Agent 能生成接管摘要。
- [ ] 运营台可查看 Trace 和证据。
- [ ] 人工可审批工具动作。
- [ ] 人工处理结果可转反馈和 eval case。
- [ ] 有 SLA 和优先级。
- [ ] 接管率进入产品指标。

## 相关链接

- [Human-in-the-loop](/note/AI-Agent/human-in-the-loop)
- [Agent UI 产品化设计](/topics/agent-ui-product-design)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)
- [Agent SaaS 产品化](/topics/agent-saas-productization)
