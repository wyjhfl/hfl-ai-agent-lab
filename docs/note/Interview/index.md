# 项目面试表达

## 这个模块解决什么问题

这个目录不是通用面试题库，而是**项目面试表达素材库**。

站内有两个面试相关目录：

- [AI Agent 面试题库](/note/AI-Interview/)：通用技术题库，重点是 Agent、RAG、Tool Calling、LangGraph、大模型工程等技术问答。
- [项目面试表达](/note/Interview/)：项目表达素材，重点是简历描述、项目一分钟介绍、项目深挖回答和项目追问。

这样拆分后，读者可以更清楚地判断：想刷技术题看 AI-Interview，想准备项目讲法看 Interview。

## 项目面试表达的基本结构

一个项目通常要讲清楚 6 件事：

1. 为什么做这个项目
2. 解决了什么业务问题
3. 系统架构如何设计
4. 关键技术难点是什么
5. 你具体负责什么
6. 最终有什么结果或收获

## 技术表达原则

### 不只说用了什么

不要只说：

> 我用了 LangGraph、RAG、FastAPI。

更好的表达是：

> 我用 LangGraph 把 Agent 的执行过程显式建模为状态机，避免多步骤任务完全依赖模型自由生成，从而提升流程可控性和可调试性。

### 不只说实现了什么

不要只说：

> 我实现了工具调用。

更好的表达是：

> 我把工具调用封装成统一接口，让 Agent 只负责选择工具和生成参数，真正执行由工具层完成，并记录每次调用的输入、输出和错误信息，方便后续追踪和评估。

### 不只说项目很复杂

不要只说：

> 这个项目用了多 Agent，所以比较复杂。

更好的表达是：

> 我没有把多 Agent 设计成自由对话，而是按照业务流程拆分角色，并通过状态机约束每个 Agent 的输入输出和执行顺序，从而保证系统可控。

## 当前内容

