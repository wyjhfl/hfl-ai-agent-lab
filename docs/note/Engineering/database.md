# 数据库设计：从业务数据到 Agent 运行记录

## 1. 这一篇解决什么问题

数据库不只是保存用户和业务表，还要保存 Agent 任务、文档、Chunk、工具调用、Trace、评测结果、用户反馈和审计记录。

在 AI Agent 项目中，数据库是“状态与证据中心”。状态指当前任务执行到哪里、文档是否入库、评测是否完成；证据指模型输入输出、工具调用参数、引用来源、错误事件和用户反馈。

如果只保存最终答案，不保存执行过程，系统上线后会很难排查问题。一次回答错误，可能来自文档解析、检索召回、上下文构建、模型生成、工具调用或权限过滤。数据库设计的目标就是让这些过程可以被记录、查询和分析。

## 2. 学习目标

- 理解 Agent 项目需要保存哪些数据。
- 学会区分业务数据、运行数据、评测数据和审计数据。
- 掌握任务表、文档表、工具调用表、Trace 表的基础设计。
- 理解索引、迁移、软删除和审计字段。

## 3. 数据类型分层

| 数据类型 | 示例 | 作用 |
|---|---|---|
| 业务数据 | 用户、工单、项目、知识库 | 表达真实业务对象，是系统服务的核心对象 |
| 文档数据 | `document`、`chunk`、`embedding_version` | 支撑 RAG 检索、引用溯源和知识库更新 |
| 任务数据 | `task`、`run`、`step` | 描述 Agent 任务从创建到完成的状态变化 |
| 工具调用数据 | `tool_call`、`tool_result` | 保存 Agent 调用工具的参数、结果、状态和耗时 |
| Trace 数据 | `run_trace`、`step_trace`、`error_event` | 还原执行轨迹，支持调试和问题定位 |
| 评测数据 | `eval_case`、`eval_run`、`eval_result` | 支持版本对比、指标计算和失败样本沉淀 |
| 审计数据 | `audit_log`、`permission_event` | 记录敏感操作、权限变更和高风险工具调用 |

分层的好处是边界清晰。业务数据回答“系统服务谁、处理什么业务”，运行数据回答“Agent 做了什么”，评测数据回答“效果好不好”，审计数据回答“谁在什么时候做了什么高风险操作”。

## 4. 核心表设计

下面是示例设计，不要求在每个项目中完全照搬，但字段含义和建模思路可以迁移。

### users

| 字段 | 含义 |
|---|---|
| `id` | 用户唯一 ID |
| `username` | 用户名 |
| `role` | 用户角色，例如 admin、operator、viewer |
| `created_at` | 创建时间 |
| `updated_at` | 更新时间 |

用户表不仅用于登录，还会关联任务、文档权限、工具权限和审计记录。

### documents

| 字段 | 含义 |
|---|---|
| `id` | 文档唯一 ID |
| `title` | 文档标题 |
| `source_type` | 来源类型，例如 upload、url、manual、ticket |
| `source_uri` | 来源地址或来源标识 |
| `content_hash` | 文档内容哈希，用于去重和增量更新 |
| `status` | 解析状态，例如 pending、parsed、failed |
| `created_at` | 创建时间 |

文档表记录的是原始文档级别的信息。RAG 中的 Chunk、向量和引用都应该能回到文档。

### document_chunks

| 字段 | 含义 |
|---|---|
| `id` | Chunk 唯一 ID |
| `document_id` | 所属文档 ID |
| `chunk_index` | 文档内 Chunk 顺序 |
| `text` | Chunk 文本 |
| `token_count` | Token 数量估计 |
| `embedding_version` | Embedding 版本 |
| `vector_id` | 向量库中的向量 ID |
| `metadata` | 页码、章节、标题层级等元数据 |
| `created_at` | 创建时间 |

Chunk 表是 RAG 的关键表。它连接文档、向量库和引用溯源。如果不保存 `embedding_version`，模型升级后很难判断哪些向量需要重建。

### agent_tasks

| 字段 | 含义 |
|---|---|
| `id` | 任务唯一 ID |
| `user_id` | 创建任务的用户 ID |
| `task_type` | 任务类型，例如 rag_query、document_ingest、agent_run、eval_run |
| `status` | 任务状态，例如 pending、running、succeeded、failed |
| `input` | 任务输入 JSON |
| `output` | 任务输出 JSON |
| `error_message` | 失败信息 |
| `created_at` | 创建时间 |
| `updated_at` | 更新时间 |
| `finished_at` | 完成时间 |

