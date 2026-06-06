# AI Agent 面试 30 天复习清单：从概念到项目表达

## 这篇文章解决什么问题

AI Agent / 大模型应用岗位的面试经常覆盖很宽：

- Agent 基础概念。
- RAG 工程化。
- Tool Calling / MCP。
- LangGraph / Agent Runtime。
- 评测、Trace、安全、成本。
- 项目架构和简历深挖。

如果没有计划，很容易只背概念，不会讲项目；或者只讲项目，不会回答原理题。这篇文章给出一个 30 天复习清单，用来把站内内容串起来。

## 总体目标

30 天后你应该能做到：

- 用 3 分钟讲清 Agent 和普通 ChatBot 的区别。
- 用 5 分钟讲清一个 RAG 项目的完整链路。
- 用 5 分钟讲清一个多 Agent 项目的架构和边界。
- 能回答 Tool Calling、MCP、Memory、Trace、Evaluation、安全、成本优化的常见追问。
- 简历里至少有 2 个 AI 项目写法清晰，有指标、有难点、有贡献。

## 第 1 周：Agent 基础和工程主线

### Day 1：Agent 是什么

阅读：

- [Agent 基础](/note/AI-Agent/agent-basic)
- [Agent Runtime 是什么](/topics/agent-runtime-explained)

要会回答：

- Agent 和 ChatBot 的区别是什么？
- Workflow 和 Agent 有什么区别？
- Agent Loop 一般包含哪些步骤？

### Day 2：Prompt 和 Context

阅读：

- [Prompt Engineering](/note/AI-Agent/prompt-engineering)
- [Context Engineering](/note/AI-Agent/context-engineering)

要会回答：

- 为什么只优化 Prompt 不够？
- Context 里应该放哪些信息？
- 长上下文为什么会降低稳定性？

### Day 3：Tool Calling

阅读：

- [Tool Calling](/note/AI-Agent/tool-calling)
- [Tool Calling 工程化](/topics/tool-calling-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)

要会回答：

- Function Calling 和真正工具执行有什么区别？
- 工具参数如何校验？
- 高风险工具如何审批？

### Day 4：Memory / State

阅读：

- [Memory 与 State](/topics/memory-state-agent)
- [长期记忆系统设计](/note/AI-Agent/long-term-memory)

要会回答：

- Memory、State、Trace 有什么区别？
- 长期记忆为什么需要证据和遗忘机制？

### Day 5：多 Agent

阅读：

- [Multi-Agent](/note/AI-Agent/multi-agent)
- [多 Agent 项目面试表达](/topics/multi-agent-interview)

要会回答：

- 多 Agent 不是多角色聊天，那它的工程价值是什么？
- 多 Agent 如何共享状态和控制权限？

### Day 6-7：整理一页总结

输出：

- Agent 概念图。
- Agent vs ChatBot 对比表。
- 一个你自己的 Agent 项目架构草图。

## 第 2 周：RAG 和知识库项目

### Day 8：RAG 主链路

阅读：

- [RAG](/note/AI-Agent/rag)
- [RAG 工程化](/topics/rag-engineering-system)

要会回答：

- RAG 从文档到答案有哪些步骤？
- Chunk 策略怎么影响召回？

### Day 9：向量检索

阅读：

- [向量数据库工程化](/note/Engineering/vector-database)
- [向量检索选型](/topics/vector-search-selection)

要会回答：

- Dense、Sparse、Hybrid Search 区别是什么？
- Metadata Filter 为什么必须在检索阶段做？

### Day 10：Rerank 和引用

阅读：

- [RAG 项目面试表达](/topics/rag-project-interview)

要会回答：

- Rerank 解决什么问题？
- 如何判断答案是否被证据支持？

### Day 11：RAG vs Fine-tuning

阅读：

- [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning)

要会回答：

- 什么时候用 RAG，什么时候用微调？
- 两者能不能组合？

### Day 12：RAG 评测

阅读：

- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)

要会回答：

- RAG 如何评测召回、引用和答案质量？
- 失败样本库怎么设计？

### Day 13-14：包装 RAG 项目

输出：

- RAG 项目 1 分钟介绍。
- RAG 项目 3 个技术难点。
- RAG 项目 3 条简历 bullet。

