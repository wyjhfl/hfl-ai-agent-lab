# 博客专题

HFL AI Agent Lab 的专题文章用于把学习路线、工程化笔记、源码拆解、AI 工具工作流和面试题库串起来。读者可以按自己的目标选择阅读路径：先建立概念，再补工程实践，再做面试表达，最后回到项目设计。

---

## 推荐阅读路径

| 目标 | 推荐路径 |
|---|---|
| 零基础建立 Agent 工程认知 | AI Agent 核心概念专题 → [Agent 开发 Playbook](/topics/agent-development-playbook) → Engineering 工程化专题 → 面试表达专题 |
| 想做 RAG 项目 | [RAG 项目面试表达](/topics/rag-project-interview) → [RAG 工程化](/topics/rag-engineering-system) → Evaluation / Trace 相关内容 |
| 想做生产级 Agent | [Agent 开发 Playbook](/topics/agent-development-playbook) → [Agent Runtime](/topics/agent-runtime-explained) → [Context Engineering](/note/AI-Agent/context-engineering) → [Trace](/topics/agent-trace-observability) → [Evaluation](/topics/evaluation-pipeline) |
| 想准备面试 | [Agent 系统设计面试题](/topics/agent-system-design-interview) → [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) → [RAG 项目面试表达](/topics/rag-project-interview) → [多 Agent 项目面试表达](/topics/multi-agent-interview) |
| 想优化线上 Agent | [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization) → [Agent 失败恢复与幂等](/note/Engineering/agent-failure-recovery) → [Agent 反馈闭环](/note/Engineering/agent-feedback-loop) |
| 想学习 AI 编程协作 | [Claude Code 实战工作流](/topics/claude-code-workflow) → [Skills 编写](/note/AI-Tools/skill-authoring) → [AI 编程审查清单](/topics/ai-coding-review-checklist) → [避免 AI 误提交和假验证](/topics/avoid-ai-miscommit-fake-verification) |
| 想看源码和架构 | [Hermes Agent](/note/Source-Reading/hermes-agent-advanced) / [OpenClaw](/topics/openclaw-architecture) / [Hook 机制](/topics/agent-harness-hooks) 相关专题 |
| 想整理求职作品集 | [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap) → [项目实战](/projects) → [简历描述模板](/note/Interview/resume-bullets) |
| 想找项目选题 | [AI Agent 项目选题库](/topics/ai-agent-project-ideas) → [Agent 开发 Playbook](/topics/agent-development-playbook) → [生产级 Agent 治理清单](/topics/production-agent-governance-checklist) |

---

## Engineering 工程化专题

