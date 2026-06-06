# LLM Semantic Cache：大模型应用的语义缓存设计

## 这篇文章解决什么问题

大模型应用上线后，成本和延迟往往比 Demo 阶段更快暴露问题：同类问题反复问、RAG 检索重复跑、模型输出重复生成、评测任务批量消耗 token。如果每次请求都从头走检索、重排、生成和工具调用，系统会又贵又慢。

Semantic Cache 的目标是：在保证权限、时效性和答案可信度的前提下，对“语义等价或高度相似”的请求复用已有结果，从而降低成本、降低延迟、提升稳定性。

它不是简单的字符串缓存，而是结合 query normalize、embedding 相似度、上下文版本、权限边界和质量门禁的缓存体系。

## 哪些结果可以缓存

| 缓存对象 | 是否适合 | 注意事项 |
|---|---|---|
| 模型纯文本回答 | 适合部分场景 | 必须绑定 Prompt、模型和安全策略版本 |
| RAG 检索结果 | 适合 | 必须绑定知识库版本、权限过滤和 query |
| Rerank 后证据包 | 适合 | 需要记录 rerank model 和 top_k |
| Structured Output | 适合 | 需要 schema version 和校验结果 |
| 工具调用结果 | 谨慎 | 只读工具可缓存，写操作不能缓存 |
| 用户个性化答案 | 谨慎 | 必须绑定 user / tenant / memory version |
| 安全判定结果 | 谨慎 | 策略更新后必须失效 |

一般优先缓存 RAG 检索、rerank 证据包和低风险问答结果，不要一上来缓存所有模型输出。

## 缓存 Key 设计

一个生产级缓存 Key 不应该只有 query 文本。

| 维度 | 示例 |
|---|---|
| normalized_query | 去空格、统一大小写、去无意义口头语 |
| query_embedding | 用于语义近似匹配 |
| tenant_id | 租户隔离 |
| user_scope | 用户权限或角色范围 |
| knowledge_version | 文档库版本、索引版本 |
| prompt_version | Prompt 变更后失效 |
| model_route | 模型或路由策略变更后失效 |
| tool_policy_version | 工具策略变更后失效 |
| schema_version | structured output 的输出契约 |
| safety_policy_version | 安全策略变更后失效 |

如果缓存没有绑定权限和版本，它就可能变成数据泄漏和陈旧答案的来源。

## 命中流程

推荐流程：

1. 对 query 做 normalize。
2. 判断是否属于不可缓存场景：高风险、强实时、写操作、隐私内容。
3. 在同 tenant / scope / version 下做精确缓存查询。
4. 精确未命中时做 embedding 近似检索。
5. 相似度超过阈值后，检查缓存答案的证据、时效和质量分。
6. 命中则返回，并在 Trace 中标记 cache_hit=true。
7. 未命中则走完整 pipeline，并决定是否写入缓存。

不要只靠相似度命中。相似问题不等于相同答案，尤其在权限、时间、实体和业务状态不同的场景。

## 相似度阈值

| 场景 | 阈值建议 |
|---|---|
| FAQ / 固定政策问答 | 可以较低，例如 0.88 |
| RAG 企业知识库 | 中高，例如 0.92 |
| 涉及金额、日期、客户、工单 | 更高，例如 0.95 或禁用 |
| 代码生成 / SQL 生成 | 谨慎，通常只缓存检索和模板，不缓存最终执行语句 |
| 医疗、法律、财务建议 | 默认不缓存或只缓存公开解释性材料 |

阈值不是一次设定永久不变，要用误命中样本持续校准。

## 缓存写入门禁

不是所有结果都值得写入缓存。建议满足以下条件：

- 答案通过 structured output 校验。
- RAG citation coverage 达标。
- 没有触发安全拦截或人工接管。
- 不是用户高度个性化内容。
- 不是强实时或易过期内容。
- 成本较高或未来复用概率较高。
- 结果质量评分达到阈值。

可以把写入策略作为 Control Plane 配置，而不是写死在业务代码里。

## 失效策略

缓存失效比缓存命中更重要。

| 触发 | 失效范围 |
|---|---|
| 文档更新 | 对应 document / collection / knowledge_version |
| Prompt 更新 | prompt_version 相关缓存 |
| 模型路由更新 | model_route 相关缓存 |
| 安全策略更新 | safety_policy_version 相关缓存 |
| 权限变更 | tenant / role / user_scope 相关缓存 |
| 用户删除数据 | user 相关缓存和衍生结果 |
| 发现误命中 | 相似 query cluster 相关缓存 |

RAG 缓存建议采用 knowledge_version 或 collection_version。不要在文档更新后继续返回旧证据。

## Trace 指标

Semantic Cache 要进入可观测体系：

| 指标 | 说明 |
|---|---|
| cache_hit_rate | 总命中率 |
| semantic_hit_rate | 语义近似命中率 |
| exact_hit_rate | 精确命中率 |
| cache_saved_tokens | 节省 token |
| cache_saved_latency_ms | 节省延迟 |
| false_hit_rate | 误命中率 |
| stale_answer_rate | 陈旧答案比例 |
| permission_blocked_cache | 因权限不一致被拦截的缓存命中 |
| cache_cost_per_success | 缓存维护成本与收益 |

缓存不能只看命中率。命中率高但误命中多，会直接伤害可信度。

## 安全边界

Semantic Cache 最常见的风险是跨用户、跨租户、跨权限复用。

必须遵守：

- 缓存查询必须先过滤 tenant。
- 缓存结果必须绑定 user_scope 或 role_scope。
- RAG 证据包必须保留原始 ACL 信息。
- 不要把用户私密内容写入全局缓存。
- 不要缓存包含密钥、个人敏感信息或内部调试信息的回答。
- 命中缓存后仍要执行输出安全检查。

如果做 Agent SaaS，多租户缓存隔离是上线前必测项。

## 面试表达模板

我会把 LLM 缓存分成精确缓存和语义缓存。语义缓存不是只用 embedding 相似度，而是绑定 tenant、user_scope、knowledge_version、prompt_version、model_route 和 safety_policy_version。命中后还要检查证据时效、权限和质量评分。这样既能降低 token 成本和延迟，又能避免跨租户泄漏和陈旧答案。

## 常见误区

### 误区一：缓存就是 Redis 里存 query 到 answer

这只适合非常简单的 FAQ。生产级 LLM 缓存要绑定权限、版本和质量门禁。

### 误区二：命中率越高越好

误命中会比未命中更危险。应该同时看 false_hit_rate 和 stale_answer_rate。

### 误区三：RAG 更新后缓存可以自然过期

不够。重要知识库更新应该主动失效相关缓存。

## 相关链接

- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [LLM 成本预算表](/note/Engineering/llm-cost-budget-table)
- [企业 RAG 权限与多租户](/note/Engineering/enterprise-rag-permission-multitenancy)
- [Agent 租户隔离测试](/note/Engineering/agent-tenant-isolation-testing)
- [LLM 可观测仪表盘](/note/Engineering/llm-observability-dashboard)
