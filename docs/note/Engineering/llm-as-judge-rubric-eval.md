# LLM-as-Judge 与 Rubric 评测：让自动评测更可信

## 这篇文章解决什么问题

大模型应用很难只用传统单元测试评估。RAG 回答是否完整、Agent 工具选择是否合理、摘要是否忠实、拒答是否合适，都需要语义判断。因此很多系统会使用 LLM-as-Judge。

但 LLM-as-Judge 也有风险：

- Judge 自己会错。
- 不同 Judge 模型打分不一致。
- 评分标准太模糊，结果不可复现。
- Judge 偏好长答案或“看起来专业”的答案。
- 自动分数和人工感受不一致。
- 团队把 Judge 分数当绝对真理。

这篇文章关注如何设计更可信的 Rubric、校准 Judge，并把自动评测接入工程流程。

## LLM-as-Judge 适合评什么

| 任务 | 是否适合 | 说明 |
|---|---|---|
| 答案完整性 | 适合 | 需要明确评分维度 |
| 引用是否支撑结论 | 适合 | 要把证据一起给 Judge |
| 摘要忠实度 | 适合 | 要提供原文 |
| 工具选择合理性 | 适合 | 要提供工具列表和任务目标 |
| 格式是否符合 schema | 不需要 Judge | 用程序校验更可靠 |
| 精确数值计算 | 不优先 | 用确定性代码校验 |
| 安全策略是否违规 | 可辅助 | 高风险仍需规则和人工抽检 |
| 用户是否满意 | 不完全适合 | 需要真实反馈 |

原则：能用程序判断的，不要交给 Judge；需要语义判断的，再用 Judge。

## Rubric 设计

差的 Rubric：

```text
请判断答案好不好，给 1-10 分。
```

好的 Rubric 应该拆维度：

| 维度 | 评分 |
|---|---|
| correctness | 结论是否正确 |
| completeness | 是否覆盖关键点 |
| faithfulness | 是否被证据支持 |
| citation_quality | 引用是否准确 |
| safety | 是否越权、泄密或给危险建议 |
| format | 是否符合输出要求 |
| conciseness | 是否清晰不过度冗长 |

示例输出：

```json
{
  "correctness": 4,
  "completeness": 3,
  "faithfulness": 5,
  "citation_quality": 4,
  "safety": 5,
  "overall": 4,
  "failure_type": "missing_key_point",
  "rationale": "答案正确但漏掉了重启后的验证步骤"
}
```

## 评分尺度要可解释

不要只写“1 到 5 分”。要定义每个分数：

| 分数 | 含义 |
|---|---|
| 5 | 完全正确，覆盖所有关键点，无明显风险 |
| 4 | 基本正确，只有轻微遗漏 |
| 3 | 部分正确，但缺少关键步骤或证据不足 |
| 2 | 多处错误，可能误导用户 |
| 1 | 完全错误、无证据或存在安全风险 |

这样才能减少 Judge 的随意性。

## Pairwise vs Pointwise

### Pointwise

直接给单个答案评分。

优点：实现简单，适合看绝对质量。

缺点：不同批次分数漂移较大。

### Pairwise

给两个答案，让 Judge 判断哪个更好。

优点：适合比较 Prompt A/B、模型 A/B。

缺点：需要更多调用，结果不一定给出绝对质量。

建议：

- 回归门禁用 pointwise。
- 模型/Prompt 选型用 pairwise + pointwise 组合。

## Judge 校准

自动评测上线前必须校准：

1. 选一批代表样本。
2. 人工按同一 Rubric 打分。
3. Judge 按 Rubric 打分。
4. 对比一致率。
5. 分析 Judge 偏差。
6. 调整 Rubric 或 Judge Prompt。
7. 固定 Judge 版本。

需要关注：

- Judge 是否偏好长答案。
- Judge 是否忽略引用错误。
- Judge 是否对中文表达过于宽松或严格。
- Judge 是否能识别拒答质量。
- Judge 是否能发现工具参数错误。

## 评测样本结构

```json
{
  "case_id": "rag_001",
  "task_type": "rag_answer",
  "input": "设备 E12 报错如何处理？",
  "context": ["manual paragraph 1", "manual paragraph 2"],
  "candidate_answer": "...",
  "golden_answer": "...",
  "rubric_id": "rag_answer_v2",
  "expected_citations": ["manual_e12_p3"],
  "judge_model": "judge_model_v1"
}
```

Judge 不应该只看到候选答案。对于 RAG，它必须看到问题、证据和期望行为。

## Judge Prompt 结构

```text
你是评测员，不是回答问题的助手。
请只根据给定问题、证据、参考答案和评分标准打分。
不要因为答案写得流畅就给高分。
如果答案中的结论没有证据支持，应降低 faithfulness 和 citation_quality。
输出 JSON，不要输出额外解释。
```

## 自动评测门禁

可以设置门禁：

| 门禁 | 示例 |
|---|---|
| overall 最低分 | overall >= 4.0 |
| 安全底线 | safety 必须为 5 |
| 引用底线 | citation_quality >= 4 |
| 退化阈值 | 新版本不得比 baseline 低 3% |
| 失败样本 | 关键失败样本必须全部通过 |

但不要让 Judge 成为唯一门禁。还要结合：

- schema pass rate。
- 工具调用准确率。
- 程序化断言。
- 人工抽检。
- 线上反馈。

## 常见误区

### 误区一：Judge 分数就是绝对真理

Judge 是评测工具，不是事实裁判。要用人工样本校准。

### 误区二：Rubric 太泛

“好不好”没有意义。要拆成 correctness、faithfulness、safety 等维度。

### 误区三：不给证据

RAG 评测不给证据，Judge 无法判断是否忠实。

### 误区四：换 Judge 不记录版本

Judge model 和 Judge prompt 变化会影响分数。必须版本化。

## 面试表达模板

> 我会把 LLM-as-Judge 当作语义评测的一部分，而不是唯一标准。能用程序校验的，比如 JSON schema、字段完整性、工具参数类型，我会用确定性校验；需要语义判断的，比如答案完整性、引用是否支撑结论、摘要忠实度，我会用 Judge。Judge 评测会设计清晰 Rubric，拆分 correctness、completeness、faithfulness、citation_quality、safety 等维度，并用人工标注样本校准一致率。每次评测记录 judge_model、judge_prompt_version、rubric_version，避免分数不可追溯。

## 项目落地清单

- [ ] 每类任务有独立 Rubric。
- [ ] 评分尺度有明确定义。
- [ ] Judge 输出结构化 JSON。
- [ ] Judge 版本、Prompt 版本、Rubric 版本可追溯。
- [ ] 有人工校准样本。
- [ ] 程序化校验和 Judge 评测分工明确。
- [ ] Pairwise 用于模型/Prompt 对比。
- [ ] 关键安全项不能只靠 Judge。

## 相关链接

- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [PromptOps](/note/Engineering/promptops-versioning)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline)
