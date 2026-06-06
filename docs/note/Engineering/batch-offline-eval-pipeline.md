# Batch / 离线评测流水线：低成本跑大规模 LLM 任务

## 这篇文章解决什么问题

不是所有 LLM 任务都需要实时完成。很多任务更适合离线批处理：

- 批量评测。
- 批量摘要。
- 批量分类。
- 数据清洗。
- 失败样本重跑。
- Prompt 版本对比。
- 模型迁移评估。

如果把这些任务都走实时接口，会增加成本、限流压力和系统复杂度。Batch / 离线评测流水线适合把非实时任务排队执行，并统一记录结果。

## 适合 Batch 的任务

| 任务 | 为什么适合 |
|---|---|
| Eval Dataset 跑分 | 不需要用户等待，适合异步 |
| 文档摘要预处理 | 可以后台执行 |
| 客服对话分类 | 批量数据，成本敏感 |
| Prompt A/B 对比 | 同一批样本跑多个版本 |
| 失败样本重放 | 需要可复现 |
| 嵌入生成 | 通常可以离线批量 |

不适合 Batch：

- 用户正在等待的实时问答。
- 语音实时交互。
- 高风险需要即时审批的操作。

## 基本架构

```text
Dataset
  ↓
Job Builder
  ↓
Batch Request File
  ↓
LLM Batch API / Worker Queue
  ↓
Result Parser
  ↓
Score / Compare
  ↓
Report / Failure Samples
```

关键是每个样本要有稳定 ID，结果能回写到对应 case。

## 数据格式

```json
{
  "custom_id": "eval_rag_001__prompt_v3",
  "method": "POST",
  "url": "/v1/responses",
  "body": {
    "model": "eval_model_policy",
    "input": "请根据证据回答问题……"
  }
}
```

结果回来后按 `custom_id` 对齐：

```json
{
  "custom_id": "eval_rag_001__prompt_v3",
  "status": "completed",
  "output": "...",
  "usage": {
    "input_tokens": 1200,
    "output_tokens": 200
  }
}
```

## 离线评测流程

### 1. 固定数据集

不要每次临时拼样本。数据集要版本化：

```text
evals/
  rag_support_v1.jsonl
  tool_calling_v1.jsonl
  agent_long_task_v1.jsonl
```

### 2. 生成任务

根据模型、Prompt 版本、参数生成 batch job。

### 3. 执行任务

可以用 Batch API，也可以用自己的 worker queue。

### 4. 解析结果

把输出、usage、latency、error 保存下来。

### 5. 评分和对比

比较：

- prompt_v2 vs prompt_v3。
- model_a vs model_b。
- rerank_on vs rerank_off。
- tool_schema_old vs tool_schema_new。

### 6. 输出报告

报告至少包含：

- 总样本数。
- 成功率。
- 平均成本。
- 指标变化。
- 失败样本列表。
- 建议回滚或发布。

## 和实时系统的关系

实时系统负责用户请求，离线系统负责质量迭代。

```text
Online Agent
  ↓ logs / failures
Failure Sample Store
  ↓
Offline Eval
  ↓
Prompt / Model / Retrieval Update
  ↓
Online Release
```

线上失败样本应该进入离线评测集，防止再次回归。

## 成本治理

Batch 任务也要记录成本：

- 每个 dataset 的总 token。
- 每个版本的总费用。
- 单样本平均费用。
- 失败重跑成本。
- 不同模型成本差异。

成本报告可以帮助决定是否要：

- 换小模型。
- 压缩上下文。
- 减少样本。
- 分层评测。
- 对部分样本人工抽检。

## 面试表达

可以这样讲离线评测：

> 我会把非实时 LLM 任务放到 Batch / 离线流水线里，比如评测集跑分、失败样本重放、Prompt 版本对比、批量摘要和分类。每个样本有 custom_id，任务结果按 ID 回写，记录输出、usage、错误和评分。评测集按 smoke、regression、benchmark 分层，线上失败样本会沉淀到离线数据集中。这样既能降低实时接口压力，也能用可复现的方式比较模型、Prompt、检索和工具 schema 的变化。

## 相关链接

- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [LLM Gateway](/note/Engineering/llm-gateway)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)

## 参考资料

- [OpenAI Batch API](https://platform.openai.com/docs/guides/batch)
- [OpenAI Evals](https://platform.openai.com/docs/guides/evals)

