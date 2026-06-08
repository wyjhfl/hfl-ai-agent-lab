# 项目 B 一分钟介绍

## 版本一：面试开场版

我做的项目 B 是一个面向运营中台的 Multi-Agent Copilot。它解决的不是单轮问答，而是运营人员每天要处理的多步骤任务，比如分析活动转化率下降原因、查询业务数据、生成工单草稿和通知文案。

系统里我没有让大模型自由调用所有工具，而是设计了一个受控的 Agent Runtime：用户输入先进 Router 判断任务类型和风险，再由 Planner 拆解步骤，Executor 通过 Tool Registry 调用受控工具，高风险动作进入 Human-in-the-loop 审批，最后由 Reviewer 检查证据和安全边界。每次执行都会记录 Trace，并把失败样本沉淀到评测集中。

这个项目主要展示我对 Agent 工程化的理解：不仅会调模型，还会设计状态机、工具治理、权限审批、Trace 回放和 Evaluation release gate。

## 版本二：简历项目版

Project B 是一个运营中台 Multi-Agent Copilot，面向活动诊断、指标查询、工单草稿和运营文案生成等场景。我负责从 0 到 1 设计 Agent 架构：用 Router / Planner / Executor / Reviewer 拆分 Agent 职责，用 Tool Registry 管理工具 schema、风险等级和错误码，用 Human-in-the-loop 控制高风险动作，并用 Trace / Eval 记录和评估每次运行结果。

项目亮点是把 Agent 从 Prompt Demo 做成可治理系统：能解释每一步为什么执行、能回放工具调用、能拒绝越权动作，也能通过评测集防止改动后能力回归。

## 版本三：技术负责人版

我把 Project B 定位成一个企业 Copilot 的最小生产化样板。架构上分为 UI、Run Controller、Agent Runtime、Context Layer、Tool Layer、Governance 和 Observability 七层。模型负责理解、规划和总结，但工具执行、权限、审批、审计和状态管理都在后端受控完成。

这样设计的原因是：企业 Agent 最大的问题不是回答一句话，而是工具调用错误、权限越界、结果不可追踪和上线后不可评估。因此我重点做了 Tool Contract、Human Approval、Trace Replay 和 Eval Dataset，把这些能力做成项目证据。

## 30 秒压缩版

Project B 是一个运营中台 Multi-Agent Copilot，用来展示 Agent 工程化能力。它通过 Router、Planner、Executor、Reviewer 拆分任务流程，通过 Tool Registry 和 Human-in-the-loop 控制工具风险，通过 Trace / Eval 让每次运行可回放、可评测、可上线。这个项目证明我不仅能做 LLM Demo，也能把 Agent 做成可治理的业务系统。

## 可追问点

- 为什么不用单 Agent？
- 为什么要状态机？
- 工具调用如何防止误操作？
- 高风险动作如何审批？
- Trace 记录哪些信息？
- Eval 如何设计？
- 如果模型升级导致退化怎么办？

## 关联材料

- [Project B 主入口](/projects/project-b-agent-copilot)
- [Project B 架构设计](/projects/project-b-architecture)
- [Project B Demo 验收脚本](/projects/project-b-demo-script)
- [Project B Trace / Eval 方案](/projects/project-b-trace-eval-plan)
- [Project B STAR 故事库](/note/Interview/project-b-star-story-bank)
