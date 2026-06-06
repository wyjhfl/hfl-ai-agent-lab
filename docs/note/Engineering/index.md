# AI Agent 工程化笔记

这不是一组普通后端学习笔记，而是围绕 AI Agent、RAG 和 Multi-Agent 项目落地所需要的工程能力地图。

AI Agent 项目不能只停留在模型调用和 Prompt 层面。一个可上线、可维护、可评估的 Agent 系统，至少需要后端服务、数据存储、RAG 检索、工具权限、异步任务、执行轨迹、评测体系、安全控制和部署运维。

## 1. 为什么需要工程化笔记

Demo 阶段通常只需要模型调用和简单 Prompt。只要能把用户输入传给模型，再把模型输出展示出来，就可以完成一个演示版本。

项目阶段完全不同。真实系统要面对用户、数据、权限、成本、延迟、失败重试、线上部署和问题排查。此时需要接口、数据库、日志、队列、权限、Trace、Evaluation 等工程模块共同支撑。

面试时，工程化能力比“会调一个框架”更能体现真实项目能力。因为企业更关心候选人能否把 AI 能力接入业务系统、能否排查线上问题、能否控制风险、能否持续评估效果。

工程化笔记的目标不是堆技术名词，而是建立一套可迁移的方法：面对一个 Agent 或 RAG 项目时，知道应该从接口、数据、任务、工具、执行轨迹、评测和部署几个层面设计系统。

## 2. AI Agent 工程化能力地图

