# Fine-tuning 数据流水线：从线上样本到可训练数据

## 这篇文章解决什么问题

Fine-tuning 经常被误解成“把文档丢给模型训练”。实际上，大多数大模型应用里，微调更适合学习：

- 固定输出格式。
- 特定语气和风格。
- 分类边界。
- 工具调用格式。
- 多轮流程习惯。
- 领域任务模式。

Fine-tuning 的关键不只是训练，而是数据流水线：样本收集、清洗、标注、质检、切分、训练、评测、上线和回滚。

## 什么时候考虑 Fine-tuning

适合：

- Prompt 很长但主要是格式和风格约束。
- 分类/抽取任务有大量标注样本。
- 工具参数格式稳定。
- 希望降低少样本示例 token 成本。
- 模型总是犯同一类行为错误。

不适合：

- 知识频繁变化。
- 只是缺外部事实。
- 数据量很少。
- 没有评测集。
- 想让模型记住私有文档细节。

知识型问题优先 RAG，行为/格式/风格问题才考虑微调。

## 数据来源

| 来源 | 价值 | 风险 |
|---|---|---|
| 线上成功样本 | 贴近真实分布 | 可能含隐私 |
| 用户修正 | 高价值标签 | 需要确认正确性 |
| 人工标注 | 质量高 | 成本高 |
| 失败样本修复 | 直接针对痛点 | 容易过拟合 |
| 合成样本 | 补覆盖 | 需要人工抽检 |
| 历史规则数据 | 稳定边界 | 可能过时 |

## 数据流水线

```text
Collect
  -> De-identify
  -> Normalize
  -> Label
  -> Quality Review
  -> Deduplicate
  -> Split
  -> Format Convert
  -> Train
  -> Eval
  -> Deploy
```

## 样本结构

### 分类样本

```json
{
  "input": "用户想取消订单但已经发货",
  "output": {"intent": "cancel_after_shipping", "risk": "medium"},
  "source": "human_label",
  "quality": "gold"
}
```

### 工具调用样本

```json
{
  "messages": [
    {"role": "user", "content": "帮我查 E12 故障处理步骤"},
    {"role": "assistant", "tool_call": {"name": "search_kb", "arguments": {"error_code": "E12"}}}
  ],
  "source": "production_corrected"
}
```

### 风格样本

```json
{
  "input": "生成售后回复",
  "output": "您好，已为您定位到...",
  "style": "support_polite_concise"
}
```

## 数据清洗

必须处理：

- 删除 PII。
- 删除密钥和内部链接。
- 删除越权数据。
- 统一字段名。
- 去重复。
- 去低质量样本。
- 修复 JSON 格式。
- 标注样本来源和质量等级。

不要把原始线上日志直接拿去训练。

## 数据切分

至少分：

- train。
- validation。
- test。
- holdout。
- adversarial。

同一用户、同一任务、同一文档变体不要同时出现在 train 和 test，否则评测虚高。

## 质量控制

| 检查 | 说明 |
|---|---|
| schema validation | 输出格式必须合法 |
| label consistency | 同类样本标签一致 |
| leakage check | 不含隐私和密钥 |
| duplication check | 避免重复样本放大权重 |
| distribution check | 各类任务比例合理 |
| human audit | 抽检高风险样本 |

## Fine-tuning 后评测

不要只看训练 loss。要看：

- 原有任务是否提升。
- 非目标任务是否退化。
- schema pass rate。
- tool argument accuracy。
- refusal quality。
- safety eval。
- 成本和延迟。
- 与 Prompt-only baseline 对比。

## 上线策略

```text
offline eval
  -> shadow traffic
  -> limited canary
  -> compare with base model
  -> rollback if regression
```

Fine-tuned model 也要纳入 [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)。

## 常见误区

### 1. 用微调解决知识问题

知识变化快时，RAG 更合适。

### 2. 没有 holdout

没有真正未见过的样本，评测分数不可信。

### 3. 数据越多越好

低质量数据会污染模型。质量比数量重要。

### 4. 微调后不回归评测

微调可能提升目标任务，但破坏安全和拒答能力。

## 面试表达模板

> 我会把 fine-tuning 当成行为和格式优化手段，而不是知识库替代品。数据流水线从线上成功样本、用户修正、人工标注、失败样本修复和合成样本收集数据，先脱敏、去重、格式校验、质量分级，再切分 train、validation、test、holdout 和 adversarial。训练后不只看 loss，而是和 Prompt-only baseline 对比 schema pass rate、tool argument accuracy、目标任务分数、安全拒答和非目标任务退化。上线时走 shadow traffic 和 canary，并保留回滚策略。

## 项目落地清单

- [ ] 明确微调目标是行为/格式/风格，而不是知识记忆。
- [ ] 样本来源和质量等级可追溯。
- [ ] 训练数据经过脱敏和去重。
- [ ] 有 holdout 和 adversarial set。
- [ ] 输出格式有 schema 校验。
- [ ] 与 Prompt-only baseline 对比。
- [ ] 上线走灰度和回滚。
- [ ] 微调模型纳入模型路由治理。

## 相关链接

- [RAG vs Fine-tuning](/note/AI-Agent/rag-vs-finetuning)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [合成数据与对抗评测集](/note/Engineering/synthetic-adversarial-eval-data)
- [PromptOps](/note/Engineering/promptops-versioning)
- [多模型路由与 A/B 实验](/note/Engineering/model-routing-ab-testing)
