# RAG 入库流水线：从原始文件到可检索知识库

## 这篇文章解决什么问题

很多 RAG 项目只展示“上传文件后可以问答”，但真实入库流程远比上传复杂：

- PDF 解析失败、乱码、缺页。
- 表格和图片里的关键信息丢失。
- Chunk 太大、太小或切断语义。
- Embedding 重复计算，成本高。
- 文档更新后旧 chunk 没失效。
- 入库失败后状态不清楚。
- 用户不知道文档是否真的可检索。

RAG 入库流水线的目标是把原始文件稳定转成可检索、可追溯、可更新、可评测的知识资产。

## 入库流程总览

```text
Upload
  -> File Validation
  -> Virus / Safety Scan
  -> Parse
  -> Normalize
  -> Structure Extraction
  -> Chunk
  -> Metadata Enrichment
  -> Embedding
  -> Index
  -> Quality Check
  -> Publish
```

每一步都应该有状态和错误信息，而不是一个黑盒任务。

## 文件校验

上传阶段先做：

- 文件类型校验。
- 文件大小限制。
- 文件 hash 去重。
- MIME 检查。
- 租户和权限绑定。
- 上传者记录。
- 临时存储隔离。

不要让任意文件直接进入解析器。

## 文档解析

不同文件需要不同解析策略：

| 类型 | 解析重点 |
|---|---|
| PDF | 页码、段落、标题、表格、图片、脚注 |
| Word | 标题层级、表格、批注、修订 |
| PPT | slide、标题、备注、图表 |
| HTML | DOM、正文、链接、导航噪声 |
| Markdown | 标题、代码块、表格 |
| 图片 | OCR、版面、置信度 |
| CSV / Excel | 表头、字段类型、sheet、单位 |

解析结果要保留 source location，比如页码、slide、行号、section。

## Normalize

解析后需要标准化：

- 去页眉页脚。
- 合并断行。
- 清理水印。
- 统一编码。
- 保留标题层级。
- 识别表格和代码块。
- 标准化时间、单位和编号。

Normalize 不能过度清洗，否则会丢证据。

## Chunk 策略

Chunk 不是简单按字数切。要结合：

- 标题层级。
- 段落边界。
- 表格完整性。
- 代码块完整性。
- 句子边界。
- overlap。
- max token。
- source location。

常见策略：

| 策略 | 适用 |
|---|---|
| fixed size | 快速 baseline |
| semantic chunk | 文章、手册 |
| structure-aware | Markdown、Word、HTML |
| page-aware | PDF 引用页码 |
| table-aware | 报表、参数表 |
| parent-child chunk | 长文档，先召回小 chunk，再带父段落 |

## Metadata Enrichment

每个 chunk 至少包含：

```json
{
  "tenant_id": "t_001",
  "doc_id": "doc_123",
  "chunk_id": "chunk_456",
  "title": "E12 故障处理",
  "section_path": ["售后手册", "故障码", "E12"],
  "page": 12,
  "doc_type": "manual",
  "version": "2026-06",
  "language": "zh",
  "acl_groups": ["support"],
  "content_hash": "..."
}
```

Metadata 是权限、过滤、引用、更新和评测的基础。

## Embedding 与索引

Embedding 前要考虑：

- 模型版本。
- 文本截断。
- 批量大小。
- 重试。
- hash 去重。
- 成本记录。
- 多语言。

索引时要记录：

- collection。
- vector_id。
- embedding_model。
- embedding_dim。
- indexed_at。
- metadata。

## 文档更新与删除

入库系统必须支持生命周期：

| 事件 | 处理 |
|---|---|
| 新文档 | 新建 doc 和 chunks |
| 文档更新 | 新版本 chunk 入库，旧版本失效 |
| 文档删除 | 删除或 tombstone chunk 和向量 |
| 权限变化 | 更新 metadata 和缓存 |
| 解析策略变化 | 重新入库 |
| embedding 模型变化 | 重新 embedding |

不要只支持“新增”，不支持“更新和删除”。

## 入库质量检查

入库后要检查：

- 解析页数是否符合预期。
- 空 chunk 比例。
- chunk 平均长度。
- 表格是否丢失。
- OCR 置信度。
- metadata 完整率。
- embedding 成功率。
- 随机检索 smoke。
- 引用 source location 是否可打开。

## 状态机

```text
UPLOADED
  -> VALIDATING
  -> PARSING
  -> CHUNKING
  -> EMBEDDING
  -> INDEXING
  -> QUALITY_CHECKING
  -> READY
  -> FAILED
  -> DELETED
```

用户界面应该显示当前状态和失败原因。

## 面试表达模板

> RAG 入库不是上传文件后直接 embedding。我会把它设计成异步流水线：先做文件校验、hash 去重和权限绑定，再根据文件类型解析，保留页码、标题层级、表格、图片和 source location。随后做结构化 chunk、metadata enrichment、embedding、向量索引和质量检查。每个 chunk 都带 tenant、doc_id、section、page、version、ACL、content_hash 等 metadata。文档更新、删除、权限变化和 embedding 模型变化都要能触发重建或失效。入库任务有状态机和错误信息，用户能看到文档是否真正 ready。

## 项目落地清单

- [ ] 文件上传有校验和 hash 去重。
- [ ] 解析结果保留 source location。
- [ ] Chunk 策略按文档结构设计。
- [ ] 每个 chunk metadata 完整。
- [ ] Embedding 记录模型版本和成本。
- [ ] 支持文档更新、删除、权限变化。
- [ ] 入库状态机可查询。
- [ ] 入库后有质量检查和 smoke 检索。

## 相关链接

- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量数据库工程化](/note/Engineering/vector-database)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [多模态文档理解 Agent](/topics/multimodal-document-agent)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
