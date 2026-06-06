# AI Agent Interview Story Bank：项目面试 STAR 故事库怎么准备

## 这篇文章解决什么问题

AI Agent 面试不只考概念，也会追问“你遇到过什么问题、怎么定位、怎么权衡、最后结果怎样”。如果只背技术点，很难回答行为面试和项目深挖。

Interview Story Bank 的目标是把项目经历整理成可复用的 STAR 故事：Situation、Task、Action、Result，并映射到 Agent 工程能力。

## 故事库应该覆盖哪些能力

| 能力 | 故事主题 |
|---|---|
| RAG | 召回差、引用不准、权限过滤、freshness、无答案策略 |
| Tool / MCP | 工具参数错、schema 变化、审批绕过、Token Exchange、工具降级 |
| Workflow | 长任务卡住、状态恢复、幂等、人工接管 |
| Evaluation | 评测集建设、Prompt 回归、Judge 校准、漂移监控 |
| Safety | Prompt Injection、PII 脱敏、工具风险、租户隔离 |
| Cost / Latency | 成本暴涨、p95 延迟、模型路由、缓存、provider failover |
| Ops | SLO、报警、事故复盘、Run Replay、Release Gate |
| Product | 用户反馈、信任设计、Demo 验收、指标增长 |

## STAR 模板

### Situation

- 项目背景是什么？
- 用户是谁？
- 失败或挑战发生在什么场景？
- 为什么这个问题重要？

### Task

- 你负责什么？
- 目标指标是什么？
- 有哪些约束：时间、成本、权限、安全、团队？

### Action

- 你如何定位问题？
- 你做了哪些方案对比？
- 你实现了哪些工程机制？
- 如何验证有效？

### Result

- 指标如何变化？
- 线上风险是否降低？
- 用户体验是否改善？
- 沉淀了哪些文档、测试、Runbook 或评测样本？

## 示例故事方向

### 1. RAG 引用不可信

- S：用户反馈答案引用不支持结论；
- T：降低 unsupported claim rate；
- A：建立 claim-to-citation 检查、no-answer policy、citation eval；
- R：引用覆盖率提升，失败样本进入 regression set。

### 2. 高风险工具需要审批

- S：Agent 可能自动发送外部消息；
- T：避免误执行；
- A：Tool Risk Classification、Approval Workflow、args_hash、Audit Log；
- R：高风险操作可追责，审批绕过被阻断。

### 3. 模型供应商故障

- S：主模型超时和限流；
- T：保持核心任务可用；
- A：LLM Gateway、provider failover、latency budget、功能降级；
- R：主路径恢复，长尾延迟下降。

### 4. 评测集失效

- S：上线后新问题分布和旧评测集不匹配；
- T：让评测代表真实业务；
- A：Eval Case Lifecycle、线上抽样、点踩样本、drift monitoring；
- R：回归样本持续更新，Prompt 改动更可控。

### 5. 长期记忆隐私

- S：用户担心 Agent 记住敏感信息；
- T：让记忆可控可删；
- A：should_remember、PII 检测、retention、forget request、memory eval；
- R：记忆质量提升，隐私风险降低。

## 故事卡片格式

| 字段 | 内容 |
|---|---|
| story_id | rag_citation_001 |
| 能力标签 | RAG、Evaluation、Safety |
| 一句话摘要 | 我把 RAG 引用从“展示来源”升级成 claim-level grounding contract |
| STAR | S/T/A/R 四段 |
| 证据 | 文档、截图、指标、commit、评测报告 |
| 可追问点 | 为什么这样设计、替代方案、失败案例、下一步 |

## 面试表达模板

> 我准备项目面试时会维护一个 STAR Story Bank。每个故事都对应一个 Agent 工程能力，比如 RAG grounding、工具审批、Provider Failover、Eval Drift、Memory Privacy。故事里不仅讲用了什么技术，还讲问题背景、我的责任、定位过程、方案取舍、验证指标和沉淀资产。

## 常见误区

### 误区一：只准备项目介绍，不准备失败故事

面试官更喜欢追问你如何处理失败、风险和权衡。

### 误区二：故事没有指标

没有指标、截图、日志、评测报告或 commit，故事就容易像空泛描述。

### 误区三：每个故事都讲全项目

故事要聚焦一个能力点，讲清楚你的动作和结果。

## 相关链接

- [AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix)
- [AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)
- [Agent System Design Whiteboard Template](/topics/agent-system-design-whiteboard-template)
- [Agent 事故复盘模板](/topics/agent-incident-postmortem-template)
- [项目面试表达](/note/Interview/)
