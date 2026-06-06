# LLM 成本与延迟优化：从能跑到跑得起、跑得稳

## 这篇文章解决什么问题

很多 LLM / Agent 项目 Demo 阶段只关注“能不能回答”。但一旦接近真实业务，就会遇到：

- 一次复杂任务调用模型十几次，成本不可控。
- RAG 召回、Rerank、生成串行执行，用户等待很久。
- 大模型回答质量好但价格高，小模型便宜但不稳定。
- Prompt 越写越长，输入 Token 成本不断上涨。
- 线上高峰期限流、超时、重试导致雪崩。
- 面试时只会说“换更便宜模型”，讲不出系统性优化方案。

成本与延迟优化不是单点技巧，而是模型路由、上下文压缩、缓存、批处理、并发、降级、评测共同组成的工程体系。

## 先建立成本账本

不要一开始就优化。先把每次调用的账算清楚：

| 维度 | 需要记录什么 | 用途 |
|---|---|---|
| 请求信息 | user_id、task_id、run_id、step_id | 定位是谁、哪个任务产生的成本 |
| 模型信息 | provider、model、temperature、max_tokens | 对比不同模型策略 |
| Token | input_tokens、output_tokens、cached_tokens | 计算真实费用和上下文浪费 |
| 延迟 | queue_ms、ttfb_ms、completion_ms、total_ms | 区分排队、首 token、生成耗时 |
| 结果 | success、error_type、retry_count | 判断重试和失败成本 |
| 质量 | eval_score、user_feedback | 避免只降成本导致质量退化 |

没有这张账本，就只能凭感觉优化。

## 成本优化的 8 个抓手

### 1. 模型分层路由

不要所有任务都用最强模型。

| 任务类型 | 推荐策略 |
|---|---|
| 分类、意图识别、格式检查 | 小模型或规则优先 |
| Query Rewrite、标题生成 | 中小模型 |
| 复杂推理、长文综合 | 强模型 |
| 结构化抽取 | 支持 schema 的模型 + 校验 |
| 离线批量摘要 | 便宜模型 + 抽检 |
| 高风险动作决策 | 强模型 + 人审 |

示例路由逻辑：

```text
if task.risk == high:
  use strong_model + approval
elif task.type in [classify, rewrite, format_check]:
  use small_model
elif task.context_tokens > threshold:
  use long_context_model or compress first
else:
  use balanced_model
```

路由策略必须和 [LLM Gateway](/note/Engineering/llm-gateway) 放在一起治理，而不是散落在业务代码里。

### 2. Prompt 瘦身

常见浪费：

- 系统 Prompt 写成产品说明书。
- 每次都塞完整历史记录。
- RAG 塞入过多无关 chunk。
- 工具 schema 过大但任务只用一个工具。
- 示例 few-shot 太多且长期不清理。

优化方法：

- 把系统规则分层：全局规则、任务规则、临时约束。
- 只注入当前任务需要的工具。
- 对长历史做 summary memory，而不是原文全塞。
- RAG context 只保留能支撑答案的证据。
- 对 Prompt 做版本评测，避免删掉关键约束。

参考：[PromptOps](/note/Engineering/promptops-versioning)、[Context Engineering](/note/AI-Agent/context-engineering)。

### 3. 检索前置过滤

RAG 成本很多来自无效上下文。优化顺序应该是：

```text
metadata filter -> hybrid search -> rerank -> context pack -> generation
```

不要把越权、过期、低相关文档塞给模型再让模型“自己忽略”。这既浪费 token，也增加安全风险。

### 4. 缓存

缓存分几层：

| 缓存层 | 适用场景 | 注意点 |
|---|---|---|
| Embedding 缓存 | 相同文档、相同 query rewrite | 需要记录 embedding model 版本 |
| 检索结果缓存 | 热门问题、固定知识库 | metadata 权限必须参与 key |
| Prompt prefix 缓存 | 稳定系统 Prompt、固定工具说明 | Prompt 版本变化会失效 |
| 完整答案缓存 | FAQ、低风险问答 | 需要过期时间和用户权限隔离 |
| Eval 缓存 | 重复跑评测集 | 需要绑定模型版本和 Prompt 版本 |

缓存不能只按 query 字符串做 key，否则多租户系统可能泄漏数据。

### 5. 批处理

适合批处理的任务：

