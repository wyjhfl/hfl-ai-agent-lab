# RAG Query Router：RAG 查询路由怎么设计

## 这篇文章解决什么问题

不是所有用户问题都应该走同一条 RAG 链路。有的问题是 FAQ，有的是政策检索，有的是多跳关系，有的是需要 SQL，有的是需要拒答，有的是需要工具调用。如果所有问题都直接丢给一个向量检索，就会导致成本高、召回差、权限复杂、答案不稳定。

RAG Query Router 的目标是先判断问题类型，再选择合适的检索、过滤、重排和回答策略。

## 路由类型

| 路由 | 适合问题 | 策略 |
|---|---|---|
| no_rag | 闲聊、通用解释 | 不检索或只用系统知识 |
| faq_rag | 高频简单问题 | 低 top-k、快模型、缓存 |
| policy_rag | 制度、流程、合同 | 强 citation、freshness、权限过滤 |
| multi_hop_rag | 多实体、多关系 | GraphRAG 或分步检索 |
| data_query | 指标、统计、明细 | SQL / BI 工具，不走普通文档 RAG |
| tool_required | 需要动作或外部系统 | Tool / MCP 调用 |
| no_answer | 越权、无证据、高风险 | 拒答或转人工 |

## Router 输入特征

- 用户意图；
- 领域和知识库；
- 是否要求最新数据；
- 是否涉及权限或敏感信息；
- 是否需要结构化数据；
- 是否需要工具副作用；
- 问题复杂度；
- 用户角色和租户；
- 历史失败样本。

## 路由输出

| 字段 | 说明 |
|---|---|
| route_type | faq_rag、policy_rag、multi_hop_rag 等 |
| knowledge_scope | 选择哪些知识库 |
| filters | tenant、ACL、status、effective time |
| retrieval_strategy | dense、hybrid、graph、sql、tool |
| top_k / rerank_k | 检索和重排规模 |
| grounding_policy | 是否强制 claim-level citation |
| fallback_policy | 无证据或低置信度时如何处理 |
| cost_budget | 本次路由允许的成本 |

## 评测指标

| 指标 | 含义 |
|---|---|
| route_accuracy | 路由是否选对 |
| retrieval_success | 对应链路是否召回正确证据 |
| no_answer_precision | 拒答是否正确 |
| cost_by_route | 不同路由成本 |
| latency_by_route | 不同路由延迟 |
| fallback_rate | 路由失败后降级比例 |

## 面试表达模板

> 我不会把所有问题都走同一套向量检索，而是先做 Query Router。Router 根据意图、知识范围、权限、是否需要最新数据、是否需要工具或 SQL，选择 FAQ RAG、Policy RAG、GraphRAG、Data Query、Tool 或 No-answer 路由。这样能同时提升召回质量、降低成本，并让权限和引用策略更精确。

## 常见误区

### 误区一：Router 只是分类器

Router 不只输出类别，还要输出 filters、retrieval strategy、grounding policy、fallback 和成本预算。

### 误区二：所有问题都强制 RAG

有些问题不需要检索，有些问题应该走 SQL 或工具，有些问题应该拒答。

### 误区三：不评测路由本身

答案错可能不是检索差，而是路由一开始就选错链路。

## 相关链接

- [RAG 工程化](/note/Engineering/rag-engineering)
- [RAG 检索故障排查](/note/Engineering/rag-retrieval-debugging)
- [RAG Grounding Contract](/note/Engineering/rag-grounding-contract)
- [GraphRAG 工程化](/note/Engineering/graphrag-engineering)
- [LLM Cost Anomaly Detection](/note/Engineering/llm-cost-anomaly-detection)
