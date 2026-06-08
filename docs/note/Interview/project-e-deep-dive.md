# Project E 深挖问答：AI Coding Agent Workbench

## Q1：Project E 和普通 AI 编程工具使用有什么区别？

普通使用是个人让模型帮忙写代码；Project E 是团队级流程，把任务理解、上下文选择、代码执行、测试、评审、PR 和失败回放串起来。重点是可控交付，而不是一次性生成。

## Q2：Context Pack 如何设计？

Context Pack 包含 task brief、相关文件、相关测试、项目约束、历史失败日志、验收命令和 out-of-scope。它避免全仓库乱塞，也避免模型缺少关键上下文。

## Q3：怎么防止 Agent 没跑测试却说完成？

所有验证命令必须记录 command、exit code、stdout/stderr 摘要和时间。PR body 只能引用真实命令输出。没有验证证据时，状态只能是“未验证”，不能标记完成。

## Q4：Code Review Bench 评估什么？

评估 reviewer 能否发现预设 bug、安全问题、测试缺口、改动越界和可维护性问题。指标包括 finding precision、recall、false alarm、blocker miss rate 和 actionable rate。

## Q5：如何处理高风险改动？

高风险改动包括鉴权、支付、数据删除、CI/CD、依赖升级和安全策略。它们需要人工复核，不能只靠 Agent 自评。必要时需要额外 e2e 或 staging 验收。

## Q6：Project E 如何和 Skills 结合？

重复任务可以沉淀成 Skill，比如“VitePress UI 批次优化”“MCP Server 创建”“PR Review Checklist”“生产发布检查”。Skill 里放流程、脚本、references 和验收命令，让 Agent 下次按同一套流程执行。

## Q7：项目最大难点是什么？

最大难点是验证可信度。AI Coding Agent 最大风险不是不会写代码，而是看似完成但没有真实验证。因此 Project E 把 verification gate 和 review bench 放在核心位置。

## 面试总结句

> Project E 的核心是把 AI Coding Agent 从个人助手升级为团队工程流程：任务结构化、上下文可控、验证真实、审查可追踪、失败可回放、流程可沉淀。
