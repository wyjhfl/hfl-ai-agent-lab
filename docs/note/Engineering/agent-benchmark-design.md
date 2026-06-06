# Agent Benchmark 设计：如何比较不同 Agent 方案

## 这篇文章解决什么问题

面试或项目中经常会问：

- 你的 Agent 比普通 Workflow 好在哪里？
- LangGraph 和自研 Runtime 怎么比较？
- 多 Agent 是否真的提升效果？
- 换模型后是否更好？
- 工具审批是否影响效率？

这些都需要 Benchmark，而不是主观感觉。

## Benchmark 要比较什么

| 维度 | 指标 |
|---|---|
| 任务完成 | success rate、partial success |
| 质量 | correctness、faithfulness、rubric score |
| 成本 | token、cost per task |
| 延迟 | total time、p95、step time |
| 稳定性 | retry、timeout、failure rate |
| 安全 | unsafe action、permission leak |
| 可恢复 | resume success、idempotency |
| 可观测 | trace completeness |

## Benchmark 任务集

任务集要分层：

- 简单任务。
- 多步骤任务。
- 工具调用任务。
- RAG 任务。
- 高风险审批任务。
- 失败恢复任务。
- 对抗样本。

示例：

```json
{
  "task_id": "ticket_create_001",
  "goal": "根据用户描述创建售后工单草稿",
  "expected_tools": ["search_kb", "create_ticket_draft"],
  "risk_level": "medium",
  "success_criteria": ["ticket has product", "ticket has fault_code", "no direct submit"]
}
```

## Baseline 很重要

至少比较：

- 纯 Prompt。
- 固定 Workflow。
- 单 Agent。
- 多 Agent。
- 人工 baseline。
- 新模型 / 旧模型。

没有 baseline，就无法证明 Agent 方案有价值。

## 自动评分与人工评分

可以组合：

- 程序化检查：schema、tool、状态、权限。
- LLM-as-Judge：语义质量。
- 人工评分：高价值样本。
- 业务指标：最终是否解决问题。

## Benchmark 运行记录

```json
{
  "benchmark_id": "agent_bench_v1",
  "variant": "langgraph_supervisor",
  "model": "balanced",
  "prompt_version": "planner_v3",
  "success_rate": 0.82,
  "avg_cost": 0.03,
  "p95_latency_ms": 12000,
  "unsafe_action_rate": 0,
  "trace_completeness": 0.98
}
```

## 结果分析

不要只看总分。要按任务类型拆：

- RAG 任务是否提升。
- 工具任务是否更稳定。
- 高风险任务是否更安全。
- 简单任务是否过度复杂。
- 成本是否显著上升。
- 延迟是否可接受。

## 面试表达模板

> 我会用 Benchmark 比较 Agent 方案，而不是凭感觉说多 Agent 更好。Benchmark 任务集会覆盖简单任务、多步骤任务、RAG、工具调用、高风险审批、失败恢复和对抗样本。比较对象包括固定 Workflow、单 Agent、多 Agent、不同模型和人工 baseline。指标不只看成功率，还看质量、成本、p95 延迟、retry、unsafe action、permission leak、resume success 和 trace completeness。评分结合程序化断言、LLM-as-Judge 和人工抽检，并按 task_type 分析，避免总分掩盖问题。

## 项目落地清单

- [ ] 有固定 benchmark dataset。
- [ ] 有 baseline 方案。
- [ ] 指标覆盖质量、成本、延迟、安全。
- [ ] 工具调用和状态可程序化检查。
- [ ] 高价值样本人工抽检。
- [ ] 结果按 task_type 分组。
- [ ] benchmark 结果可追溯到模型和 Prompt 版本。

## 相关链接

- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [LLM-as-Judge 与 Rubric 评测](/note/Engineering/llm-as-judge-rubric-eval)
- [Agent 编排模式](/topics/agent-orchestration-patterns)
- [Agent 框架选型](/topics/agent-framework-selection)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
