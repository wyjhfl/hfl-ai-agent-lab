# Agent 开发 Playbook：从需求到可上线版本

## 这篇文章解决什么问题

很多 Agent 项目失败，不是因为模型不会回答，而是因为开发流程一开始就错了：

- 上来就选框架，没有定义任务边界。
- 直接写 Prompt，没有定义状态和工具。
- Demo 能跑，但没有 Trace、评测和回滚。
- 多 Agent 只是多个角色聊天，没有真正的任务协作。
- 工具能调用，但没有权限、幂等和审计。
- 上线后不知道失败来自检索、模型、工具还是业务规则。

这篇文章给出一个 Agent 项目从 0 到 1 的开发 Playbook。它不是某个框架教程，而是一套工程推进顺序。

## 总体路线

```text
业务问题
  ↓
任务边界
  ↓
单 Agent 最小闭环
  ↓
工具和 RAG 接入
  ↓
State / Trace / Evaluation
  ↓
Guardrails / Human Review
  ↓
多 Agent 或复杂编排
  ↓
上线与持续迭代
```

核心原则：先做可验证的单 Agent 闭环，再扩展复杂架构。

## 第一步：定义业务问题

不要先说“我要做一个 Agent”。先回答：

- 用户是谁？
- 用户要完成什么任务？
- 当前流程为什么慢或不稳定？
- AI 能减少哪个环节的成本？
- 失败的后果是什么？
- 输出结果如何被使用？

例如项目 A：

> 售后工程师需要从手册和历史工单中找故障原因，并生成可执行工单建议。人工检索慢，答案缺少引用，经验难沉淀。

例如项目 B：

> 运营人员需要分析活动数据、生成操作建议、创建执行任务并跟踪结果。流程涉及多个系统和审批，人工切换成本高。

业务问题清楚后，Agent 的边界才清楚。

## 第二步：定义任务边界

Agent 不应该什么都做。先定义“输入、输出、成功标准、禁止事项”。

| 项目 | 示例 |
|---|---|
| 输入 | 用户问题、文档、指标、工单、截图 |
| 输出 | 诊断建议、操作计划、工单草稿、分析报告 |
| 成功标准 | 有引用、可执行、格式正确、无需人工大改 |
| 禁止事项 | 不能直接删除数据，不能越权创建任务，不能编造引用 |
| 人工介入点 | 高风险操作前审批，低置信度答案人工确认 |

没有边界的 Agent 很容易变成不可控聊天机器人。

## 第三步：做单 Agent 最小闭环

最小闭环不是最简 Demo，而是最小可验证系统。

它至少包括：

- 一个明确任务入口。
- 一个 Agent 执行函数。
- 一个输出 schema。
- 一组示例输入。
- 一个 smoke test。
- 一条执行 Trace。

不要一开始就做多 Agent。单 Agent 闭环跑不稳，多 Agent 只会放大问题。

## 第四步：接入工具和 RAG

Agent 的能力来自外部上下文和外部动作。

### RAG 接入

RAG 负责给模型证据：

```text
query -> rewrite -> retrieve -> rerank -> context pack -> answer with citations
```

必须记录：

- query。
- 召回文档。
- rerank 分数。
- 进入上下文的证据。
- 答案引用。

### Tool 接入

工具负责执行动作：

- 查询数据库。
- 创建工单。
- 读取指标。
- 调用内部 API。
- 请求人工审批。

工具必须具备：

- schema。
- 参数校验。
- 权限控制。
- 错误分类。
- 幂等。
- 审计日志。

如果工具数量变多，可以用 MCP 标准化接入。

## 第五步：设计 State

Agent 的状态不是聊天记录。状态应该是结构化对象。

```json
{
  "task_id": "task_001",
  "status": "waiting_for_approval",
  "goal": "generate support diagnosis",
  "steps_completed": ["retrieve_docs", "draft_answer"],
  "pending_action": {
    "type": "create_workorder",
    "risk": "medium"
  },
  "evidence_ids": ["manual-001#p12"],
  "errors": []
}
```

结构化 State 的好处：

- 可以恢复。
- 可以展示。
- 可以审批。
- 可以测试。
- 可以评测。

