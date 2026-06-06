# RAG Ingestion Quality Gate：文档入库质量门禁怎么做

## 这篇文章解决什么问题

RAG 的答案质量很大程度取决于入库质量。很多系统只要文件解析不报错就入库，但真实场景里会遇到乱码、空页、重复文档、错误 metadata、缺失权限、切块过碎、图片表格丢失、embedding 失败等问题。

RAG Ingestion Quality Gate 的目标是在文档进入索引前做质量门禁，避免垃圾知识进入检索链路。

## 入库质量门禁

| 门禁 | 检查内容 |
|---|---|
| file validation | 文件类型、大小、病毒、加密、损坏 |
| parser validation | 页数、文本抽取率、乱码率、空页率 |
| metadata validation | tenant、workspace、owner、ACL、status、source_url |
| chunk validation | chunk 长度、重叠、标题层级、表格保留 |
| duplicate detection | hash、simhash、source id、版本冲突 |
| pii scan | PII、密钥、敏感字段检测和脱敏 |
| embedding validation | 向量维度、失败率、空向量、模型版本 |
| retrieval smoke | 样本文档能否被固定 query 召回 |

## 质量评分

可以给每个文档生成 ingestion_quality_score：

| 维度 | 分数 |
|---|---|
| parse_score | 文本抽取完整度 |
| structure_score | 标题、表格、列表保留程度 |
| metadata_score | 权限和版本字段完整度 |
| chunk_score | chunk 长度和语义完整性 |
| security_score | 敏感信息处理结果 |
| retrieval_score | smoke query 召回结果 |

低于阈值的文档不应直接进入 active index，可以进入 quarantine 或人工审核队列。

## 入库状态机

| 状态 | 含义 |
|---|---|
| uploaded | 文件已上传 |
| parsing | 正在解析 |
| normalized | 已清洗和结构化 |
| quality_checking | 正在执行质量门禁 |
| quarantine | 质量不达标，等待人工处理 |
| embedding | 正在生成向量 |
| indexed | 已进入索引 |
| active | 可检索 |
| failed | 入库失败，可重试或回放 |

## 面试表达模板

> 我不会让文档解析成功就直接入库，而是设置 ingestion quality gate。文件需要经过解析质量、metadata、ACL、chunk、重复、PII、embedding 和 retrieval smoke 检查，低质量文档进入 quarantine。这样能把 RAG 问题前移，避免后面靠 Prompt 修垃圾知识。

## 常见误区

### 误区一：RAG 效果差只调检索参数

如果文档解析、metadata、chunk 和权限本身有问题，调 top-k 或 rerank 只是治标。

### 误区二：所有文档都立即 active

低质量文档应先隔离或人工审核，否则会污染线上答案。

### 误区三：不记录入库版本

没有 parser_version、chunker_version、embedding_version，就无法复盘质量变化。

## 相关链接

- [RAG 入库流水线](/note/Engineering/rag-ingestion-pipeline)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [RAG Freshness Evaluation](/note/Engineering/rag-freshness-evaluation)
- [RAG 权限过滤](/note/Engineering/rag-permission-filtering)
- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