| 专题 | 解决的问题 | 适合读者 |
|---|---|---|
| [RAG 工程化：从文档到可评估答案](/topics/rag-engineering-system) | 从文档解析、Chunk、Embedding、检索、Rerank、引用和评测理解生产级 RAG。 | 想做 RAG 项目、理解 RAG 工程全链路的人 |
| [多模态文档理解 Agent](/topics/multimodal-document-agent) | 处理 PDF、图片、表格、版面块、OCR 和结构化抽取，把复杂文档变成可检索证据。 | 想做文档智能和多模态项目的人 |
| [Agent 开发 Playbook：从需求到可上线版本](/topics/agent-development-playbook) | 从业务问题、单 Agent 闭环、工具/RAG、State、Trace、Evaluation、Guardrails 到多 Agent 的开发顺序。 | 想把 Agent 从想法推进到可验证项目的人 |
| [Agent 协议全景](/topics/agent-protocol-landscape) | 区分 Function Calling、Tools、MCP、A2A、Plugin、Skill、Hook 和 Agent SDK 的职责边界。 | 想理解 Agent 协议生态的人 |
| [Agent 框架选型：LangGraph、OpenAI Agents SDK、LlamaIndex、CrewAI 怎么看](/topics/agent-framework-selection) | 从任务边界、State、Tool、Human-in-the-loop、Trace、RAG 和团队维护成本选择框架。 | 想讲清楚框架取舍的人 |
| [Agent Trace：如何让 Agent 执行过程可观测](/topics/agent-trace-observability) | 用 Run、Step、Tool Call、状态变化和错误事件记录 Agent 的完整执行轨迹。 | 想让 Agent 系统可调试、可审计、可优化的人 |
| [Evaluation Pipeline：Agent 效果怎么评估](/topics/evaluation-pipeline) | 从测试集、指标、自动评测、人工抽检、版本对比和失败样本库构建评测闭环。 | 想系统化评估 Agent / RAG 效果的人 |
| [生产级 Agent 治理清单](/topics/production-agent-governance-checklist) | 用 30 个问题检查任务边界、上下文、工具权限、状态恢复、模型治理、评测和回滚。 | 准备把 Agent 从 Demo 推到真实业务的人 |
| [FastAPI 到 Agent Backend：接口层怎么设计](/topics/fastapi-agent-backend) | 从路由、Schema、Service、Worker、Trace、Evaluation 和权限理解 Agent 后端接口层。 | 想把 Agent / RAG 做成后端服务的学习者 |
| [LLM Gateway](/note/Engineering/llm-gateway) | 统一治理多模型调用、路由、限流、成本、Prompt 版本、降级和审计。 | 想把模型调用接入生产后端的人 |
| [Structured Output 工程化](/note/Engineering/structured-output-engineering) | 用 Schema、类型校验、重试修复、Trace 和评测让模型输出稳定进入业务系统。 | 想把 LLM 输出接入前后端和工作流的人 |
| [PromptOps：Prompt 版本、评测和回滚](/note/Engineering/promptops-versioning) | 把 Prompt 当作可版本化、可评测、可发布、可回滚的工程资产管理。 | 想治理线上 Prompt 变更风险的人 |
| [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization) | 从调用账本、模型路由、Prompt 瘦身、缓存、批处理、降级和并发优化线上成本与 p95 延迟。 | 想让大模型应用跑得起、跑得稳的人 |
| [向量检索选型：Embedding、Hybrid Search、Rerank 和 Metadata Filter](/topics/vector-search-selection) | 从 Dense/Sparse、混合检索、权限过滤、重排和评测设计完整检索链路。 | 想提升 RAG 召回质量的人 |
| [Agent 数据库设计：状态、证据与执行记录](/topics/agent-database-design) | 用 Task、Run、Step、Tool Call、Document、Chunk、Trace、Evaluation 建模 Agent 系统数据。 | 想理解 Agent 数据建模的学习者 |
| [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery) | 设计状态机、幂等键、重试分类、断点续跑、补偿和人工介入，让长任务失败后能继续。 | 想做可靠长任务 Agent 的人 |
| [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission) | 从工具风险分级、参数校验、文件/网络/命令沙箱、审批和 MCP 权限审计控制工具调用风险。 | 想把 Tool Calling 安全落地的人 |
| [Agent UI 产品化设计：不要只做一个聊天框](/topics/agent-ui-product-design) | 设计任务面板、证据面板、工具调用审批、反馈和失败重跑，让 Agent 可控可解释。 | 想把 Agent 做成真实产品的人 |
| [AI Agent 反馈闭环](/note/Engineering/agent-feedback-loop) | 将用户反馈关联 Trace、Prompt、模型、检索和工具调用，转化为评测样本与迭代队列。 | 想让线上反馈驱动持续改进的人 |
| [Docker 部署工程化：从本地 Demo 到可上线服务](/topics/docker-agent-deployment) | 从 API、Worker、数据库、Redis、向量库、健康检查、日志和回滚理解部署闭环。 | 想把 Demo 部署成服务的学习者 |
| [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide) | 从工具 schema、返回结构、权限、Trace、stdio/HTTP 选择到测试清单，理解 MCP Server 怎么落地。 | 想把外部工具标准化接入 Agent 的学习者 |
| [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model) | 系统整理 Prompt Injection、工具滥用、RAG 文档污染、MCP 越权和数据泄漏防护。 | 想理解 Agent 安全治理的人 |
| [Eval Dataset 设计](/note/Engineering/eval-dataset-design) | 设计 RAG、Tool Calling、长任务 Agent 的评测样本、指标、失败样本库和分层评测集。 | 想把评测从主观体验变成工程资产的人 |
| [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline) | 用异步批处理跑评测集、失败样本回放、Prompt 版本对比、批量摘要和分类。 | 想做 LLMOps 离线流水线的人 |

---

## AI Agent 核心概念专题