- 离线评测。
- 大量文档摘要。
- 批量分类。
- 失败样本回放。
- 低实时性数据清洗。

不适合批处理的任务：

- 用户正在等待的交互。
- 高风险实时审批。
- 需要连续状态推进的长任务。

批处理可以配合 [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline) 使用。

### 6. 降级策略

降级不是“失败就随便换模型”，而是事先设计的策略：

| 故障 | 降级方式 |
|---|---|
| 强模型超时 | 切 balanced model，并缩短输出 |
| Rerank 不可用 | 使用 hybrid score 排序 |
| 向量库慢 | 降低 top_k，启用缓存 |
| 工具调用失败 | 返回可恢复状态，而不是继续胡编 |
| 外部模型限流 | 排队、退避、切备用 provider |
| 预算耗尽 | 只允许低成本任务，阻断高成本任务 |

每次降级都要写入 Trace，否则线上排查时只看到“质量变差”，不知道系统做了什么。

### 7. 并发与流水线

可以并发的步骤：

- 多路检索。
- 多个文档摘要。
- 多个候选工具的参数预校验。
- 低风险独立子任务。

不应盲目并发的步骤：

- 有顺序依赖的状态更新。
- 写数据库或调用外部副作用工具。
- 高风险审批链路。

Agent 系统里，并发要配合状态机、幂等键和取消机制。

### 8. 输出长度控制

输出 token 往往比输入更贵、更慢。可以通过：

- 明确 `max_tokens`。
- 要求先给结论，再给必要解释。
- 用结构化输出减少废话。
- 前端分段展示，长答案异步补充。
- 摘要任务指定长度上限。

不要让模型“尽可能详细回答”，这句话在线上就是成本黑洞。

## 延迟优化拆解

一次请求的总延迟通常来自：

```text
排队 -> 鉴权 -> 检索 -> Rerank -> Prompt 组装 -> 模型首 token -> 生成 -> 后处理 -> 落库 -> 返回
```

优化时先分段计时：

| 阶段 | 常见问题 | 优化方向 |
|---|---|---|
| 排队 | worker 不够、限流太低 | 队列、并发、优先级 |
| 检索 | top_k 太大、过滤不走索引 | metadata 索引、降低候选集 |
| Rerank | 串行重排太多文档 | top_k 分层、批量 rerank |
| Prompt 组装 | 上下文过长 | context pack、摘要 |
| 首 token | 模型排队或网络慢 | 模型路由、流式输出 |
| 生成 | 输出太长 | max token、结构化输出 |
| 后处理 | JSON 修复过多 | schema 设计、校验前置 |
| 落库 | 同步写太多 | 异步审计、批量写入 |

## 监控指标

建议至少监控：

- p50 / p95 / p99 latency。
- input_tokens / output_tokens。
- cost per request。
- cost per successful task。
- retry rate。
- timeout rate。
- cache hit rate。
- model fallback rate。
- eval score by prompt_version。
- user feedback by task_type。

只看平均值没用。Agent 系统的问题通常藏在 p95 和失败样本里。

## 面试表达模板

> 我不会只通过换便宜模型优化成本，而是先建立调用账本，把每次模型调用的 token、延迟、失败、重试、Prompt 版本、任务类型记录下来。然后按任务复杂度做模型路由，简单分类和格式检查走小模型，复杂推理走强模型；再通过 Prompt 瘦身、RAG 前置过滤、缓存、批处理和输出长度控制降低 token。延迟上我会拆分检索、Rerank、模型首 token、生成和后处理耗时，分别优化。所有降级和 fallback 都写入 Trace，并用评测集保证降成本不牺牲关键质量。

## 项目落地清单

- [ ] LLM Gateway 记录每次调用的成本与延迟。
- [ ] 所有 Prompt 有版本号。
- [ ] 模型路由策略可配置。
- [ ] RAG context 有 token 预算。
- [ ] 缓存 key 包含用户权限、知识库版本、模型版本。
- [ ] 超时、重试、降级写入 Trace。
- [ ] p95 延迟和成本有仪表盘。
- [ ] 成本优化后跑回归评测。

## 相关链接

- [LLM Gateway](/note/Engineering/llm-gateway)
- [PromptOps](/note/Engineering/promptops-versioning)
- [Context Engineering](/note/AI-Agent/context-engineering)
- [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