任务表面向外部调用方，表示一个用户请求或系统任务的生命周期。

### agent_runs

| 字段 | 含义 |
|---|---|
| `id` | Run 唯一 ID |
| `task_id` | 所属任务 ID |
| `run_type` | 运行类型，例如 rag、agent、evaluation |
| `model_name` | 使用的模型名称 |
| `status` | 运行状态 |
| `started_at` | 开始时间 |
| `ended_at` | 结束时间 |
| `total_tokens` | 总 Token 消耗 |
| `total_cost` | 成本估算 |

Run 表比 Task 更接近执行层。一个 Task 可能对应一个或多个 Run，例如一次评测任务可能包含多次模型运行。

### agent_steps

| 字段 | 含义 |
|---|---|
| `id` | Step 唯一 ID |
| `run_id` | 所属 Run ID |
| `step_index` | 步骤顺序 |
| `step_type` | 步骤类型，例如 retrieve、rerank、generate、tool_call |
| `input` | 步骤输入 JSON |
| `output` | 步骤输出 JSON |
| `status` | 步骤状态 |
| `error_message` | 错误信息 |
| `created_at` | 创建时间 |

Step 表用于记录执行轨迹。RAG 中可以记录 Query Rewrite、检索、重排、生成；Agent 中可以记录任务拆解、工具调用、模型输出摘要等。

### tool_calls

| 字段 | 含义 |
|---|---|
| `id` | 工具调用唯一 ID |
| `run_id` | 所属 Run ID |
| `step_id` | 所属 Step ID |
| `tool_name` | 工具名称 |
| `arguments` | 工具参数 JSON |
| `result` | 工具结果 JSON |
| `status` | 调用状态 |
| `latency_ms` | 调用耗时 |
| `created_at` | 创建时间 |

工具调用表是 Agent 系统排查问题的关键。如果工具参数和结果都不记录，就无法判断错误来自模型决策还是工具执行。

### eval_results

| 字段 | 含义 |
|---|---|
| `id` | 评测结果唯一 ID |
| `eval_run_id` | 所属评测运行 ID |
| `case_id` | 测试用例 ID |
| `run_id` | 被评测的运行 ID |
| `score` | 分数 |
| `reason` | 评分原因 |
| `created_at` | 创建时间 |

评测结果表用于版本对比。每次模型、Prompt、检索参数或 Chunk 策略变更后，都可以通过评测结果判断效果是否提升。

## 5. 索引设计

常见索引如下：

| 索引字段 | 作用 |
|---|---|
| `task.status` | 快速查询待执行或运行中的任务 |
| `task.user_id` | 快速查询某个用户的任务列表 |
| `run.task_id` | 根据任务查找运行记录 |
| `step.run_id` | 聚合某次运行的执行步骤 |
| `tool_call.run_id` | 查询某次运行中的全部工具调用 |
| `document.content_hash` | 文档去重和增量更新 |
| `chunk.document_id` | 查询文档下的全部 Chunk |
| `eval_result.eval_run_id` | 聚合某次评测的结果 |

查询任务状态要快，因为前端可能频繁轮询。查询执行轨迹要按 `run_id` 聚合，因为排查问题时通常先定位一次运行，再展开步骤和工具调用。

文档去重要依赖 hash。只靠标题或文件名不可靠，同一份文档可能被重复上传，也可能文件名不同但内容相同。

评测结果要按版本比较。评测表通常还会关联模型版本、Prompt 版本、检索参数版本和数据集版本。

## 6. 迁移管理

数据库 schema 会持续变化。项目早期可能只保存任务和文档，后续会增加工具调用、Trace、评测结果、审计字段。如果没有迁移管理，线上数据库很容易和代码不一致。

建议使用 Alembic 或类似工具管理 schema 变更。每次表结构变化都生成迁移文件，并随代码一起提交。

不要手动改线上数据库。手工修改不可复现，也很难在测试环境、预发环境和生产环境保持一致。

迁移要可回滚。新增字段、创建索引、拆表和数据回填都要考虑失败后如何恢复。

字段新增要考虑默认值和历史数据。例如给任务表新增 `status` 字段时，要明确历史数据的默认状态；给文档表新增 `embedding_version` 时，要考虑旧 Chunk 是否需要补齐版本。

