# 向量数据库工程化

## 1. 这一篇解决什么问题

向量数据库负责管理 embedding、metadata、索引、过滤查询和相似度检索。它直接影响 RAG 的召回质量、查询延迟、权限控制和数据更新。

向量库不是“存向量的地方”。在生产 RAG 中，它是召回质量、性能和权限控制的核心组件。Collection 怎么建、metadata 怎么设计、索引怎么选、过滤条件怎么写，都会影响最终答案质量。

如果向量库设计粗糙，系统可能出现这些问题：召回不到正确文档、召回了无权限文档、文档更新后旧内容仍被检索、Embedding 模型升级后结果不稳定、查询延迟不可控。

## 2. 学习目标

- 理解向量库在 RAG 链路中的位置。
- 掌握 Collection 和 Metadata 的设计原则。
- 理解常见相似度计算方式和索引类型。
- 掌握过滤查询、增量更新和删除策略。
- 学会从质量和性能两个角度排查向量检索问题。

## 3. 向量库在 RAG 中的位置

```text
document_chunks → embedding → vector collection → similarity search → metadata filter → rerank → context
```

`document_chunks` 是数据库中的文本块。每个 Chunk 都应该有稳定的 `document_id`、`chunk_id`、文本内容和元数据。

`embedding` 是把 Chunk 文本转换为向量表示。Embedding 模型决定了语义空间，向量维度和模型版本要被记录下来。

`vector collection` 是向量库中的集合。它保存向量、向量 ID 和 metadata，并提供相似度检索能力。

`similarity search` 根据用户问题向量召回相似 Chunk。它解决“语义上相近”的问题。

`metadata filter` 用来限制检索范围，例如租户、权限、文档类型、项目 ID、语言和时间范围。

`rerank` 对初始候选结果重新排序。向量库负责粗召回，Rerank 负责提升排序精度。

`context` 是最终进入模型的上下文。只有通过检索、过滤和排序的 Chunk 才应该进入上下文。

## 4. Collection 设计

Collection 不要随便建，要考虑以下因素：

- 业务域。
- 租户隔离。
- embedding model。
- 数据权限。
- 更新频率。
- 查询场景。

| Collection | 场景 |
| --- | --- |
| `kb_chunks` | 通用知识库 Chunk |
| `ticket_docs` | 工单文档 |
| `product_manuals` | 产品手册 |
| `eval_docs` | 评测用文档 |

如果不同业务域的数据差异很大，可以拆分 Collection。这样能减少无关召回，也方便按业务独立更新和评测。

如果多租户隔离要求很高，可以考虑按租户拆 Collection，或者在同一 Collection 中强制使用 `tenant_id` filter。前者隔离更强，但管理成本更高；后者管理简单，但必须保证过滤条件不会遗漏。

Embedding model 是 Collection 设计的重要因素。不同 Embedding 模型生成的向量通常不应该混在同一个 Collection 中，除非有明确的版本字段和过滤策略。

## 5. Metadata 设计

向量库中的 metadata 至少应包含：

| 字段 | 作用 |
| --- | --- |
| `document_id` | 回到原始文档 |
| `chunk_id` | 定位具体 Chunk |
| `source_uri` | 返回来源链接或来源标识 |
| `title` | 展示和调试 |
| `page` | 页码引用 |
| `section` | 章节定位 |
| `tenant_id` | 租户隔离 |
| `user_id` | 用户级数据归属 |
| `permission_level` | 权限过滤 |
| `created_at` | 时间过滤和调试 |
| `embedding_version` | 版本管理 |
| `content_hash` | 去重和增量更新 |

Metadata 的价值主要体现在五个方面。

第一，权限过滤。检索阶段就应该过滤掉用户无权访问的文档。

第二，来源引用。回答返回时需要能展示文档、页码、章节和来源。

第三，增量更新。通过 `content_hash` 和 `embedding_version` 判断哪些向量需要重建。

第四，Debug。召回结果异常时，可以检查 metadata 是否错误。

第五，评测分析。可以按文档类型、版本、时间范围分析召回效果。

## 6. 相似度计算

### Cosine Similarity

Cosine Similarity 关注向量方向相似度，常用于文本语义检索。它对向量长度不敏感，适合很多归一化后的 Embedding。