| 工程层级 | 核心内容 | 对 Agent 项目的价值 |
| --- | --- | --- |
| 后端接口层 | FastAPI、路由、请求校验、统一响应、鉴权 | 提供稳定的任务入口、RAG 问答入口、文件上传入口和状态查询入口 |
| LLM Gateway 层 | 模型路由、限流、成本、Prompt 版本、降级和审计 | 把模型调用从业务代码中抽离，统一治理多模型访问 |
| Structured Output 层 | JSON Schema、Pydantic、TypeScript 类型、字段校验、输出修复 | 让模型输出可解析、可落库、可渲染、可评测，而不是只能给人读 |
| Context Window 管理层 | token 预算、历史压缩、证据排序、Memory 过滤、上下文 Trace | 控制长上下文成本、相关性、可信边界和可复盘性 |
| PromptOps 层 | Prompt Registry、版本、评测、灰度、回滚、调用审计 | 把 Prompt 从临时代码字符串变成可治理的工程资产 |
| Prompt Regression 层 | smoke、golden、failure replay、adversarial、schema/citation/tool assertion | 防止 Prompt、模型、工具和 RAG 变更破坏历史能力 |
| 成本与延迟优化层 | 调用账本、模型路由、缓存、批处理、降级、p95 延迟 | 让 Agent 不只是能跑，还能在预算和 SLA 内稳定运行 |
| 成本预算层 | token、模型、embedding、rerank、tool、eval、human review、infra | 把 Agent 成本从事后账单变成上线前预算和门禁 |
| LLM Semantic Cache 层 | query normalize、embedding 相似度、版本失效、权限隔离、误命中监控 | 在不牺牲安全和可信度的前提下降低成本与延迟 |
| LLM Cost Chargeback 层 | cost ledger、tenant、feature、model、retry、cache saving、quota | 把成本拆到租户、功能和任务，支撑预算、限额和商业化 |
| 多模型治理层 | 路由策略、A/B 实验、Shadow Traffic、Canary、自动回滚 | 让模型切换和新模型上线可评测、可灰度、可追溯 |
| Model Rollout Canary 层 | offline eval、shadow traffic、canary、ramp-up、rollback trigger | 让新模型上线可控、可观测、可回滚 |
| 数据存储层 | 用户、任务、文档、工具调用、Trace、评测结果 | 保存业务状态和运行证据，让系统可追踪、可恢复、可评估 |
| RAG 检索层 | 文档解析、Chunk、Embedding、Hybrid Search、Rerank、引用溯源 | 让模型基于外部知识回答，并能解释答案来源 |
| RAG 入库层 | 文件校验、解析、Normalize、Chunk、Metadata、Embedding、索引、质量检查 | 把原始文件稳定转成可检索、可追溯、可更新的知识资产 |
| RAG Debug 层 | Query Rewrite、召回、Filter、Rerank、Context Pack、Citation Trace | 定位答案差到底是入库、检索、排序、上下文还是生成问题 |
| RAG Citation Evaluation 层 | citation coverage、faithfulness、permission、freshness、no-answer | 验证引用是否真的支持答案，而不是只显示来源链接 |
| RAG Evaluation Report 层 | 数据集、Pipeline 配置、指标、失败归因、成本延迟、安全结果 | 把 RAG 优化过程沉淀成可复现、可面试表达的报告 |
| RAG Knowledge Lifecycle 层 | document version、status、effective time、ACL、index version、cache invalidation | 治理文档新增、更新、过期、删除和权限变化 |
| RAG Permission Filtering 层 | tenant、workspace、ACL、classification、status、permission_filter_hash | 防止企业知识库和缓存跨租户、跨角色泄漏 |
| 向量数据库层 | Collection、Metadata、索引、过滤查询、增量更新 | 支撑高质量召回、权限过滤、引用定位和检索性能优化 |
| Embedding 评测迁移层 | Recall@k、MRR、hard negative、shadow query、canary、collection 版本 | 安全替换向量模型，避免召回质量和权限过滤退化 |
| GraphRAG 层 | 实体、关系、子图、社区摘要、路径检索 | 支撑多跳关系、全局结构和复杂知识推理 |
| 企业权限层 | tenant、workspace、ACL、metadata filter、缓存隔离 | 防止企业知识库和多租户 RAG 检索泄漏数据 |
| 租户隔离测试层 | API、RAG、Vector Metadata、MCP、Memory、Cache、Trace、Billing | 用对抗样本证明多租户 Agent 不会跨客户泄漏 |
| 异步任务层 | 任务队列、Worker、状态机、超时、重试、幂等 | 处理文档入库、长时间 Agent 执行、批量评测等耗时任务 |
| Queue / Backpressure 层 | 优先级队列、资源并发、限流、熔断、死信队列、压力信号 | 防止长任务、工具失败和重试风暴压垮在线服务 |
| 失败恢复层 | 状态机、幂等键、断点续跑、补偿、人工介入 | 让长任务在模型、工具、服务失败后能安全恢复 |
| Workflow 状态机层 | Created、Queued、Planning、RunningTool、WaitingApproval、Completed、Failed | 把 Agent 长任务从自由对话变成可恢复、可审计、可展示的执行轨道 |
| Multi-Agent Handoff 层 | handoff_id、from/to agent、evidence_refs、constraints、acceptance criteria | 让多 Agent 交接有边界、有证据、有验收 |
| Agent Scheduler 层 | cron、interval、delay、event、幂等键、并发、预算、熔断 | 支撑定时报表、周期巡检、批量评测和延迟跟进任务 |
| Agent 错误分类层 | input、policy、context、retrieval、model、tool、runtime、infra、ux error | 把失败变成可定位、可统计、可恢复、可回归的工程信号 |
| Human Takeover 层 | 接管队列、任务摘要、Trace 查看、人工审批、重跑、失败标注 | 把人工运营纳入可靠性闭环，避免高风险或低置信度任务失控 |
| 工具权限层 | 工具注册、参数校验、权限控制、审批、审计 | 控制 Agent 能调用什么工具、在什么条件下调用、如何追责 |
| Tool Registry 层 | tool_id、版本、schema、风险等级、owner、启停、监控和审计 | 把工具从散落函数变成可治理、可授权、可评测的资产 |
| Tool Risk Classification 层 | R0-R4、敏感读取、可逆写、高影响写、危险操作、审批和沙箱 | 按副作用和数据敏感度控制 Agent 工具调用风险 |
| Tool Call Replay 层 | tool_call_id、schema_version、args_hash、policy、approval、dry/mock/live replay | 把工具失败变成可回放、可归因、可回归的调试资产 |
| 工具沙箱层 | 文件/网络/命令/数据沙箱、MCP 权限审计 | 限制工具调用的环境边界，避免越权、注入和危险副作用 |
| 安全治理层 | Prompt Injection、防越权、数据脱敏、工具风险分级 | 把模型放进受控执行环境，避免工具滥用和数据泄漏 |
| Prompt Injection 纵深防御层 | untrusted evidence、retrieval 清洗、tool policy、approval、sandbox、adversarial regression | 防止外部内容诱导模型越权执行工具或泄漏数据 |
| Trace 可观测层 | Run ID、Step ID、工具调用记录、状态变化、错误定位 | 还原 Agent 执行过程，支持调试、复盘和质量分析 |
| Agent Control Plane 层 | model registry、prompt registry、tool policy、eval gate、budget、release | 把 Agent 运行策略从业务代码中抽离，统一灰度和回滚 |
| Agent Configuration Management 层 | agent profile、policy version、config snapshot、schema validation、rollback | 让模型、Prompt、RAG、工具和预算配置可治理 |
| Agent Approval Workflow 层 | tool risk、policy check、approval request、args hash、execution guard、audit | 把高风险工具调用变成可审批、可追责、不可绕过的闭环 |
| Agent Audit Log 层 | actor、action、target、risk、policy、hash、metadata、append-only | 让关键行为可追责、可合规、可复盘 |
| Evaluation 评测层 | 测试集、指标、版本对比、失败样本库 | 把效果从主观感觉变成可比较、可迭代的数据 |
| Eval Dataset 层 | smoke set、regression set、失败样本、评分规则 | 让评测可复用、可回归、可定位失败原因 |
| Agent Benchmark 层 | 固定任务集、方案对比、成本延迟、安全、恢复和 Trace 完整度 | 用数据比较 Workflow、单 Agent、多 Agent、模型和框架，而不是凭感觉选型 |
| Agent Contract Testing 层 | JSON schema、tool args、task state、trace event、MCP schema 契约 | 保证模型输出和系统接口可集成、可验收、可回归 |
| LLM Evaluation Scorecard 层 | task success、factuality、grounding、format、tool、safety、cost、latency | 把主观好不好拆成可比较、可解释、可门禁的评分卡 |
| Eval Drift Monitoring 层 | input、knowledge、model、prompt、tool、judge、cost、safety drift | 持续发现上线后质量、安全、成本和延迟退化 |
| Conversation Regression 层 | golden conversation、fixtures、关键事实、引用、拒答、工具调用回归 | 防止 Prompt、模型、RAG、工具和 Memory 变更破坏历史能力 |
| Judge 评测层 | Rubric、LLM-as-Judge、人工校准、pairwise 对比 | 让自动语义评测更稳定、更可解释 |
| 对抗评测层 | 合成样本、Prompt Injection、越权、危险工具、冲突证据 | 主动覆盖线上不常见但高风险的边界情况 |
| 红队演练层 | Prompt/RAG/Tool/MCP/Memory/API 攻击样本、修复和回归 | 上线前主动攻击系统，把安全问题转化为评测资产 |
| Fine-tuning 数据层 | 样本收集、脱敏、标注、质检、切分、训练、评测、灰度 | 把线上行为和格式样本转成可训练、可回归的数据资产 |
| LLM 数据治理层 | 数据分级、脱敏、用途隔离、保留周期、评测/训练集溯源 | 让用户输入、Trace、反馈、评测和训练数据可用、可控、可删除 |
| PII Redaction 层 | mask、tokenize、hash、drop、redaction_version、utility eval | 防止敏感信息进入模型、日志、缓存和评测集 |
| 反馈闭环层 | 用户反馈、人工修正、失败归因、eval case 转化 | 把线上真实问题转成评测、Prompt、检索和产品迭代燃料 |
| MCP 工具接入层 | Tools、Resources、Prompts、Schema、鉴权、审计 | 标准化外部工具接入方式，降低工具集成成本 |
| MCP Server Hardening 层 | 参数校验、风险分级、timeout、rate limit、错误映射、schema version | 把 MCP Server 从脚本提升为可上线工具服务 |
| MCP Supply Chain Risk 层 | server provenance、version pin、schema diff、dependency、sandbox、untrusted output | 防止 MCP 工具生态引入供应链和权限风险 |
| MCP Tool Schema 层 | 工具命名、描述、参数、输出、错误、风险等级、版本 | 让工具可发现、可控、可评测，而不是散落函数 |
| MCP Client 测试层 | fake server、contract、policy filter、error mapping、injection samples | 验证 MCP Client 接入后可回归、可审计、可降级 |
| MCP Client 层 | Server Registry、Tool Discovery、权限过滤、连接管理、结果标准化 | 把 MCP Server 安全稳定接入 Agent Runtime |
| MCP Gateway 层 | server registry、schema cache、policy filter、secret boundary、approval、audit | 统一治理多 MCP Server 的发现、鉴权、审批、限流和观测 |
| MCP Gateway Operations 层 | health、schema diff、latency、error、quota、degrade、postmortem | 让多 MCP Server 接入后可巡检、可限流、可止血 |
| MCP 安全授权层 | scope、tenant、role、secret boundary、schema pinning、audit、red team | 防止 MCP 工具越权、数据泄漏、危险副作用和供应链风险 |
| Memory Evaluation 层 | should/should-not remember、更新、遗忘、注入、stale memory 指标 | 证明长期记忆写得对、用得对、更新得了、忘得掉 |
| Skills 工作流层 | `SKILL.md`、脚本、参考资料、验收标准 | 把重复工程流程沉淀成 Agent 可复用的操作手册 |
| Skill Testing 层 | trigger、procedure、output、safety、regression、changelog | 让 Skill 像代码一样可版本化、可测试、可持续演进 |
| Browser 验收层 | Playwright、Mock LLM、工具审批、任务状态、引用和截图 Trace | 验证用户真实流程能跑通，避免只测 API 不测体验 |
| 部署上线层 | Docker、环境变量、健康检查、日志、回滚、成本监控 | 保证系统能在真实环境稳定运行，并支持运维和回滚 |
| 生产运维层 | SLO、报警分级、事故排查、止血开关、复盘模板 | 让 Agent 上线后有日常巡检和事故处理手册 |
| Agent SLO / Error Budget 层 | task_success、grounding、tool_success、approval_timeout、cost、safety budget | 把可靠性目标和发布节奏绑定，防止错误预算被快速耗尽 |
| Production Failure Drill 层 | 模型延迟、RAG 退化、工具超时、审批卡住、租户隔离、成本失控 | 上线前主动验证发现、降级、止血和恢复能力 |
| Incident Postmortem 层 | 事故摘要、时间线、Trace、根因、回归样本、Release Gate 更新 | 把线上失败转化为评测、监控、Runbook 和产品改进资产 |
| Agent Release Gate 层 | code、contract、eval、RAG、safety、cost、latency、ops、product gate | 让 Prompt、模型、RAG、MCP 和策略变更可灰度、可回滚 |
| LLM 可观测层 | 成本、延迟、Prompt 版本、RAG、工具、反馈、安全的仪表盘 | 把模型调用从黑盒变成可 drill-down、可运营的系统 |