- [项目 B 一分钟介绍](/note/Interview/project-b-one-minute)
- [项目 B 深挖版](/note/Interview/project-b-deep-dive)
- [简历描述模板](/note/Interview/resume-bullets)
- [Agent Capability Matrix](/topics/agent-capability-matrix)
- [AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix)
- [AI Agent Job Search Evidence Map](/topics/ai-agent-job-search-evidence-map)
- [AI Agent Interview Story Bank](/topics/ai-agent-interview-story-bank)
- [AI Agent Career Readiness Checklist](/topics/ai-agent-career-readiness-checklist)
- [AI Agent Offer Portfolio Review](/topics/ai-agent-offer-portfolio-review)
- [AI Agent 项目包装：简历、作品集和面试讲法](/topics/ai-agent-project-packaging)
- [AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)
- [AI Agent 项目答辩稿](/topics/ai-agent-project-defense-script)
- [AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)
- [生产级 Agent Readiness Review](/topics/agent-production-readiness-review)
- [AI Agent Enterprise Pilot Plan](/topics/ai-agent-enterprise-pilot-plan)
- [AI Agent CTO Review Checklist](/topics/ai-agent-cto-review-checklist)
- [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan)
- [AI Agent 面试追问地图](/topics/ai-agent-interview-followup-map)
- [AI 项目设计文档模板](/topics/ai-project-design-doc-template)
- [AI Agent 产品需求文档 PRD 模板](/topics/ai-agent-prd-template)
- [Agent Product Metrics](/topics/agent-product-metrics)
- [Agent SaaS 多租户、RBAC 与配额设计](/topics/agent-saas-tenant-rbac-quota)
- [LLM 数据治理](/note/Engineering/llm-data-governance)
- [Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth)
- [AI Agent Security Interview Guide](/topics/ai-agent-security-interview-guide)
- [OWASP LLM Top 10 for Agents](/note/Engineering/owasp-llm-top10-agent-mapping)
- [Agent Guardrails Pipeline](/note/Engineering/agent-guardrails-pipeline)
- [Agent Identity and RBAC](/note/Engineering/agent-identity-rbac-design)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [Agent 系统设计案例库](/topics/agent-system-design-casebook)
- [Agent System Design Whiteboard Template](/topics/agent-system-design-whiteboard-template)
- [数据分析 Agent 项目方向](/topics/data-analysis-agent)
- [数据分析 Agent 安全](/topics/data-analysis-agent-security)
- [Agent SaaS 产品化项目方向](/topics/agent-saas-productization)
- [Code Agent 工程化项目方向](/topics/code-agent-engineering)
- [Agent 编排模式](/topics/agent-orchestration-patterns)
- [Agent 红队演练](/note/Engineering/agent-red-team-playbook)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
- [Tool Idempotency Side Effect](/note/Engineering/tool-idempotency-side-effect)
- [Conversation Regression Testing](/topics/conversation-regression-testing)
- [Agent Contract Testing](/topics/agent-contract-testing)
- [Agent 错误分类](/note/Engineering/agent-error-taxonomy)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [MCP OAuth Authorization Design](/note/Engineering/mcp-oauth-authorization-design)
- [MCP Token Exchange](/note/Engineering/mcp-token-exchange)
- [Skill 测试与版本管理](/note/AI-Tools/skill-testing-versioning)
- [Skill Review Checklist](/note/AI-Tools/skill-review-checklist)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent Memory 评测](/note/Engineering/memory-evaluation-for-agents)
- [Memory Privacy Retention](/note/Engineering/memory-privacy-retention)
- [Context Window 管理](/note/AI-Agent/context-window-management)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)
- [MCP Observability Metrics](/note/Engineering/mcp-observability-metrics)
- [MCP Server Hardening](/note/Engineering/mcp-server-hardening)
- [MCP Server Template for Agents](/note/Engineering/mcp-server-template-for-agents)
- [MCP Resources and Prompts Design](/note/Engineering/mcp-resources-prompts-design)
- [MCP 供应链风险](/note/Engineering/mcp-supply-chain-risk)
- [MCP Sandbox Profile](/note/Engineering/mcp-sandbox-profile)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
- [Browser Automation Testing](/topics/browser-automation-testing-agent-ui)
- [Browser Agent E2E Acceptance](/topics/browser-agent-e2e-acceptance)
- [Computer Use Agent Safety](/note/Engineering/computer-use-agent-safety)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [OpenAI Agents SDK Engineering](/note/Engineering/openai-agents-sdk-engineering)
- [Responses API Tool Orchestration](/note/Engineering/responses-api-tool-orchestration)
- [Agent UI State Machine](/note/Engineering/agent-ui-state-machine)
- [Agent Frontend Telemetry](/note/Engineering/agent-frontend-telemetry)
- [Agent UI Pattern Library](/topics/agent-ui-pattern-library)
- [AI Agent Portfolio UI Blueprint](/topics/ai-agent-portfolio-ui-blueprint)
- [AI Agent Site UI Optimization Playbook](/topics/ai-agent-site-ui-optimization-playbook)
- [Agent Autonomy Levels](/note/Engineering/agent-autonomy-levels)
- [Multi-Agent Handoff Protocol](/note/Engineering/multi-agent-handoff-protocol)
- [Agent Scheduler 与 Cron](/note/Engineering/agent-scheduler-cron)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
- [Eval Drift Monitoring](/note/Engineering/eval-drift-monitoring)
- [Eval Case Lifecycle](/note/Engineering/eval-case-lifecycle)
- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
- [RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)
- [RAG Ingestion Quality Gate](/note/Engineering/rag-ingestion-quality-gate)
- [RAG 知识生命周期](/note/Engineering/rag-knowledge-lifecycle)
- [RAG 权限过滤](/note/Engineering/rag-permission-filtering)
- [RAG Freshness Evaluation](/note/Engineering/rag-freshness-evaluation)
- [RAG Query Router](/note/Engineering/rag-query-router)
- [RAG Grounding Contract](/note/Engineering/rag-grounding-contract)
- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
- [LLM Output Safety Filter](/note/Engineering/llm-output-safety-filter)
- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [Agent 配置治理](/note/Engineering/agent-configuration-management)
- [Agent 审计日志设计](/note/Engineering/agent-audit-log-design)
- [Agent Secret Management](/note/Engineering/agent-secret-management)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Version Deprecation](/note/Engineering/mcp-version-deprecation)
- [Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)
- [MCP Client 测试](/note/Engineering/mcp-client-testing)
- [Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing)
- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [LLM Cost Anomaly Detection](/note/Engineering/llm-cost-anomaly-detection)
- [LLM Request Ledger](/note/Engineering/llm-request-ledger)
- [Agent Latency Budget](/note/Engineering/agent-latency-budget)
- [Model Provider Failover](/note/Engineering/model-provider-failover)
- [LLM Semantic Cache](/note/Engineering/llm-semantic-cache)
- [Model Rollout Canary](/note/Engineering/model-rollout-canary)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
- [Skill 运营手册](/note/AI-Tools/skill-operations-playbook)
- [Agent 事故复盘模板](/topics/agent-incident-postmortem-template)
- [Agent Run Replay](/note/Engineering/agent-run-replay)
- [Agent Feedback Triage](/note/Engineering/agent-feedback-triage)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
- [Agent 故障演练](/note/Engineering/agent-production-failure-drill)
- [RAG 设计问答](/note/Interview/rag-qa)
- [Multi-Agent 设计问答](/note/Interview/multi-agent-qa)
- [LangGraph 设计问答](/note/Interview/langgraph-qa)