| 专题 | 解决的问题 | 适合读者 |
|---|---|---|
| [Agent Runtime 是什么：Agent 真正开始工作的执行引擎](/topics/agent-runtime-explained) | 理解 Agent 的任务执行引擎，包括模型调用、工具调度、状态推进和结果生成。 | 想理解 Agent 任务执行引擎的人 |
| [Context Engineering](/note/AI-Agent/context-engineering) | 理解系统规则、任务上下文、RAG 证据、Memory、State、Trace 如何分层进入模型上下文。 | 想提升长任务 Agent 稳定性的人 |
| [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning) | 判断什么时候该做检索增强，什么时候该做行为/格式微调，以及两者如何组合。 | 准备大模型工程取舍题的人 |
| [Tool Calling 工程化：不只是函数调用](/topics/tool-calling-engineering) | 理解工具 Schema、参数校验、权限控制、错误处理、Trace 和安全审计。 | 想把工具调用从 Demo 推向生产级的人 |
| [Realtime Voice Agent](/note/AI-Agent/realtime-voice-agent) | 理解低延迟语音输入输出、打断处理、多轮状态、工具调用和语音安全边界。 | 想做实时语音 Agent 的人 |
| [Browser / Computer Use Agent](/note/AI-Agent/browser-computer-use-agent) | 理解让 Agent 操作 GUI、浏览器、截图、DOM 和高风险动作审批的工程边界。 | 想做浏览器/电脑控制 Agent 的人 |
| [Memory 与 State：Agent 不只是记住聊天记录](/topics/memory-state-agent) | 区分 Session、Context、Memory、State 和 Trace，理解长任务和多 Agent 的状态管理。 | 想理解 Agent 记忆与状态管理的人 |
| [长期记忆系统设计](/note/AI-Agent/long-term-memory) | 设计用户偏好、项目事实、记忆候选、证据校验、检索和遗忘机制。 | 想构建长期个性化 Agent 的人 |

---

## AI 工具工作流专题

| 专题 | 解决的问题 | 适合读者 |
|---|---|---|
| [Claude Code 实战工作流：从需求拆解到可提交修改](/topics/claude-code-workflow) | 把 Claude Code 纳入工程流程：任务单设计、范围限定、检查命令、限定提交和输出总结。 | 想用 AI 编程助手做工程化开发的人 |
| [Skills 编写：把一次性提示词沉淀成可复用工作流](/note/AI-Tools/skill-authoring) | 用 `SKILL.md`、脚本、参考资料和验收标准沉淀博客写作、项目推进、简历整理等重复流程。 | 想让 AI 协作流程稳定复用的人 |
| [AI 编程审查清单：提交前必须检查的 10 件事](/topics/ai-coding-review-checklist) | 从文件范围、内容质量、Markdown 格式、构建结果、Git 状态、远端状态审查 AI 输出。 | 想避免 AI 产出质量失控的人 |
| [如何避免 AI 误提交和假验证](/topics/avoid-ai-miscommit-fake-verification) | 用文件白名单、暂存区检查、构建日志、commit hash 和远端核对降低风险。 | 想安全使用 AI 编程助手的人 |

---

## 面试表达专题

| 专题 | 解决的问题 | 适合读者 |
|---|---|---|
| [Agent 系统设计面试题：如何讲清楚一个生产级 Agent](/topics/agent-system-design-interview) | 从 Runtime、Tool、Memory / State、Trace、Evaluation、Security 讲清楚生产级 Agent 系统设计。 | 准备 Agent 系统设计面试的人 |
| [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) | 整理 Agent vs ChatBot、失败排查、评测、安全、成本、MCP、长任务恢复等工程追问。 | 已会基础概念、需要准备深挖追问的人 |
| [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap) | 把个人博客、项目 A、项目 B、面试题库、Skills/MCP 内容组织成可证明能力的求职作品集。 | 准备 AI Agent / 大模型应用开发岗位的人 |
| [AI Agent 项目选题库](/topics/ai-agent-project-ideas) | 整理 RAG、MCP、LLMOps、语音、多模态、数据分析等 12 个适合求职作品集的项目方向。 | 需要规划个人项目矩阵的人 |
| [AI Agent 项目包装：简历、作品集和面试讲法](/topics/ai-agent-project-packaging) | 把 RAG、多 Agent、MCP、LLMOps 项目包装成有架构、有难点、有指标、有贡献的求职表达。 | 已有项目但不知道怎么写进简历的人 |
| [RAG 项目面试表达：如何讲清楚从文档到答案的工程链路](/topics/rag-project-interview) | 把 RAG 从文档解析、Chunk、Embedding、检索、Rerank、引用和评测讲成完整工程链路。 | 准备 RAG 项目面试的人 |
| [多 Agent 项目面试表达：不要只讲多角色聊天](/topics/multi-agent-interview) | 避免"多角色聊天"，围绕任务分派、状态共享、工具权限、Trace、结果聚合和评测表达。 | 准备多 Agent 项目面试的人 |

