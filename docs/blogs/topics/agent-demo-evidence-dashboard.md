# Agent Demo Evidence Dashboard：让项目证据一眼可见

作品集项目不应该只给一个“项目介绍”。面试官更想快速看到证据：

- Demo 能不能跑？
- Agent 调用了哪些工具？
- 评测指标是什么？
- 安全边界在哪里？
- 出错后如何恢复？
- 这些证据和简历 bullet 是否一致？

Agent Demo Evidence Dashboard 的目标，是把项目从“文章”升级成“证据面板”。

---

## 1. Dashboard 应该展示什么

推荐 6 个区域：

| 区域 | 展示内容 | 证明能力 |
|---|---|---|
| Project Snapshot | 项目定位、技术栈、核心场景 | 一眼看懂 |
| Demo Paths | 成功路径、风险路径、失败恢复路径 | 可演示 |
| Agent Trace | plan、tool call、approval、result | Agent 工程 |
| Eval Scorecard | task success、grounding、safety、latency | 可评测 |
| Security Gates | sandbox、RBAC、PII、audit | 可上线 |
| Interview Pack | 一分钟介绍、STAR、追问链接 | 可答辩 |

不要把这些藏在长文里。Dashboard 的价值是让访客先看到证据，再决定是否深入阅读。

---

## 2. Project Snapshot

示例：

```text
Project C：企业 MCP Gateway 与 Skill Hub
定位：为企业 Agent 提供可治理工具扩展平台
技术栈：FastAPI / MCP / Tool Registry / OAuth / Audit Log / Eval Gate
核心证据：Gateway Console、Tool Risk Classification、Approval Workflow、Security Eval
```

Snapshot 卡片需要避免泛泛而谈：

- 不写“使用先进大模型技术”；
- 不写“提升效率”但没有指标；
- 不写“支持多种功能”但没有边界。

---

## 3. Demo Paths

一个项目至少准备三条演示路径：

### 成功路径

用户输入任务，Agent 正确规划、调用工具、返回结果，并通过评测。

### 风险路径

Agent 尝试执行高风险动作，系统触发审批或拦截。

### 失败恢复路径

工具失败、测试失败或证据不足时，Agent 给出恢复方案，而不是直接崩溃。

这三条路径能证明你理解生产级 Agent，而不是只会做 happy path demo。

---

## 4. Trace 证据

Trace 面板建议包含：

| 字段 | 说明 |
|---|---|
| run_id | 一次 Agent 运行的唯一标识 |
| step_id | 当前步骤 |
| actor | planner / executor / reviewer / tool |
| action | plan / call_tool / approve / evaluate |
| latency | 当前步骤耗时 |
| risk | low / medium / high |
| status | running / success / blocked / failed |

不要展示模型链式思考。展示可审计计划、工具调用摘要、输入输出摘要和状态变化即可。

相关内容：

- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent Run Replay](/note/Engineering/agent-run-replay)
- [Agent Decision Record](/note/Engineering/agent-decision-record)

---

## 5. Eval Scorecard

建议每个项目都给一个最小评分卡：

| Metric | Target | Evidence |
|---|---:|---|
| Task Success | ≥ 80% | eval report |
| Tool Correctness | ≥ 90% | tool call cases |
| Grounding | ≥ 85% | citation check |
| Safety Gate Pass | 100% high-risk blocked or approved | audit log |
| Latency P95 | ≤ 15s | trace metrics |

不同项目可以替换指标：

- RAG 项目：召回率、引用准确率、权限过滤命中。
- MCP 项目：schema 通过率、sandbox 拦截率、工具延迟。
- Coding Agent：测试通过率、文件相关性、review issue 命中。
- 文档智能：字段抽取准确率、PII 识别率、人工复核通过率。

---

## 6. Security Gates

作品集项目常被追问：

> “如果 Agent 调错工具、读到敏感文件、执行危险命令怎么办？”

Dashboard 里应该直接展示安全门禁：

- Tool risk level。
- Human approval。
- Sandbox profile。
- PII redaction。
- Audit log。
- Release gate。

这比在文章里写“考虑了安全性”更可信。

---

## 7. Interview Pack

Dashboard 最后一块应该服务求职：

| 内容 | 链接 |
|---|---|
| 一分钟介绍 | `/note/Interview/project-x-one-minute` |
| 深挖问答 | `/note/Interview/project-x-deep-dive` |
| STAR 故事 | story bank |
| Demo 脚本 | project demo script |
| 简历 bullet | resume bullets |

这样面试前可以直接按项目复习，而不是在文章堆里翻找。

---

## 8. Dashboard 模板

```markdown
## Evidence Dashboard

### Snapshot
- Problem:
- Architecture:
- Tech Stack:
- Proof:

### Demo Paths
- Success:
- Risk:
- Failure Recovery:

### Trace
- run_id:
- tool calls:
- approvals:
- final status:

### Eval
| Metric | Target | Result | Evidence |
|---|---:|---:|---|

### Security
- sandbox:
- approval:
- audit:
- PII:

### Interview Pack
- one-minute:
- deep-dive:
- resume bullet:
```

继续阅读：

- [AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)
- [AI Agent Offer Portfolio Review](/topics/ai-agent-offer-portfolio-review)
- [Agent UI Review Checklist](/topics/agent-ui-review-checklist)
- [项目实战](/projects)
