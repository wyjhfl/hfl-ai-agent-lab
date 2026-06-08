# Project E 架构设计：AI Coding Agent Workbench

> 这页用于系统设计答辩：如何把 AI Coding Agent 纳入团队软件工程流程。

## 设计目标

1. **可控执行**：Agent 只能在任务范围内改动，并记录 diff、命令和验证结果。
2. **上下文精准**：给 Agent 的上下文不是全仓库乱塞，而是 task brief + relevant files + tests + constraints。
3. **验证优先**：没有构建/测试/浏览器验收证据，不能宣称完成。
4. **审查闭环**：Agent 生成代码后必须经过 review bench。
5. **经验沉淀**：重复流程变成 Skills 和 scripts。

## 分层架构

| 层级 | 模块 | 说明 |
|---|---|---|
| Intake Layer | issue parser、requirements checklist、risk classifier | 把任务转成可执行 brief |
| Context Layer | repo map、file retriever、test locator、decision log | 生成上下文包 |
| Execution Layer | Codex / Claude Code / Copilot / local agent adapters | 执行代码修改 |
| Verification Layer | lint、unit、build、e2e、browser smoke、docs build | 证明改动有效 |
| Review Layer | static rules、LLM reviewer、human reviewer | 发现 bug、越界和质量问题 |
| Delivery Layer | PR composer、changelog、rollback plan | 交付协作材料 |
| Learning Layer | failure replay、skill library、eval dataset | 让经验复用 |

## Task Brief 结构

```ts
interface CodingTaskBrief {
  taskId: string
  objective: string
  constraints: string[]
  targetFiles?: string[]
  relatedTests?: string[]
  riskLevel: 'low' | 'medium' | 'high'
  acceptanceCommands: string[]
  expectedArtifacts: string[]
  outOfScope: string[]
}
```

## Context Pack

一个好的 coding agent context pack 应包括：

- 任务目标和验收标准。
- 相关文件，而不是全仓库。
- 需要运行的测试命令。
- 项目编码规范。
- 最近相关失败日志。
- 不能改动的边界。
- 交付格式。

## Review Bench

| Reviewer | 检查内容 |
|---|---|
| Static rules | dead code、secret、危险命令、格式、类型 |
| LLM reviewer | 逻辑 bug、边界条件、需求遗漏、可读性 |
| Test reviewer | 是否跑了正确命令，是否覆盖原问题 |
| Human reviewer | 高风险改动、架构取舍、安全影响 |

## 指标

- task success rate
- build pass rate
- review finding precision
- regression recurrence count
- time to PR
- human edit rate
- context token cost
- flaky test rate
- rollback count

## 面试表达

> Project E 的架构核心是把 AI Coding Agent 放进软件工程闭环：先把需求结构化，再生成上下文包，再执行改动，再通过测试门禁和代码审查，最后生成 PR 和失败回放。它强调验证和协作，而不是盲目相信模型改动。
