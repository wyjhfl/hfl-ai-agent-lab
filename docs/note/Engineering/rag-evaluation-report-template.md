# RAG Evaluation Report Template：RAG 评测报告怎么写

## 这篇文章解决什么问题

很多 RAG 项目做了评测，但最后只留下几句“效果不错”“召回率提升”。这不利于项目复盘，也不利于面试表达。真正有价值的 RAG 评测报告应该回答：评测集从哪里来、指标如何定义、当前版本相对基线提升在哪里、失败样本如何归因、下一版要改什么。

这篇文章给出一份可以直接复用的 RAG Evaluation Report 模板。

## 报告结构

建议每次 RAG 版本迭代都沉淀一份报告：

1. 评测目标
2. 系统版本
3. 数据集说明
4. Pipeline 配置
5. 指标结果
6. 分层分析
7. 失败样本归因
8. 成本与延迟
9. 安全与权限
10. 结论与下一步

这份报告不一定很长，但必须能复现评测结论。

## 1. 评测目标

先写清楚这次评测要验证什么。

| 目标 | 示例 |
|---|---|
| 检索质量 | 新 chunk 策略是否提升 Recall@5 |
| 答案可信 | citation 是否真正支持答案 |
| 无答案能力 | 没有证据时是否拒答 |
| 权限隔离 | tenant A 是否无法检索 tenant B 文档 |
| 成本延迟 | rerank 是否值得增加成本 |
| 回归稳定 | 新 Prompt 是否破坏历史样本 |

不要把所有指标混在一起。每次评测要有主要问题。

## 2. 系统版本

记录版本信息：

| 项 | 示例 |
|---|---|
| app_version | rag-platform-v1.3.0 |
| prompt_version | answer_v12 |
| embedding_model | embedding-v3-large |
| rerank_model | reranker-v2 |
| chunk_strategy | heading-aware-v4 |
| index_version | kb_20260606_01 |
| eval_dataset | rag_regression_202606 |
| evaluator | rule + judge + human audit |

没有版本信息，评测结果无法复现。

## 3. 数据集说明

数据集至少分层：

| 子集 | 样本来源 | 目的 |
|---|---|---|
| smoke | 人工构造 20 条 | 快速发现明显问题 |
| regression | 历史失败样本 | 防止旧问题回归 |
| golden | 专家标注问答 | 衡量核心能力 |
| no-answer | 无证据问题 | 测拒答能力 |
| permission | 多租户权限样本 | 测数据隔离 |
| adversarial | 注入、冲突、噪声 | 测安全边界 |
| fresh | 最新文档问题 | 测更新时效 |

每条样本建议包含：question、expected_answer、expected_evidence、tenant_id、tags、difficulty、source。

## 4. Pipeline 配置

写清楚被评测的 RAG 链路：

~~~text
query -> rewrite -> hybrid retrieval -> metadata filter -> rerank -> context pack -> answer -> citation check
~~~

同时记录：top_k、rerank_k、context token budget、是否启用 query rewrite、是否启用语义缓存、权限过滤字段。

## 5. 指标结果

核心指标示例：

| 指标 | 说明 |
|---|---|
| Recall@k | 正确证据是否进入 top_k |
| MRR | 正确证据排名是否靠前 |
| context_precision | 进入上下文的证据是否相关 |
| answer_faithfulness | 答案是否被证据支持 |
| citation_coverage | 关键结论是否有引用 |
| citation_accuracy | 引用是否真的支持对应句子 |
| no_answer_accuracy | 无证据时是否拒答 |
| permission_leak_rate | 权限泄漏率，目标为 0 |
| p95_latency | 端到端延迟 |
| cost_per_answer | 单次答案成本 |

报告里最好同时展示当前版本、上一个版本和目标阈值。

## 6. 分层分析

平均分可能掩盖问题。建议按标签拆分：

| 维度 | 例子 |
|---|---|
| 文档类型 | PDF、表格、FAQ、工单、API 文档 |
| 问题类型 | fact、how-to、comparison、multi-hop、summary |
| 难度 | easy、medium、hard |
| 租户 | tenant A、tenant B |
| 时间 | 新文档、旧文档 |
| Pipeline | rewrite on/off、rerank on/off |

这样才能发现“整体提升但表格问题退化”这类隐藏问题。

## 7. 失败样本归因

失败不要只写“模型回答错”。建议归因到具体层：

| 归因 | 现象 |
|---|---|
| ingestion_error | 文档解析错、表格丢失、chunk 边界错误 |
| retrieval_miss | 正确证据没有召回 |
| filter_error | metadata / ACL 过滤错误 |
| rerank_error | 正确证据被排到后面 |
| context_pack_error | 召回了但没放进上下文 |
| generation_error | 证据正确但答案生成错 |
| citation_error | 答案对但引用错 |
| no_answer_error | 无证据却编造答案 |
| permission_error | 不该看到的证据被使用 |

每类失败都应该进入下一轮迭代任务或评测集。

## 8. 成本与延迟

RAG 评测报告不要只看质量。

| 指标 | 说明 |
|---|---|
| retrieval_latency | 检索耗时 |
| rerank_latency | 重排耗时 |
| generation_latency | 生成耗时 |
| p95_total_latency | 用户体验关键指标 |
| embedding_cost | 入库和 query embedding 成本 |
| rerank_cost | 重排成本 |
| generation_cost | 生成成本 |
| cache_hit_rate | 缓存收益 |
| cost_per_success | 成功答案成本 |

如果质量提升 1%，成本上涨 200%，就需要解释是否值得。

## 9. 安全与权限

企业 RAG 必须单独报告安全结果：

- permission_leak_rate 是否为 0。
- no-answer 样本是否拒答。
- Prompt Injection 样本是否被降权。
- 敏感字段是否脱敏。
- 过期文档是否被排除。
- citation 是否包含用户有权访问的来源。

安全指标不能被平均质量指标覆盖。

## 10. 结论模板

可以用下面格式写结论：

~~~text
本次版本相对 v1.2 在 Recall@5 上从 0.78 提升到 0.86，主要收益来自 heading-aware chunk 和 hybrid retrieval。
Citation accuracy 从 0.71 提升到 0.82，但表格类问题仍然偏低。
No-answer accuracy 保持 0.93，permission_leak_rate 为 0。
成本从每次 0.018 元升至 0.024 元，p95 延迟增加 280ms，仍在目标阈值内。
下一步重点修复表格解析、rerank 对多跳问题的排序和 citation sentence alignment。
~~~

## 面试表达模板

我做 RAG 评测不会只看“回答对不对”，而是拆成检索、重排、上下文、生成、引用、拒答、权限和成本。每次版本迭代都会记录 prompt、embedding、index、chunk、rerank 和评测集版本，并把失败样本归因到 ingestion、retrieval、filter、rerank、context pack、generation 或 citation。这样优化不是凭感觉，而是能知道哪一层带来了收益或退化。

## 相关链接

- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
- [RAG 入库流水线](/note/Engineering/rag-ingestion-pipeline)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