---

## 源码与架构专题

| 专题 | 解决的问题 | 适合读者 |
|---|---|---|
| [从 RAG 到生产级 Agent Harness 的工程化学习路线](/topics/rag-to-agent-harness) | 建立从 RAG、Tool Calling、Memory、Trace、Evaluation 到 Deploy 的工程路线。 | 想建立 AI Agent 工程学习地图的人 |
| [Hermes Agent 高级用法与进阶玩法](/note/Source-Reading/hermes-agent-advanced) | 理解子代理驱动开发、Kanban、多代理协作、TDD、MCP、Cron、Skills 和安全控制。 | 想理解 Agent Harness 高级能力的人 |
| [OpenClaw 架构拆解：复杂 Agent 系统怎么分层](/topics/openclaw-architecture) | 理解 Gateway、Channel、Session、Runtime、Workspace、Memory、Tools、Security 和 Evaluation。 | 想学习复杂 Agent 系统架构拆分的人 |
| [Hook 机制为什么是 Agent Harness 最重要的资产](/topics/agent-harness-hooks) | 理解 Agent Harness 如何通过规则、工具边界和治理层变得可控。 | 想把 Agent 从 Prompt Demo 推向可控系统的人 |
| [Hermes vs OpenClaw：Agent 架构差异怎么理解](/topics/hermes-vs-openclaw) | 横向比较 Hermes 与 OpenClaw 在系统定位、任务组织、Runtime、Tool、Workspace、Memory、安全和评测上的差异。 | 想从源码阅读进入架构抽象的学习者 |
| [Agent Runtime 横向对比：任务执行引擎到底负责什么](/topics/agent-runtime-comparison) | 比较简单 Agent Loop、Workflow 和生产级 Agent Runtime 的职责边界。 | 想设计 Agent 执行引擎的学习者 |
| [Agent 协议全景](/topics/agent-protocol-landscape) | 从协议和扩展机制层面区分 Function Calling、MCP、A2A、Plugin、Skill、Hook。 | 想准备 Agent 架构深挖的人 |
| [Agent 框架选型](/topics/agent-framework-selection) | 比较 LangGraph、OpenAI Agents SDK、LlamaIndex、CrewAI 和轻量自研 Runtime 的适用场景。 | 想准备框架选型面试表达的人 |
| [Tool System 横向对比：Tool、Skill、Plugin、MCP、Hook 到底怎么区分](/topics/tool-system-comparison) | 区分执行能力、能力封装、扩展机制、标准协议和治理入口。 | 想理解 Agent 工具系统边界的学习者 |

---

## 如何配合站内内容阅读

| 阅读目标 | 建议路径 |
|---|---|
| 建立学习主线 | [AI Agent 学习路线](/note/AI-Agent/) → [Agent 开发 Playbook](/topics/agent-development-playbook) → AI Agent 核心概念专题 → Engineering 工程化专题 |
| 学工程落地 | [工程化笔记](/note/Engineering/) → [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model) → RAG 工程化 / Agent Trace / Evaluation Pipeline 专题 |
| 准备面试 | [面试题库](/note/AI-Interview/) → [Agent 面试追问库](/note/AI-Interview/agent-followup-interview) → 面试表达专题 → 源码与架构专题 |
| 看架构设计 | [源码拆解](/note/Source-Reading/) → Hermes / OpenClaw / Hook 机制专题 |
| 学 AI 编程协作 | [AI 工具笔记](/note/AI-Tools/) → AI 工具工作流专题 → [Skills 编写](/note/AI-Tools/skill-authoring) |
| 规划个人项目 | [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap) → [项目实战](/projects) → Engineering 工程化专题 → 面试表达专题 |
| 包装求职材料 | [AI Agent 项目包装](/topics/ai-agent-project-packaging) → [简历描述模板](/note/Interview/resume-bullets) → [面试题库](/note/AI-Interview/) |
