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
- [AI Agent 项目包装：简历、作品集和面试讲法](/topics/ai-agent-project-packaging)
- [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan)
- [AI 项目设计文档模板](/topics/ai-project-design-doc-template)
- [AI Agent 产品需求文档 PRD 模板](/topics/ai-agent-prd-template)
- [Agent 系统设计案例库](/topics/agent-system-design-casebook)
- [数据分析 Agent 项目方向](/topics/data-analysis-agent)
- [Agent SaaS 产品化项目方向](/topics/agent-saas-productization)
- [Code Agent 工程化项目方向](/topics/code-agent-engineering)
- [Agent 编排模式](/topics/agent-orchestration-patterns)
- [Agent 红队演练](/note/Engineering/agent-red-team-playbook)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent Memory 评测](/note/Engineering/memory-evaluation-for-agents)
- [Context Window 管理](/note/AI-Agent/context-window-management)
- [MCP Gateway 架构](/note/Engineering/mcp-gateway-architecture)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
- [Browser Automation Testing](/topics/browser-automation-testing-agent-ui)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [RAG 设计问答](/note/Interview/rag-qa)
- [Multi-Agent 设计问答](/note/Interview/multi-agent-qa)
- [LangGraph 设计问答](/note/Interview/langgraph-qa)

## 本批次新增项目表达角度

这批内容可以直接补到项目深挖和作品集讲法里：

- **Tool Registry**：不要只说“我做了工具调用”，要说清楚工具如何注册、版本化、分风险等级、按角色授权、审批和审计。
- **Human Takeover 运营台**：不要把人工接管当作失败兜底，而要说成生产级可靠性设计，包括接管队列、摘要、Trace 查看、审批、重跑和失败标注。
- **Browser Automation Testing**：不要只说接口测试通过，要说明如何用 Playwright 验证上传、问答、引用、任务状态、工具审批和运营台流程。
- **Agent Benchmark**：不要凭感觉说多 Agent 更好，要用固定任务集比较质量、成本、延迟、安全、恢复能力和 Trace 完整度。
- **AI Agent PRD**：不要一上来写代码，要先把用户、场景、P0/P1 范围、权限审批、产品指标和验收标准写清楚。
- **Context Window 管理**：不要说“大上下文全塞进去”，要讲 token 预算、历史压缩、证据排序、Memory 过滤和上下文 Trace。
- **MCP Gateway**：不要只说“接入 MCP”，要讲 server registry、schema cache、policy filter、secret boundary、approval 和 audit。
- **Memory Evaluation**：不要只说“做了记忆”，要讲 should remember / should not remember / update / forget / injection 测试集。
- **Queue / Backpressure**：不要只说“异步任务”，要讲优先级队列、资源并发、背压信号、熔断和死信队列。

## 后续补充方向

后续这个目录会继续沉淀：

- 项目 A / 项目 B 的完整面试讲法
- 项目架构图对应的讲解稿
- 面试官追问清单
- 简历 bullet 与项目页面之间的映射
- “一分钟介绍 → 深挖回答 → 反问准备”的表达链路

## 推荐组合阅读

如果已经有项目代码，但不知道怎么讲，建议按下面顺序整理：

1. 先看 [Agent Capability Matrix](/topics/agent-capability-matrix)，确认项目能证明哪些能力域。
2. 再看 [AI Agent 项目包装](/topics/ai-agent-project-packaging)，把项目改写成“业务问题 + 架构 + 难点 + 指标 + 贡献”。
3. 再看 [简历描述模板](/note/Interview/resume-bullets)，把项目压缩成 2-4 条简历 bullet。
4. 最后回到 [AI Agent 面试题库](/note/AI-Interview/)，准备技术追问。

如果距离面试时间较近，可以直接按 [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan) 执行，每周分别覆盖 Agent 基础、RAG、生产级工程和项目表达。

如果需要补充作品集项目方向，可以先用 [AI 项目设计文档模板](/topics/ai-project-design-doc-template) 写清楚方案，再用 [AI Agent PRD 模板](/topics/ai-agent-prd-template) 写清楚用户、范围和验收标准，然后从 [数据分析 Agent](/topics/data-analysis-agent)、[Code Agent 工程化](/topics/code-agent-engineering)、[Agent SaaS 产品化](/topics/agent-saas-productization) 中选择一个，分别对应数据智能、AI 编程工具和商业化产品能力。

项目深挖时，建议额外准备四类追问：一类是 [Agent 编排模式](/topics/agent-orchestration-patterns)，说明为什么选择 Router、Planner、Supervisor 或状态机；一类是 [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)，说明工具如何治理；一类是 [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)，说明如何证明方案收益；另一类是 [Agent 红队演练](/note/Engineering/agent-red-team-playbook)，说明上线前如何主动验证安全边界。

如果遇到系统设计题，可以按 [Agent 系统设计案例库](/topics/agent-system-design-casebook) 的 6 类案例练习：企业知识库、数据分析、Code Review、客服工单、多 Agent 研究助手和 Agent SaaS；如果面试官追问产品化落地，再补充 [Human Takeover 运营台](/topics/human-takeover-operations-console) 和 [Browser Automation Testing](/topics/browser-automation-testing-agent-ui)，说明系统如何被运营和验收。
