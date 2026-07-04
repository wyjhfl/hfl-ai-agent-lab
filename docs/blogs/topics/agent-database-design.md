# Agent 数据库设计：状态、证据与执行记录

## 这篇文章解决什么问题

很多项目只把数据库当成保存用户和业务数据的地方，但 Agent 系统还需要保存更多内容：

- 文档信息和 Chunk 信息
- Embedding 版本
- 任务状态和执行记录
- Run、Step、Tool Call
- Trace 和 Evaluation
- 用户反馈和审计记录

核心观点：**数据库不是附属模块，而是 Agent 系统可追踪、可评估、可恢复的基础。** 如果只保存最终答案，不保存执行过程，系统上线后会很难排查问题。一次回答错误，可能来自文档解析、检索召回、上下文构建、模型生成、工具调用或权限过滤。数据库设计的目标就是让这些过程可以被记录、查询和分析。

---

## 工程链路总览

### 数据类型总览

| 数据类型 | 示例表 | 作用 |
|---|---|---|
| 用户与权限 | users, roles, permissions | 表达用户身份、角色和权限边界 |
| 文档与 Chunk | documents, document_chunks | 支撑 RAG 检索、引用溯源和知识库更新 |
| 向量索引映射 | chunk_vectors | 连接 Chunk 和向量库，记录 embedding_version |
| Task / Run / Step | agent_tasks, agent_runs, agent_steps | 描述 Agent 任务从创建到完成的状态变化 |
| Tool Call | tool_calls | 保存 Agent 调用工具的参数、结果、状态和耗时 |
| Trace | run_trace, error_events | 还原执行轨迹，支持调试和问题定位 |
| Evaluation | eval_cases, eval_runs, eval_results | 支持版本对比、指标计算和失败样本沉淀 |
| Feedback | user_feedback | 记录用户对结果的评价，用于优化 |
| Audit Log | audit_logs | 记录敏感操作、权限变更和高风险工具调用 |

分层的好处是边界清晰。业务数据回答"系统服务谁、处理什么业务"，运行数据回答"Agent 做了什么"，评测数据回答"效果好不好"，审计数据回答"谁在什么时候做了什么高风险操作"。

---

## Task / Run / Step / Tool Call 模型

Agent 系统的执行记录可以用四层模型建模：

```text
task
  └── run
        ├── step
        │     └── tool_call
        ├── step
        │     └── model_call
        └── eval_result
```

- **Task**：用户创建的任务，面向外部调用方，表示一个请求的生命周期。
- **Run**：一次具体执行，比 Task 更接近执行层。一个 Task 可能对应一个或多个 Run。
- **Step**：执行过程中的一步，记录输入、输出、状态和错误。
- **Tool Call**：某一步调用的工具，记录参数、结果、状态和耗时。
- **Error Event**：失败事件，记录错误类型和处理方式。
- **Eval Result**：评测结果，关联 run_id，用于版本对比。

---

## 核心表字段示例

| 表 | 核心字段 | 说明 |
|---|---|---|
| agent_tasks | id, user_id, task_type, status, input, output, error_message, created_at, finished_at | 面向外部的任务生命周期 |
| agent_runs | id, task_id, run_type, model_name, status, started_at, ended_at, total_tokens, total_cost | 面向执行层的运行记录 |
| agent_steps | id, run_id, step_index, step_type, input, output, status, error_message | 执行步骤记录 |
| tool_calls | id, run_id, step_id, tool_name, arguments, result, status, latency_ms | 工具调用记录 |
| documents | id, title, source_uri, content_hash, parser_version, status | 文档元信息 |
| document_chunks | id, document_id, chunk_index, text, embedding_version, vector_id, metadata | Chunk 信息，连接文档和向量 |
| eval_cases | id, dataset_id, question, expected_answer | 评测用例 |
| eval_results | id, eval_run_id, case_id, run_id, score, reason | 评测结果 |
| audit_logs | id, user_id, action, resource_type, resource_id, detail, created_at | 审计记录 |

---

## 文档与 Chunk 表设计

documents 应记录：

- `document_id`：文档唯一 ID。
- `source_uri`：来源地址或来源标识。
- `title`：文档标题。
- `content_hash`：文档内容哈希，用于去重和增量更新。
- `parser_version`：解析器版本，不同版本可能产生不同 Chunk。
- `status`：解析状态（pending、parsed、failed）。
- `created_at`：创建时间。

chunks 应记录：

- `chunk_id`：Chunk 唯一 ID。
- `document_id`：所属文档 ID。
- `text`：Chunk 文本。
- `page`：页码。
- `section`：章节。
- `chunk_hash`：Chunk 内容哈希，用于增量更新。
- `embedding_version`：Embedding 版本。
- `vector_id`：向量库中的向量 ID。
- `metadata`：额外元信息。

RAG 系统必须能做引用溯源、增量更新、Embedding 重建和问题排查。如果 Chunk 不记录 `embedding_version`，模型升级后很难判断哪些向量需要重建。

---

## Embedding 版本管理

必须记录以下字段：

