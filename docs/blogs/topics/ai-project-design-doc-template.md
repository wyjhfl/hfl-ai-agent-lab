# AI 项目设计文档模板：从想法到可交付项目

## 这篇文章解决什么问题

很多 AI 项目失败不是因为模型不会，而是因为一开始没有设计文档：

- 需求不清楚。
- 成功指标不明确。
- 数据来源没确认。
- 权限和风险没设计。
- 没有评测集。
- 项目做完不知道如何展示。

这篇文章给出一个适合 AI Agent / RAG / LLM 应用的设计文档模板，可用于个人项目、团队方案和面试准备。

## 1. 项目背景

写清楚：

- 目标用户是谁？
- 他们现在怎么解决问题？
- 痛点是什么？
- 为什么需要 AI / Agent / RAG？
- 不做 AI 是否也能解决？

示例：

```text
售后工程师需要在大量设备手册中查找故障处理步骤。传统关键词搜索容易漏掉同义表达，也无法自动生成工单建议，因此需要 RAG + 工单 Agent。
```

## 2. 项目目标和非目标

### Goals

- 支持文档上传和问答。
- 答案带引用。
- 支持创建工单草稿。
- 记录反馈和评测。

### Non-goals

- 不做完全自动派单。
- 不允许 Agent 直接关闭工单。
- 不支持跨租户检索。

Non-goals 很重要，可以防止范围失控。

## 3. 用户流程

```text
用户上传文档
  -> 系统入库并显示 ready
  -> 用户提问
  -> 系统检索证据
  -> 生成带引用答案
  -> 用户反馈或创建工单
```

## 4. 系统架构

至少包含：

- Frontend。
- API。
- Database。
- Vector DB。
- LLM Gateway。
- Worker。
- Tool Registry。
- Trace / Evaluation。

## 5. 数据模型

列出核心对象：

| 对象 | 字段 |
|---|---|
| document | id、tenant_id、status、version |
| chunk | id、doc_id、text、metadata、embedding_model |
| task | id、user_id、status、goal |
| run | id、task_id、model、prompt_version |
| tool_call | id、run_id、tool_name、args_hash、status |
| feedback | id、run_id、type、comment |

## 6. Agent / RAG 设计

写清楚：

- 是否真的需要 Agent？
- 用什么编排模式？
- 工具有哪些？
- RAG 检索链路是什么？
- Prompt 版本如何管理？
- 输出是否结构化？
- 失败如何恢复？

## 7. 权限和安全

必须回答：

- 谁能访问哪些数据？
- 工具是否有副作用？
- 哪些动作需要审批？
- Prompt Injection 如何防？
- 日志是否脱敏？
- 多租户如何隔离？

## 8. 评测方案

| 能力 | 指标 |
|---|---|
| RAG 召回 | Recall@k、MRR |
| 答案质量 | correctness、faithfulness |
| 引用 | citation accuracy |
| 工具调用 | tool selection、argument accuracy |
| 安全 | attack block rate、permission leak rate |
| 产品 | feedback rate、task success rate |

## 9. 监控和运维

写清楚：

- p95 延迟。
- 成本。
- 错误率。
- fallback。
- 工具失败。
- 负反馈。
- 报警和 Runbook。

## 10. 里程碑

| 阶段 | 交付 |
|---|---|
| M1 | 本地 Demo，单文档问答 |
| M2 | 入库流水线和引用 |
| M3 | 权限过滤和反馈 |
| M4 | 工具调用和审批 |
| M5 | 评测集和上线检查 |

## 11. 风险和取舍

示例：

| 风险 | 应对 |
|---|---|
| 检索召回差 | 建立 RAG debug trace 和评测集 |
| 成本高 | 模型路由、缓存、上下文预算 |
| 工具误调用 | schema、权限、人审、幂等 |
| 数据泄漏 | metadata filter、多租户隔离 |
| 质量退化 | PromptOps 和回归评测 |

## 12. 简历和展示计划

提前设计展示：

- README 架构图。
- Demo 截图。
- 测试命令。
- 评测结果。
- 关键设计文档。
- 面试讲解稿。

## 一页模板

```text
项目名称：
目标用户：
核心痛点：
AI 能力：RAG / Tool / Agent / Eval / SaaS
核心流程：
系统架构：
数据模型：
工具和权限：
评测指标：
上线检查：
项目亮点：
风险和取舍：
```

## 面试表达模板

> 我做 AI 项目前会先写设计文档，明确用户、痛点、目标和非目标，再设计用户流程、系统架构、数据模型、RAG/Agent/Tool 链路、权限安全、评测方案和运维指标。这样项目不是临时拼 Demo，而是从一开始就考虑数据、权限、失败、成本、评测和展示。最后我会把设计文档转成 README、简历 bullet 和面试讲解稿。

## 相关链接

- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
- [Agent 系统设计案例库](/topics/agent-system-design-casebook)
- [Agent 开发 Playbook](/topics/agent-development-playbook)
- [生产级 Agent 治理清单](/topics/production-agent-governance-checklist)
- [AI Agent 面试 30 天复习清单](/topics/ai-agent-interview-30-day-plan)