## 第 3 周：生产级 Agent 工程

### Day 15：后端和数据模型

阅读：

- [FastAPI 到 Agent Backend](/topics/fastapi-agent-backend)
- [Agent 数据库设计](/topics/agent-database-design)

要会回答：

- Agent 后端需要哪些接口？
- task/run/step/tool_call 如何建模？

### Day 16：Trace 和 Observability

阅读：

- [Agent Trace](/topics/agent-trace-observability)
- [日志与可观测性](/note/Engineering/observability)

要会回答：

- 为什么 Agent 必须有 Trace？
- 一次工具调用要记录哪些字段？

### Day 17：失败恢复

阅读：

- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)

要会回答：

- 长任务失败后如何断点续跑？
- 幂等键怎么设计？

### Day 18：成本和延迟

阅读：

- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)

要会回答：

- 如何降低 LLM 成本？
- 新模型如何灰度上线？

### Day 19：安全治理

阅读：

- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)

要会回答：

- Prompt Injection 如何防？
- MCP Server 为什么不是天然安全边界？

### Day 20-21：生产运维总结

阅读：

- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [AI Agent 上线检查清单](/note/Engineering/production-checklist)

输出：

- 一个生产级 Agent 上线检查表。
- 一个事故排查流程。

## 第 4 周：面试表达和作品集

### Day 22：面试题库总览

阅读：

- [AI Agent 面试题库](/note/AI-Interview/)
- [Agent 面试追问库](/note/AI-Interview/agent-followup-interview)

输出：

- 10 个最容易被追问的问题。

### Day 23：LLM 工程题

阅读：

- [大模型工程面试题](/note/AI-Interview/llm-engineering-interview)
- [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview)

输出：

- 成本优化、工具调用、结构化输出各 1 个标准回答。

### Day 24：LangGraph / 框架选型

阅读：

- [LangGraph](/note/AI-Agent/langgraph)
- [Agent 框架选型](/topics/agent-framework-selection)

要会回答：

- 什么时候用 LangGraph？
- 什么时候不用复杂 Agent 框架？

### Day 25：MCP / Skills

阅读：

- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [Skills 编写](/note/AI-Tools/skill-authoring)

要会回答：

- MCP Server、Tool、Skill、Plugin 有什么区别？
- 如何把一次性工作流沉淀成 Skill？

### Day 26：项目包装

阅读：

- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
- [简历描述模板](/note/Interview/resume-bullets)

输出：

- 项目 A / 项目 B 各 3 条简历 bullet。

### Day 27：项目深挖

阅读：

- [项目 B 一分钟介绍](/note/Interview/project-b-one-minute)
- [项目 B 深挖版](/note/Interview/project-b-deep-dive)

输出：

- 1 分钟版、3 分钟版、深挖版回答。

### Day 28：模拟面试

准备：

- 5 个 Agent 概念题。
- 5 个 RAG 工程题。
- 5 个项目深挖题。
- 3 个系统设计题。

### Day 29：补短板

根据模拟面试，回到对应文章补缺口。

### Day 30：最终材料包

最终输出：

- 简历 AI 项目版。
- GitHub README 优化版。
- 个人博客项目索引。
- 面试题速记表。
- 项目讲解稿。

## 最后一周高频追问

| 追问 | 要点 |
|---|---|
| 你的 Agent 和普通工作流区别是什么？ | 不要神化 Agent，讲任务状态、工具、反馈和控制 |
| RAG 效果差怎么排查？ | 文档解析、chunk、embedding、检索、rerank、context、生成 |
| 工具调用怎么保证安全？ | schema、权限、审批、沙箱、Trace |
| 多 Agent 为什么需要？ | 复杂任务分工，但要控制状态和边界 |
| 成本太高怎么办？ | 账本、路由、缓存、批处理、上下文压缩 |
| 如何评测 Agent？ | dataset、metrics、LLM-as-Judge、人工抽检、线上反馈 |
| 线上失败怎么恢复？ | 状态机、幂等、重试分类、断点续跑 |

## 相关链接

- [AI Agent 面试题库](/note/AI-Interview/)
- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
- [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap)
- [Agent 系统设计面试题](/topics/agent-system-design-interview)
- [项目面试表达](/note/Interview/)