## 本批次新增项目表达角度

这批内容可以直接补到项目深挖和作品集讲法里：

- **Tool Registry**：不要只说“我做了工具调用”，要说清楚工具如何注册、版本化、分风险等级、按角色授权、审批和审计。
- **Tool Output Normalization**：不要让模型直接读原始工具返回，要讲 status、key_fields、error、retry_policy、redaction 和 raw_ref。
- **Tool Risk Classification**：不要把所有工具都当成函数调用，要讲 R0-R4 风险分级、权限、审批、沙箱和审计。
- **Tool Idempotency Side Effect**：不要只说“工具失败会重试”，要讲 idempotency_key、args_hash、side_effect_log、补偿动作和重复执行防护。
- **Human Takeover 运营台**：不要把人工接管当作失败兜底，而要说成生产级可靠性设计，包括接管队列、摘要、Trace 查看、审批、重跑和失败标注。
- **Browser Automation Testing**：不要只说接口测试通过，要说明如何用 Playwright 验证上传、问答、引用、任务状态、工具审批和运营台流程。
- **Agent Benchmark**：不要凭感觉说多 Agent 更好，要用固定任务集比较质量、成本、延迟、安全、恢复能力和 Trace 完整度。
- **AI Agent PRD**：不要一上来写代码，要先把用户、场景、P0/P1 范围、权限审批、产品指标和验收标准写清楚。
- **Context Window 管理**：不要说“大上下文全塞进去”，要讲 token 预算、历史压缩、证据排序、Memory 过滤和上下文 Trace。
- **Context Packing**：不要只拼 Prompt，要讲 task_brief、constraints、evidence_pack、tool_result_pack 和 context_pack 快照。
- **MCP Gateway**：不要只说“接入 MCP”，要讲 server registry、schema cache、policy filter、secret boundary、approval 和 audit。
- **Tool Call Replay**：不要只说“工具偶发失败”，要讲 tool_call_id、schema、参数、审批、结果快照以及 dry/mock/live 三种回放模式。
- **Multi-Agent Handoff**：不要只说“多个 Agent 协作”，要讲 handoff payload、evidence_refs、constraints、acceptance_criteria 和责任归属。
- **Memory Evaluation**：不要只说“做了记忆”，要讲 should remember / should not remember / update / forget / injection 测试集。
- **Memory Privacy Retention**：不要只说“做了长期记忆”，要讲 should_remember、PII、retention、forget request 和跨租户隔离。
- **Queue / Backpressure**：不要只说“异步任务”，要讲优先级队列、资源并发、背压信号、熔断和死信队列。
- **Skill Testing**：不要只说“写了 Skill”，要讲触发测试、流程测试、输出测试、安全测试、回归样例和 changelog。
- **Skill Review Checklist**：不要只说“写了 Skill”，要讲 frontmatter、渐进加载、脚本、验收标准和安全审查。
- **MCP Security**：不要只说“接入 MCP”，要讲 scope、tenant、role、secret boundary、schema pinning 和 audit。
- **MCP OAuth Authorization**：不要只说“配了 API Key”，要讲 Authorization Server、scope、audience、短期 token、刷新撤销和 approval 绑定。
- **MCP Sandbox Profile**：不要让所有 MCP 工具共用运行环境，要讲文件、网络、命令、Secret、资源预算和审计边界。
- **MCP Token Exchange**：不要让 MCP Server 共用全局 Token，要讲 run、tool、scope、args_hash、approval 绑定的短期凭证。
- **MCP Observability Metrics**：不要只说“MCP 能启动”，要讲 server health、schema diff、tool success、token exchange、approval 和 sandbox 指标。
- **OpenTelemetry GenAI**：不要只看 HTTP 200，要讲 agent.run、gen_ai.request、rag.retrieve、tool.call、policy.denied 和 cost event 如何串成 Trace。
- **Agent Observability Dashboard**：不要只展示日志，要讲 task success、p95 latency、cost per success、tool error、RAG hit、safety block 和 UX 信任信号。
- **Error Taxonomy**：不要把失败都归因成模型不行，要区分输入、权限、上下文、检索、模型、工具、运行时和基础设施错误。
- **Contract / Regression Testing**：不要只说“做了测试”，要讲接口契约、状态机契约、MCP schema 契约和对话回归样例。
- **Agent Workflow 状态机**：不要只说“Agent 会自己规划”，要讲 Created、Queued、Planning、RunningTool、WaitingApproval、Completed、Failed 等状态和转移规则。
- **Agent UI State Machine**：不要只用 loading/error，要讲 queued、planning、waiting_approval、running_tool、failed_retryable 和 allowed_actions。
- **Agent Frontend Telemetry**：不要只看后端 Trace，要讲前端如何采集证据查看、审批、重试、转人工和反馈。
- **Agent UI Pattern Library**：不要只展示聊天框，要讲 Task Intake、Plan Preview、Tool Approval、Evidence Panel、Trace Timeline 和 Recovery Panel。
- **Computer Use Safety**：不要只说能自动点网页，要讲观察、风险分类、具体确认、before/after trace 和第三方指令隔离。
- **Realtime Voice Agent**：不要只说 ASR+LLM+TTS，要讲低延迟、打断、高风险确认、语音 UI 和指标。
- **Agent Autonomy Levels**：不要只说“Agent 自主执行”，要讲 L0-L5 自主等级、工具风险、审批和灰度。
- **LLM Evaluation Scorecard**：不要只说“效果不错”，要讲 task success、factuality、grounding、format、tool correctness、safety、cost、latency 的评分卡。
- **MCP Tool Schema**：不要只说“接了 MCP 工具”，要讲工具命名、描述、参数、输出、错误、风险等级和 schema version。
- **MCP Version Deprecation**：不要随意改 MCP schema，要讲 schema diff、deprecated_since、sunset_at、migration_note 和旧版本使用量。
- **MCP Client Testing**：不要只测 Server 启动，要讲 fake server、工具发现、policy filter、error mapping、timeout 和 Prompt Injection 样本。
- **RAG Citation Evaluation**：不要只说“答案带引用”，要讲 citation coverage、faithfulness、permission、freshness 和 no-answer。
- **RAG Query Router**：不要让所有问题都走同一个向量检索，要讲 FAQ、政策、多跳、SQL、拒答和工具调用如何路由。
- **RAG Metadata Schema**：不要只存 text 和 embedding，要讲 tenant、ACL、status、version、semantic_type 和 citation。
- **Agent Control Plane**：不要把模型、Prompt、工具策略散落在业务代码里，要讲 model registry、prompt registry、tool policy、eval gate、budget 和 release。
- **Agent Configuration Management**：不要把 Prompt、模型、工具和预算写死在代码里，要讲环境隔离、配置版本、diff review、灰度和回滚。
- **MCP Gateway Operations**：不要只讲 Gateway 架构，要讲 health、schema diff、latency、error、quota、degrade 和 postmortem。
- **Data Analysis Agent Security**：不要只说 NL2SQL，要讲语义层、SQL guardrails、权限、cost estimate、脱敏和洞察校验。
- **PII Redaction**：不要只说“不会泄漏数据”，要讲输入、RAG、工具、Trace、缓存和评测集中的 mask、tokenize、hash 与删除策略。
- **Tenant Isolation Testing**：不要只说“支持多租户”，要讲 API、RAG、Vector Metadata、MCP、Memory、Cache、Trace 和 Billing 的隔离测试。
- **LLM Cost Budget**：不要只说“做了成本优化”，要讲 cost_per_task、p95_cost、cost_per_success、model_mix、cache_hit_rate 和 retry_cost_ratio。
- **LLM Cost Anomaly Detection**：不要月底才看账单，要讲 cost_per_success、p95_cost、retry_cost_ratio、model_mix 和 cache_hit_rate。
- **LLM Request Ledger**：不要只看总 token，要讲每次 request 如何按 tenant、feature、model、prompt_version、release 和 run_id 记账。
- **Agent Latency Budget**：不要只说“换更快模型”，要讲 queue、planning、retrieval、tool、approval、retry 和前端感知延迟。
- **Model Provider Failover**：不要只说“模型挂了就重试”，要讲同供应商降级、跨供应商切换、功能降级和人工接管。
- **Eval Drift Monitoring**：不要只说“上线前测过”，要讲线上抽样、golden set、分桶趋势、Judge 校准和漂移响应。
- **Eval Failure Clustering**：不要只汇报通过率，要讲失败样本如何按根因聚类、分配 owner、进入回归集。
- **Eval Case Lifecycle**：不要让评测集无人维护，要讲 candidate、脱敏、标注、审核、active、flaky、deprecated 和 archived。
- **Model Rollout Canary**：不要只说“换了更好的模型”，要讲 offline eval、shadow、canary、ramp-up、自动回滚和风险阈值。
- **Skill Operations**：不要只说“写了 Skill”，要讲版本、触发测试、输出测试、安全测试、反馈、漂移修复和废弃策略。
- **Agent Incident Postmortem**：不要只说“线上问题已修复”，要讲事故摘要、时间线、Trace、错误分类、回归样本和 Release Gate 更新。
- **Agent Run Replay**：不要只说“看日志排查”，要讲 input、config、context、retrieval、tool、model、output 快照和 replay 模式。
- **Agent Decision Record**：不要只记录最终答案，要讲关键决策的候选项、依据、策略版本、风险等级和结果。
- **Portfolio Case Study**：不要把作品集写成技术栈列表，要讲背景、目标、架构、Workflow、评测、安全、难点和 60 秒版本。
- **Demo Acceptance Script**：不要临场随意演示，要按主路径、权限、工具风险、失败恢复、Trace、评测和指标准备验收脚本。
- **System Design Whiteboard**：不要只画 LLM 到工具，要按任务边界、Runtime、RAG、Tool/MCP、Data、Observability 和 Governance 白板表达。
- **Resume Project Matrix**：不要把简历 bullet 写成“熟悉 RAG/Agent”，要把每条经历映射到 Workflow、Tool、MCP、Eval、Security、Cost、Ops 和 Product 能力证据。
- **Interview Story Bank**：不要只背项目介绍，要把失败、权衡和结果整理成 STAR 故事并绑定能力标签。
- **Career Readiness Checklist**：不要只学技术点，要检查项目、作品集、演示、评测、STAR 故事和简历 bullet 是否达标。
- **Offer Portfolio Review**：不要写完作品集就投递，要在投递前检查项目主线、能力证据、Demo、指标和面试追问是否闭环。
- **Agent Product Metrics**：不要只说“用户觉得好用”，要讲 task completion、handoff、correction、trust signal、cost 和 latency 如何共同证明产品价值。
- **LLM Data Governance**：不要只说“收集日志做优化”，要讲数据分级、脱敏、用途隔离、保留周期、删除请求和评测/训练集 lineage。
- **Agent Release Gate**：不要把上线说成“测试通过”，要讲 code、contract、eval、RAG、safety、cost、latency、ops 和 product gate。
- **Agent Approval Workflow**：不要只说“危险操作会问用户”，要讲模型提议、策略判断、审批卡片、参数哈希、执行层校验和审计 Trace。
- **LLM Semantic Cache**：不要只说“加缓存降成本”，要讲语义相似、tenant/scope 隔离、knowledge_version、prompt_version、误命中率和陈旧答案失效。
- **Agent Scheduler**：不要只说“定时任务”，要讲 cron/interval/event、window 幂等键、并发预算、熔断和 schedule Trace。
- **MCP Server Hardening**：不要只说“写了 MCP Server”，要讲风险分级、参数校验、超时限流、错误映射、schema version 和审计日志。
- **MCP Server Template**：不要只暴露一个函数，要讲 Tools、Resources、Prompts、Policy、Telemetry、结构化错误和测试清单。
- **MCP Resources / Prompts**：不要把只读上下文和固定流程都做成 Tool，要讲 resource URI、prompt template 和权限过滤。
- **RAG Evaluation Report**：不要只说“RAG 效果提升”，要讲评测目标、数据集分层、指标对比、失败归因、成本延迟和安全结果。
- **RAG Ingestion Quality Gate**：不要只说“文档已入库”，要讲解析质量、metadata、ACL、chunk、PII、embedding 和召回 smoke。
- **Production Failure Drill**：不要只说“有监控”，要讲模型延迟、RAG 退化、工具超时、审批卡住、租户隔离和成本失控的演练。
- **Agent SLO / Error Budget**：不要只说“系统稳定”，要讲 task success、grounding、tool success、approval timeout、cost 和 safety budget。
- **Production Readiness Review**：不要只列技术栈，要从任务边界、Workflow、RAG、Tool/MCP、Memory、评测、安全、成本、运维和发布十个维度审查。
- **Agent Audit Log**：不要只说“有日志”，要讲 actor、action、target、risk、policy、hash、脱敏 metadata 和 append-only。
- **Agent Secret Management**：不要把密钥放环境变量就结束，要讲 Secret Store、Token Broker、最小权限、短期凭证和脱敏 Trace。
- **LLM Cost Chargeback**：不要只说“有成本控制”，要讲成本如何按 tenant、feature、agent、model、run 分摊。
- **RAG Knowledge Lifecycle**：不要只说“文档入库”，要讲版本、生效期、过期、权限变更、索引更新和缓存失效。
- **Agent Feedback Triage**：不要把点踩当作一句抱怨，要讲如何关联 run_id、Trace、RAG、工具、Prompt、模型并分诊到 owner。
- **RAG Permission Filtering**：不要只说“做了多租户”，要讲 tenant、workspace、ACL、classification、status、citation 和缓存隔离。
- **RAG Freshness Evaluation**：不要只说“文档入库成功”，要讲新文档、更新、过期、删除、权限变更和缓存失效如何评测。
- **RAG Grounding Contract**：不要只说“答案有引用”，要讲 claim-to-citation、no-answer、权限、freshness 和 unsupported claim。
- **MCP Supply Chain Risk**：不要只说“用了 MCP”，要讲 Server 来源、版本 pin、schema diff、依赖风险、沙箱和审计。
- **Enterprise Pilot Plan**：不要只展示 Demo，要讲试点范围、种子用户、禁用能力、指标、风险和退出条件。
- **CTO Review Checklist**：不要从技术栈开始汇报，要从业务价值、风险、成本、质量、运维和维护责任回答。
- **Prompt Injection Defense**：不要只靠系统提示，要讲 untrusted evidence、tool policy、审批、沙箱、审计和对抗回归测试。
- **OWASP LLM Top 10 Mapping**：不要只背安全名词，要把 Prompt Injection、敏感泄漏、供应链、过度代理和成本消耗映射到 Agent 控制点。
- **Agent Guardrails Pipeline**：不要只说“加 guardrail”，要讲 input、retrieval、context、tool、output、feedback 六个防护位置。
- **Agent Identity / RBAC**：不要让 Agent 用全局系统账号，要讲 user_identity、agent_identity、tool_identity、tenant、role、scope 和审计。
- **LLM Output Safety Filter**：不要只做输入安全，要讲输出 schema、citation、PII、policy、grounding 和 compliance 检查。
- **Prompt Regression Testing**：不要说“Prompt 改完我看过”，要讲 smoke、golden、failure replay、adversarial 和 schema/citation/tool assertion。
- **SaaS Tenant / RBAC / Quota**：不要只说“支持团队使用”，要讲 tenant、workspace、role、permission、quota、usage、billing 和审计隔离。

