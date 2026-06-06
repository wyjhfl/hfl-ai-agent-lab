# RAG Metadata Schema Design：RAG 文档元数据怎么设计

## 这篇文章解决什么问题

很多 RAG 项目只存 text 和 embedding，刚开始能跑，后面一接入企业文档、权限、版本、过期、引用和多租户就会出问题。答案错不一定是模型错，而是 metadata 太弱，检索时无法过滤、排序、追溯和失效。

RAG Metadata Schema 的目标是让文档、chunk、索引、权限、版本和引用都可治理。

## 文档级 Metadata

| 字段 | 说明 |
|---|---|
| document_id | 文档唯一 ID |
| tenant_id | 租户 |
| workspace_id | 工作区或项目空间 |
| source_type | pdf、html、wiki、ticket、code、db_export |
| source_uri | 原始来源引用 |
| title | 文档标题 |
| owner | 责任人或团队 |
| classification | public、internal、confidential、restricted |
| acl | 可见角色、用户、团队 |
| status | draft、active、deprecated、deleted |
| version | 文档版本 |
| effective_from / effective_to | 生效期 |
| created_at / updated_at | 时间戳 |
| language | 语言 |
| checksum | 内容 hash |

## Chunk 级 Metadata

| 字段 | 说明 |
|---|---|
| chunk_id | chunk 唯一 ID |
| document_id | 所属文档 |
| chunk_index | 文档内顺序 |
| section_path | 标题层级 |
| page_start / page_end | 页码范围 |
| token_count | token 数 |
| semantic_type | definition、policy、procedure、faq、table、code |
| embedding_model | 向量模型 |
| index_version | 索引版本 |
| citation_text | 可展示引用片段 |
| permission_filter_hash | 权限过滤摘要 |

## 为什么 metadata 会影响答案质量

| 问题 | metadata 缺失后果 |
|---|---|
| 文档过期 | 检索到旧制度 |
| 权限不同 | 用户看到不该看的内容 |
| 多版本共存 | 新旧答案互相冲突 |
| 表格与正文混合 | 引用无法定位 |
| 多租户 | cache 或检索结果跨租户泄漏 |
| 模型迁移 | embedding 版本无法对比 |

## 检索时的过滤顺序

1. tenant/workspace 过滤。
2. ACL 和 classification 过滤。
3. status=active 过滤。
4. effective time 过滤。
5. knowledge_version / index_version 过滤。
6. query intent 对 semantic_type 加权。
7. 向量、关键词、重排。
8. citation pack 生成。

不要先召回再做权限过滤到最后，否则可能出现上下文污染、缓存误命中和日志泄漏。

## 与缓存的关系

RAG 缓存 key 不能只用 query_text，需要至少包含：

| 维度 | 说明 |
|---|---|
| tenant_id | 租户隔离 |
| user_scope_hash | 用户权限摘要 |
| knowledge_version | 知识版本 |
| index_version | 索引版本 |
| prompt_version | 回答策略版本 |
| query_intent | 问题类型 |

## 面试表达

可以这样讲：

> 我不会只把文档切块后存 embedding，而是为 document 和 chunk 都设计 metadata。检索前先按 tenant、ACL、status、effective time 和 index_version 过滤，再做召回和重排。这样可以解决企业 RAG 中最常见的旧知识、越权、多版本冲突和引用不可追溯问题。

## 落地检查清单

- [ ] document 是否有 tenant、workspace、ACL 和 classification？
- [ ] chunk 是否有 section_path、page、semantic_type 和 citation_text？
- [ ] 是否记录 embedding_model 和 index_version？
- [ ] 是否能处理文档删除、过期和权限变更？
- [ ] cache key 是否包含权限和知识版本？
