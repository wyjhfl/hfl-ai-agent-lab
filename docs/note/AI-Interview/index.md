# AI Agent 面试题库

这个模块用于系统整理 AI Agent、RAG、LLM 工具调用、大模型工程、LangChain / LangGraph 相关面试题。

它和原来的"面试表达"不同：

- 面试表达：侧重项目怎么讲、简历怎么写、项目亮点怎么表达
- 面试题库：侧重技术概念、原理题、追问题、工程化理解和背诵版总结

## 当前分类

| 分类 | 覆盖内容 |
|---|---|
| Agent 面试题 | Agent 概念与架构、Workflow 与 Agent、ReAct、Plan-and-Execute、Reflection、任务拆分、记忆机制、Multi-Agent 协作 |
| Agent 面试追问库 | Agent vs ChatBot、什么时候不用 Agent、失败排查、评测、安全、成本、长任务恢复 |
| RAG 面试题 | RAG 原理、文档切割、Embedding、向量数据库、检索优化、Query Rewrite、多路召回、Reranking、幻觉规避、效果评估 |
| LLM 工具调用面试题 | Function Calling、Tools、MCP、A2A、Skills、SSE、WebSocket、WebRTC、LLM 网关 |
| 大模型工程面试题 | Transformer、Attention、KV Cache、LoRA、模型部署、推理加速、成本优化 |
| LangChain / LangGraph 面试题 | Chain、Agent、Tool、Graph、State、Checkpoint、Human-in-the-loop、框架选型 |

## 统一整理模板

每篇题库文章按照以下结构整理：

1. 高频问题地图
2. 核心概念速记
3. 标准回答模板
4. 面试官追问
5. 工程化理解
6. 常见误区
7. 背诵版总结
8. 后续补充

## 当前状态

当前先建立题库结构，后续会根据历史对话素材和个人学习内容逐步补充正式题解。

## 第一轮已完成题解

| 分类 | 已完成 |
|---|---|
| Agent 面试题 | 5 道 |
| Agent 面试追问库 | 12 道追问 |
| RAG 面试题 | 5 道 |
| LLM 工具调用面试题 | 5 道 |
| 大模型工程面试题 | 4 道 |
| LangChain / LangGraph 面试题 | 4 道 |

本轮内容为 HFL AI Agent Lab 原创整理，参考公开面试题方向，但不复制外站正文。

## 求职作品集补充

面试题库解决“怎么回答技术问题”，作品集路线解决“怎么证明自己做过”。建议配合阅读：

- [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan)
- [AI Agent 面试追问地图](/topics/ai-agent-interview-followup-map)
- [AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix)
- [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap)
- [AI Agent 项目选题库](/topics/ai-agent-project-ideas)
- [AI Agent 项目包装：简历、作品集和面试讲法](/topics/ai-agent-project-packaging)
- [AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)
- [AI Agent 项目答辩稿](/topics/ai-agent-project-defense-script)
- [AI Agent 产品需求文档 PRD 模板](/topics/ai-agent-prd-template)
- [Agent Product Metrics](/topics/agent-product-metrics)
- [Agent SaaS 多租户、RBAC 与配额设计](/topics/agent-saas-tenant-rbac-quota)
- [LLM 数据治理](/note/Engineering/llm-data-governance)
- [Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [Agent 框架选型](/topics/agent-framework-selection)
- [Agent 协议全景](/topics/agent-protocol-landscape)
- [生产级 Agent 治理清单](/topics/production-agent-governance-checklist)
- [Conversation Regression Testing](/topics/conversation-regression-testing)
- [Agent Contract Testing](/topics/agent-contract-testing)
- [Agent 错误分类](/note/Engineering/agent-error-taxonomy)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [Skill 测试与版本管理](/note/AI-Tools/skill-testing-versioning)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)
- [MCP Server Hardening](/note/Engineering/mcp-server-hardening)
- [MCP 供应链风险](/note/Engineering/mcp-supply-chain-risk)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Client 测试](/note/Engineering/mcp-client-testing)
- [Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing)
- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [Skill 运营手册](/note/AI-Tools/skill-operations-playbook)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [Agent 配置治理](/note/Engineering/agent-configuration-management)
- [Agent 审计日志设计](/note/Engineering/agent-audit-log-design)
- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
- [RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)
- [RAG 知识生命周期](/note/Engineering/rag-knowledge-lifecycle)
- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
- [Model Rollout Canary](/note/Engineering/model-rollout-canary)
- [LLM Semantic Cache](/note/Engineering/llm-semantic-cache)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
- [Agent 事故复盘模板](/topics/agent-incident-postmortem-template)
- [Agent 故障演练](/note/Engineering/agent-production-failure-drill)
- [Agent Memory 评测](/note/Engineering/memory-evaluation-for-agents)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent Scheduler 与 Cron](/note/Engineering/agent-scheduler-cron)
- [Context Window 管理](/note/AI-Agent/context-window-management)
- [Agent Capability Matrix](/topics/agent-capability-matrix)
- [生产级 Agent Readiness Review](/topics/agent-production-readiness-review)
- [AI Agent Enterprise Pilot Plan](/topics/ai-agent-enterprise-pilot-plan)
- [AI Agent CTO Review Checklist](/topics/ai-agent-cto-review-checklist)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)
- [Multi-Agent Handoff Protocol](/note/Engineering/multi-agent-handoff-protocol)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
- [Browser Automation Testing](/topics/browser-automation-testing-agent-ui)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [RAG 项目面试表达](/topics/rag-project-interview)
- [多 Agent 项目面试表达](/topics/multi-agent-interview)
- [项目 B 一分钟介绍](/note/Interview/project-b-one-minute)
- [简历描述模板](/note/Interview/resume-bullets)