## 后续补充方向

后续这个目录会继续沉淀：

- 项目 A / 项目 B 的完整面试讲法
- 项目架构图对应的讲解稿
- 面试官追问清单
- 简历 bullet 与项目页面之间的映射
- “一分钟介绍 → 深挖回答 → 反问准备”的表达链路

## 推荐组合阅读

如果已经有项目代码，但不知道怎么讲，建议按下面顺序整理：

1. 先看 [Agent Capability Matrix](/topics/agent-capability-matrix)、[AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix)、[AI Agent Interview Story Bank](/topics/ai-agent-interview-story-bank) 和 [AI Agent Career Readiness Checklist](/topics/ai-agent-career-readiness-checklist)，确认项目能证明哪些能力域，并把能力映射到简历 bullet。
2. 再看 [AI Agent 项目包装](/topics/ai-agent-project-packaging)、[AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)、[AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)、[AI Agent 项目答辩稿](/topics/ai-agent-project-defense-script) 和 [AI Agent Offer Portfolio Review](/topics/ai-agent-offer-portfolio-review)，把项目改写成“业务问题 + 架构 + Workflow + 难点 + 指标 + 贡献 + 5 分钟演示 + 投递前审查”。
3. 再看 [简历描述模板](/note/Interview/resume-bullets)，把项目压缩成 2-4 条简历 bullet。
4. 最后回到 [AI Agent 面试题库](/note/AI-Interview/)，准备技术追问。

