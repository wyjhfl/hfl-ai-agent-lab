# Agent 系统设计案例库：面试中如何拆 6 类 AI 项目

## 这篇文章解决什么问题

AI Agent 面试经常要求“设计一个系统”。如果只会背概念，很难现场组织答案。这篇文章整理 6 类常见系统设计题：

- 企业知识库 RAG。
- 数据分析 Agent。
- Code Review Agent。
- 客服工单 Agent。
- 多 Agent 研究助手。
- Agent SaaS 平台。

每个案例都按同一框架拆：需求、核心能力、架构、数据模型、风险、评测和面试表达。

## 通用回答框架

```text
1. Clarify Requirements
2. Define User Journey
3. High-level Architecture
4. Data Model
5. Agent / RAG / Tool Design
6. Safety and Permission
7. Evaluation and Monitoring
8. Trade-offs
```

## 案例 1：企业知识库 RAG

### 需求

员工上传和检索企业文档，基于权限回答问题，答案带引用。

### 架构

```text
Frontend
  -> API
  -> Ingestion Pipeline
  -> Vector DB
  -> Metadata Permission Filter
  -> Rerank
  -> LLM Answer
  -> Trace / Feedback
```

### 难点

- 文档解析和 chunk。
- 多租户权限。
- 引用可信。
- 文档更新和删除。
- RAG 评测。

### 评测

- Recall@k。
- Citation accuracy。
- No-answer refusal。
- Permission leak rate。

## 案例 2：数据分析 Agent

### 需求

用户用自然语言问业务数据，系统生成 SQL、图表和洞察。

### 架构

```text
Question
  -> Metric / Schema Retrieval
  -> SQL Generation
  -> SQL Safety Check
  -> Query Execution
  -> Chart Config
  -> Insight Summary
```

### 难点

- 语义层。
- SQL 安全。
- 权限过滤。
- 图表推荐。
- 不把相关性说成因果。

### 评测

- SQL correctness。
- Permission safety。
- Chart appropriateness。
- Insight faithfulness。

## 案例 3：Code Review Agent

### 需求

对 PR 做代码审查，发现 bug、风险、测试缺口并生成 review comment。

### 架构

```text
PR Diff
  -> Repo Context Retrieval
  -> Static Checks
  -> LLM Review
  -> Risk Classification
  -> Inline Comments
  -> Human Feedback
```

### 难点

- 只审改动相关上下文。
- 不产生泛泛建议。
- 关联测试和历史 bug。
- 防止误报。
- 不泄漏代码。

### 评测

- actionable comment rate。
- false positive rate。
- bug catch rate。
- developer acceptance rate。

## 案例 4：客服工单 Agent

### 需求

基于用户问题和知识库生成答复，必要时创建工单并进入人工处理。

### 架构

```text
User Message
  -> Intent Router
  -> RAG Answer / Tool Action
  -> Risk Check
  -> Human Approval
  -> Ticket Creation
  -> Feedback
```

### 难点

- 意图识别。
- RAG 引用。
- 工单字段结构化。
- 高风险动作审批。
- 用户满意度反馈。

### 评测

- intent accuracy。
- answer faithfulness。
- ticket field accuracy。
- escalation quality。

## 案例 5：多 Agent 研究助手

### 需求

帮助用户调研主题，搜索资料、总结观点、生成报告。

### 架构

```text
Planner
  -> Researcher
  -> Evidence Collector
  -> Writer
  -> Reviewer
  -> Report
```

### 难点

- 来源可信度。
- 多 Agent 状态共享。
- 引用和事实校验。
- 成本控制。
- 长任务恢复。

### 评测

- source quality。
- fact consistency。
- coverage。
- report usefulness。

## 案例 6：Agent SaaS 平台

### 需求

为企业提供可配置 Agent，支持团队、多租户、工具、计费和运维。

### 架构

```text
Tenant / User
  -> Agent Config
  -> Tool Registry
  -> LLM Gateway
  -> Run Runtime
  -> Billing / Audit / Monitoring
```

### 难点

- 多租户隔离。
- 工具权限。
- 额度计费。
- 运维后台。
- 安全审计。

### 评测

- task success rate。
- cost per tenant。
- permission leak rate。
- tool failure rate。

## 面试表达技巧

### 先问需求

不要直接画架构。先问：

- 用户是谁？
- 数据是什么？
- 是否需要实时？
- 是否有权限和合规？
- 成功指标是什么？

### 强调取舍

例如：

- 小规模知识库不一定需要 GraphRAG。
- 高风险工具必须人审。
- 数据分析 Agent 要优先安全 SQL，不是追求一次回答所有问题。

### 给出评测

系统设计题如果没有评测，会显得不落地。

## 面试回答模板

> 我会先澄清用户、数据、权限、实时性和成功指标。架构上分成入口 API、任务状态、模型调用、RAG/工具、Trace、评测和运维。对于 RAG 类系统，我会重点讲文档入库、metadata 权限过滤、rerank、引用和反馈；对于工具类 Agent，我会重点讲 schema、权限、审批、幂等和审计；对于 SaaS，我会补充多租户、额度计费和运营后台。最后用评测指标和监控说明系统如何持续迭代。

## 相关链接

- [Agent 系统设计面试题](/topics/agent-system-design-interview)
- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
- [Agent 编排模式](/topics/agent-orchestration-patterns)
- [数据分析 Agent](/topics/data-analysis-agent)
- [Agent SaaS 产品化](/topics/agent-saas-productization)
