# 生产级 Agent Readiness Review：上线前如何做架构审查

## 这篇文章解决什么问题

很多个人项目能跑通 Demo，但一到面试或真实上线，就会被追问：失败怎么恢复？工具怎么控权？成本怎么算？多租户怎么隔离？RAG 怎么评测？MCP 怎么审计？上线怎么回滚？

Production Readiness Review 是把 Agent 项目从“能演示”推进到“可上线、可解释、可运营”的审查清单。它适合用于：

- 项目上线前评审。
- 作品集项目自查。
- 面试系统设计题准备。
- 团队内部 Agent 架构审查。

## 总览：10 个审查维度

| 维度 | 核心问题 |
|---|---|
| 任务边界 | Agent 解决什么，不解决什么 |
| Workflow | 状态、步骤、失败、人工介入是否清晰 |
| RAG | 证据、引用、拒答、权限是否可评测 |
| Tool / MCP | 工具 schema、权限、审批、审计是否可控 |
| Memory | 记忆写入、更新、遗忘和注入防护是否可靠 |
| Evaluation | 是否有 smoke、regression、benchmark 和 scorecard |
| Security | Prompt Injection、越权、数据泄漏是否有纵深防御 |
| Cost / Latency | 成本、延迟、缓存和预算是否可观测 |
| Operations | 告警、Runbook、故障演练、复盘是否完整 |
| Release | 版本、灰度、回滚和变更记录是否可治理 |

如果一个项目只能解释“我调了模型和工具”，说明还停留在 Demo 阶段。

## 1. 任务边界审查

要回答：

- 用户是谁？
- 任务输入是什么？
- 输出交付物是什么？
- 哪些场景必须拒绝？
- 哪些场景转人工？
- 成功标准是什么？

示例表达：

> 这个 Agent 只负责生成工单处理建议，不自动关闭高风险工单；当证据不足、权限不足或用户要求超出范围时，会拒答或转人工。

## 2. Workflow 审查

检查是否有明确状态机：

- Created
- Queued
- Planning
- Retrieving
- RunningTool
- WaitingApproval
- Validating
- Completed
- Failed
- Cancelled

每个状态要有进入条件、退出条件、失败处理和 Trace。长任务不能只靠一次模型调用完成。

## 3. RAG 审查

RAG 不只是“接了向量库”。要检查：

- 文档如何解析、切块、打 metadata。
- 检索是否有 tenant / ACL 过滤。
- 是否有 rerank 和 context pack。
- 引用是否能定位到文档、页码、chunk。
- 无答案时是否拒答。
- 是否有 RAG Evaluation Report。

面试时要能解释答案错了如何定位：入库、召回、过滤、重排、上下文、生成还是引用。

## 4. Tool / MCP 审查

工具调用要检查：

- tool schema 是否稳定。
- 参数是否服务端校验。
- tenant_id / user_id 是否由系统注入。
- 高风险工具是否审批。
- MCP Server 是否有 timeout、rate limit、错误映射。
- 调用是否写入审计日志和 Agent Trace。
- Schema 变化是否有 diff 和回归测试。

不要把 MCP 讲成“接入协议”，要讲成“工具治理体系”。

## 5. Memory 审查

记忆系统要回答：

- 什么应该记住？
- 什么不应该记住？
- 用户如何查看、修改、删除记忆？
- 记忆是否有 tenant / user 隔离？
- 过期记忆如何处理？
- Prompt Injection 能否污染记忆？

没有记忆评测的 Memory 很容易“记住但记错”。

## 6. Evaluation 审查

至少要有四层评测：

| 层 | 内容 |
|---|---|
| smoke | 快速验证核心链路 |
| regression | 历史失败样本回放 |
| safety | 注入、越权、危险工具 |
| benchmark | 对比模型、框架、workflow 方案 |

评测结果最好沉淀成 Scorecard，而不是一句“效果还不错”。

## 7. Security 审查

安全不是一个 guardrail 开关，而是一组边界：

- 不信任用户输入和 RAG 文档。
- 不信任模型生成的工具参数。
- 不让模型控制 tenant / role / permission。
- 高风险工具必须审批。
- 敏感输出必须脱敏。
- 安全失败样本进入回归集。

安全审查要覆盖 Prompt、RAG、Tool、MCP、Memory、API、Cache 和 Trace。

## 8. Cost / Latency 审查

要有成本账本：

- token_per_task
- cost_per_task
- cost_per_success
- p95_latency
- retry_cost_ratio
- cache_hit_rate
- model_mix

优化手段包括：模型路由、语义缓存、RAG top_k 控制、Prompt 瘦身、批处理、流式输出和失败重试预算。

## 9. Operations 审查

上线后要能回答：

- 哪些指标报警？
- 谁处理报警？
- 如何止血？
- 如何回滚？
- 如何复盘？
- 如何把事故变成评测样本？

Agent 项目如果没有 Runbook，只能靠开发者临时排查。

## 10. Release 审查

上线前检查：

- Prompt 版本是否记录。
- 模型路由是否可回滚。
- 工具策略是否可灰度。
- Eval Gate 是否通过。
- 安全样本是否通过。
- 成本和延迟是否在预算内。
- 变更记录是否可追踪。

生产级 Agent 的发布对象不只是代码，还包括 Prompt、模型、RAG index、工具 schema、MCP Server 和策略配置。

## 面试 60 秒表达

我会用 Production Readiness Review 审查 Agent 项目，不只看功能是否能跑通，而是从任务边界、Workflow、RAG、Tool/MCP、Memory、Evaluation、Security、Cost、Operations 和 Release 十个维度检查。比如高风险工具要有审批和执行层校验，RAG 要有 citation evaluation 和权限隔离，模型调用要有成本账本和语义缓存，MCP Server 要有 schema version、timeout 和审计。这样项目从 Demo 变成可上线系统时，每个关键风险都有对应的工程控制点。

## 作品集怎么用

可以把这篇清单变成作品集页面的一节：

- 架构图：展示 Data Plane / Control Plane / Eval / Ops。
- 表格：列出 10 个 readiness 维度和项目实现情况。
- 指标：展示 task success、citation accuracy、cost_per_task、p95_latency。
- 风险：说明哪些能力已实现，哪些是下一版计划。

这比单纯列技术栈更能体现工程深度。

## 相关链接

- [Agent 开发 Playbook](/topics/agent-development-playbook)
- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [MCP Server Hardening](/note/Engineering/mcp-server-hardening)
- [RAG Evaluation Report Template](/note/Engineering/rag-evaluation-report-template)
- [Agent Production Failure Drill](/note/Engineering/agent-production-failure-drill)
