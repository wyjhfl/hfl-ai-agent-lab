# RAG Knowledge Lifecycle：知识库文档生命周期治理

## 这篇文章解决什么问题

RAG 项目经常只关注“怎么把文档切块入库”，但真实知识库会不断变化：文档新增、修订、过期、撤回、权限变化、重复冲突、版本回滚。如果没有知识生命周期治理，RAG 很容易返回旧答案、冲突答案或越权答案。

RAG Knowledge Lifecycle 的目标是把文档从“上传后变成向量”升级为“可版本化、可失效、可回滚、可审计、可评测”的知识资产。

## 生命周期阶段

| 阶段 | 关键动作 |
|---|---|
| Draft | 文档草稿、未发布，不进入生产检索 |
| Submitted | 提交入库，等待校验 |
| Validating | 文件类型、大小、病毒、结构、权限校验 |
| Parsed | 解析正文、表格、图片、元数据 |
| Chunked | 按结构和语义切块 |
| Embedded | 生成向量 |
| Indexed | 写入检索索引 |
| Published | 可被生产 RAG 检索 |
| Deprecated | 仍保留但降低权重或提示过期 |
| Archived | 不再检索，仅保留审计 |
| Deleted | 按策略删除或匿名化 |

不要让上传成功等于发布成功。入库流水线应该有状态和质量门禁。

## 文档版本

每份文档至少需要：

| 字段 | 说明 |
|---|---|
| document_id | 稳定 ID |
| version_id | 文档版本 |
| source_uri | 来源 |
| checksum | 文件 hash，防重复 |
| effective_from | 生效时间 |
| effective_to | 失效时间 |
| status | draft、published、deprecated、archived |
| owner | 负责人 |
| tenant_id | 租户 |
| acl | 访问权限 |
| parser_version | 解析器版本 |
| chunk_strategy | 切块策略 |
| embedding_model | 向量模型 |
| index_version | 索引版本 |

当文档内容变更、权限变更、解析器变更或 embedding 模型变更时，都要能追踪版本。

## 冲突与重复治理

知识库越大，冲突越常见：

- 同一政策不同版本同时存在。
- FAQ 和 PDF 给出不同答案。
- 旧文档未下线，新文档已发布。
- 多租户导入了相似但权限不同的文档。
- OCR 解析错误导致重复 chunk。

治理方式：

| 问题 | 策略 |
|---|---|
| 重复文档 | checksum + simhash 去重 |
| 多版本冲突 | effective time + version priority |
| 来源优先级 | 官方文档高于用户笔记 |
| 过期文档 | 降权、标记或禁止检索 |
| 权限冲突 | 以最小权限为准 |
| 内容冲突 | 返回冲突提示并列出证据 |

RAG 不应该在冲突证据中强行编一个确定答案。

## 增量更新

全量重建索引成本高、风险大。建议支持增量：

1. 检测新增、修改、删除文档。
2. 对修改文档生成新 version_id。
3. 只重算受影响 chunk 的 embedding。
4. 更新索引别名或 collection version。
5. 使旧版本进入 deprecated / archived。
6. 触发缓存失效。
7. 跑增量评测。

增量更新必须保证检索时不会同时混用互相冲突的旧新版本。

## 权限生命周期

权限变化和内容变化一样重要。

| 权限事件 | 处理 |
|---|---|
| 用户离职 | 删除或禁用 user scope |
| 团队变更 | 更新 workspace ACL |
| 文档转公开 | 扩大可检索范围并记录审计 |
| 文档转私密 | 立即失效缓存和检索结果 |
| 租户删除 | 清理索引、缓存、Trace 衍生数据 |

如果权限变更后缓存和向量索引没有同步失效，就会出现隐蔽的数据泄漏。

## 质量门禁

文档发布前建议检查：

- 解析文本长度是否异常。
- 表格是否丢失。
- chunk 是否过长或过短。
- metadata 是否完整。
- ACL 是否存在。
- embedding 是否成功。
- 抽样检索是否能召回。
- citation 是否能定位原文。
- 是否包含敏感信息。

质量门禁失败的文档不应该进入生产索引。

## 评测指标

| 指标 | 说明 |
|---|---|
| ingestion_success_rate | 入库成功率 |
| parse_error_rate | 解析失败率 |
| stale_doc_hit_rate | 命中过期文档比例 |
| conflict_answer_rate | 冲突证据导致答案不一致比例 |
| permission_leak_rate | 权限泄漏率 |
| freshness_accuracy | 最新文档问题回答准确率 |
| citation_resolvable_rate | 引用可定位比例 |
| reindex_latency | 文档更新到可检索的延迟 |

知识生命周期治理的核心是让“知识更新”可观测、可评测。

## 面试表达模板

我不会把 RAG 入库理解成一次性 embedding，而是设计文档生命周期。每份文档有 document_id、version_id、checksum、status、effective time、ACL、parser_version、chunk_strategy、embedding_model 和 index_version。文档更新后走增量重建、旧版本 deprecated、缓存失效和增量评测；权限变化也会触发索引和缓存失效。这样可以避免旧答案、冲突答案和跨权限泄漏。

## 常见误区

### 误区一：文档上传成功就能检索

上传只是开始，发布前还要解析、切块、权限、质量和引用检查。

### 误区二：知识库只需要增量新增

删除、过期、权限变更和冲突治理同样重要。

### 误区三：旧文档不删也没关系

旧文档会污染召回，导致模型生成过期答案。

## 相关链接

- [RAG 入库流水线](/note/Engineering/rag-ingestion-pipeline)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [LLM Semantic Cache](/note/Engineering/llm-semantic-cache)
