# RAG Freshness Evaluation：知识库新鲜度怎么评估

## 这篇文章解决什么问题

RAG 项目经常被问“答案准不准”，但生产知识库还有一个更隐蔽的问题：答案是否基于最新知识？文档更新、政策变更、权限调整、产品价格变化、流程废弃后，如果索引、缓存和引用没有同步，模型可能给出过期但看起来很可信的答案。

RAG Freshness Evaluation 的目标是评估知识库更新后，系统能否及时检索到新内容、避开旧内容，并正确标注引用版本。

## Freshness 风险来源

| 风险 | 例子 |
|---|---|
| 文档已更新但索引未更新 | 新制度发布后仍召回旧制度 |
| 文档已过期但仍可检索 | expired 文档进入 context |
| 权限已变更但缓存未失效 | 用户降权后命中旧答案 |
| 多版本文档混用 | 同一政策 V1/V2 同时进入上下文 |
| 引用版本不明 | 答案正确但无法证明来自最新版本 |
| Semantic Cache 陈旧 | query 相似命中旧知识版本答案 |

## Freshness Metadata

建议每个 document / chunk 都有：

| 字段 | 说明 |
|---|---|
| document_version | 文档版本号 |
| index_version | 索引版本号 |
| effective_from / effective_to | 生效期 |
| status | draft、active、expired、deleted |
| source_updated_at | 源文档更新时间 |
| indexed_at | 入库时间 |
| permission_version | 权限版本 |
| cache_version | 缓存失效版本 |

## 评测样本设计

| 样本类型 | 检查点 |
|---|---|
| newly added doc | 新文档是否能被召回和引用 |
| updated doc | 新版本是否覆盖旧版本 |
| expired doc | 过期内容是否被拒绝或排除 |
| deleted doc | 删除内容是否不再进入上下文 |
| permission changed | 降权后是否无法命中旧答案 |
| conflicting versions | 多版本冲突时是否选择有效版本 |
| cache invalidation | knowledge_version 变化后是否不命中旧缓存 |

## 指标

| 指标 | 含义 |
|---|---|
| freshness_recall@k | 新版本文档进入 top-k 的比例 |
| stale_context_rate | 上下文中出现过期 chunk 的比例 |
| stale_answer_rate | 答案引用旧知识的比例 |
| effective_version_accuracy | 引用版本是否符合生效期 |
| cache_staleness_rate | 缓存返回旧知识答案的比例 |
| update_lag_minutes | 源文档更新到可检索的延迟 |

## 工程实现要点

1. 入库流水线产生 index_version；
2. 文档状态变化触发索引更新和缓存失效；
3. 检索过滤必须包含 status 和 effective time；
4. rerank 后检查候选 chunk 版本；
5. 答案引用输出 document_version；
6. 评测报告记录知识库版本和索引版本；
7. 如果 freshness 失败，不能只调 Prompt，要检查入库、索引、过滤和缓存链路。

## 面试表达模板

> 我在 RAG 评测里不只看召回率和答案质量，还会单独评估 freshness。每个 chunk 都带 document_version、index_version、status、effective time 和 source_updated_at，评测集覆盖新文档、更新文档、过期文档、删除文档、权限变更和缓存失效。这样可以证明系统回答的是最新且有权限的知识。

## 常见误区

### 误区一：只要能检索到相关文档就可以

相关不等于最新。过期文档可能语义最相似，但业务上不应该使用。

### 误区二：知识更新只更新向量索引

还要处理 BM25、rerank cache、semantic cache、citation、权限版本和评测基线。

### 误区三：Freshness 只靠文档更新时间排序

有些旧文档仍然有效，有些新文档只是草稿。必须结合 status、effective time 和权限。

## 相关链接

- [RAG 知识生命周期](/note/Engineering/rag-knowledge-lifecycle)
- [RAG 权限过滤](/note/Engineering/rag-permission-filtering)
- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
- [LLM Semantic Cache](/note/Engineering/llm-semantic-cache)
- [RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)
