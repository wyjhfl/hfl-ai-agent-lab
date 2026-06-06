# 向量检索选型：Embedding、Hybrid Search、Rerank 和 Metadata Filter

## 这篇文章解决什么问题

RAG 项目效果差，很多时候不是模型问题，而是检索问题。常见现象：

- 召回不到正确文档。
- 召回了但排在后面。
- 不同用户查到了越权文档。
- 文档更新后结果不稳定。
- 相似问题检索结果差异很大。
- 表格、代码、短文本召回效果差。

向量检索选型不是只选一个 Vector DB，而是设计完整检索链路。

## 检索链路

```text
Query
  ↓
Rewrite / Normalize
  ↓
Dense Retrieval
  ↓
Sparse / Keyword Retrieval
  ↓
Hybrid Merge
  ↓
Metadata Filter
  ↓
Rerank
  ↓
Context Pack
```

每一层都可能影响最终答案。

## Dense vs Sparse

| 类型 | 优点 | 缺点 |
|---|---|---|
| Dense Embedding | 语义相似好，适合同义表达 | 对精确词、编号、代码、型号可能不稳定 |
| Sparse / Keyword | 精确匹配强，适合编号、术语 | 对语义改写不敏感 |
| Hybrid Search | 兼顾语义和关键词 | 需要调权重和合并策略 |

企业知识库通常建议 hybrid，而不是只靠向量。

## Metadata Filter

metadata 是 RAG 的权限和精度基础。

常见 metadata：

- tenant_id。
- user_role。
- doc_type。
- product_line。
- version。
- language。
- created_at。
- source。
- page。

过滤要在检索阶段完成，不能检索出来后再让模型自己忽略越权文档。

## Rerank

Rerank 负责把初召回结果重新排序。适合：

- 初召回 top_k 较大。
- 文档片段相似度接近。
- 问题复杂。
- 需要提升引用准确率。

常见流程：

```text
retrieve top 50 -> rerank top 10 -> context top 5
```

Rerank 会增加延迟和成本，需要按场景使用。

## Chunk 策略

Chunk 不是越小越好，也不是越大越好。

| 文档类型 | 策略 |
|---|---|
| FAQ | 一问一答为 chunk |
| 手册 | 按章节 + 滑动窗口 |
| 表格 | 保留表头和行列结构 |
| 代码 | 按函数/类 |
| 合同 | 按条款 |
| PDF 图文 | 页面 + block |

Chunk 要保留上下文和引用位置。

## 选型维度

选择向量数据库或检索方案时看：

- 是否支持 metadata filter。
- 是否支持 hybrid search。
- 是否支持 batch upsert。
- 是否支持多租户隔离。
- 是否支持删除和更新。
- 是否支持 rerank 集成。
- 是否有可观测指标。
- 本地部署还是托管。
- 成本和延迟。

不要只看“能不能存向量”。

## 评测指标

RAG 检索要单独评测：

- recall@k。
- precision@k。
- MRR。
- gold document hit rate。
- rerank improvement。
- metadata filter correctness。
- citation accuracy。

如果不单独评测检索，就无法判断答案差是检索问题还是生成问题。

## 面试表达

可以这样讲向量检索选型：

> 我不会把 RAG 简化成“把文档切 chunk 存向量库”。检索链路通常包括 query rewrite、dense retrieval、keyword retrieval、hybrid merge、metadata filter、rerank 和 context pack。Dense embedding 适合语义相似，但对型号、编号、代码等精确词不一定稳定，所以企业知识库常需要 hybrid search。权限过滤应该在检索阶段通过 metadata 完成，不能让模型自己忽略越权文档。最终要用 recall@k、gold document hit rate、rerank improvement 和 citation accuracy 单独评估检索质量。

## 相关链接

- [向量数据库工程化](/note/Engineering/vector-database)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [多模态文档理解 Agent](/topics/multimodal-document-agent)

## 参考资料

- [Pinecone Hybrid Search](https://docs.pinecone.io/guides/search/hybrid-search)
- [Qdrant Filtering](https://qdrant.tech/documentation/concepts/filtering/)
- [Weaviate Hybrid Search](https://weaviate.io/developers/weaviate/search/hybrid)

