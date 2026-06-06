# 企业知识库权限与多租户 RAG：不要让检索泄漏数据

## 这篇文章解决什么问题

企业 RAG 最危险的问题之一不是回答错，而是“检索到了不该看的文档”。常见风险：

- A 租户查到了 B 租户文档。
- 普通员工查到了管理层文档。
- 离职员工缓存里还能看到历史答案。
- metadata 过滤只在生成阶段做，没有在检索阶段做。
- 文档删除后向量库里还残留 chunk。
- 社区摘要或 GraphRAG 混合了多个权限域的信息。

企业知识库 RAG 必须把权限设计放在检索链路里，而不是只靠 Prompt 约束。

## 权限模型

| 级别 | 示例 |
|---|---|
| tenant | 公司 / 组织 |
| workspace | 项目空间 / 部门空间 |
| user | 用户 |
| role | viewer / operator / admin |
| group | 售后组 / 研发组 / 财务组 |
| document_acl | 文档可见用户或组 |
| row_policy | 数据库行级策略 |
| time_policy | 文档有效期 |

每个 document / chunk 都要带权限 metadata。

## RAG 检索权限流程

```text
user request
  -> authn
  -> authz context
  -> query rewrite
  -> metadata permission filter
  -> vector / hybrid retrieval
  -> rerank within allowed docs
  -> context pack
  -> answer with citations
```

关键：权限过滤必须发生在 retrieval 阶段。

## Metadata 设计

```json
{
  "tenant_id": "t_001",
  "workspace_id": "w_after_sales",
  "doc_id": "doc_123",
  "doc_acl_groups": ["support", "admin"],
  "classification": "internal",
  "version": "2026-06",
  "valid_from": "2026-01-01",
  "valid_to": null,
  "deleted_at": null
}
```

检索 filter 示例：

```text
tenant_id == current_tenant
AND workspace_id IN allowed_workspaces
AND doc_acl_groups INTERSECT user_groups
AND deleted_at IS NULL
```

## 权限不能后置

错误做法：

```text
先检索 top 20
再让模型忽略没有权限的文档
```

风险：

- 模型已经看到了敏感内容。
- Trace / 日志可能记录敏感 chunk。
- 引用可能泄漏标题。
- Prompt Injection 可能诱导模型输出。

正确做法：检索前过滤。

## 文档生命周期

文档权限会变：

- 新增。
- 更新。
- 删除。
- 权限调整。
- 过期。
- 租户停用。

向量库必须同步：

| 事件 | 处理 |
|---|---|
| 文档更新 | 重新 chunk / embedding，旧 chunk 失效 |
| 文档删除 | 标记 deleted_at 或物理删除向量 |
| 权限变化 | 更新 chunk metadata |
| 租户删除 | 删除该 tenant 所有文档、chunk、cache |
| 版本变化 | 保留版本字段，检索时按版本过滤 |

缓存也要按权限失效。

## 多租户缓存

缓存 key 必须包含：

- tenant_id。
- user_id 或 role/group hash。
- knowledge_base_version。
- prompt_version。
- model_version。

不要只用 query 作为缓存 key。

## GraphRAG 权限

GraphRAG 更复杂：

- entity 可能来自多个文档。
- relation 可能跨权限域。
- community summary 可能混合敏感信息。
- graph expansion 可能跨 tenant。

建议：

- entity 记录 source_doc_ids。
- relation 记录 evidence_chunk_id。
- summary 按 tenant / workspace 分开生成。
- graph query 加权限过滤。
- 回答只引用用户可见 evidence。

## 审计日志

每次知识库访问要记录：

- user_id。
- tenant_id。
- query。
- filters。
- retrieved_doc_ids。
- cited_doc_ids。
- denied_reason。
- run_id。
- timestamp。

审计日志要脱敏，但足够支持排查。

## 权限评测

必须有权限测试集：

| 测试 | 期望 |
|---|---|
| A 租户查询 B 租户文档 | 召回为空或拒绝 |
| 普通用户查 admin 文档 | 不召回 |
| 文档删除后查询 | 不召回旧 chunk |
| 权限更新后查询 | 立即或按 SLA 生效 |
| 缓存命中 | 不跨用户泄漏 |
| GraphRAG summary | 不混合权限域 |

## 面试表达模板

> 企业 RAG 的权限不能只靠 Prompt，要在检索阶段做 metadata filter。每个 document 和 chunk 都带 tenant_id、workspace_id、ACL、classification、version、deleted_at 等 metadata，用户请求先生成 authz context，再把权限条件注入 vector/hybrid retrieval。检索到的内容、rerank、context pack 和引用都只在允许范围内进行。文档删除、权限变化和租户删除要同步更新向量库和缓存。缓存 key 也必须包含 tenant、用户权限、知识库版本，避免跨用户泄漏。GraphRAG 还要保证 entity、relation、summary 不跨权限域混合。

## 项目落地清单

- [ ] document / chunk 带 tenant_id 和 ACL metadata。
- [ ] 检索阶段执行权限 filter。
- [ ] rerank 只处理允许文档。
- [ ] cache key 包含权限上下文。
- [ ] 文档删除能清理向量和缓存。
- [ ] GraphRAG summary 按权限域隔离。
- [ ] 审计日志记录 retrieved_doc_ids。
- [ ] 权限泄漏测试进入回归集。

## 相关链接

- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量数据库工程化](/note/Engineering/vector-database)
- [GraphRAG 工程化](/note/Engineering/graphrag-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [合成数据与对抗评测集](/note/Engineering/synthetic-adversarial-eval-data)
