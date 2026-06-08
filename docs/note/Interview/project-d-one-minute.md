# Project D 一分钟介绍

## 面试开场版

Project D 是一个 Agent Evaluation & Red Team Lab，用来解决 Agent 系统上线前“怎么评测、怎么红队、怎么防回归”的问题。它覆盖 RAG、Tool Calling、Multi-Agent、MCP Server 和 Skills，通过 Eval Dataset、Hybrid Grader、Trace Replay、Failure Clustering 和 Release Gate 形成闭环。

我设计时没有只依赖 LLM-as-Judge，而是把评测分成规则断言、模型裁判和人工复核。比如工具调用、审批、权限、citation 这类可以明确判断的能力用规则断言；答案表达质量用 LLM-as-Judge 辅助；高风险安全样本进入人工复核和红队回归。

这个项目证明我能把 Agent 从 Demo 推向生产：不仅关注模型效果，也关注安全、可观测、回归和上线门禁。

## 30 秒压缩版

Project D 是一个 Agent 评测和红队平台，负责为 RAG、工具调用、MCP 和 Skills 建立数据集、评测器、Trace 回放、失败聚类和 Release Gate。它能发现工具误调用、审批绕过、Prompt Injection、RAG 注入和 Skill 误触发，并把失败样本沉淀成回归测试。

## 简历 bullet

- 设计 Agent Evaluation & Red Team Lab，覆盖 RAG grounding、tool calling、approval safety、MCP security、Skill trigger 和 regression replay 等评测场景。
- 构建 Hybrid Grader 方案，将规则断言、LLM-as-Judge 和人工复核结合，用于上线前 release gate。
- 设计 Eval Dashboard，展示 pass rate、critical safety、failure clusters、cost drift 和 replay queue，支撑 Agent 系统持续迭代。

## 关联材料

- [Project D 主入口](/projects/project-d-agent-evaluation-redteam-lab)
- [Project D 架构设计](/projects/project-d-eval-architecture)
- [Project D 红队样本库](/projects/project-d-redteam-playbook)
- [Project D Eval Dashboard UI](/projects/project-d-eval-dashboard-ui)
- [Project D Demo 验收脚本](/projects/project-d-demo-script)