这张地图可以作为项目设计时的检查框架。一个 Agent 系统如果只实现了模型调用，而没有任务状态、工具权限、执行轨迹和评测闭环，就很难进入真实生产环境。

## 3. 推荐学习顺序

1. FastAPI：先把服务接口搭起来。
2. LLM Gateway：统一模型路由、成本、降级和审计。
3. Structured Output：让模型输出能被后端、前端、数据库和评测系统稳定消费。
4. Context Window Management：控制长上下文的 token 预算、证据排序、历史压缩和上下文 Trace。
5. PromptOps：把 Prompt 版本、评测、灰度和回滚接入发布流程。
6. Prompt Regression Testing：用 smoke、golden、failure replay 和 adversarial 样本防止能力退化。
6. Cost / Latency Optimization：建立调用账本、模型路由、缓存、降级和 p95 延迟优化。
7. LLM Cost Budget Table：把 token、模型、工具、评测、人审和基础设施拆成预算。
8. LLM Semantic Cache：用语义缓存、权限隔离和版本失效降低重复请求成本。
9. LLM Cost Chargeback：把成本拆到租户、功能、模型和 run，支持预算与配额。
8. Model Routing / A/B Testing：把模型切换、新模型灰度和实验结果纳入治理。
9. Model Rollout Canary：用离线评测、shadow、canary 和自动回滚上线新模型。
9. Database：设计任务、文档、Trace、评测等数据模型。
10. LLM Data Governance：治理用户输入、Trace、反馈、评测集和训练数据的分级、脱敏、授权和保留周期。
11. PII Redaction：在输入、RAG、工具、Trace、评测和缓存中做敏感信息脱敏。
11. RAG Engineering：构建知识检索链路。
12. RAG Ingestion：把文件解析、Chunk、metadata、embedding 和索引做成可靠流水线。
13. RAG Debugging：建立检索故障排查 Trace。
14. RAG Citation Evaluation：评测引用覆盖率、支持度、权限和无答案行为。
15. RAG Evaluation Report：把评测目标、数据集、指标、失败归因和成本延迟写成报告。
16. RAG Knowledge Lifecycle：治理文档版本、过期、权限变化、索引更新和缓存失效。
17. RAG Permission Filtering：把 tenant、ACL、status、effective time 和缓存隔离放进检索链路。
15. Vector Database：管理向量数据和检索性能。
16. Embedding Eval / Migration：评测和灰度迁移向量模型。
17. GraphRAG：在需要复杂关系推理时引入实体、关系和子图检索。
18. Enterprise RAG Permission：把 tenant、ACL、metadata filter 和缓存隔离放进检索链路。
19. Agent Tenant Isolation Testing：验证 API、RAG、MCP、Memory、Cache 和 Trace 不跨租户泄漏。
20. Async Task：处理长任务和并发。
21. Queue / Backpressure：用优先级队列、资源并发、限流、熔断和死信队列保护系统。
22. Failure Recovery：设计状态机、幂等、断点续跑和补偿。
23. Agent Workflow State Machine：把任务状态、转移规则、审批、恢复和 Trace 设计清楚。
24. Multi-Agent Handoff：用结构化交接协议传递目标、证据、约束和验收标准。
24. Agent Scheduler / Cron：设计定时、延迟、周期和事件触发任务的幂等与并发。
24. Agent Error Taxonomy：把 input、policy、context、retrieval、model、tool、runtime、infra、ux error 分开处理。
25. Human Takeover / Ops Console：把低置信度、高风险、超时和用户转人工做成接管队列。
26. API Security：控制身份、权限、租户和高风险操作。
27. Tool Registry：治理工具 schema、版本、风险等级、owner、启停和审批策略。
28. Tool Risk Classification：按 R0-R4 定义工具权限、审批、沙箱和审计策略。
28. Tool Call Replay：记录和回放工具调用，定位参数、权限、schema 和外部服务失败。
28. Tool Sandbox：限制文件、网络、命令和 MCP 工具边界。
29. Agent Security：设计 Prompt Injection、工具滥用和数据泄漏防护。
30. Prompt Injection Defense-in-depth：用上下文降权、RAG 清洗、tool policy、approval、sandbox 和红队回归做纵深防御。
31. Red Team：用攻击样本主动验证 Agent 安全边界。
32. Agent Trace：记录 Agent 执行过程。
33. Agent Control Plane：统一管理模型、Prompt、工具、策略、预算和发布。
34. Agent Configuration Management：把 Agent Profile 和策略版本纳入配置发布和回滚。
34. Agent Approval Workflow：把高风险工具调用纳入审批、参数哈希和执行层校验。
35. Agent Audit Log：记录关键行为的 actor、action、target、risk、policy 和 hash。
34. Evaluation Pipeline：评估系统效果。
35. Eval Dataset：沉淀 smoke、regression 和失败样本。
36. LLM-as-Judge：设计 Rubric、Judge 校准和自动评测门禁。
37. LLM Evaluation Scorecard：把质量、证据、格式、工具、安全、成本和延迟拆成评分卡。
38. Eval Drift Monitoring：持续监控模型、Prompt、知识库、工具和 Judge 漂移。
38. Synthetic / Adversarial Eval：补齐边界样本和攻击样本。
39. Agent Benchmark：用固定任务集比较 Workflow、单 Agent、多 Agent、模型和框架方案。
40. Agent Contract Testing：验证 JSON schema、tool args、task state、trace event 和 MCP schema 契约。
41. Conversation Regression Testing：把关键对话路径、fixtures、工具调用和安全边界做成回归。
42. Agent Memory Evaluation：评测记忆写入、检索、更新、遗忘和注入防护。
43. Fine-tuning Data Pipeline：把线上样本转成可训练、可评测的数据。
44. Feedback Loop：把线上反馈转化为评测样本和迭代任务。
45. Batch / Offline Eval：低成本跑批量评测、摘要、分类和失败样本回放。
46. MCP Server：标准化外部工具接入。
47. MCP Server Hardening：为 MCP 工具服务补齐参数校验、风险分级、超时和审计。
48. MCP Supply Chain Risk：治理 MCP Server 来源、版本、依赖、schema diff 和沙箱。
47. MCP Tool Schema：设计工具命名、参数、输出、错误、风险和版本。
48. MCP Client：把 MCP Server 安全稳定接入 Agent Runtime。
49. MCP Client Testing：用 fake server、契约测试、权限过滤和注入样本验证 Client。
50. MCP Gateway：统一治理多 MCP Server 的发现、权限、审批、限流和审计。
51. MCP Gateway Operations：巡检 health、schema diff、latency、quota，并支持降级止血。
52. MCP Security / Auth：设计 scope、tenant、role、secret boundary、schema pinning 和审计。
53. Skills：把重复工作流沉淀成可复用操作手册。
54. Skill Testing / Versioning：让 Skill 有 trigger、procedure、output、safety、regression 测试和 changelog。
55. AI Project Design Doc：把项目背景、架构、数据、评测和风险写成可交付方案。
56. AI Agent PRD：把技术能力翻译成用户故事、交互流程、权限审批和验收标准。
57. Agent Product Metrics：把 task success、handoff、correction、trust signal、cost、latency 统一进产品指标。
58. Agent SaaS Tenant / RBAC / Quota：设计 tenant、workspace、role、permission、quota、usage 和 billing。
59. Browser Automation Testing：用浏览器自动化验证上传、问答、引用、工具审批和运营台流程。
60. Docker Deploy：部署和运维。
61. Agent Release Gate：上线前检查 code、contract、eval、RAG、safety、cost、latency、ops 和 product gate。
62. Production Ops Runbook：上线后巡检、报警、止血和复盘。
63. Agent SLO / Error Budget：用可靠性目标和错误预算治理发布节奏。
63. Production Failure Drill：上线前演练模型、RAG、工具、审批、租户和成本故障。
63. Agent Incident Postmortem：把线上失败沉淀成回归样本、门禁和 Runbook。
64. LLM Observability Dashboard：建设成本、延迟、质量和安全统一仪表盘。
65. Production Checklist：上线前检查。