如果距离面试时间较近，可以直接按 [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan) 执行，每周分别覆盖 Agent 基础、RAG、生产级工程和项目表达。

如果需要补充作品集项目方向，可以先用 [AI 项目设计文档模板](/topics/ai-project-design-doc-template) 写清楚方案，再用 [AI Agent PRD 模板](/topics/ai-agent-prd-template) 和 [Agent Product Metrics](/topics/agent-product-metrics) 写清楚用户、范围、指标和验收标准，然后从 [数据分析 Agent](/topics/data-analysis-agent) 与 [数据分析 Agent 安全](/topics/data-analysis-agent-security)、[Code Agent 工程化](/topics/code-agent-engineering)、[Agent SaaS 产品化](/topics/agent-saas-productization) 与 [Agent SaaS 多租户、RBAC 与配额设计](/topics/agent-saas-tenant-rbac-quota) 中选择一个，分别对应数据智能、AI 编程工具和商业化产品能力。

项目深挖时，建议额外准备五类追问：一类是 [Agent System Design Whiteboard Template](/topics/agent-system-design-whiteboard-template)、[Agent 编排模式](/topics/agent-orchestration-patterns) 和 [Multi-Agent Handoff](/note/Engineering/multi-agent-handoff-protocol)，说明为什么选择 Router、Planner、Supervisor 或状态机以及角色如何交接；一类是 [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)、[Tool Idempotency Side Effect](/note/Engineering/tool-idempotency-side-effect) 和 [Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)，说明工具如何治理、幂等和排障；一类是 [RAG Query Router](/note/Engineering/rag-query-router)、[Agent Benchmark 设计](/note/Engineering/agent-benchmark-design) 与 [Model Rollout Canary](/note/Engineering/model-rollout-canary)，说明如何证明方案收益并安全替换模型；一类是 [Agent 配置治理](/note/Engineering/agent-configuration-management)、[LLM Request Ledger](/note/Engineering/llm-request-ledger) 和 [Agent Feedback Triage](/note/Engineering/agent-feedback-triage)，说明 Prompt、模型、工具策略、成本和反馈如何进入运营闭环；另一类是 [MCP Sandbox Profile](/note/Engineering/mcp-sandbox-profile)、[Agent 红队演练](/note/Engineering/agent-red-team-playbook) 与 [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)，说明上线前如何主动验证安全边界。

如果遇到系统设计题，可以按 [Agent 系统设计案例库](/topics/agent-system-design-casebook) 的 6 类案例练习：企业知识库、数据分析、Code Review、客服工单、多 Agent 研究助手和 Agent SaaS；如果面试官追问产品化落地，再补充 [Human Takeover 运营台](/topics/human-takeover-operations-console)、[Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth) 和 [Agent Release Gate](/note/Engineering/agent-release-gate)，说明系统如何被运营、验收和安全发布。