- `embedding_model`：使用的 Embedding 模型。
- `embedding_version`：模型版本。
- `chunk_hash`：Chunk 内容哈希。
- `vector_id`：向量库中的向量 ID。
- `created_at`：创建时间。

为什么不同版本混用会影响召回稳定性？如果不同批次的 Chunk 使用了不同版本的 Embedding 模型，向量空间的语义分布会不一致，召回质量会下降。记录 `embedding_version` 可以在模型升级时精准重建需要更新的 Chunk。

---

## Trace 数据库设计

Trace 不一定是一张表，可以是 runs、steps、tool_calls、error_events 的组合。至少记录：

- `run_id`：运行唯一标识。
- `step_id`：步骤标识。
- `tool_call_id`：工具调用标识。
- `model_call_summary`：模型调用摘要（输入、输出、耗时）。
- `state_change`：状态变化。
- `status`：执行状态。
- `latency`：执行耗时。
- `cost`：token 消耗和成本。
- `error_message`：错误信息。

Trace 通过 `run_id` 关联所有记录。排查问题时通常先定位一次运行，再展开步骤和工具调用。

---

## Evaluation 数据设计

评测要关联以下数据：

- `eval_case`：评测用例，包含问题和期望答案。
- `eval_run`：评测运行，记录版本、模型、参数。
- `eval_result`：评测结果，记录分数和原因。
- `related_run_id`：被评测的运行 ID，关联 Trace。
- `metrics`：指标（Recall、MRR、Faithfulness 等）。
- `failure_type`：失败类型（检索失败、生成幻觉、引用错误等）。
- `fixed_version`：修复版本，用于跟踪问题是否解决。

Evaluation 和 Trace 通过 `run_id` 关联，失败样本才能定位原因。每次模型、Prompt、检索参数变更后，都可以通过评测结果判断效果是否提升。

---

## 审计与安全

Agent 能调用工具后，必须记录审计信息：

- 谁触发任务（user_id）。
- 调用了什么工具（tool_name）。
- 传入什么参数摘要（arguments_summary）。
- 是否高风险（risk_level）。
- 是否经过审批（approved）。
- 是否访问敏感资源（resource_type）。
- 是否失败或回滚（status）。

审计记录不只服务合规，也服务工程排查。很多线上问题的关键不在代码，而在"谁在什么时候改了配置或调用了工具"。

---

## 索引与查询

常见查询需求决定索引设计：

| 查询需求 | 索引字段 |
|---|---|
| 查某个 task 的所有 run | agent_runs.task_id |
| 查某个 run 的所有 step | agent_steps.run_id |
| 查某个工具失败次数 | tool_calls.tool_name, tool_calls.status |
| 查某个文档对应的 chunk | document_chunks.document_id |
| 查某个 eval_run 下失败 case | eval_results.eval_run_id, eval_results.score |
| 查某个用户的高风险操作 | audit_logs.user_id, audit_logs.action |
| 文档去重 | documents.content_hash |
| 任务状态查询 | agent_tasks.status, agent_tasks.user_id |

查询任务状态要快，因为前端可能频繁轮询。查询执行轨迹要按 `run_id` 聚合，因为排查问题时通常先定位一次运行，再展开步骤和工具调用。

---

## 常见误区

- 只存最终答案，不存执行过程——无法定位错误来源。
- 不存 run_id / step_id——无法把模型调用、检索、工具调用串起来。
- 文档和 Chunk 没有 hash——无法做增量更新和去重。
- Embedding 没有版本——模型升级后无法判断哪些向量需要重建。
- Tool Call 不记录参数摘要——排查问题时不知道工具传了什么参数。
- Trace 和 Evaluation 没有关联——失败样本无法定位原因。
- 审计记录缺失——无法追踪谁在什么时候做了什么高风险操作。
- 把向量库当成全部数据库——向量库只负责检索，状态、Trace、Evaluation 需要关系型数据库。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

可以从 documents、chunks、rag_runs、citations、feedback、eval_results 开始。RAG 查询不要只返回答案，还要存 `run_id` 和 citation。失败样本可以进入 Evaluation，用于版本对比和持续优化。

**项目 B（多 Agent 运营中台 Copilot）：**

多 Agent Copilot 需要 task / run / step / tool_call / audit_log。每个 Agent 的执行都需要记录，不同 Agent 的工具调用需要隔离。本文不展开 Project B 具体页面，只说明数据库建模方向。

---

## 面试表达

我不会把数据库只当成业务数据存储。在 Agent 项目里，数据库还要承担状态、证据、执行记录和评测资产的作用。

对 RAG，我会保存 document、chunk、embedding_version、citation 等信息。这样不仅能完成检索，还能做引用溯源、向量重建、失败样本分析和质量评测。

对 Agent，我会用 task / run / step / tool_call 建模执行过程，用 eval_result 和 failure_type 支撑持续优化。上线后如果用户反馈结果错误，可以通过 `run_id` 还原检索、生成、工具调用和错误事件。这样系统才能调试、恢复、审计和评估。

---

## 后续 TODO

- 补充 Agent 数据库 ER 图。
- 补充 RAG 表结构 SQL 示例。
- 补充 task / run / step 查询示例。
- 补充 Evaluation 与 Trace 关联示例。