## 第六步：接入 Trace

Trace 是 Agent 工程化的底座。每次执行至少记录：

- `run_id`
- `step_id`
- 当前 state。
- 模型输入摘要。
- 模型输出摘要。
- 工具调用。
- RAG 证据。
- 错误类型。
- latency。
- token 和成本。

没有 Trace，线上失败只能靠猜。

## 第七步：建立 Evaluation

Agent 评测不能只靠人工感觉。至少要有：

- 固定测试集。
- 关键指标。
- 失败样本库。
- 版本对比。
- 人工抽检。

不同任务用不同指标：

| 任务 | 指标 |
|---|---|
| RAG 问答 | 引用准确率、答案完整性、幻觉率 |
| 工单生成 | 字段完整率、可执行性、人工修改率 |
| 工具调用 | 调用正确率、参数正确率、失败恢复率 |
| 多 Agent | 任务完成率、handoff 正确率、重复工作率 |
| 代码 Agent | 测试通过率、diff 范围、回归率 |

评测要和 Trace 结合，才能定位失败原因。

## 第八步：加入 Guardrails 和人工审批

高风险 Agent 必须有控制点：

- 输入过滤。
- 工具权限。
- 参数校验。
- 输出检查。
- 人工审批。
- 操作撤销。

常见审批点：

- 写数据库。
- 发消息。
- 创建工单。
- 修改配置。
- 删除资源。
- 执行 shell。

审批不是最后加一个“确认按钮”，而是要和 State、Trace、权限系统结合。

## 第九步：再考虑多 Agent

多 Agent 适合任务确实需要分工的场景：

- Planner 制定计划。
- Retriever 找证据。
- Analyst 分析数据。
- Executor 调工具。
- Critic 审核结果。

但每个 Agent 都要有职责边界、输入输出 contract 和工具权限。否则多 Agent 会变成多角色聊天。

## 第十步：上线运行

上线前至少检查：

- 环境变量。
- API Key 权限。
- 数据库迁移。
- 队列和 worker。
- 日志和 Trace。
- 失败告警。
- 成本预算。
- 降级策略。
- 回滚方案。
- 用户反馈入口。

生产级 Agent 不是“模型能回答”，而是系统出错时能定位、恢复和改进。

## 一个项目迭代节奏

| 阶段 | 目标 | 产出 |
|---|---|---|
| v0.1 | 单 Agent 最小闭环 | API、schema、示例输入输出 |
| v0.2 | RAG / Tool 接入 | 检索链路、工具 schema、权限 |
| v0.3 | State / Trace | run、step、tool_call 数据 |
| v0.4 | Evaluation | 测试集、指标、失败样本 |
| v0.5 | Guardrails | 审批、限权、错误分类 |
| v0.6 | UI / Demo | 可展示页面、操作路径 |
| v0.7 | 部署 | Docker、runbook、smoke test |
| v0.8 | 多 Agent | handoff、分工、聚合 |

每个阶段都应该能独立验证。

## 面试表达

可以这样讲 Agent 开发流程：

> 我不会一开始就上复杂多 Agent 框架，而是先定义业务任务边界，做一个单 Agent 最小闭环：明确输入输出、输出 schema、示例数据和 smoke test。然后逐步接入 RAG 和工具，把工具 schema、权限、错误和幂等处理好。接着设计结构化 State 和 Trace，让每次执行可恢复、可审计。最后补 Evaluation、Guardrails 和人工审批，再根据任务复杂度决定是否拆成多 Agent。这样每一步都有验证证据，而不是靠 Demo 效果主观判断。

## 相关链接

- [Context Engineering](/note/AI-Agent/context-engineering)
- [Agent Runtime](/note/AI-Agent/agent-runtime)
- [Tool Calling 工程化](/topics/tool-calling-engineering)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [Evaluation Pipeline](/topics/evaluation-pipeline)
- [AI Agent 求职作品集路线](/topics/ai-agent-portfolio-roadmap)

## 参考资料

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [Model Context Protocol Architecture](https://modelcontextprotocol.io/docs/learn/architecture)

