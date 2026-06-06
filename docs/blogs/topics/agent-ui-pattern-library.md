# Agent UI Pattern Library：AI Agent 产品界面模式库

## 这篇文章解决什么问题

很多 Agent 项目默认把界面做成一个聊天框，但生产级 Agent 不是“输入一句话 → 等模型回复”这么简单。真实业务里会出现长任务、工具审批、RAG 证据、状态恢复、人工接管、失败重试、成本提示和审计 Trace。

Agent UI Pattern Library 的目标是把这些复杂能力变成可复用的界面模式，让用户能理解 Agent 正在做什么、为什么需要审批、失败后如何恢复，以及结果是否可信。

## Agent UI 不等于 Chat UI

| 只做 Chat UI 的问题 | 生产级 Agent UI 需要补什么 |
|---|---|
| 用户不知道任务执行到哪一步 | Task timeline / Stepper |
| 工具调用像黑盒 | Tool call card / Approval card |
| RAG 证据隐藏在回答里 | Evidence panel / Citation drawer |
| 失败只显示“出错了” | Retryable error card / Recovery action |
| 高风险动作没有边界 | Risk badge / Human approval |
| 多轮任务无法恢复 | Run state / Resume entry |
| 结果难以面试展示 | Trace export / Demo script |

## 核心界面模式

| 模式 | 适合场景 | 必备字段 | 风险点 |
|---|---|---|---|
| Task Intake Card | 用户提交任务前 | 任务目标、输入文件、约束、预算、截止时间 | 输入太自由，后端难以校验 |
| Plan Preview | Agent 执行前展示计划 | step、tool、risk、expected_output | 不要展示链式思考，只展示可审计计划 |
| Tool Approval Card | 需要用户批准工具 | tool_name、args_summary、risk_level、side_effect、expires_at | 参数必须可读且不可被前端篡改 |
| Evidence Panel | RAG / 文档问答 | citation_id、title、section、freshness、permission | 引用必须来自过滤后的证据 |
| Trace Timeline | 长任务和排障 | run_id、step_id、status、latency、error_code | 不要泄漏敏感 Prompt 和 Secret |
| Human Takeover Queue | 低置信度或高风险任务 | reason、summary、owner、sla、next_action | 人工接管不是失败，而是可靠性策略 |
| Eval Result Badge | 结果可信度提示 | grounding、format、safety、cost、latency | 避免把自动评分包装成绝对事实 |
| Cost / Latency Hint | 商业化产品 | estimated_cost、token、p95、cache_hit | 成本提示要分租户和权限 |

## 推荐页面结构

一个可展示的 Agent 产品页面可以按下面组织：

1. **左侧任务区**：用户输入、上传文件、选择模板、设置约束。
2. **中间执行区**：计划、步骤、工具卡片、流式输出。
3. **右侧证据区**：RAG 引用、工具结果摘要、Trace、评测状态。
4. **底部恢复区**：重试、回放、人工接管、导出报告。

如果屏幕较窄，可以把右侧证据区折叠成 Drawer，但不要完全隐藏。

## 状态视觉设计

| 状态 | UI 表达 |
|---|---|
| queued | 灰色队列卡 + 预计等待时间 |
| planning | 蓝色步骤卡 + “正在生成执行计划” |
| waiting_approval | 橙色审批卡 + 风险说明 + 参数摘要 |
| running_tool | 紫色工具卡 + 超时倒计时 |
| retrieving | 青色证据卡 + 数据源标签 |
| failed_retryable | 红色错误卡 + 重试按钮 + 错误码 |
| failed_terminal | 红色错误卡 + 人工接管入口 |
| completed | 绿色结果卡 + 证据和 Trace 链接 |

## 前端组件清单

| 组件 | 作用 |
|---|---|
| TaskComposer | 统一任务输入、文件上传、模板选择 |
| AgentPlanCard | 展示可审计计划，不展示隐私推理 |
| ToolCallCard | 展示工具、参数、状态、错误和结果摘要 |
| ApprovalCard | 高风险工具审批，绑定 args_hash |
| EvidenceDrawer | 展示 citation、metadata、permission、freshness |
| TraceTimeline | 展示 run / step / tool / error 事件 |
| RecoveryPanel | 提供 retry、resume、handoff、export |
| EvalBadge | 展示 grounding、format、safety、cost 等评分 |

## 作品集展示建议

如果把 Agent 项目放到个人博客或简历作品集，建议至少展示 5 张截图：

1. 任务提交页面。
2. Agent 计划预览页面。
3. 工具审批页面。
4. RAG 证据与引用页面。
5. Trace / Eval / 失败恢复页面。

这些截图比单纯展示“聊天回答”更能证明工程能力。

## 面试表达

可以这样讲：

> 我没有把 Agent UI 做成普通聊天框，而是按任务生命周期设计了 Task Intake、Plan Preview、Tool Approval、Evidence Panel、Trace Timeline 和 Recovery Panel。这样用户能看到 Agent 为什么调用工具、引用了哪些证据、失败后如何重试或人工接管，也方便我在面试中展示系统的可控性和可观测性。

## 落地检查清单

- [ ] 是否能看到 Agent 当前步骤和状态？
- [ ] 高风险工具是否有审批卡和参数摘要？
- [ ] RAG 答案是否能打开证据面板？
- [ ] 失败是否有错误码、重试和人工接管入口？
- [ ] 是否能导出 Trace 或 Demo 证据？
- [ ] 是否避免暴露系统 Prompt、密钥和未脱敏数据？