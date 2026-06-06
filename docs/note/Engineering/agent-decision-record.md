# Agent Decision Record：Agent 决策记录怎么设计

## 这篇文章解决什么问题

Agent 经常会做决策：选择哪个工具、是否检索、是否需要审批、是否拒答、是否切换模型、是否重试。问题是很多系统只记录最终输出，不记录“为什么这么做”。一旦线上出错，就很难判断是策略错、模型判断错、权限错还是上下文错。

Agent Decision Record 的目标是为关键决策留下结构化证据，让系统可解释、可审计、可回放。

## 哪些决策需要记录

| 决策类型 | 示例 |
|---|---|
| route_decision | 走 RAG、SQL、工具、人工接管还是拒答 |
| tool_decision | 选择哪个工具、为什么不选其它工具 |
| approval_decision | 是否需要人工审批 |
| safety_decision | 是否触发安全策略、是否拒答 |
| retry_decision | 是否重试、重试几次、是否降级 |
| model_decision | 使用哪个模型、是否切换供应商 |
| context_decision | 纳入哪些证据、裁剪哪些历史 |

## 推荐字段

| 字段 | 说明 |
|---|---|
| decision_id | 决策唯一 ID |
| run_id / step_id | 所属执行步骤 |
| decision_type | route、tool、approval、safety、retry、model、context |
| options | 候选选项 |
| selected | 最终选择 |
| rationale | 决策理由摘要 |
| evidence_refs | 支撑决策的上下文、规则、证据或工具结果 |
| policy_version | 策略版本 |
| confidence | 置信度或评分 |
| risk_level | 风险等级 |
| reviewer | 人审或自动策略 |
| outcome | 决策后的结果 |

## 记录粒度

不要记录所有 token 级推理，也不要只记录最终答案。建议记录“会影响外部行为”的关键节点：路由、工具、审批、安全、重试、降级、上下文裁剪。

## 与审计日志的区别

| 类型 | 关注点 |
|---|---|
| Audit Log | 谁在什么时候对什么对象做了什么动作 |
| Decision Record | 系统为什么选择这个动作而不是其它动作 |
| Trace | 执行过程发生了哪些步骤和事件 |

三者可以共享 run_id，但用途不同。Audit 负责追责，Trace 负责排障，Decision Record 负责解释和复盘。

## 示例

| 字段 | 值 |
|---|---|
| decision_type | tool_decision |
| options | search_docs、create_ticket、ask_user |
| selected | search_docs |
| rationale | 用户问题需要先查制度，当前不满足创建工单条件 |
| evidence_refs | context_pack_123、policy_tool_risk_v4 |
| risk_level | R1 |
| outcome | retrieved 5 chunks |

## 面试表达

可以这样讲：

> 我会把 Agent 的关键决策做成 Decision Record，比如为什么选择某个工具、为什么触发审批、为什么拒答或降级。它和普通日志不同，记录的是候选项、最终选择、依据、策略版本、风险等级和结果。这样线上问题可以解释，也可以把错误决策转成评测和策略迭代。

## 落地检查清单

- [ ] 路由、工具、审批、安全、重试是否都有决策记录？
- [ ] 是否记录候选项而不是只记录最终选择？
- [ ] 是否能关联 context_pack、policy_version 和 evidence_refs？
- [ ] 是否能把错误决策转成 eval case？
- [ ] 是否避免泄漏 chain-of-thought，只保留可审计理由摘要？