## 7. 软删除与审计字段

文档、任务、用户数据通常不建议直接物理删除。特别是 Agent 执行记录和工具调用记录，可能用于问题排查、评测回放和审计。

常见做法是使用 `deleted_at` 或 `status` 标记删除状态。业务查询默认过滤已删除数据，但管理员或审计任务仍可追溯历史记录。

`created_at`、`updated_at`、`created_by` 有利于问题追踪。比如某个文档什么时候上传、由谁上传、什么时候被更新，都会影响 RAG 检索结果。

审计字段不只服务合规，也服务工程排查。很多线上问题的关键不在代码，而在“谁在什么时候改了配置或上传了文档”。

## 8. 和 RAG / Agent 的关系

RAG 需要 `documents`、`document_chunks`、`embedding_version`。这些表支撑文档管理、向量重建、引用溯源和失败样本分析。

Agent 需要 `tasks`、`runs`、`steps`。这些表支撑任务生命周期、执行状态和步骤级排查。

Trace 需要 `tool_calls` 和 `error_events`。这些数据帮助还原工具调用记录、状态变化和错误位置。

Evaluation 需要 `eval_cases` 和 `eval_results`。这些数据让系统能比较不同模型、不同 Prompt、不同检索参数的效果。

Safety 需要 `audit_logs`。权限变更、高风险工具调用、敏感文档访问都应该有审计记录。

## 9. 最小实现示例

下面是一个任务与运行记录的示例设计：

```sql
CREATE TABLE agent_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  status TEXT NOT NULL,
  input JSONB NOT NULL,
  output JSONB,
  error_message TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  finished_at TIMESTAMP
);

CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES agent_tasks(id),
  run_type TEXT NOT NULL,
  model_name TEXT,
  status TEXT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  total_tokens INTEGER,
  total_cost NUMERIC
);
```

这个示例只表达核心关系：Task 面向用户请求，Run 面向实际执行。真实项目中还会补充用户表、步骤表、工具调用表、错误事件表和评测表。

## 10. 生产环境注意点

- JSON 字段适合保存灵活结构，但核心查询字段要单独列出来。
- 大文本不要无限制塞进单表，要考虑归档、压缩或对象存储。
- 高频轮询字段要建立索引，例如任务状态和用户任务列表。
- Trace 数据增长很快，要考虑保留周期和归档策略。
- 成本、Token、延迟等指标要可聚合，方便后续分析。
- 权限相关数据要避免只存在缓存中，关键决策需要可审计。

## 11. 常见误区

### 误区一：只存最终答案，不存执行过程

最终答案无法解释系统为什么这么回答。没有执行过程，就无法定位错误来源。

### 误区二：文档 Chunk 不记录 embedding 版本

Embedding 模型升级后，如果不知道每个 Chunk 使用哪个版本，就无法稳定重建和比较召回效果。

### 误区三：工具调用不记录参数和结果

只记录工具名没有意义。排查问题时必须知道工具参数、返回结果、状态和耗时。

### 误区四：没有 run_id，导致无法排查问题

没有 `run_id` 就无法把模型调用、检索、工具调用、错误事件串起来。

### 误区五：不区分任务状态和运行状态

任务状态面向用户，运行状态面向执行引擎。两者混在一起会让长任务、重试和评测变复杂。

### 误区六：不做迁移管理

手工改库会导致环境不一致。表结构变化必须通过迁移文件管理。

## 12. 面试表达

我会把 Agent 数据分成业务数据、运行数据、评测数据和审计数据。业务数据描述用户和业务对象，运行数据记录任务、Run、Step 和工具调用，评测数据用于效果对比，审计数据用于权限和风险追踪。

对 RAG，我会保存 document、chunk、embedding_version、citation 等信息。这样不仅能完成检索，还能做引用溯源、向量重建、失败样本分析和质量评测。

对 Agent，我会保存 task、run、step、tool_call，用于 Trace、评测和问题排查。上线后如果用户反馈结果错误，可以通过 `run_id` 还原检索、生成、工具调用和错误事件。

## 13. 后续学习 TODO

- 补充项目 A 的工单、文档、引用和反馈表设计。
- 补充 Agent Trace 的错误事件表设计。
- 补充 Evaluation 数据集版本表设计。
- 补充数据库归档和 Trace 保留策略。

## 14. 相关链接

- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [FastAPI 后端接口工程化](/note/Engineering/fastapi)
