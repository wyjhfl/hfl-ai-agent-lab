# AI Agent Career Readiness Checklist：AI Agent 求职准备度清单

## 这篇文章解决什么问题

很多人学习了 RAG、Agent、MCP、LangGraph、Prompt Engineering，但不知道自己是否已经具备投递 AI Agent / 大模型应用开发岗位的准备度。求职准备不是只看学了多少概念，而是看能否用项目、文档、演示、指标和面试故事证明能力。

这份 checklist 用来检查你的作品集、工程能力、面试表达和求职材料是否完整。

## 1. 项目能力

| 检查项 | 达标标准 |
|---|---|
| RAG 项目 | 有入库、检索、引用、权限、评测和失败分析 |
| Agent Workflow | 有状态机、工具调用、Trace、失败恢复 |
| MCP / Tool | 有工具 schema、权限、审批、测试和观测 |
| Evaluation | 有 smoke、golden、regression、adversarial 样本 |
| Safety | 有 Prompt Injection、PII、租户隔离、输出过滤 |
| Cost / Latency | 能讲成本账本、延迟预算、缓存和模型路由 |
| Ops | 有 SLO、Runbook、事故复盘、Release Gate |
| Product | 有用户场景、PRD、指标和 Demo 验收脚本 |

## 2. 作品集材料

你至少应该准备：

- 1 篇项目 Case Study；
- 1 张系统架构图；
- 1 份 Demo Acceptance Script；
- 1 份评测报告；
- 1 份简历项目矩阵；
- 3 到 5 个 STAR 面试故事；
- 关键代码仓库和 README；
- 构建、测试、部署或运行截图。

## 3. 面试表达

| 追问 | 你应该能回答 |
|---|---|
| 为什么不用普通 ChatBot？ | 任务边界、工具、状态、Trace 和评测 |
| RAG 为什么会错？ | 入库、召回、rerank、context、grounding、freshness |
| 工具调用如何安全？ | risk classification、approval、sandbox、audit |
| 如何证明效果？ | eval dataset、scorecard、drift、feedback loop |
| 如何上线？ | release gate、SLO、error budget、runbook |
| 成本怎么控？ | budget、chargeback、cache、routing、anomaly detection |
| MCP 有什么风险？ | token、schema diff、supply chain、observability |

## 4. 简历自查

简历 bullet 不要写：

> 熟悉 RAG、LangChain、MCP、Agent。

更好的写法：

> 设计企业知识库 RAG 链路，覆盖文档入库质量门禁、ACL metadata filter、claim-level citation evaluation 和 freshness 测试，并将失败样本沉淀为 regression set。

每条 bullet 最好包含：动作、对象、工程机制、指标或证据。

## 5. 30 分钟自测

如果现在让你面试，你能否在 30 分钟内完成：

1. 5 分钟讲清一个 Agent 项目；
2. 5 分钟画系统架构；
3. 5 分钟讲 RAG / Tool / MCP 一个难点；
4. 5 分钟讲一次失败和复盘；
5. 5 分钟讲评测和指标；
6. 5 分钟回答成本、安全和上线。

如果其中任何一项讲不清，就应该回到对应文章补材料。

## 面试表达模板

> 我会用作品集证明自己不是只会调 API。我的准备材料包括项目 Case Study、架构图、Demo 验收脚本、评测报告、简历能力矩阵和 STAR 故事库。面试时我可以从 RAG、Workflow、Tool/MCP、Eval、安全、成本和运维七个维度展开，也能讲清一次真实问题如何定位和沉淀。

## 相关链接

- [AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix)
- [AI Agent Interview Story Bank](/topics/ai-agent-interview-story-bank)
- [AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)
- [Agent System Design Whiteboard Template](/topics/agent-system-design-whiteboard-template)
- [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan)
