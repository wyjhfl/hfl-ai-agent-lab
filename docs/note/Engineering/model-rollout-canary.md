# Model Rollout Canary：新模型上线如何灰度和回滚

## 这篇文章解决什么问题

大模型能力变化很快，团队经常想把旧模型换成新模型。但模型切换不是简单改一个 model name。新模型可能更便宜但格式不稳定，或者推理更强但延迟更高，也可能在某些安全样本上退化。

Model Rollout Canary 的目标是让模型上线像代码发布一样：先离线评测，再 shadow，再 canary，再全量，随时可回滚。

## 为什么不能直接全量切换

| 风险 | 示例 |
|---|---|
| 输出格式变化 | JSON 不稳定，结构化解析失败 |
| 安全退化 | 更容易被 Prompt Injection 诱导 |
| RAG 忠实度变化 | 更会总结但引用不准确 |
| 工具调用变化 | 参数更激进或遗漏必填字段 |
| 成本变化 | 输出更长，token 上升 |
| 延迟变化 | p95 超过 SLA |
| 用户体验变化 | 语气、详细程度、拒答风格改变 |

模型升级要用数据证明，而不是凭一次体验判断。

## 发布阶段

| 阶段 | 做什么 |
|---|---|
| offline eval | 固定评测集对比旧模型和新模型 |
| shadow traffic | 真实请求复制给新模型但不展示 |
| canary | 小比例真实用户使用新模型 |
| ramp-up | 逐步扩大比例 |
| full rollout | 全量切换 |
| rollback | 指标退化时回旧模型 |

每个阶段都要有进入条件和退出条件。

## 评测维度

| 维度 | 指标 |
|---|---|
| 任务质量 | task_success、human preference |
| 事实性 | factuality、grounding |
| RAG | citation_accuracy、no_answer_accuracy |
| 工具 | tool_selection、args_validity、tool_success |
| 格式 | schema_valid_rate |
| 安全 | injection_block_rate、unsafe_output_rate |
| 成本 | cost_per_task、output_tokens |
| 延迟 | p50、p95、timeout_rate |
| 稳定性 | retry_rate、parse_error_rate |

上线门禁不能只看总体分数，必须看关键维度是否退化。

## Canary 策略

| 策略 | 示例 |
|---|---|
| 按流量比例 | 1% -> 5% -> 20% -> 50% |
| 按租户 | 内部租户先试用 |
| 按功能 | 先在摘要功能使用，不在高风险工具使用 |
| 按风险 | 低风险任务先切换 |
| 按用户 | 种子用户或白名单用户 |

高风险任务不应该最先灰度。先从只读、低风险、可人工修正的功能开始。

## 自动回滚条件

| 条件 | 示例 |
|---|---|
| schema_valid_rate 下降 | 低于 99% |
| p95_latency 上升 | 超过基线 30% |
| cost_per_task 上升 | 超过预算 20% |
| safety incident | 任意 critical 事件 |
| citation_accuracy 下降 | 低于阈值 |
| tool_error_rate 上升 | 超过基线 2 倍 |
| negative_feedback 上升 | 超过阈值 |

回滚条件要提前写进 Control Plane，而不是事故发生时临时讨论。

## 版本记录

每次模型发布记录：

- rollout_id
- old_model / new_model
- model_route_version
- affected_agents
- affected_tenants
- eval_report
- canary_start / end
- metrics_snapshot
- rollback_target
- owner
- changelog

模型发布也是生产变更，必须能审计。

## 面试表达模板

我不会直接把模型名从旧模型改成新模型，而是走 offline eval、shadow traffic、canary、ramp-up 和 rollback。评测维度包括 task success、RAG citation、tool args validity、schema_valid_rate、安全、成本和 p95 延迟。Canary 会先放在低风险功能或内部租户，Control Plane 里配置自动回滚条件，比如格式错误率上升、成本超预算、安全事件或 citation accuracy 下降。

## 常见误区

### 误区一：新模型 benchmark 更高就一定更适合

通用 benchmark 不代表你的业务任务、工具调用和格式输出更好。

### 误区二：只看质量不看成本延迟

新模型质量提升一点，但成本和延迟大幅上升，可能不值得全量。

### 误区三：灰度没有回滚条件

没有自动回滚条件的灰度只是慢速全量。

## 相关链接

- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
