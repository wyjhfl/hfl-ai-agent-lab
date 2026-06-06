# AI Agent CTO Review Checklist：技术负责人会怎么审 AI Agent 项目

## 这篇文章解决什么问题

面试或项目汇报中，候选人常常从“我用了什么框架”开始讲，但技术负责人更关心：这个系统能不能上线？风险在哪里？成本谁承担？失败怎么恢复？数据能不能审计？团队能不能维护？

这篇清单模拟 CTO / 技术负责人视角，帮助你把 Agent 项目讲成一个可评审的工程方案，而不是技术栈展示。

## CTO 最关心的 12 个问题

| 问题 | 关注点 |
|---|---|
| 为什么需要 Agent | 是否真的需要模型决策，而不是普通 workflow |
| 业务边界是什么 | 哪些做、哪些不做、失败怎么处理 |
| 数据从哪来 | 数据质量、权限、生命周期 |
| 工具能做什么 | 工具权限、审批、审计、沙箱 |
| 安全风险是什么 | Prompt Injection、越权、泄漏 |
| 质量怎么证明 | 评测集、指标、失败样本 |
| 成本怎么控制 | 预算、chargeback、缓存、模型路由 |
| 延迟能否接受 | p95、异步任务、降级 |
| 如何上线 | 灰度、回滚、Release Gate |
| 如何运维 | SLO、报警、Runbook、故障演练 |
| 谁来维护 | owner、版本、文档、交接 |
| 商业价值是什么 | 节省时间、提升转化、降低人工成本 |

如果你只能回答“用了 LangGraph 和 RAG”，说明准备还不够。

## 架构审查问题

- Agent 是单 Agent、Workflow 还是多 Agent？为什么？
- 状态机怎么设计？
- 长任务如何恢复？
- 工具调用如何记录？
- RAG 和工具结果如何进入上下文？
- 失败时如何降级？
- 用户如何知道任务进度？

回答重点不是“框架支持”，而是你如何约束模型自由度。

## 数据审查问题

- 文档如何入库、更新、过期和删除？
- RAG 是否支持 ACL 和多租户？
- 用户输入、Trace、反馈是否会用于训练？
- 数据保留周期是多少？
- 用户删除请求如何处理？
- 审计日志是否会泄漏敏感信息？

数据治理是企业项目能否落地的核心。

## 安全审查问题

- Prompt Injection 怎么防？
- MCP Server 是否可信？
- 工具参数是否由服务端校验？
- 高风险操作是否审批？
- 模型能否伪造 tenant_id / user_id？
- 缓存是否可能跨租户命中？
- 审批是否绑定参数 hash？

安全答案必须落到执行层，而不是只说“我们会写安全 Prompt”。

## 质量审查问题

- 评测集如何构造？
- smoke、regression、safety、benchmark 是否分层？
- RAG 的 citation accuracy 怎么测？
- LLM-as-Judge 是否校准？
- 线上失败如何进入回归集？
- 新模型上线如何 A/B？

CTO 不会只接受“人工看起来不错”。

## 成本审查问题

- 单任务成本是多少？
- 成本按 tenant / feature / model 如何拆？
- 失败重试占多少成本？
- 缓存节省多少？
- 免费用户如何限额？
- 企业客户如何扩容？

成本不可解释，就很难商业化。

## 运维审查问题

- 哪些指标报警？
- 模型超时怎么降级？
- MCP 工具失败怎么熔断？
- 审批卡住怎么处理？
- 成本突增怎么止血？
- 事故后如何复盘？

Agent 系统上线后，运维复杂度通常比普通后端更高。

## 60 秒汇报模板

我的 Agent 项目不是只做模型调用，而是按生产系统设计。任务边界上只处理指定场景，高风险动作进入审批；数据层有文档生命周期、ACL 和租户隔离；执行层有状态机、幂等、工具沙箱和 Trace；质量层有 smoke、regression、safety 和 RAG citation 评测；成本层有 cost ledger、quota、semantic cache 和模型路由；上线层有 Release Gate、灰度、Runbook 和故障演练。这样系统既能演示能力，也能解释风险、成本和运维方案。

## 反问准备

如果面试官从 CTO 角度追问，你也可以反问：

- 这个场景更看重节省时间还是降低错误率？
- 企业是否允许模型输出直接触达客户？
- 数据是否可以进入评测集或训练集？
- 高风险工具审批由谁负责？
- 试点成功后如何扩展到更多团队？

好的反问能体现你不是只关注技术实现，也关注组织落地。

## 相关链接

- [生产级 Agent Readiness Review](/topics/agent-production-readiness-review)
- [AI Agent Enterprise Pilot Plan](/topics/ai-agent-enterprise-pilot-plan)
- [Agent Audit Log Design](/note/Engineering/agent-audit-log-design)
- [MCP Supply Chain Risk](/note/Engineering/mcp-supply-chain-risk)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
