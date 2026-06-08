# Agent Eval & Observability Playbook：从评分卡到上线门禁

Agent 系统一旦接入工具、RAG、审批和长任务，就不能只看“最终回答是否像样”。你需要同时观察：

- 任务是否完成；
- 工具是否调对；
- 证据是否可信；
- 高风险动作是否被拦截；
- 延迟和成本是否可控；
- 失败样本是否进入回归集；
- 新版本是否比旧版本更好。

这篇 Playbook 把 Eval、Trace、Observability 和 Release Gate 串成一条上线链路。

---

## 1. 四层评测模型

| 层级 | 评测对象 | 示例指标 |
|---|---|---|
| Output | 最终答案 | 格式、正确性、完整性 |
| Tool | 工具调用 | tool selection、参数、side effect |
| Context | RAG / Memory | 召回、引用、权限、freshness |
| Workflow | Agent 过程 | step success、approval、recovery、latency |

只评最终答案会漏掉很多问题。例如：

- 答案对了，但读了越权文档；
- 工具调用成功，但参数不该这么传；
- RAG 引用了过期资料；
- Agent 失败后没有恢复路径。

---

## 2. 最小 Scorecard

```yaml
scorecard:
  task_success:
    target: 0.80
    method: human_or_llm_judge
  tool_correctness:
    target: 0.90
    method: schema_and_expected_tool
  grounding:
    target: 0.85
    method: citation_check
  safety:
    target: 1.00
    method: policy_gate
  latency_p95:
    target: 15s
    method: trace_metrics
```

建议每个项目至少保留：

- 20 条核心任务；
- 10 条边界任务；
- 10 条失败/攻击任务；
- 5 条高风险工具任务。

---

## 3. Trace 事件模型

Trace 不是为了好看，而是为了复盘。

建议记录：

| Event | 字段 |
|---|---|
| run.started | run_id、user_id、task_type、model |
| plan.created | steps、risk_summary、estimated_tools |
| tool.called | tool_name、args_summary、risk、timeout |
| tool.result | status、latency、result_summary、error_code |
| approval.requested | action、risk、expires_at |
| approval.resolved | approved、operator、reason |
| eval.completed | scorecard、failures、release_gate |
| run.completed | final_status、cost、latency |

注意：

- 不要把 secret、完整 prompt、用户隐私写进 trace。
- args 只保存摘要或脱敏版本。
- 高风险工具必须有 audit id。

---

## 4. Observability Dashboard

Dashboard 建议分 5 个面板：

### Reliability

- run success rate
- retry rate
- failure by error type
- human takeover rate

### Tooling

- top tools
- tool error rate
- tool latency p95
- approval rate

### RAG / Context

- retrieval hit rate
- citation pass rate
- permission filter blocks
- freshness failures

### Safety

- prompt injection blocked
- PII redaction count
- high-risk action blocked
- policy violation by category

### Cost / Latency

- cost per run
- tokens per stage
- model fallback rate
- cache hit rate

---

## 5. Release Gate

上线前用门禁做决策，不靠主观感觉。

| Gate | 阈值 | 不通过时 |
|---|---:|---|
| Core task success | ≥ 80% | 不发布 |
| Critical safety | 100% | 不发布 |
| Tool schema errors | ≤ 2% | 修 schema |
| P95 latency | ≤ 15s | 优化路由/缓存 |
| Regression failures | 0 critical | 回滚 |
| Manual review | pass | 补样本 |

Release Gate 输出应该是一份报告：

```text
release: 2026-06-agent-eval-v3
decision: blocked
reason:
  - high-risk tool approval bypass: 1 case
  - citation freshness failure: 3 cases
next:
  - patch approval middleware
  - refresh RAG index
  - rerun regression set
```

---

## 6. 失败样本如何进入闭环

失败样本不要只修当前 prompt，要进入系统闭环：

1. 分类：tool / retrieval / reasoning / safety / latency / UX。
2. 归因：数据问题、schema 问题、prompt 问题、权限问题、模型问题。
3. 修复：代码、数据、prompt、工具、UI、策略。
4. 回归：加入 regression set。
5. 复盘：写入 failure cluster 或 postmortem。

相关内容：

- [Eval Failure Clustering](/note/Engineering/eval-failure-clustering)
- [Agent Feedback Triage](/note/Engineering/agent-feedback-triage)
- [Agent Release Gate](/note/Engineering/agent-release-gate)

---

## 7. 面试讲法

一分钟版本：

> 我把 Agent 评测分成 output、tool、context、workflow 四层，并通过 trace 记录 plan、tool call、approval、eval 和 final status。上线前用 release gate 判断是否发布，而不是只人工试几个 demo。失败样本会进入 regression set 和 failure clustering，形成持续迭代闭环。

深挖点：

- 为什么最终答案正确不代表系统安全？
- Tool correctness 怎么评测？
- RAG citation 怎么做自动检查？
- Release Gate 阈值怎么定？
- Trace 如何避免泄露敏感信息？
- 失败样本如何变成回归测试？

---

## 8. 参考资料

- [OpenAI Evals 文档](https://platform.openai.com/docs/guides/evals)
- [OpenTelemetry Semantic Conventions for GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Model Context Protocol：Server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)

继续阅读：

- [Evaluation Pipeline](/topics/evaluation-pipeline)
- [Agent Demo Evidence Dashboard](/topics/agent-demo-evidence-dashboard)
- [Project D：Agent Evaluation & Red Team Lab](/projects/project-d-agent-evaluation-redteam-lab)
- [Agent Observability Dashboard Design](/note/Engineering/agent-observability-dashboard-design)