## 如何配合学习路线和工程化笔记复习

不要只背题。建议按照以下路径复习：

1. **先看学习路线理解概念** — 知道这个技术是什么、为什么需要
2. **再看工程化笔记理解落地** — 知道在真实项目中怎么设计和实现
3. **最后看面试题库练表达** — 知道怎么用简洁的语言回答面试官

| 面试题分类 | 推荐先读 | 推荐工程化补充 |
|---|---|---|
| [Agent 面试题](/note/AI-Interview/agent-interview) | [Agent 基础](/note/AI-Agent/agent-basic)、[Multi-Agent](/note/AI-Agent/multi-agent)、[Evaluation](/note/AI-Agent/evaluation) | [Agent Trace](/note/Engineering/agent-trace)、[Evaluation Pipeline](/note/Engineering/eval-pipeline)、[Agent 失败恢复](/note/Engineering/agent-failure-recovery)、[Multi-Agent Handoff](/note/Engineering/multi-agent-handoff-protocol) |
| [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) | [Context Engineering](/note/AI-Agent/context-engineering)、[Context Window 管理](/note/AI-Agent/context-window-management)、[Agent Runtime](/note/AI-Agent/agent-runtime) | [AI Agent 面试追问地图](/topics/ai-agent-interview-followup-map)、[AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix)、[Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)、[Agent Scheduler 与 Cron](/note/Engineering/agent-scheduler-cron)、[Agent Control Plane](/note/Engineering/agent-control-plane)、[Agent 配置治理](/note/Engineering/agent-configuration-management)、[Agent Approval Workflow](/note/Engineering/agent-approval-workflow)、[Agent 错误分类](/note/Engineering/agent-error-taxonomy)、[Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)、[多模型路由](/note/Engineering/model-routing-ab-testing)、[Model Rollout Canary](/note/Engineering/model-rollout-canary) |
| Agent 协议与工具生态 | [Tool Calling](/note/AI-Agent/tool-calling)、[Browser / Computer Use Agent](/note/AI-Agent/browser-computer-use-agent) | [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)、[Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)、[Agent 协议全景](/topics/agent-protocol-landscape)、[MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)、[MCP Server Hardening](/note/Engineering/mcp-server-hardening)、[MCP 供应链风险](/note/Engineering/mcp-supply-chain-risk)、[MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)、[MCP Client 测试](/note/Engineering/mcp-client-testing)、[MCP Client 工程化](/note/Engineering/mcp-client-engineering)、[MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)、[MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)、[MCP 安全与授权](/note/Engineering/mcp-security-auth) |
| Agent 安全与治理追问 | [Guardrails / Safety](/note/AI-Agent/guardrails)、[Human-in-the-loop](/note/AI-Agent/human-in-the-loop) | [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)、[Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)、[PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)、[Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth)、[Human Takeover 运营台](/topics/human-takeover-operations-console)、[Agent 红队演练](/note/Engineering/agent-red-team-playbook)、[生产级 Agent 治理清单](/topics/production-agent-governance-checklist) |
| [RAG 面试题](/note/AI-Interview/rag-interview) | [RAG](/note/AI-Agent/rag) | [RAG 入库流水线](/note/Engineering/rag-ingestion-pipeline)、[RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)、[RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)、[RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)、[向量检索选型](/topics/vector-search-selection) |
| 高级 RAG / 企业知识库 | [RAG](/note/AI-Agent/rag)、[RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning) | [RAG 知识生命周期](/note/Engineering/rag-knowledge-lifecycle)、[Embedding 模型评测与迁移](/note/Engineering/embedding-model-eval-migration)、[GraphRAG](/note/Engineering/graphrag-engineering)、[企业 RAG 权限与多租户](/note/Engineering/enterprise-rag-permission-multitenancy)、[Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing) |
| RAG / Fine-tuning 取舍 | [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning) | [Fine-tuning 数据流水线](/note/Engineering/finetuning-data-pipeline)、[LLM 数据治理](/note/Engineering/llm-data-governance)、[Eval Dataset 设计](/note/Engineering/eval-dataset-design)、[PromptOps](/note/Engineering/promptops-versioning) |
| [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) | [Tool Calling](/note/AI-Agent/tool-calling) | [Structured Output](/note/Engineering/structured-output-engineering)、[Agent 工具沙箱](/note/Engineering/agent-tool-sandbox-permission)、[MCP Server](/note/Engineering/mcp-server) |
| [大模型工程面试题](/note/AI-Interview/llm-engineering-interview) | [Production Engineering](/note/AI-Agent/production) | [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)、[LLM 成本预算表](/note/Engineering/llm-cost-budget-table)、[LLM Semantic Cache](/note/Engineering/llm-semantic-cache)、[LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)、[LLM 数据治理](/note/Engineering/llm-data-governance)、[PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)、[Model Rollout Canary](/note/Engineering/model-rollout-canary)、[Agent 配置治理](/note/Engineering/agent-configuration-management)、[Agent 审计日志设计](/note/Engineering/agent-audit-log-design)、[Agent Release Gate](/note/Engineering/agent-release-gate)、[Agent 故障演练](/note/Engineering/agent-production-failure-drill)、[生产运维 Runbook](/note/Engineering/agent-production-ops-runbook) |
| 评测与安全追问 | [Evaluation](/note/AI-Agent/evaluation)、[Guardrails](/note/AI-Agent/guardrails) | [Agent Contract Testing](/topics/agent-contract-testing)、[Conversation Regression Testing](/topics/conversation-regression-testing)、[LLM-as-Judge](/note/Engineering/llm-as-judge-rubric-eval)、[LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)、[合成数据与对抗评测集](/note/Engineering/synthetic-adversarial-eval-data)、[Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)、[Agent Memory 评测](/note/Engineering/memory-evaluation-for-agents)、[Agent 反馈闭环](/note/Engineering/agent-feedback-loop) |
| AI 编程 / Code Agent | [Tool Calling](/note/AI-Agent/tool-calling)、[Agent Runtime](/note/AI-Agent/agent-runtime) | [Code Agent 工程化](/topics/code-agent-engineering)、[Skills 编写](/note/AI-Tools/skill-authoring)、[Skill 测试与版本管理](/note/AI-Tools/skill-testing-versioning)、[Skill 运营手册](/note/AI-Tools/skill-operations-playbook)、[AI 编程审查清单](/topics/ai-coding-review-checklist) |
| 数据分析 Agent / SaaS 产品化 | [Structured Output](/note/Engineering/structured-output-engineering)、[Agent UI](/topics/agent-ui-product-design) | [AI Agent PRD 模板](/topics/ai-agent-prd-template)、[Agent Product Metrics](/topics/agent-product-metrics)、[Agent SaaS 产品化](/topics/agent-saas-productization)、[Agent SaaS 多租户、RBAC 与配额设计](/topics/agent-saas-tenant-rbac-quota)、[数据分析 Agent](/topics/data-analysis-agent)、[数据分析 Agent 安全](/topics/data-analysis-agent-security)、[Human Takeover 运营台](/topics/human-takeover-operations-console)、[Browser Automation Testing](/topics/browser-automation-testing-agent-ui)、[Agent 反馈闭环](/note/Engineering/agent-feedback-loop) |
| AI 系统设计题 | [Agent 系统设计面试题](/topics/agent-system-design-interview)、[Agent 开发 Playbook](/topics/agent-development-playbook) | [Agent Capability Matrix](/topics/agent-capability-matrix)、[Agent 系统设计案例库](/topics/agent-system-design-casebook)、[生产级 Agent Readiness Review](/topics/agent-production-readiness-review)、[AI 项目设计文档模板](/topics/ai-project-design-doc-template)、[AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)、[Agent Approval Workflow](/note/Engineering/agent-approval-workflow)、[Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)、[Agent Release Gate](/note/Engineering/agent-release-gate)、[生产级 Agent 治理清单](/topics/production-agent-governance-checklist) |
| [LangChain / LangGraph 面试题](/note/AI-Interview/langchain-interview) | [LangGraph](/note/AI-Agent/langgraph)、[Human-in-the-loop](/note/AI-Agent/human-in-the-loop) | [Agent Trace](/note/Engineering/agent-trace)、[Evaluation Pipeline](/note/Engineering/eval-pipeline) |
