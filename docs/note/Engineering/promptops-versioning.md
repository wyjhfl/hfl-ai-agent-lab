# PromptOps：Prompt 版本、评测和回滚

## 这篇文章解决什么问题

Prompt 在 LLM 应用里不是随手写的字符串，而是影响系统行为的核心配置。没有 PromptOps，会出现：

- Prompt 散落在代码中。
- 改了 Prompt 不知道影响了什么。
- 线上效果变差无法回滚。
- 不同环境 Prompt 不一致。
- 评测结果无法追溯到 Prompt 版本。
- 多人协作互相覆盖。

PromptOps 的目标是把 Prompt 当作可版本化、可评测、可发布、可回滚的工程资产。

## Prompt 应该记录什么

一个 Prompt 版本至少记录：

```json
{
  "prompt_id": "support_answer",
  "version": "v3",
  "task_type": "rag_support_answer",
  "template": "...",
  "model_policy": "balanced",
  "owner": "agent-team",
  "created_at": "2026-06-06",
  "change_log": "add citation requirement",
  "eval_set": "rag_support_v2"
}
```

每次模型调用都应该记录 `prompt_id` 和 `version`。

## Prompt 生命周期

```text
Draft
  ↓
Local Eval
  ↓
Review
  ↓
Staging
  ↓
Canary
  ↓
Production
  ↓
Rollback / Iterate
```

不要在生产环境直接手改 Prompt。

## Prompt 变更要评测什么

| 任务 | 评测指标 |
|---|---|
| RAG 回答 | 引用准确率、答案完整性、拒答质量 |
| 工具调用 | tool selection、argument accuracy、approval compliance |
| 结构化输出 | schema pass rate、字段完整率 |
| 分类 | accuracy、confusion matrix |
| 摘要 | completeness、faithfulness |
| 多 Agent handoff | facts completeness、next_action correctness |

Prompt 变更必须跑至少 smoke eval。高风险变更跑 regression eval。

## Prompt 和代码的关系

Prompt 可以放在：

- 代码仓库。
- 数据库。
- Prompt registry。
- 配置中心。

无论放哪里，都要满足：

- 可版本化。
- 可审查。
- 可回滚。
- 可关联 eval。
- 可关联运行日志。

如果 Prompt 在数据库里，也要有变更记录，不要只有最新值。

## Prompt 不是万能补丁

以下问题不应该只靠 Prompt 修：

- 检索召回失败。
- 工具 schema 不清。
- 输出没有校验。
- 权限缺失。
- 上下文污染。
- 数据质量差。

PromptOps 的价值是管理 Prompt 变化，不是把所有系统问题都写进 Prompt。

## 灰度和回滚

上线 Prompt 时建议：

- 按用户或流量比例灰度。
- 记录版本效果。
- 观察失败样本。
- 支持一键回滚。
- 保留旧版本至少一个发布周期。

回滚依据不是“感觉不好”，而是指标下降或失败样本增加。

## 面试表达

可以这样讲 PromptOps：

> 我会把 Prompt 当成工程资产管理。每个 Prompt 有 prompt_id、version、task_type、owner、change_log 和关联 eval set。每次模型调用都记录 Prompt 版本，方便线上问题回溯。Prompt 变更先跑 smoke eval，高风险变更跑 regression eval，再灰度发布。如果指标下降或失败样本增加，可以回滚到上一版。PromptOps 不是靠 Prompt 修所有问题，而是让 Prompt 的变化可审查、可评测、可发布、可回滚。

## 相关链接

- [LLM Gateway](/note/Engineering/llm-gateway)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline)
- [Structured Output 工程化](/note/Engineering/structured-output-engineering)

## 参考资料

- [OpenAI Evals](https://platform.openai.com/docs/guides/evals)
- [OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching)

