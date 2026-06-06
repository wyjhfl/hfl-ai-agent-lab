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
- [AI Agent 项目包装：简历、作品集和面试讲法](/topics/ai-agent-project-packaging)
- [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan)
- [数据分析 Agent 项目方向](/topics/data-analysis-agent)
- [Agent SaaS 产品化项目方向](/topics/agent-saas-productization)
- [Code Agent 工程化项目方向](/topics/code-agent-engineering)
- [RAG 设计问答](/note/Interview/rag-qa)
- [Multi-Agent 设计问答](/note/Interview/multi-agent-qa)
- [LangGraph 设计问答](/note/Interview/langgraph-qa)

## 后续补充方向

后续这个目录会继续沉淀：

- 项目 A / 项目 B 的完整面试讲法
- 项目架构图对应的讲解稿
- 面试官追问清单
- 简历 bullet 与项目页面之间的映射
- “一分钟介绍 → 深挖回答 → 反问准备”的表达链路

## 推荐组合阅读

如果已经有项目代码，但不知道怎么讲，建议按下面顺序整理：

1. 先看 [AI Agent 项目包装](/topics/ai-agent-project-packaging)，把项目改写成“业务问题 + 架构 + 难点 + 指标 + 贡献”。
2. 再看 [简历描述模板](/note/Interview/resume-bullets)，把项目压缩成 2-4 条简历 bullet。
3. 最后回到 [AI Agent 面试题库](/note/AI-Interview/)，准备技术追问。

如果距离面试时间较近，可以直接按 [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan) 执行，每周分别覆盖 Agent 基础、RAG、生产级工程和项目表达。

如果需要补充作品集项目方向，可以优先从 [数据分析 Agent](/topics/data-analysis-agent)、[Code Agent 工程化](/topics/code-agent-engineering)、[Agent SaaS 产品化](/topics/agent-saas-productization) 中选择一个，分别对应数据智能、AI 编程工具和商业化产品能力。
