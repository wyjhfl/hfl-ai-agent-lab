# Agent Product Metrics：不要只看模型回答好不好

## 这篇文章解决什么问题

Agent 项目从 Demo 走向产品后，不能只看“回答是否看起来不错”。真正需要衡量的是用户是否完成任务、系统是否可控、成本是否可接受、风险是否被拦住。

Agent Product Metrics 的目标是把 AI 能力转成产品指标、工程指标和运营指标，让团队知道项目到底有没有产生价值。

## 指标分层

| 层级 | 核心问题 | 示例指标 |
|---|---|---|
| Acquisition | 用户是否愿意开始用 | 激活率、首个任务创建率 |
| Activation | 用户是否完成第一次价值体验 | first task success、time to first value |
| Engagement | 用户是否持续使用 | 周活、任务频次、复访率 |
| Task Success | Agent 是否完成任务 | success rate、partial success、handoff rate |
| Quality | 结果是否可信 | citation accuracy、judge score、用户满意度 |
| Efficiency | 是否省时省钱 | time saved、cost per task、token per task |
| Safety | 风险是否被控制 | unsafe action blocked、approval reject rate |
| Reliability | 系统是否稳定 | p95 latency、error rate、retry success |

不要把所有指标混成一个总分。不同阶段关注重点不同。

## Agent 产品特有指标

| 指标 | 含义 |
|---|---|
| task completion rate | 用户目标最终是否完成 |
| autonomous completion rate | 无人工介入完成比例 |
| handoff rate | 转人工比例 |
| approval rate | 高风险动作审批通过比例 |
| correction rate | 用户或人工修改 Agent 输出比例 |
| evidence click rate | 用户是否查看引用和证据 |
| retry rate | 用户是否重复尝试同类任务 |
| abandonment rate | 任务中途放弃比例 |
| trust signal rate | 用户点赞、采纳、复制、导出比例 |

这些指标比“模型回答分数”更接近真实产品价值。

## 技术指标不能脱离产品指标

技术指标需要和产品指标一起看：

| 技术指标 | 可能影响的产品指标 |
|---|---|
| p95 latency | 放弃率、复访率 |
| cost per task | 商业毛利、套餐定价 |
| schema pass rate | 前端错误率、任务完成率 |
| retrieval hit rate | 答案可信度、用户满意度 |
| tool error rate | 任务完成率、转人工率 |
| approval wait time | 用户等待体验 |
| memory stale rate | 个性化信任度 |

如果 p95 延迟下降但任务完成率也下降，说明优化可能牺牲了质量。

## 不同 Agent 的北极星指标

| 产品类型 | 北极星指标 |
|---|---|
| RAG 知识库 | 有引用的有效答案率 |
| 客服 Agent | 工单解决率 + 人工接管节省时间 |
| 数据分析 Agent | 被采纳的分析结论数 |
| Code Agent | 通过测试并被合并的任务数 |
| 研究助手 | 可引用报告生成完成率 |
| Agent SaaS | 每团队每周成功任务数 |

北极星指标要和用户价值绑定，而不是和模型调用次数绑定。

## 指标埋点设计

每个任务至少要有：

```text
task_id
run_id
user_id
tenant_id
task_type
entry_point
status
duration_ms
cost
model
prompt_version
tool_count
handoff_flag
approval_flag
feedback_score
```

产品指标、工程 Trace 和成本账本要能通过 run_id 关联。

## 常见误区

- 只看 DAU，不看任务是否成功。
- 只看模型评分，不看用户是否采纳。
- 只看平均延迟，不看 p95 和高价值任务。
- 只看自动完成率，不看高风险错误。
- 只看成本下降，不看质量和留存。

## 面试表达

> 我不会只用“回答质量”衡量 Agent 产品。Agent 指标要分产品、质量、效率、安全和可靠性几层。产品侧看 task completion、time to first value、handoff rate、correction rate、trust signal；工程侧看 p95 latency、cost per task、schema pass rate、tool error rate、retrieval hit rate。所有指标通过 task_id/run_id 关联 Trace、成本、模型版本、Prompt 版本和用户反馈。这样才能判断 Agent 是否真的帮用户完成任务，而不是只产生了更多对话。

## 相关链接

- [AI Agent PRD 模板](/topics/ai-agent-prd-template)
- [Agent SaaS 产品化](/topics/agent-saas-productization)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
- [AI Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
