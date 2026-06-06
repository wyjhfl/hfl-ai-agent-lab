# 多模型路由与 A/B 实验：不要把模型选择写死在代码里

## 这篇文章解决什么问题

真实的大模型应用很少只依赖一个模型。不同模型在价格、延迟、上下文长度、结构化输出、工具调用、中文能力、稳定性上都不同。常见问题包括：

- 所有请求都打到一个模型，成本和限流风险集中。
- 代码里到处写死 model name，后续切模型很痛苦。
- 新模型上线后只凭感觉切换，没有评测和灰度。
- 不同任务需要不同模型，但系统没有路由策略。
- A/B 实验只看用户主观反馈，没有成本、延迟、失败率指标。
- 出现质量退化时不知道是模型、Prompt、检索还是工具导致。

多模型治理的目标是把“选哪个模型”从临时代码逻辑变成可配置、可评测、可灰度、可回滚的工程能力。

## 模型路由的基本维度

| 维度 | 示例 | 说明 |
|---|---|---|
| 任务类型 | 分类、摘要、RAG、工具调用、代码生成 | 不同任务对能力要求不同 |
| 风险等级 | 低风险问答、高风险业务动作 | 高风险任务需要更强模型或人审 |
| 上下文长度 | 短问答、长文档、多轮任务 | 长上下文模型更贵，不应滥用 |
| 输出要求 | 自然语言、JSON、函数参数 | 结构化输出能力很关键 |
| 延迟要求 | 实时对话、离线批处理 | 实时任务更关注 p95 延迟 |
| 成本预算 | 免费用户、付费用户、内部管理员 | 预算策略可影响模型选择 |
| 可用性 | 限流、超时、区域故障 | 需要 fallback |

路由策略不要只写：

```text
if premium_user: use_big_model
else: use_small_model
```

更好的方式是：

```text
route(task_type, risk_level, context_tokens, output_schema, latency_slo, budget_policy)
```

## 路由策略示例

| 场景 | 主模型 | 备用策略 |
|---|---|---|
| 意图识别 | 小模型 | 规则兜底 |
| Query Rewrite | 中小模型 | 不改写，直接检索 |
| RAG 最终回答 | 中强模型 | 缩短上下文后换备用模型 |
| 高风险工具参数 | 强模型 + schema | 人工审批 |
| 批量摘要 | 低成本模型 | 失败样本抽检 |
| 评测打分 | Judge 模型 | 人工校准样本 |
| 代码生成 | 代码能力强的模型 | 要求生成 patch 和测试 |

## A/B 实验不是随便分流

模型 A/B 实验至少要明确：

1. 实验目标：质量提升、成本下降、延迟下降还是稳定性提升。
2. 实验对象：哪些 task_type、哪些用户、哪些 Prompt 版本。
3. 指标：主指标和护栏指标。
4. 样本量：不能只看十几个请求。
5. 回滚条件：出现什么指标退化立即停止。
6. 记录方式：每次请求必须记录 experiment_id 和 variant。

### 指标设计

| 指标类型 | 指标 |
|---|---|
| 质量指标 | eval_score、人工评分、用户反馈、引用准确率 |
| 成本指标 | cost_per_request、cost_per_successful_task |
| 延迟指标 | p50、p95、p99、time_to_first_token |
| 稳定性指标 | error_rate、timeout_rate、retry_rate、fallback_rate |
| 安全指标 | policy_violation、unsafe_tool_call、approval_rejection |
| 业务指标 | 工单解决率、转人工率、任务完成率 |

不能只看“用户点赞率”，也不能只看“成本下降”。便宜但质量崩了不是优化。

## 灰度发布流程

推荐流程：

```text
Offline Eval
  -> Shadow Traffic
  -> Internal Dogfood
  -> 5% Canary
  -> 25% Canary
  -> 50% Canary
  -> Full Rollout
  -> Continuous Monitoring
```

### Offline Eval

先在固定评测集上对比模型。覆盖：

- 常规样本。
- 线上失败样本。
- 长上下文样本。
- 工具调用样本。
- Prompt Injection 样本。
- 结构化输出样本。

### Shadow Traffic

新模型接收真实请求的副本，但不把结果返回用户。用于观察成本、延迟、输出格式和潜在错误。

### Canary

小流量真实返回。必须有自动回滚条件：

```text
if error_rate > baseline + threshold: rollback
if p95_latency > baseline * 1.5: rollback
if negative_feedback_rate > baseline + threshold: rollback
if schema_pass_rate < minimum: rollback
```

## 路由配置示例

```json
{
  "policy_id": "rag_answer_v6",
  "task_type": "rag_answer",
  "primary_model": "balanced",
  "fallback_models": ["fast", "strong"],
  "max_context_tokens": 12000,
  "latency_slo_ms": 8000,
  "budget_cents": 3,
  "requires_schema": true,
  "experiment": {
    "id": "rag_model_ab_202606",
    "variant": "B",
    "traffic_percent": 10
  }
}
```

配置可以放在 LLM Gateway、配置中心或数据库中，但每次调用必须记录最终命中的策略。

## 常见坑

### 1. 把 fallback 当成免费午餐

fallback 会增加延迟和成本。必须记录 fallback 发生率，并分析原因。

### 2. 模型变了但 Prompt 没变

不同模型对 Prompt 风格、schema、工具说明的敏感度不同。模型切换通常要配合 PromptOps 和回归评测。

### 3. 只评测最终答案

工具调用、结构化输出、引用准确率、拒答能力都要单独评测。

### 4. 忽略用户分层

免费用户、付费用户、内部测试用户、管理员可能有不同预算和可靠性要求。

### 5. 不记录版本

没有 model_version、prompt_version、router_policy_version，就无法复盘退化。

## 面试表达模板

> 我不会把模型名称写死在业务代码里，而是通过 LLM Gateway 做多模型路由。路由会考虑任务类型、风险等级、上下文长度、结构化输出要求、延迟 SLO 和预算策略。新模型上线前先跑离线评测，再做 shadow traffic 和小流量 canary。每次调用记录 model、prompt_version、router_policy、experiment_id、token、成本、延迟和结果。A/B 实验不仅看用户反馈，还看成本、p95 延迟、schema pass rate、错误率和安全指标，并设置自动回滚条件。

## 项目落地清单

- [ ] 业务代码不直接写死模型名。
- [ ] LLM Gateway 支持路由策略。
- [ ] 每次调用记录 router_policy_version。
- [ ] 新模型上线前跑离线评测。
- [ ] A/B 实验记录 experiment_id 和 variant。
- [ ] canary 有自动回滚条件。
- [ ] fallback 发生率进入监控。
- [ ] 质量、成本、延迟、安全指标一起看。

## 相关链接

- [LLM Gateway](/note/Engineering/llm-gateway)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [PromptOps](/note/Engineering/promptops-versioning)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