### Dot Product

Dot Product 计算向量内积。它可能同时受到方向和向量长度影响，适合某些模型明确要求使用内积的场景。

### Euclidean Distance

Euclidean Distance 计算向量空间中的距离。距离越小表示越相似，适合一些特定向量空间配置。

选择哪种相似度取决于 Embedding 模型和向量库配置。不要只看分数，要结合召回质量评测。不同模型的分数尺度可能不同，不能简单比较。

## 7. 索引类型

| 索引类型 | 特点 | 适用场景 |
|---|---|---|
| Flat | 精准但慢 | 小规模数据、评测基准、需要精确搜索 |
| HNSW | 高性能近似搜索 | 常见在线 RAG 检索场景 |
| IVF | 先聚类再检索 | 大规模向量检索 |
| PQ | 向量压缩，节省存储 | 超大规模、存储成本敏感场景 |

Flat 会遍历全部向量，结果精准但数据量大时延迟高。它适合小规模知识库或离线评测基准。

HNSW 常用于高性能近似搜索。它通常能在召回质量和延迟之间取得较好平衡，是很多在线 RAG 场景的常用选择。

IVF 适合大规模检索。它通过聚类缩小搜索范围，但需要调节聚类数量和搜索范围。

PQ 用于压缩和节省存储。它会牺牲一定精度，适合向量数量非常大、存储成本高的场景。

## 8. 过滤查询

RAG 生产环境通常不能只做相似度搜索，还要加 metadata filter。

常见过滤条件包括：

- `tenant_id`
- `document_type`
- `permission_level`
- `created_at`
- `project_id`
- `language`

权限过滤非常重要。用户无权访问的文档不应该进入候选集，更不应该进入模型上下文。

过滤条件也会影响召回质量。过滤过宽可能泄露或污染结果，过滤过严可能导致正确文档无法召回。因此，过滤条件要写入 Trace，方便排查。

示例设计：

```python
results = vector_store.search(
    query_vector=query_embedding,
    top_k=20,
    filter={
        "tenant_id": current_user.tenant_id,
        "permission_level": {"$lte": current_user.permission_level},
        "document_type": "manual",
    },
)
```

## 9. 增量更新与删除

新文档增量入库时，需要先解析文档、生成 Chunk、计算 `content_hash` 和 `chunk_hash`，再生成 Embedding 并 upsert 到向量库。

文档更新后根据 `content_hash` 判断是否需要重建。如果 hash 没变，可以跳过重建；如果 hash 变了，需要重新解析并更新对应 Chunk 和向量。

删除文档时要删除 Chunk 和向量。只删除业务数据库中的文档记录不够，向量库中残留的向量仍可能被召回。

Embedding 模型升级后要批量重建。重建时应使用新的 `embedding_version`，并在查询时避免新旧版本混用。

Soft delete 与物理删除需要权衡。Soft delete 便于恢复和审计，但查询时必须过滤已删除数据；物理删除更干净，但恢复成本高。

## 10. 性能优化

- 控制 `top_k`。
- 使用 metadata filter 缩小范围。
- Rerank 前候选集不要过大。
- 批量 embedding。
- 批量 upsert。
- 缓存高频查询。
- 异步入库。
- 定期清理无效向量。

`top_k` 不是越大越好。过大的候选集会增加向量库返回数据量、Rerank 成本和上下文构建复杂度。

Metadata filter 可以显著缩小搜索范围。比如先按租户、项目和文档类型过滤，再做相似度检索，通常比全库搜索更快也更安全。

批量 embedding 和批量 upsert 能降低 API 调用开销和网络往返。文档入库应尽量异步执行，不要阻塞用户查询接口。

缓存高频查询可以降低延迟，但要注意知识库更新后的缓存失效策略。

## 11. 质量排查

当 RAG 召回不好时，应该检查：

- 文档是否解析正确。
- Chunk 是否合理。
- embedding 版本是否一致。
- metadata 是否错误。
- filter 是否过严。
- `top_k` 是否过小。
- 是否需要 hybrid search 和 rerank。

质量排查不能只看向量库分数。分数高不一定代表结果对问题有用，分数低也可能是因为模型、切分或查询表达不匹配。

