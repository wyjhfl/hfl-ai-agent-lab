# Agent Frontend Telemetry：Agent 前端埋点怎么设计

## 这篇文章解决什么问题

Agent 产品上线后，后端 Trace 只能告诉你模型、工具、RAG 有没有跑通，但不一定能告诉你用户是否信任结果、是否看懂审批、是否打开证据、是否因为等待太久离开。

Agent Frontend Telemetry 的目标是把用户行为、界面状态和 Agent Run 关联起来，让产品体验、质量评测和运维排障形成闭环。

## 为什么 Agent 前端需要单独埋点

| 只看后端 Trace 的盲区 | 前端 Telemetry 能补什么 |
|---|---|
| 不知道用户是否读了证据 | evidence_panel_opened |
| 不知道审批卡是否看懂 | approval_card_expanded / approval_rejected_reason |
| 不知道用户在哪一步流失 | task_step_visible / page_leave |
| 不知道结果是否被信任 | answer_copied / citation_clicked / feedback_submitted |
| 不知道错误提示是否可行动 | retry_clicked / handoff_clicked |

## 关键事件设计

| 事件 | 触发时机 | 关键字段 |
|---|---|---|
| task_composer_viewed | 打开任务输入区 | page、template_id |
| task_submitted | 提交任务 | task_type、input_size、has_file |
| run_state_visible | 状态变化展示给用户 | run_id、state、step_id |
| plan_preview_opened | 用户查看计划 | run_id、plan_version |
| evidence_panel_opened | 打开证据面板 | run_id、citation_count |
| citation_clicked | 点击引用 | citation_id、document_id |
| approval_card_viewed | 展示审批卡 | tool_name、risk_level |
| approval_decided | 批准或拒绝 | decision、risk_level、args_hash |
| tool_card_expanded | 展开工具详情 | tool_name、status |
| retry_clicked | 用户点击重试 | error_code、retry_count |
| human_takeover_clicked | 转人工 | reason、state |
| answer_feedback_submitted | 点赞、点踩或纠错 | rating、reason、run_id |
| trace_exported | 导出 Trace | run_id、format |

## 埋点字段规范

| 字段 | 说明 |
|---|---|
| event_id | 事件唯一 ID |
| timestamp | 客户端时间 |
| session_id | 前端会话 |
| user_scope_hash | 脱敏用户范围 |
| run_id / step_id | 关联 Agent Trace |
| page / component | 页面和组件 |
| state | 当前 UI 状态 |
| release_version | 前端版本 |
| experiment_id | A/B 实验 |
| privacy_level | public、internal、sensitive |

不要把用户原始输入、完整 Prompt、文件内容、密钥或未脱敏 PII 直接放进前端埋点。

## 产品指标

| 指标 | 说明 |
|---|---|
| task_submit_rate | 进入页面后实际提交任务比例 |
| plan_accept_rate | 用户接受 Agent 计划比例 |
| evidence_open_rate | 用户打开证据面板比例 |
| approval_reject_rate | 工具审批被拒绝比例 |
| retry_success_rate | 用户重试后成功比例 |
| correction_rate | 用户纠错或点踩比例 |
| handoff_rate | 转人工比例 |
| trust_signal_rate | 复制答案、点击引用、下载报告等信任行为比例 |
| perceived_latency | 用户感知等待时间，不只是后端耗时 |

## 和后端 Trace 如何关联

前端每个关键事件都应该带 run_id。这样可以回答：

- 用户点踩的答案对应哪个 Prompt 版本？
- 用户拒绝的工具是否集中在某个 risk_level？
- 用户打开证据后是否更愿意采纳答案？
- 某个模型版本是否导致 retry 或 handoff 增加？
- 前端等待时间和后端 p95 是否一致？

## 隐私与合规

| 风险 | 控制方式 |
|---|---|
| PII 进入埋点 | 前端先做字段白名单，不采集正文 |
| 跨租户分析泄漏 | tenant_id 使用 hash 或聚合桶 |
| Trace 过度暴露 | 前端只展示脱敏摘要和引用 ID |
| 用户反馈含敏感信息 | 反馈文本进入脱敏队列后再入库 |
| A/B 实验影响高风险工具 | 高风险流程不直接实验审批策略 |

## 面试表达

可以这样讲：

> 我会把 Agent 前端埋点和后端 Trace 通过 run_id 关联。后端能看到模型、RAG、工具执行情况，前端能看到用户是否打开证据、是否接受计划、是否拒绝审批、是否点击重试或转人工。这样既能优化体验，也能把用户反馈转成评测样本和产品指标。

## 落地检查清单

- [ ] 前端事件是否都带 run_id？
- [ ] 是否采集 evidence_open、approval_decision、retry、handoff、feedback？
- [ ] 是否避免采集原始 Prompt、文件内容和 PII？
- [ ] 是否能按 release_version 分析 UI 改版影响？
- [ ] 是否能把点踩样本关联到后端 Trace 和 eval case？