这个顺序从“服务能接请求”开始，到“系统能上线和评估”结束。学习时不建议一开始就追求复杂 Agent 框架，而是先把后端接口、数据模型、检索链路和执行记录打牢。

## 4. 与项目 A / 项目 B 的关系

### 项目 A：RAG 工单系统

项目 A 的核心是把工单、文档和知识库连接起来，让系统能基于检索结果生成可信答案或工单建议。

- FastAPI 提供 API。
- Database 保存工单、文档、检索结果、用户反馈。
- RAG Engineering 负责检索增强。
- Vector Database 负责向量检索。
- Trace 记录检索、生成、引用、失败原因。
- Evaluation 衡量答案质量和工单生成质量。

在这个项目中，工程重点不是“能不能回答”，而是回答是否有来源、是否能复现、是否能评估、是否能根据反馈迭代。

### 项目 B：多 Agent Copilot

项目 B 的重点是任务拆解、多个 Agent 协作、工具调用和执行过程管理。这里只讨论通用迁移关系，不展开具体实现。

- FastAPI 提供任务入口。
- Database 保存任务、Agent 运行记录、工具调用。
- Async Task 支撑长任务。
- Queue / Backpressure 防止长任务积压、重试风暴和资源耗尽。
- API Security 控制工具权限。
- Tool Registry 管理工具 schema、版本、风险等级、审批策略和 owner。
- Human Takeover 支撑高风险、低置信度、SLA 超时和用户转人工场景。
- Agent Trace 记录多 Agent 协作过程。
- Agent Benchmark 比较 Workflow、单 Agent、多 Agent 和不同模型方案的真实收益。
- Evaluation 评估任务完成质量。

