# Agent Latency Budget：Agent 延迟预算怎么拆

## 这篇文章解决什么问题

Agent 慢通常不是单点慢，而是模型规划、RAG 检索、rerank、工具调用、审批、重试、前端轮询、队列等待叠加后的结果。如果只看总耗时，很难知道该优化哪里。

Agent Latency Budget 的目标是把端到端延迟拆成可观测、可归因、可优化的预算项，并把不同任务类型的 p50 / p95 / p99 目标写进 SLO 和 Release Gate。

## 延迟拆分

| 阶段 | 说明 | 常见优化 |
|---|---|---|
| queue_wait | 排队等待 worker 或并发资源 | 优先级队列、并发池、背压 |
| planning | 模型规划、意图识别、任务拆解 | 短 Prompt、小模型路由、缓存 |
| retrieval | query rewrite、检索、metadata filter | 索引优化、混合检索、过滤下推 |
| rerank | reranker 或 LLM 证据排序 | top-k 控制、轻量 reranker、批处理 |
| generation | 最终回答生成 | 模型路由、streaming、上下文瘦身 |
| tool_call | 外部工具调用 | timeout、并发、结果缓存、降级 |
| approval_wait | 人工审批等待 | 风险分级、审批 SLA、自动超时处理 |
| retry_repair | schema 修复、重试、补偿 | 更强 schema、确定性校验、失败分类 |
| frontend_render | 前端渲染、轮询、流式展示 | SSE/WebSocket、增量状态、骨架屏 |

## 预算示例

| 任务类型 | p95 目标 | 预算拆分 |
|---|---|---|
| FAQ RAG | 5s | retrieval 1s + rerank 1s + generation 3s |
| 文档总结 | 20s | parsing 5s + retrieval 3s + generation 10s + render 2s |
| 多工具 Agent | 60s | planning 5s + tools 35s + generation 10s + retry 10s |
| 高风险审批任务 | 15min | 系统执行 60s + approval wait 14min |
| 批量评测 | 2h | queue 10min + batch eval 100min + report 10min |

## Trace 字段

每个 run / step 应记录：

- start_at、end_at、duration_ms；
- model、prompt_version、input_tokens、output_tokens；
- retrieval_top_k、rerank_top_k、context_tokens；
- tool_id、timeout_ms、retry_count、error_type；
- queue_name、worker_id、concurrency_slot；
- approval_id、approval_wait_ms；
- cache_hit、cache_type、cache_version。

## 优化策略

### 1. 先优化长尾，不只优化平均值

平均 3 秒但 p95 60 秒，用户仍然会感觉系统不稳定。要按 workflow、tenant、tool、model、knowledge_base 分桶看长尾。

### 2. 将同步任务拆成可感知状态

长任务不要让用户盯着空白页面。可以展示 Queued、Planning、Retrieving、RunningTool、WaitingApproval、Generating、Completed。

### 3. 给工具设置硬 timeout

工具调用必须有超时、取消、降级和错误映射，否则一个外部服务就能拖垮整个 Agent。

### 4. 用模型路由控制延迟

不是所有步骤都需要最强模型。意图识别、分类、格式修复可以用更快更便宜的模型。

## 面试表达模板

> 我会把 Agent 延迟拆成 queue、planning、retrieval、rerank、generation、tool、approval、retry 和 frontend render，而不是只看总耗时。每个 run 都记录 step duration、模型版本、tool_id、retry_count 和 cache_hit，再按 workflow 和工具分桶看 p95，决定是优化检索、换模型、降级工具还是调整队列。

## 常见误区

### 误区一：只说“换更快模型”

Agent 慢可能是工具、队列、rerank、审批或重试造成的，不一定是模型。

### 误区二：长任务必须同步等待

长任务应该状态化、可取消、可恢复、可通知，而不是一直阻塞 HTTP 请求。

### 误区三：只看后端耗时

前端轮询、渲染、流式输出和用户感知状态也影响体验。

## 相关链接

- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [Agent Queue 与 Backpressure](/topics/agent-queue-backpressure)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
