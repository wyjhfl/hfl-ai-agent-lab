# Embedding 模型评测与迁移：不要随便换向量模型

## 这篇文章解决什么问题

RAG 系统中，Embedding 模型决定了语义召回的基础质量。很多团队会遇到：

- 想换更便宜或更强的 embedding 模型。
- 新模型维度不同，向量库要重建。
- 换模型后召回效果反而变差。
- 中文、英文、代码、表格场景表现差异很大。
- 旧向量和新向量混在一个 collection 里，结果不可控。
- 没有评测集，只能凭主观感觉换模型。

Embedding 迁移不是改一个模型名，而是一次检索系统变更，需要评测、灰度、重建、回滚和监控。

## Embedding 模型影响什么

| 影响点 | 说明 |
|---|---|
| 语义召回 | 同义表达、长短文本匹配 |
| 精确匹配 | 型号、编号、术语、代码可能不稳定 |
| 多语言 | 中英混合、跨语言检索 |
| 向量维度 | 影响 collection schema 和存储成本 |
| 速度成本 | 文档入库和 query embedding 成本 |
| 上下文长度 | 单次 embedding 输入限制 |
| 稳定性 | 模型版本变化导致结果漂移 |

## 评测集怎么设计

Embedding 评测关注“正确证据能不能召回”。样本结构：

```json
{
  "case_id": "e12_fan_fault_001",
  "query": "E12 报错后风扇不转怎么办？",
  "positive_chunk_ids": ["manual_e12_p12_c3"],
  "hard_negative_chunk_ids": ["manual_e21_p9_c2"],
  "metadata_filter": {"doc_type": "manual", "product": "X"},
  "query_type": "error_code"
}
```

要覆盖：

- 短问句。
- 长问题。
- 错别字。
- 型号/编号。
- 同义表达。
- 表格字段。
- 代码/配置。
- 中英混合。
- 无答案问题。
- 权限过滤场景。

## 核心指标

| 指标 | 含义 |
|---|---|
| Recall@k | 正确 chunk 是否出现在 top k |
| MRR | 正确 chunk 排名是否靠前 |
| nDCG | 多个相关 chunk 的排序质量 |
| Hit Rate | 是否至少命中一个正确证据 |
| Hard Negative Confusion | 是否把相似但错误 chunk 排前面 |
| Filtered Recall | 加 metadata filter 后召回质量 |
| Latency | query embedding 和检索耗时 |
| Cost | 文档重嵌和在线查询成本 |

不要只看 Recall@5。对于 RAG，正确证据排第 1 和排第 5 的生成效果差异很大。

## 迁移流程

```text
Baseline Eval
  -> New Model Offline Eval
  -> Build New Collection
  -> Shadow Query
  -> Canary Traffic
  -> Monitor Feedback
  -> Full Switch
  -> Keep Rollback Window
```

### 1. Baseline Eval

先保存旧模型表现：

- dataset_version。
- embedding_model。
- collection_version。
- metrics。
- query logs sample。

### 2. New Model Offline Eval

用同一评测集跑新模型。比较：

- 总体指标。
- query_type 分组指标。
- 失败样本。
- 成本和延迟。

### 3. Build New Collection

不要把不同 embedding 模型的向量混在同一个 collection。

推荐命名：

```text
kb_chunks_v1_embed_a
kb_chunks_v2_embed_b
```

### 4. Shadow Query

线上 query 同时查旧 collection 和新 collection，但只返回旧结果。记录差异。

### 5. Canary

小流量真实使用新模型。监控：

- 负反馈。
- 无答案率。
- 引用投诉。
- 检索 latency。
- fallback。

## 回滚策略

必须保留旧 collection 一段时间：

- 新模型效果不稳定时快速切回。
- 文档重嵌失败时不影响线上。
- 评测发现某类 query 退化时按业务域切回。

## 常见坑

### 1. 只重嵌文档，不重嵌 query

文档和 query 必须使用同一 embedding 空间。

### 2. 新旧向量混在一起

不同模型向量空间不同，不能混查。

### 3. 只测正常问题

要测型号、表格、错别字、代码和 hard negative。

### 4. 忽略 Chunk 影响

Embedding 模型变了，最佳 chunk 长度也可能变化。

### 5. 不记录版本

不记录 embedding_model_version 和 collection_version，线上问题无法复盘。

## 面试表达模板

> 我不会直接替换 embedding 模型，而是先用固定检索评测集跑 baseline，评估 Recall@k、MRR、nDCG、hard negative confusion、latency 和 cost。新模型离线评测通过后，会建立新的 collection，不和旧向量混用。然后做 shadow query，对比新旧召回差异，再小流量 canary，并监控负反馈、无答案率、引用投诉和检索延迟。迁移期间保留旧 collection，出现退化可以快速回滚。每个 chunk 和 query 都记录 embedding_model_version 和 collection_version。

## 项目落地清单

- [ ] 有 embedding 检索评测集。
- [ ] 样本覆盖 query_type 和 hard negative。
- [ ] 记录 Recall@k / MRR / nDCG。
- [ ] 新模型使用新 collection。
- [ ] 支持 shadow query。
- [ ] canary 有监控和回滚。
- [ ] chunk metadata 记录 embedding_model_version。
- [ ] 迁移后保留旧 collection 回滚窗口。

## 相关链接

- [向量数据库工程化](/note/Engineering/vector-database)
- [向量检索选型](/topics/vector-search-selection)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