建议把每次查询的候选结果、分数、metadata filter、Rerank 结果和最终上下文都记录到执行轨迹中。这样才能判断问题发生在哪一层。

## 12. 最小实现示例

下面是一个示例设计：

```python
def upsert_chunks(chunks, embedding_model, embedding_version):
    vectors = []
    for chunk in chunks:
        embedding = embedding_model.embed(chunk.text)
        vectors.append({
            "id": chunk.vector_id,
            "values": embedding,
            "metadata": {
                "document_id": chunk.document_id,
                "chunk_id": chunk.id,
                "source_uri": chunk.source_uri,
                "page": chunk.page,
                "tenant_id": chunk.tenant_id,
                "permission_level": chunk.permission_level,
                "embedding_version": embedding_version,
                "content_hash": chunk.content_hash,
            },
        })
    vector_store.upsert(vectors)
```

这个示例强调两个点：向量 ID 要稳定，metadata 要完整。否则后续更新、删除、引用和 Debug 都会变困难。

## 13. 生产环境注意点

向量库要和业务数据库协同设计。业务数据库保存文档和 Chunk 的权威信息，向量库保存用于检索的向量和 metadata。两者之间要通过 `chunk_id` 或 `vector_id` 关联。

向量库写入要考虑失败重试。如果数据库写入成功但向量库写入失败，就会出现文档存在但无法检索的问题。可以通过任务状态和重试队列处理。

向量库迁移和重建要可控。重建期间可以使用双 Collection 或版本字段，避免线上查询读到半更新状态。

对于权限敏感数据，metadata filter 不是可选项。任何查询都必须带上租户和权限条件。

## 14. 常见误区

### 误区一：只换向量库，不分析 Chunk

召回差不一定是向量库问题。Chunk 切分不合理会导致任何向量库都召回不好。

### 误区二：只看相似度分数

相似度分数不是最终质量指标。需要结合 Recall@K、引用准确率和人工评审判断。

### 误区三：不做 metadata 设计

没有 metadata，就无法做权限过滤、引用溯源、增量更新和 Debug。

### 误区四：不记录 embedding_version

Embedding 版本不清会导致召回不稳定，也无法判断哪些向量需要重建。

### 误区五：不处理删除和更新

文档删除或更新后，如果向量库不更新，旧内容仍可能被召回。

### 误区六：忽视权限过滤

向量检索如果不做权限过滤，可能把无权文档放进上下文，造成数据泄露。

### 误区七：把向量库当成普通数据库

向量库擅长相似度检索，不适合承担所有业务查询。业务状态仍应由关系数据库或文档数据库管理。

## 15. 和 AI Agent / RAG 项目的关系

在 RAG 系统中，向量库决定候选知识能否被召回。它影响的不只是答案质量，还包括延迟、权限、引用和问题排查。

在 Agent 系统中，向量库通常作为知识检索工具的一部分。Agent 调用检索工具时，仍然需要传入用户权限、任务上下文和检索参数。

如果多 Agent 系统共享知识库，向量库设计更要关注隔离和 metadata。不同 Agent 可能有不同任务目标和权限范围，不能默认所有知识都可见。

## 16. 面试表达

我会从 collection、metadata、index、filter、update、evaluation 几个维度设计向量库。Collection 要结合业务域、租户、Embedding 模型和查询场景；metadata 要支持权限过滤、引用溯源、增量更新和 Debug。

在 RAG 中，向量库不仅影响召回，还影响权限控制、引用溯源和问题排查。生产环境中我不会只做相似度搜索，而会加上租户、权限、文档类型等过滤条件。

如果召回质量差，我不会只换模型，而会检查解析、Chunk、embedding、filter、rerank 和评测结果。只有定位到具体环节，优化才是可控的。

## 17. 后续学习 TODO

- 补充 HNSW 参数对召回和延迟的影响示例。
- 补充 Hybrid Search 与向量检索融合排序示例。
- 补充向量库重建的双 Collection 切换方案。
- 补充基于失败样本的召回质量分析方法。

## 18. 相关链接

- [RAG 工程化](/note/Engineering/rag-engineering)
- [数据库设计：从业务数据到 Agent 运行记录](/note/Engineering/database)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