在这个项目中，工程重点是可控性。多 Agent 系统如果没有任务状态、权限边界和执行轨迹，失败后很难判断问题来自任务拆解、工具调用、模型输出还是外部依赖。

## 5. 面试表达

我不是只关注模型调用，而是关注 Agent 系统从接口、数据、任务、工具、Trace、评测到部署的完整工程链路。模型能力只是系统中的一个组件，真正可上线的 Agent 还需要任务状态管理、错误处理、权限控制、执行记录和效果评估。

在 RAG 项目中，我会把文档、Chunk、Embedding、检索、引用、反馈和评测都建模，而不是只调一个向量库。这样当答案质量不好时，可以定位是文档解析问题、召回问题、排序问题、上下文构建问题还是生成问题。

在多 Agent 项目中，我会重点设计任务状态、工具权限、执行轨迹和评测闭环，避免系统不可控。每一次任务执行都应该有 run_id，每一个关键步骤都应该能被记录和复盘。

## 6. 后续 TODO

- 补充项目 A 的具体数据库设计。
- 补充项目 B 的多 Agent Trace 设计。
- 补充 Human Takeover 运营台案例。
- 补充 Agent Benchmark 指标示例。
- 补充 Evaluation 指标示例。
- 补充 Docker Compose 生产配置示例。

