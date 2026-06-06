# RAG Permission Filtering：企业知识库权限过滤怎么做

## 这篇文章解决什么问题

企业 RAG 最危险的问题不是答错，而是答对了不该给这个用户看的内容。如果检索阶段没有权限过滤，模型就可能把其他租户、其他部门、过期文档、草稿文档或敏感字段放进上下文。

RAG Permission Filtering 的核心原则是：权限必须在检索链路中前置执行，不能只依赖模型“不要泄漏”。

## 权限过滤发生在哪里

完整链路通常有 5 层：

1. 文档入库层：写入 tenant、workspace、owner、ACL、classification、status；
2. Query 层：解析用户身份、角色、会话范围和访问目的；
3. Vector / Search 层：metadata filter 前置过滤；
4. Rerank / Context Pack 层：再次校验 chunk 权限和文档状态；
5. Answer / Citation 层：引用输出前校验用户是否可见。

只在最后一层做过滤是不够的，因为模型可能已经看到了不该看的上下文。

## Metadata 设计

| 字段 | 用途 |
|---|---|
| tenant_id | 多租户隔离第一道边界 |
| workspace_id | 团队/项目空间隔离 |
| document_id | 引用和生命周期管理 |
| chunk_id | 精确定位和审计 |
| acl_subjects | 用户、角色、部门或群组 |
| classification | public/internal/confidential/restricted |
| status | draft/active/expired/deleted |
| effective_from / effective_to | 生效期控制 |
| knowledge_version | 知识库版本和缓存失效 |
| redaction_version | 脱敏策略版本 |

## 检索过滤策略

### 1. 必须前置的过滤

- tenant_id；
- workspace_id；
- document status；
- effective time；
- classification；
- ACL subject；
- legal hold / deletion flag。

这些过滤不应该交给模型，也不应该只在前端隐藏。

### 2. Rerank 后二次校验

混合检索和 rerank 后，仍然要二次校验候选 chunk：

- metadata 是否完整；
- ACL 是否和请求主体匹配；
- 文档版本是否仍有效；
- chunk 是否来自最新索引；
- 是否触发敏感字段脱敏。

### 3. Citation 输出校验

答案引用每个 citation 前，再检查：用户是否能打开该文档、引用片段是否被脱敏、引用是否来自允许展示的版本、是否出现跨租户 doc_id。

## 缓存隔离

RAG 缓存是常见泄漏点。缓存 key 至少要包含 tenant_id、user_scope_hash、knowledge_version、permission_filter_hash、prompt_version 和 redaction_version。

如果只用 query 文本做缓存，用户 A 的答案可能被用户 B 命中。

## 测试清单

| 测试 | 目标 |
|---|---|
| cross tenant query | A 租户不能召回 B 租户文档 |
| role downgrade | 用户降权后不能命中旧缓存 |
| document expiry | 过期文档不能进入上下文 |
| draft document | 草稿不能被普通用户检索 |
| citation access | 引用链接不能打开无权限文档 |
| rerank leakage | rerank 不得重新引入无权限候选 |
| no-answer | 无权限时应该拒答，而不是猜测 |

## 面试表达模板

> 我在企业 RAG 里不会只做向量召回，而是把 tenant、workspace、ACL、classification、status、effective time 写入 metadata，并在检索、rerank、context pack 和 citation 输出前多次校验。缓存 key 也包含 permission_filter_hash，避免跨用户命中缓存导致数据泄漏。

## 常见误区

### 误区一：权限过滤放在前端就够了

前端隐藏只能控制展示，不能阻止模型在后端看到无权限上下文。

### 误区二：用自然语言提示模型不要泄漏

权限是系统策略，不是模型自觉。模型不能承担访问控制职责。

### 误区三：只测正常权限路径

权限系统必须用越权、降权、过期、删除、跨租户、缓存命中等反向样本测试。

## 相关链接

- [企业 RAG 权限与多租户](/note/Engineering/enterprise-rag-permission-multitenancy)
- [RAG 知识生命周期](/note/Engineering/rag-knowledge-lifecycle)
- [Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing)
- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
