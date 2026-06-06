# LLM 可观测仪表盘：把模型调用变成可运营系统

## 这篇文章解决什么问题

LLM 应用上线后，如果只看 API 日志，很难回答：

- 哪个模型最贵？
- 哪个 Prompt 版本退化了？
- 哪类任务最慢？
- 哪个工具失败率最高？
- 哪些用户消耗异常？
- RAG 的负反馈来自召回还是生成？
- 新模型灰度是否比旧模型更好？

LLM 可观测仪表盘的目标是把模型调用、Prompt、RAG、工具、成本、延迟、质量和反馈统一起来。

## 仪表盘分层

| 层级 | 看什么 |
|---|---|
| 业务层 | 任务完成率、用户反馈、转人工率 |
| 质量层 | eval score、schema pass、引用准确率 |
| 模型层 | token、成本、延迟、错误、fallback |
| RAG 层 | recall、rerank、no answer、citation complaint |
| 工具层 | tool success、approval、timeout、error_type |
| 系统层 | API 5xx、queue、worker、DB、vector DB |
| 安全层 | policy violation、unsafe tool、permission deny |

## 每次调用要记录什么

```json
{
  "run_id": "run_001",
  "task_type": "rag_answer",
  "tenant_id": "t_001",
  "model": "balanced",
  "prompt_version": "rag_answer_v6",
  "router_policy": "rag_policy_v3",
  "input_tokens": 4200,
  "output_tokens": 700,
  "cost_cents": 1.8,
  "latency_ms": 5200,
  "success": true,
  "error_type": null,
  "fallback": false
}
```

不要只记录原始 prompt 和 response。结构化字段才适合分析。

## 核心图表

### 1. 成本趋势

- daily cost。
- cost by model。
- cost by task_type。
- cost by tenant。
- cost per successful task。

### 2. 延迟趋势

- p50 / p95 / p99。
- time to first token。
- latency by model。
- latency by RAG / tool / generation。

### 3. 质量趋势

- eval score by prompt_version。
- negative feedback rate。
- citation complaint rate。
- schema pass rate。
- tool argument accuracy。

### 4. 失败分布

- error_type top N。
- retry rate。
- fallback rate。
- timeout rate。
- provider error rate。

### 5. RAG Debug

- no answer rate。
- retrieval miss。
- rerank error。
- context pack truncation。
- top failed query clusters。

### 6. 安全与权限

- denied tool calls。
- approval required / approved / rejected。
- permission denied retrieval。
- prompt injection detected。
- red team regression pass rate。

## Drill-down 能力

仪表盘不只看总览，还要能点进去：

```text
metric spike
  -> task_type
  -> tenant/user
  -> prompt_version/model
  -> run_id
  -> trace steps
  -> tool calls / retrieved chunks
```

没有 drill-down，只能看到“有问题”，不知道怎么修。

## 告警规则

| 告警 | 条件示例 |
|---|---|
| 成本异常 | daily cost > baseline * 1.5 |
| 延迟异常 | p95 latency > SLO |
| 质量退化 | eval score drop > 5% |
| Schema 退化 | schema pass rate < 98% |
| 工具异常 | tool timeout rate > threshold |
| 安全异常 | unsafe tool call > 0 |
| RAG 异常 | no answer rate suddenly rises |
| Provider 异常 | 429 / 5xx spike |

## 数据保留与隐私

要注意：

- Prompt 和 response 可能包含敏感信息。
- 日志需要脱敏。
- 原文证据访问要有权限。
- 保留时间要可配置。
- 只把必要内容给运营和开发看。
- 审计日志不可随意删除。

## 面试表达模板

> 我会把 LLM 可观测分成业务、质量、模型、RAG、工具、系统和安全几层。每次调用记录 run_id、task_type、tenant、model、prompt_version、router_policy、token、成本、延迟、错误、fallback 和反馈。仪表盘既看总览，也支持从成本或质量异常 drill down 到 task_type、tenant、prompt_version、run_id 和具体 Trace。核心指标包括 cost per successful task、p95 延迟、schema pass rate、引用投诉率、tool failure rate、fallback rate 和安全拦截。这样模型调用才能从黑盒变成可运营系统。

## 项目落地清单

- [ ] 每次 LLM 调用有结构化日志。
- [ ] 记录 prompt_version 和 router_policy。
- [ ] 成本、延迟、质量、工具、安全指标分层展示。
- [ ] 支持 drill-down 到 run_id 和 Trace。
- [ ] 有告警规则和 SLO。
- [ ] 日志脱敏和权限控制。
- [ ] 反馈和 eval 结果进入同一分析视图。

## 相关链接

- [日志与可观测性](/note/Engineering/observability)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
