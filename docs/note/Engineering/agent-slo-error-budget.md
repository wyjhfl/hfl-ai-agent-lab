# Agent SLO 与 Error Budget：生产级 Agent 怎么定义可靠性

## 这篇文章解决什么问题

很多 AI Agent 项目上线后只看“用户能不能问答”，但真实生产系统需要更细的可靠性目标：任务成功率、引用可信度、工具调用成功率、审批超时率、成本超预算率、p95 延迟、人工接管率、回滚速度。

SLO 不是运维部门的形式主义，而是把 Agent 的“体验好不好、能不能稳定交付”变成可监控、可报警、可复盘的指标体系。

## 为什么 Agent 需要单独设计 SLO

传统 API 的 SLO 通常关注可用性和延迟。Agent 系统还多了几类不确定性：

- 模型输出质量不稳定；
- RAG 召回可能缺证据或召回错证据；
- 工具调用可能参数错误、权限不够或外部服务失败；
- 长任务可能卡在等待审批、队列或重试；
- 成本可能因为重试、长上下文、复杂工具链突然放大；
- 用户体验可能因为低置信度和频繁接管而下降。

因此 Agent SLO 要同时覆盖可用性、质量、安全、成本和恢复能力。

## 推荐 SLO 指标

| 指标 | 含义 | 建议拆分 |
|---|---|---|
| task_success_rate | 任务最终完成比例 | 按 agent_type、tenant、workflow、model_version |
| grounded_answer_rate | 答案被证据支持的比例 | 按知识库、chunk_version、reranker_version |
| tool_success_rate | 工具调用成功比例 | 按 tool_id、schema_version、risk_level |
| approval_timeout_rate | 审批超时或无人处理比例 | 按审批类型、风险等级、工作时段 |
| p95_task_latency | 任务端到端延迟 | 拆 planning、retrieval、tool、generation、review |
| cost_per_success | 每个成功任务平均成本 | 按模型、RAG、工具、人审和基础设施拆分 |
| safety_violation_rate | 安全策略命中或越界比例 | 按 prompt injection、PII、越权、危险工具 |
| human_takeover_rate | 人工接管比例 | 区分主动升级、用户请求、系统兜底 |

## Error Budget 怎么用

Error Budget 是允许系统在一个周期内消耗的失败额度。例如：月度 task_success_rate 目标 98%，允许失败预算为 2%。如果前两周已经消耗 80% 预算，后续模型切换、Prompt 改动、工具新增都必须进入冻结或更严格灰度。

对 Agent 来说，Error Budget 不只约束接口错误，也约束质量和安全：

| 预算类型 | 触发动作 |
|---|---|
| 质量预算消耗过快 | 暂停 Prompt / 模型大改，优先修复失败样本 |
| 工具失败预算消耗过快 | 降级高风险工具，增加回放和契约测试 |
| 安全预算被击穿 | 立即关闭危险能力，进入红队修复和回归 |
| 成本预算消耗过快 | 降级模型、开启缓存、限制长上下文和重试 |

## 监控看板结构

一个实用的 Agent SLO 看板至少要能按以下维度 drill down：

1. 入口维度：用户、租户、产品功能、API、前端页面；
2. 任务维度：workflow、agent_type、state、run_id；
3. 模型维度：model、prompt_version、route_policy、canary_group；
4. 知识维度：knowledge_base、document_version、index_version、permission_filter；
5. 工具维度：tool_id、schema_version、risk_level、approval_status；
6. 成本维度：token、embedding、rerank、tool、human_review、retry；
7. 安全维度：policy_hit、redaction_version、sandbox_result、audit_event。

## 报警分级

| 级别 | 例子 | 处理方式 |
|---|---|---|
| P0 | 越权读取、危险工具误执行、PII 泄漏 | 立即止血、关闭能力、保留证据、复盘 |
| P1 | 成功率大幅下降、审批队列阻塞、成本暴涨 | 降级、回滚、限制流量、通知负责人 |
| P2 | 某工具失败率上升、某知识库引用质量下降 | 建 issue、补回归样本、排期修复 |
| P3 | 低频体验问题、个别回答不稳定 | 进入反馈池和下轮优化 |

## 面试表达模板

> 我没有只用接口可用率衡量 Agent，而是把任务成功率、证据支持率、工具成功率、审批超时率、p95 延迟、cost per success 和安全违规率纳入 SLO。上线后如果错误预算消耗过快，就暂停新模型、Prompt 或工具变更，优先修复失败样本并更新回归集。

## 常见误区

### 误区一：Agent 只要 API 200 就算可用

API 200 只能说明服务返回了结果，不能说明答案正确、证据可信、工具安全、成本可控。

### 误区二：SLO 只给运维看

SLO 应该反向影响产品范围、模型路由、Prompt 发布、工具启停和灰度策略。

### 误区三：只看平均值

Agent 失败通常集中在长尾任务、高风险工具、特殊租户和复杂知识库。必须看 p95、失败分布和分组指标。

## 相关链接

- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [Agent 故障演练](/note/Engineering/agent-production-failure-drill)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
