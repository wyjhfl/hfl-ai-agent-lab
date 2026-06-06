# RAG 检索故障排查：答案差时到底是哪一层坏了

## 这篇文章解决什么问题

RAG 项目效果不好时，很多人第一反应是“模型不行”或“Prompt 不好”。但真实问题可能在：

- 文档没解析好。
- Chunk 切坏了。
- Query 改写错了。
- Embedding 模型不适合。
- Metadata 过滤过严或过松。
- top_k 太小。
- Rerank 排错。
- Context Pack 截断关键证据。
- 生成阶段忽略证据。

RAG 故障排查的目标是定位失败发生在哪一层，而不是盲目改 Prompt。

## 排查总流程

```text
User Question
  -> Query Understanding
  -> Retrieval Candidates
  -> Metadata Filter
  -> Rerank
  -> Context Pack
  -> Generation
  -> Citation
  -> Feedback
```

每层都要能单独观察。

## 第一步：确认文档是否入库

问题：正确文档根本没进入知识库。

检查：

- doc_id 是否存在。
- chunk 数量是否合理。
- metadata 是否完整。
- embedding 是否成功。
- collection 是否正确。
- 文档是否处于 READY 状态。
- 权限是否允许当前用户访问。

常见现象：用户问某文档内容，但检索结果完全不相关。

## 第二步：检查 Chunk

问题：答案被切碎或关键信息丢失。

检查：

- chunk 是否过短。
- chunk 是否跨主题。
- 表格是否被拆坏。
- 标题是否丢失。
- overlap 是否合理。
- source location 是否正确。

示例：故障码和处理步骤被切到两个 chunk，模型只看到故障码没看到步骤。

## 第三步：检查 Query Rewrite

Query Rewrite 可能把问题改错：

```text
用户：E12 报错后风扇不转怎么办？
错误改写：风扇不转原因
正确改写：E12 故障码 风扇不转 处理步骤
```

检查：

- 原始 query。
- rewrite query。
- 扩展词。
- 是否丢失型号、编号、时间、否定词。
- 多轮上下文是否误合并。

## 第四步：检查召回

召回阶段关注 recall：正确 chunk 有没有进入候选集。

记录：

- top_k candidates。
- score。
- doc_id。
- chunk_id。
- metadata。
- query embedding model。
- filter 条件。

如果正确 chunk 不在 top_k，问题在召回或过滤。

## 第五步：检查 Metadata Filter

过滤错误很常见：

| 问题 | 现象 |
|---|---|
| filter 过严 | 正确文档被过滤掉 |
| filter 过松 | 越权或过期文档进入结果 |
| 字段缺失 | 新文档无法被检索 |
| 类型不一致 | version 字符串/数字不一致 |
| 多租户错误 | 跨 tenant 泄漏 |

过滤条件要写入 Trace。

## 第六步：检查 Rerank

如果正确 chunk 在候选集中但最终没进入 context，问题可能在 rerank。

检查：

- rerank input candidates。
- rerank score。
- rerank top_n。
- 是否把长 chunk 或关键词 chunk 偏置过高。
- 是否忽略标题和 source。

Rerank 不是越强越好，也需要评测。

## 第七步：检查 Context Pack

Context Pack 负责把证据塞进模型上下文。

常见问题：

- token budget 不够，关键 chunk 被截断。
- 重复 chunk 占满上下文。
- 引用信息丢失。
- 表格格式被破坏。
- 多文档顺序混乱。

检查最终传给模型的 context，而不是只看检索结果。

## 第八步：检查生成

如果证据在 context 中，但答案仍错，问题在生成：

- Prompt 没要求基于证据。
- 模型过度推理。
- 没有无答案拒答规则。
- 引用格式不稳定。
- 输出太长导致重点丢失。

此时再改 Prompt 或换模型才有意义。

## Debug Trace 模板

```json
{
  "query": "E12 报错怎么办",
  "rewrite": "E12 故障码 处理步骤",
  "filters": {"tenant_id": "t1", "doc_type": "manual"},
  "retrieved": [
    {"chunk_id": "c1", "score": 0.82, "doc_id": "manual_e12"}
  ],
  "reranked": [
    {"chunk_id": "c1", "score": 0.91}
  ],
  "context_chunk_ids": ["c1", "c2"],
  "answer_citations": ["c1"],
  "failure_type": null
}
```

## 失败类型分类

| failure_type | 含义 |
|---|---|
| document_missing | 文档未入库 |
| parse_error | 解析失败 |
| chunk_error | 切块错误 |
| query_rewrite_error | 改写错误 |
| retrieval_miss | 未召回正确 chunk |
| filter_error | metadata 过滤错误 |
| rerank_error | rerank 排错 |
| context_pack_error | 上下文组装丢证据 |
| generation_error | 有证据但生成错 |
| citation_error | 引用不支持答案 |
| permission_error | 权限过滤问题 |

线上反馈应该归类到这些类型。

## 面试表达模板

> RAG 效果差时我不会直接改 Prompt，而是按链路排查。先确认文档是否成功入库、chunk 和 metadata 是否正确，再看 query rewrite 是否丢了关键实体，然后检查召回 top_k 中是否包含正确 chunk。如果正确 chunk 被过滤掉，排查 metadata filter；如果在候选集但没进上下文，排查 rerank 和 context pack；如果证据已经进 prompt 但答案仍错，才考虑 Prompt、模型或引用规则问题。每次请求都要记录 query、rewrite、filter、retrieved chunks、rerank score、context 和 citations，这样才能定位失败层。

## 项目落地清单

- [ ] 每次 RAG 请求记录 debug trace。
- [ ] 能查看最终传给模型的 context。
- [ ] 检索候选和 rerank 候选都可追踪。
- [ ] filter 条件写入日志。
- [ ] 线上负反馈有 failure_type。
- [ ] 每类失败都能转成 eval case。
- [ ] 有 RAG debug dashboard 或脚本。

## 相关链接

- [RAG 入库流水线](/note/Engineering/rag-ingestion-pipeline)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量检索选型](/topics/vector-search-selection)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
