# GraphRAG 工程化：当普通向量检索不够用

## 这篇文章解决什么问题

普通 RAG 通常依赖 chunk + embedding + top_k 检索。它适合回答“某段文档里有什么”，但在复杂知识关系场景里会遇到问题：

- 答案需要跨多个实体和关系推理。
- 用户问的是“某公司、某产品、某政策之间的影响”。
- 文档片段单独看相关，但缺少全局结构。
- 多个名称、别名、缩写指向同一实体。
- 需要沿着关系链找证据。
- 需要输出结构化关系图而不是普通答案。

GraphRAG 的目标不是替代向量检索，而是在向量检索之外增加实体、关系、社区、路径和全局摘要能力。

## GraphRAG 适合什么场景

| 场景 | 为什么适合 |
|---|---|
| 企业知识库 | 部门、产品、客户、流程之间有复杂关系 |
| 法规/政策问答 | 条款、机构、时间、适用对象关联强 |
| 论文综述 | 作者、方法、数据集、指标、结论之间有关系 |
| 投研/情报分析 | 公司、人物、事件、时间线需要串联 |
| 故障诊断 | 设备、部件、错误码、处理步骤构成图谱 |
| 多文档项目理解 | 需求、接口、代码、测试、缺陷之间有关联 |

不适合：

- 简单 FAQ。
- 小规模文档。
- 没有明显实体关系的闲聊问答。
- 只需要全文语义召回的场景。

## GraphRAG 基本流程

```text
Documents
  -> Chunk
  -> Entity Extraction
  -> Relation Extraction
  -> Entity Resolution
  -> Graph Build
  -> Community / Subgraph Summary
  -> Query Understanding
  -> Vector + Graph Retrieval
  -> Answer with Evidence
```

关键是：图谱构建和检索都需要评测，否则很容易变成“看起来高级但不稳定”。

## 核心数据模型

### Entity

```json
{
  "entity_id": "product_x",
  "name": "Product X",
  "type": "product",
  "aliases": ["PX", "产品X"],
  "source_doc_ids": ["doc_1", "doc_7"],
  "confidence": 0.92
}
```

### Relation

```json
{
  "source": "product_x",
  "target": "error_e12",
  "type": "has_error_code",
  "evidence_chunk_id": "chunk_123",
  "confidence": 0.88
}
```

### Community Summary

```json
{
  "community_id": "after_sales_faults",
  "entities": ["product_x", "error_e12", "repair_step_3"],
  "summary": "该社区描述 Product X 常见故障码及售后处理流程",
  "source_chunks": ["chunk_123", "chunk_456"]
}
```

## GraphRAG 的检索方式

### 1. Entity-first

先识别用户问题中的实体，再找相关关系和证据。

适合：

- “Product X 的 E12 故障和哪个部件有关？”
- “这家公司和哪些供应商有关？”

### 2. Vector-first

先用向量召回相关 chunk，再抽取其中实体和子图。

适合：

- 用户问题比较模糊。
- 实体识别不稳定。

### 3. Hybrid Graph + Vector

最常用：

```text
query -> entity linking -> vector retrieval -> graph expansion -> rerank -> context pack
```

图谱负责结构关系，向量负责语义召回。

## Graph Expansion 要有限制

不要无限沿关系扩展。需要控制：

- 最大跳数。
- 最大节点数。
- 关系类型白名单。
- 时间范围。
- 权限 metadata。
- 证据 chunk 数量。

否则上下文会爆炸，且引入无关关系。

## Entity Resolution

GraphRAG 最难的环节之一是实体消歧：

- “OpenAI” 和 “Open AI” 是否同一实体？
- “E12” 是故障码还是型号？
- “苹果” 是公司还是水果？
- “张三” 是否同一个客户？

需要结合：

- entity type。
- 上下文。
- source document。
- alias table。
- 人工校正。
- confidence。

错误实体合并会污染整张图。

## 权限与多租户

GraphRAG 不能只对 chunk 做权限过滤，图节点和边也要有权限：

- entity.source_doc_ids 对应用户可见文档。
- relation.evidence_chunk_id 必须可见。
- community summary 不能混合不同租户敏感信息。
- graph expansion 时不能跨 tenant。

企业场景中，GraphRAG 权限比普通 RAG 更复杂。

## 评测指标

| 指标 | 含义 |
|---|---|
| entity precision / recall | 实体抽取是否准、是否漏 |
| relation precision | 关系是否真实被证据支持 |
| entity resolution accuracy | 实体合并是否正确 |
| subgraph relevance | 扩展子图是否相关 |
| answer faithfulness | 答案是否被图和原文证据支持 |
| graph contamination rate | 错误关系污染比例 |
| permission leak rate | 是否跨租户泄漏 |

不要只评最终答案。图谱中间结果也要评。

## GraphRAG 与普通 RAG 的组合

| 能力 | 普通 RAG | GraphRAG |
|---|---|---|
| 语义召回 | 强 | 可结合 |
| 局部事实问答 | 强 | 中等 |
| 多跳关系 | 弱 | 强 |
| 全局主题总结 | 中 | 强 |
| 构建成本 | 低 | 高 |
| 维护复杂度 | 低 | 高 |
| 权限治理 | 中 | 高 |

建议先做好普通 RAG，再在确实需要关系推理的场景引入 GraphRAG。

## 面试表达模板

> 我不会把 GraphRAG 理解成“加一个图数据库就更高级”。GraphRAG 的价值在于把文档中的实体、关系、社区和路径显式建模，用于解决普通向量检索难处理的多跳关系和全局结构问题。工程上要做实体抽取、关系抽取、实体消歧、图构建、子图检索、权限过滤和证据回溯。它通常和向量检索组合使用：先做 query entity linking，再做 vector retrieval 和 graph expansion，最后 rerank 和 context pack。评测不能只看最终答案，还要评 entity precision、relation precision、subgraph relevance 和权限泄漏率。

## 项目落地清单

- [ ] 明确是否真的需要 GraphRAG。
- [ ] 设计 entity / relation / evidence 数据模型。
- [ ] 抽取结果有 confidence。
- [ ] Entity Resolution 可人工修正。
- [ ] 图扩展有 hop 和关系类型限制。
- [ ] 图节点和边带权限 metadata。
- [ ] Graph 检索和向量检索可组合。
- [ ] 中间图谱质量有评测集。

## 相关链接

- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量检索选型](/topics/vector-search-selection)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [多模态文档理解 Agent](/topics/multimodal-document-agent)
