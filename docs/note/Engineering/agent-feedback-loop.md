# AI Agent 反馈闭环：把用户反馈变成系统迭代燃料

## 这篇文章解决什么问题

很多 LLM 应用上线后只收集一个“赞 / 踩”。这对真实迭代远远不够。

用户反馈应该回答：

- 是检索错了，还是生成错了？
- 是工具选错了，还是参数错了？
- 是答案不完整，还是引用不可信？
- 是 Prompt 版本退化，还是模型切换导致？
- 这个失败样本能不能进入回归评测？
- 用户改正后的答案能不能沉淀为知识？

反馈闭环的目标不是“收集满意度”，而是把线上真实失败转化为评测集、Prompt 改进、知识库修复、工具修复和产品优化。

## 反馈类型

| 反馈类型 | 示例 | 后续动作 |
|---|---|---|
| 点赞 / 点踩 | 用户认为好或不好 | 粗粒度质量趋势 |
| 分类反馈 | 答案错误、引用错误、太啰嗦、没解决 | 定位失败类型 |
| 文本反馈 | 用户写明原因 | 人工分析和样本标注 |
| 编辑反馈 | 用户修改了 Agent 生成内容 | 形成偏好或正确答案 |
| 行为反馈 | 用户复制、下载、重试、放弃 | 产品可用性信号 |
| 业务结果 | 工单是否解决、审批是否通过 | 真实业务指标 |
| 人工评分 | 评审员按 rubrics 打分 | 高质量评测标签 |

只做点赞/点踩，会丢掉最有价值的信息。

## 反馈数据模型

建议至少保存：

```json
{
  "feedback_id": "fb_001",
  "user_id": "u_123",
  "task_id": "task_456",
  "run_id": "run_789",
  "step_id": "answer_generation",
  "prompt_version": "rag_answer_v4",
  "model": "balanced-model",
  "feedback_type": "citation_wrong",
  "rating": -1,
  "comment": "引用文档不支持这个结论",
  "user_correction": "正确答案应该...",
  "created_at": "2026-06-06"
}
```

反馈必须关联 run_id / prompt_version / model，否则后面无法定位是哪次系统行为导致。

## 失败归因框架

收到负反馈后，不要只改 Prompt。先归因：

| 失败位置 | 判断方法 | 修复方向 |
|---|---|---|
| Query 理解 | 用户问题被改写错 | 改 query rewrite / 意图识别 |
| 文档解析 | 原文入库缺页、乱码 | 修 parser / OCR |
| Chunk | 证据被切碎 | 调 chunk 策略 |
| 检索 | 正确文档没召回 | hybrid、metadata、embedding |
| Rerank | 正确文档排后面 | 调 rerank / top_k |
| Context Pack | 证据被截断 | 上下文预算分配 |
| 生成 | 有证据但答错 | Prompt / 模型 / schema |
| 工具 | 工具选错或参数错 | 工具 schema / 权限 / 示例 |
| UI | 用户看不懂证据 | 产品展示优化 |

反馈闭环的核心是定位“哪一层失败”。

## 从反馈到评测集

不是所有反馈都直接进评测集。需要筛选：

1. 去重：相同问题只保留代表样本。
2. 脱敏：删除用户隐私和业务敏感字段。
3. 标注：写清期望答案、证据、失败类型。
4. 分层：smoke、regression、edge case。
5. 绑定版本：记录进入评测集的时间和原因。

样本格式：

```json
{
  "case_id": "rag_citation_042",
  "input": "设备 E12 报错怎么处理？",
  "expected_behavior": "必须引用 E12 故障处理手册，不得编造步骤",
  "golden_citations": ["manual_e12_p3"],
  "failure_type": "citation_wrong",
  "source_feedback_id": "fb_001"
}
```

## 反馈驱动的迭代队列

建议把反馈进入一个 triage 队列：

```text
new feedback
  -> auto classify failure type
  -> group by task / prompt / document
  -> human review high-impact cases
  -> create fix task
  -> add eval case
  -> run regression
  -> release prompt / retrieval / tool fix
  -> monitor metric after release
```

这比“看到差评就手改 Prompt”可靠得多。

## 反馈指标

| 指标 | 含义 |
|---|---|
| negative feedback rate | 负反馈比例 |
| correction rate | 用户编辑率 |
| unresolved task rate | 用户重试或放弃比例 |
| citation complaint rate | 引用错误反馈比例 |
| tool failure feedback | 工具相关负反馈 |
| feedback-to-eval conversion | 反馈转评测样本比例 |
| regression catch rate | 回归评测捕获线上问题的比例 |
| fix lead time | 从反馈到修复上线耗时 |

## 数据隐私

反馈可能包含敏感内容。必须考虑：

- 用户输入脱敏。
- 反馈评论脱敏。
- 只保存必要上下文。
- 标注平台权限控制。
- 不把原始敏感反馈直接用于公开 demo。
- 训练或微调前重新确认授权。

## 面试表达模板

> 我不会只做点赞点踩，而是把反馈和 task_id、run_id、prompt_version、model、检索结果、引用和工具调用关联起来。负反馈会进入 triage 队列，先判断失败发生在 query rewrite、文档解析、chunk、检索、rerank、context pack、生成、工具还是 UI。高价值反馈会脱敏后转成评测样本，加入 smoke 或 regression set。修复后必须跑回归评测，并监控上线后的负反馈率和业务指标。这样用户反馈就不是零散意见，而是系统持续迭代的数据闭环。

## 项目落地清单

- [ ] 前端支持分类反馈和文本反馈。
- [ ] feedback 关联 run_id、prompt_version、model。
- [ ] 负反馈自动归类。
- [ ] 高价值反馈可转 eval case。
- [ ] 脱敏流程明确。
- [ ] 修复后跑 regression eval。
- [ ] 反馈指标进入仪表盘。
- [ ] 用户编辑结果可作为候选正确答案。

## 相关链接

- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent UI 产品化设计](/topics/agent-ui-product-design)
- [RAG 工程化](/note/Engineering/rag-engineering)