## 7. 常见误区

### 误区一：只要模型效果好，系统就能上线

模型效果只是一个环节。真实项目还需要接口稳定、数据可追踪、权限可控制、失败可恢复、成本可监控。

### 误区二：只做 Prompt，不做数据建模

Agent 项目如果不保存任务、步骤、工具调用和评测结果，就无法复现问题，也无法持续改进。

### 误区三：忽略执行轨迹

没有 Run ID、Step ID 和工具调用记录，线上问题只能靠猜。执行轨迹是 Agent 系统的调试基础。

### 误区四：评测只靠人工感觉

人工体验很重要，但不能替代测试集、指标和失败样本库。没有评测闭环，系统迭代很容易退化。

## 8. 相关链接

- [FastAPI 后端接口工程化](/note/Engineering/fastapi)
- [LLM Gateway](/note/Engineering/llm-gateway)
- [Structured Output 工程化](/note/Engineering/structured-output-engineering)
- [Context Window 管理](/note/AI-Agent/context-window-management)
- [PromptOps：Prompt 版本、评测和回滚](/note/Engineering/promptops-versioning)
- [Prompt Regression Testing](/note/Engineering/prompt-regression-testing)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [LLM Semantic Cache](/note/Engineering/llm-semantic-cache)
- [LLM Cost Chargeback](/note/Engineering/llm-cost-chargeback)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
- [Model Rollout Canary](/note/Engineering/model-rollout-canary)
- [数据库设计：从业务数据到 Agent 运行记录](/note/Engineering/database)
- [LLM 数据治理](/note/Engineering/llm-data-governance)
- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [RAG 入库流水线](/note/Engineering/rag-ingestion-pipeline)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
- [RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)
- [RAG 知识生命周期](/note/Engineering/rag-knowledge-lifecycle)
- [RAG 权限过滤](/note/Engineering/rag-permission-filtering)
- [向量数据库工程化](/note/Engineering/vector-database)
- [Embedding 模型评测与迁移](/note/Engineering/embedding-model-eval-migration)
- [GraphRAG 工程化](/note/Engineering/graphrag-engineering)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing)
- [异步任务与长任务处理](/note/Engineering/async-task)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [Multi-Agent Handoff Protocol](/note/Engineering/multi-agent-handoff-protocol)
- [Agent Scheduler 与 Cron](/note/Engineering/agent-scheduler-cron)
- [Agent 错误分类](/note/Engineering/agent-error-taxonomy)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
- [Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
- [Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth)
- [Agent 红队演练](/note/Engineering/agent-red-team-playbook)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [Agent 配置治理](/note/Engineering/agent-configuration-management)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [Agent 审计日志设计](/note/Engineering/agent-audit-log-design)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Fine-tuning 数据流水线](/note/Engineering/finetuning-data-pipeline)
- [LLM-as-Judge 与 Rubric 评测](/note/Engineering/llm-as-judge-rubric-eval)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
- [Eval Drift Monitoring](/note/Engineering/eval-drift-monitoring)
- [合成数据与对抗评测集](/note/Engineering/synthetic-adversarial-eval-data)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [Agent Contract Testing](/topics/agent-contract-testing)
- [Conversation Regression Testing](/topics/conversation-regression-testing)
- [Agent Memory 评测](/note/Engineering/memory-evaluation-for-agents)
- [AI Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline)
- [MCP Server](/note/Engineering/mcp-server)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [MCP Server Hardening](/note/Engineering/mcp-server-hardening)
- [MCP 供应链风险](/note/Engineering/mcp-supply-chain-risk)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Client 测试](/note/Engineering/mcp-client-testing)
- [MCP Client 工程化](/note/Engineering/mcp-client-engineering)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [Skills 编写](/note/AI-Tools/skill-authoring)
- [Skill 测试与版本管理](/note/AI-Tools/skill-testing-versioning)
- [Skill 运营手册](/note/AI-Tools/skill-operations-playbook)
- [Docker 部署](/note/Engineering/docker-deploy)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
- [Agent 故障演练](/note/Engineering/agent-production-failure-drill)
- [Agent 事故复盘模板](/topics/agent-incident-postmortem-template)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
- [AI Agent 上线检查清单](/note/Engineering/production-checklist)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
- [Browser Automation Testing：给网页 Agent 和前端流程做验收](/topics/browser-automation-testing-agent-ui)
- [AI Agent 产品需求文档 PRD 模板](/topics/ai-agent-prd-template)
- [Agent Product Metrics](/topics/agent-product-metrics)
- [Agent SaaS 多租户、RBAC 与配额设计](/topics/agent-saas-tenant-rbac-quota)
