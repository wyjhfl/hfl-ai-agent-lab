# Project B STAR 故事库

> 面试时不要只背架构，要准备可讲述的 STAR 故事：Situation、Task、Action、Result。下面这些故事可以对应简历、项目答辩和追问。

## 故事 1：从聊天 Demo 改成受控 Agent Runtime

### Situation

最初的 Copilot 方案容易变成“用户输入 → 模型回答”的聊天 Demo。虽然能演示，但很难解释工具为什么被调用、风险如何控制、错误如何排查。

### Task

我要把它改造成可展示工程能力的 Agent Runtime，让每次任务都有状态、工具、审批和 Trace。

### Action

我把流程拆成 Router、Planner、Executor、Reviewer 四类角色，并用状态机约束流程。工具不直接暴露给模型，而是进入 Tool Registry，统一 schema、风险等级、超时和错误码。高风险动作必须进入审批。

### Result

项目从“能回答”升级为“可治理”：可以展示每一步为什么执行、调用了什么工具、有没有证据、是否经过审批，也能为后续 Evaluation 提供数据。

## 故事 2：解决 Agent 工具误调用风险

### Situation

运营任务里有些工具只是读数据，有些工具会创建工单或发通知。如果模型误调用写操作，会带来业务风险。

### Task

我要设计一套工具风险治理机制，避免 Agent 直接执行高风险动作。

### Action

我给每个工具定义 risk level：read、write draft、external side effect。低风险查询可以自动执行；中风险只生成草稿；高风险动作必须生成 action preview，经用户 approve 后才能执行。

### Result

这样既保留了 Agent 的效率，又把真实副作用动作放回人工控制链路中。面试时可以用它解释 Human-in-the-loop 和工具治理能力。

## 故事 3：用 Trace 定位多 Agent 错误

### Situation

多 Agent 系统的错误可能来自很多地方：任务分类、规划、检索、工具、审批或最终总结。只看最终答案很难定位。

### Task

我要让每次运行都可回放，能快速判断问题发生在哪一层。

### Action

我设计了 run trace：记录 Router 分类、Planner 计划、Retriever query、Tool input/output、Approval decision、Reviewer verdict、token cost 和 latency。

### Result

如果答案错误，可以分层排查：是指标口径没查到、工具超时、权限拒绝，还是 Reviewer 漏检。Trace 也能直接变成评测和复盘材料。

## 故事 4：把失败样本沉淀成 Evaluation

### Situation

Agent 项目上线后，Prompt、模型、工具 schema、业务数据都会变化。一次改动可能让历史能力退化。

### Task

我要设计评测集和 release gate，防止改动后出现无声回归。

### Action

我把关键任务做成 eval cases：必须调用哪些工具、是否必须审批、是否必须引用证据、是否必须拒绝越权请求。软性质量再用 rubric 评估完整性、清晰度和业务可用性。

### Result

每次改动都能跑回归。这样项目不仅能演示，还能讲清楚如何持续维护和上线。

## 故事 5：把 Project B 包装成求职作品集

### Situation

很多 AI 项目写在简历上只有“使用 LangGraph / RAG / FastAPI”，缺少可验证证据。

### Task

我要把 Project B 打包成招聘方能快速理解的作品集。

### Action

我补了项目主入口、架构设计、Demo 验收脚本、Trace / Eval 方案、路线图、一分钟介绍、深挖问答和 STAR 故事库。每个技术点都能跳转到证据页面。

### Result

面试时可以从简历 bullet 直接讲到架构图、状态机、工具治理、审批、Trace 和评测，而不是停留在框架名。

## 简历 bullet 模板

- 设计运营中台 Multi-Agent Copilot，将任务理解、计划生成、工具调用、人工审批和结果复核拆成可追踪状态机，提升多步骤 AI 任务的可控性。
- 建立 Tool Registry 与风险分级机制，为业务查询、工单草稿、通知文案等工具定义 schema、错误码、审批策略和审计字段。
- 设计 Agent Trace / Evaluation 方案，记录 router、planner、retriever、tool、approval、reviewer 等 spans，并用关键任务回归防止模型和 Prompt 改动导致能力退化。

## 关联材料

- [Project B 一分钟介绍](/note/Interview/project-b-one-minute)
- [Project B 深挖版](/note/Interview/project-b-deep-dive)
- [Project B 架构设计](/projects/project-b-architecture)
- [Project B Trace / Eval 方案](/projects/project-b-trace-eval-plan)
