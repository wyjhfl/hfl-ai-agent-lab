# Agent Release Gate：AI 功能上线前要过哪些门禁

## 这篇文章解决什么问题

传统后端上线通常看单元测试、集成测试和监控。Agent 系统还要额外面对模型漂移、Prompt 变更、RAG 召回退化、工具 schema 变化、安全攻击、成本上升和输出不稳定。

Agent Release Gate 的目标是在上线前用一组门禁判断：这个版本是否可以进入 staging、canary 和 production。

## 发布门禁总览

| 门禁 | 关注点 |
|---|---|
| Code Gate | 类型检查、单元测试、lint、构建 |
| Contract Gate | JSON schema、tool args、Trace event、MCP schema |
| Eval Gate | smoke、regression、benchmark、judge score |
| RAG Gate | recall、citation、permission filter |
| Safety Gate | prompt injection、越权、危险工具 |
| Cost Gate | cost per task、token、缓存命中 |
| Latency Gate | p50/p95、队列等待、工具耗时 |
| Ops Gate | 监控、告警、runbook、回滚开关 |
| Product Gate | 任务完成率、反馈、人工接管影响 |

## Prompt 变更门禁

Prompt 改动必须至少回答：

- prompt_version 是什么？
- 影响哪些 task_type？
- 是否跑了 conversation regression？
- schema pass rate 是否下降？
- 安全样本是否仍通过？
- 成本和延迟是否变化？

Prompt 是生产资产，不是随手改的字符串。

## 模型切换门禁

模型切换要先离线评测，再 shadow traffic，再 canary。门禁指标包括：

- task success rate 不下降。
- safety regression 为 0。
- cost per task 在预算内。
- p95 latency 在 SLO 内。
- schema pass rate 不下降。
- 关键业务样本通过。

## RAG 变更门禁

RAG 变更包括 chunk、embedding、rerank、metadata filter、索引和权限策略。必须验证：

- Recall@k。
- citation accuracy。
- no-answer 拒答。
- tenant 权限过滤。
- hard negative。
- 高价值查询回归。

## Tool / MCP 变更门禁

工具变更要验证：

- schema 兼容性。
- 参数校验。
- 权限策略。
- 高风险审批。
- tool timeout 和错误分类。
- 审计字段完整。

## 发布策略

```text
local checks → staging eval → shadow traffic → canary → production
```

| 阶段 | 说明 |
|---|---|
| local | 构建、契约测试、小样本 eval |
| staging | 全量 regression、安全样本、工具 mock/real smoke |
| shadow | 复制真实流量但不影响用户 |
| canary | 小比例用户真实使用 |
| production | 自动监控和回滚条件 |

## 自动回滚条件

- error rate 超过阈值。
- safety regression 命中。
- cost per task 超预算。
- p95 latency 超 SLO。
- schema pass rate 下跌。
- negative feedback 激增。
- handoff rate 异常上升。

## 面试表达

> 我会为 Agent 上线设计 Release Gate，而不是只跑普通单元测试。Agent 发布前要过 code、contract、eval、RAG、safety、cost、latency、ops 和 product 几类门禁。Prompt、模型、RAG、MCP tool schema 任何变化都要跑对应 regression。发布路径是 local checks、staging eval、shadow traffic、canary、production，并设置自动回滚条件，比如 safety regression、schema pass rate 下降、p95 超 SLO、cost 超预算或负反馈激增。

## 相关链接

- [Agent Contract Testing](/topics/agent-contract-testing)
- [Conversation Regression Testing](/topics/conversation-regression-testing)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
