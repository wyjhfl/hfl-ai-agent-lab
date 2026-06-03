# Agent Trace：如何让 Agent 执行过程可观测

## 这篇文章解决什么问题

Agent 系统比普通 LLM 应用更复杂，因为它会调用工具、执行多步任务、产生中间状态、遇到异常、可能重试或等待人工确认。

如果只保存最终答案，就无法回答：

- Agent 到底做了什么？
- 哪一步失败了？
- 调用了什么工具？
- 工具参数是什么？
- 工具返回了什么？
- 模型输出是否符合预期？
- 成本和耗时在哪里？
- 失败样本如何沉淀？

传统应用的调试方式是看日志。但 Agent 系统的行为由模型驱动，同样的输入可能产生不同的执行路径。日志只能告诉你"发生了什么"，Trace 才能告诉你"为什么会这样"。

**核心观点**：Agent Trace 不是日志美化，而是 Agent 系统调试、评测、审计和优化的基础设施。

## 为什么 Agent 需要 Trace

普通 LLM 应用可能只需要 request / response 日志——用户问了什么、模型回了什么。但 Agent 项目需要更细粒度的执行轨迹：

- `run_id`：标识一次完整执行
- `step_id`：标识执行中的每一步
- `tool_call_id`：标识每次工具调用
- `model_call`：模型输入输出摘要
- `state_change`：状态变化记录
- `error_event`：异常事件
- `latency`：每步耗时
- `token_usage`：token 消耗
- `cost`：成本统计
- `final_result`：最终结果

Agent 的执行路径取决于模型的推理结果，同样的输入可能走完全不同的路径。没有 Trace，出了问题只能猜测原因，无法精确定位。

Trace 不是日志美化，而是 Agent 系统调试、评测、审计和优化的基础设施。它让 Agent 从"黑盒"变成"可回溯"。

## Agent Trace 应该记录什么

| 记录对象 | 记录内容 | 价值 |
|---|---|---|
| Run | run_id、task_id、开始时间、结束时间、总耗时、最终状态、总 token、总成本 | 定位整体执行情况，关联任务和评测 |
| Step | step_id、step_index、步骤类型、输入摘要、输出摘要、耗时、状态、错误信息 | 定位具体哪一步出问题 |
| Model Call | 模型名称、输入 token、输出 token、耗时、输出摘要 | 成本分析、性能优化、模型版本对比 |
| Tool Call | tool_call_id、工具名称、参数、结果摘要、耗时、状态 | 判断工具选择和执行是否正确 |
| Tool Result | 返回数据摘要、是否成功、错误信息 | 调试工具行为、发现工具异常 |
| State Change | 变更前快照、变更后快照、变更原因 | 理解 Agent 状态流转，定位状态错误 |
| Error Event | 错误类型、错误消息、关联的 run/step/tool_call | 失败分类、错误模式分析 |
| Human Review | 审核人、审核结果、审核意见 | 人工兜底记录，安全审计依据 |
| Final Result | 最终输出、是否成功、总耗时 | 任务完成度判断 |
| Eval Result | 评测指标、评测版本、是否通过 | 质量追踪、版本对比 |

## Run / Step / Tool Call 的关系

一次 Agent 执行的结构是层级嵌套的：

```text
task
  └── run
        ├── step 1: model_call
        │     └── 模型输出摘要
        ├── step 2: tool_call
        │     └── tool_call (query_order)
        ├── step 3: model_call
        │     └── 基于工具结果生成回答
        └── final_result
```

**Run**：一次完整 Agent 执行。从收到用户输入到返回最终结果。每个 Run 有唯一的 `run_id`。

**Step**：Run 中的一个执行步骤。一次 Run 可能包含多个 Step——模型调用是 Step，工具调用是 Step，状态更新也是 Step。每个 Step 有 `step_id` 和 `step_index`。

**Tool Call**：某个 Step 中调用的工具。一个 Step 可能包含一次工具调用，记录工具名称、参数、返回结果、耗时和状态。

**Error Event**：某个 Run / Step / Tool Call 的异常事件。Error Event 挂在对应的层级上，方便定位错误发生在哪一层。

**Eval Result**：对 Run 的质量评价。Eval Result 关联到 `run_id`，可以追溯到具体的执行过程。

这个层级结构的核心价值：出了问题，可以逐层定位——先找 Run，再找 Step，再找 Tool Call，最后找到 Error Event。

## Trace 数据模型示例

```sql
-- 执行记录
agent_runs
  - id                  -- run_id
  - task_id             -- 关联的任务 ID
  - run_type            -- 执行类型（single / multi_agent）
  - model_name          -- 使用的模型
  - status              -- success / failed / timeout
  - started_at          -- 开始时间
  - ended_at            -- 结束时间
  - total_tokens        -- 总 token 消耗
  - total_cost          -- 总成本

-- 步骤记录
agent_steps
  - id                  -- step_id
  - run_id              -- 关联的 run
  - step_index          -- 步骤序号
  - step_type           -- model_call / tool_call / state_update
  - input_summary       -- 输入摘要
  - output_summary      -- 输出摘要
  - status              -- success / failed
  - error_message       -- 错误信息
  - created_at          -- 创建时间

-- 工具调用记录
tool_calls
  - id                  -- tool_call_id
  - run_id              -- 关联的 run
  - step_id             -- 关联的 step
  - tool_name           -- 工具名称
  - arguments           -- 调用参数（脱敏后）
  - result_summary      -- 返回结果摘要
  - status              -- success / failed
  - latency_ms          -- 执行耗时
  - created_at          -- 创建时间
```

**敏感数据要脱敏**：工具参数和结果不一定要完整保存，可以保存摘要、哈希或安全字段。用户的手机号、身份证号、API Key 等信息必须脱敏后再存储。

**摘要而非全文**：`input_summary` 和 `result_summary` 存储的是摘要，不是完整内容。这样既保留了调试所需的信息，又控制了存储成本。

## Trace 与日志的区别

| 项目 | 普通日志 | Agent Trace |
|---|---|---|
| 粒度 | 关键事件 | 完整执行链路 |
| 关联性 | 按时间排列 | 按 run_id / step_id 关联 |
| 内容 | 系统状态、错误信息 | 输入输出、工具调用、状态变化、决策摘要 |
| 用途 | 系统运维 | Agent 调试、评测、审计 |
| 查询方式 | 按时间、按服务 | 按 run_id、按步骤、按工具 |
| 回答的问题 | 发生了什么 | 怎么发生的、为什么这样 |

日志更偏系统运行状态——服务是否健康、是否报错、请求量多少。

Trace 更偏一次任务的完整执行链路——Agent 是怎么一步步走到最终结果的。

日志可以告诉你服务报错，Trace 可以告诉你 Agent 是怎么一步步走到错误的。两者互补，缺一不可。

## Trace 与 Evaluation 的关系

Evaluation 判断结果好不好，Trace 帮助解释为什么好或为什么差。

两者联动的典型场景：

- **答案错误**：Trace 显示检索结果无关，说明问题在检索阶段而不是生成阶段。
- **工具失败**：Trace 显示参数不合法，说明问题在模型生成参数而不是工具本身。
- **成本过高**：Trace 显示重复调用模型，说明 Agent 流程设计有循环或重试问题。
- **任务超时**：Trace 显示某个工具耗时过长，说明需要优化工具性能或设置超时。
- **评测失败**：通过 `run_id` 找到 Trace，逐层定位是检索、工具还是生成出了问题。

Trace 是 Evaluation 的"解释层"。评测告诉你"这个 case 失败了"，Trace 告诉你"为什么失败"。失败样本可以反过来补充评测集——每次 Trace 中发现的新失败模式，都应该被加入测试集。

## Trace 与安全审计

Agent 能调用工具后，安全审计就变得必要。Trace 可以为权限审查和事故复盘提供证据。

审计需要回答的问题：

- **谁触发了任务**：run_id 关联到触发用户，知道是谁发起的操作。
- **调用了什么工具**：Trace 记录了每次工具调用的名称，知道 Agent 做了什么。
- **传入了什么参数**：Trace 记录了工具参数（脱敏后），知道 Agent 传了什么给工具。
- **是否触发高风险操作**：删除、发送、修改等操作应该在 Trace 中标记为高风险。
- **是否经过审批**：高风险操作的审批记录应该关联到 Trace。
- **是否访问了敏感资源**：权限过滤的结果应该在 Trace 中记录。

没有 Trace，安全审计就无从谈起。出了安全事故，无法还原 Agent 到底做了什么，也无法判断是权限设计问题还是模型行为问题。

## 最小 Trace 记录伪代码

```python
def run_agent(task):
    run_id = create_run(task_id=task.id)

    try:
        # Step 1: 模型调用
        step_id = create_step(run_id, step_type="model_call")
        model_output = call_model(task.input)
        finish_step(step_id, output_summary=summarize(model_output))

        # Step 2: 工具调用（如果模型要求）
        if model_output.requires_tool:
            tool_step_id = create_step(run_id, step_type="tool_call")
            tool_result = call_tool(
                model_output.tool_name,
                model_output.arguments,
            )
            record_tool_call(
                run_id=run_id,
                step_id=tool_step_id,
                tool_name=model_output.tool_name,
                arguments=model_output.arguments,
                result_summary=summarize(tool_result),
            )
            finish_step(
                tool_step_id,
                output_summary=summarize(tool_result),
            )

        # 最终结果
        final_result = build_final_result(model_output)
        finish_run(run_id, status="success", result=final_result)
        return final_result

    except Exception as e:
        record_error(run_id, error_message=str(e))
        finish_run(run_id, status="failed")
        raise
```

这个伪代码的核心思路：每一步操作都创建 Step，Step 结束时记录摘要。工具调用额外记录 tool_call 信息。异常发生时记录 Error Event 并标记 Run 为 failed。

## 常见误区

**误区一：只记录最终答案**

最终答案只能告诉你结果对不对，不能告诉你为什么对或为什么错。没有中间步骤，出了问题无法定位。

**误区二：只记录日志，不记录 run / step**

日志是扁平的事件列表，无法表达 Agent 执行的层级结构。没有 run_id 和 step_id，无法关联一次执行中的所有事件。

**误区三：工具调用参数不记录**

工具调用参数是调试的关键信息。不记录参数，出错时无法复盘是模型生成了错误参数，还是工具对正确参数返回了错误结果。

**误区四：敏感信息直接明文入库**

Trace 中可能包含用户输入、工具返回的敏感数据。明文存储是安全隐患，所有敏感字段必须脱敏。

**误区五：没有 run_id，无法关联评测结果**

评测结果需要关联到具体的执行过程。没有 run_id，评测失败后无法找到对应的 Trace 来分析原因。

**误区六：没有 token / cost 统计**

Agent 的成本主要在模型调用。不统计 token 和成本，可能不知不觉花了很多钱，或者某个异常请求消耗了大量资源。

**误区七：没有错误分类**

失败的 Trace 应该按错误类型分类——工具失败、模型超时、参数错误、权限拦截。不分类就无法发现系统性的失败模式。

## 对个人项目的启发

**通用迁移思路**：不管做什么类型的 Agent 项目，Trace 都应该从第一天就设计进去。每个请求一个 run_id，每个操作单元一个 Step，工具调用单独记录 tool_call。这些是 Agent 工程的通用骨架，不绑定具体业务。

**项目 A RAG 工单系统**：

- 记录每次 RAG 查询的 run_id，关联到用户的工单操作。
- 记录检索结果、引用、生成答案、用户反馈，形成完整的执行轨迹。
- 失败的 RAG 查询（检索不到、答案幻觉、引用错误）自动进入失败样本库，后续可用于扩充评测集。

**项目 B 多 Agent Copilot**：

- 多 Agent 任务必须记录每个 Agent 的 step，知道每个 Agent 做了什么。
- 工具调用、权限检查、人工审批都要进入 Trace，形成完整的审计链路。
- 最终结果要能还原执行路径——从任务分派到工具调用到结果聚合，每一步都可追溯。

## 面试表达

我认为 Agent Trace 是生产级 Agent 的基础设施。它不是普通日志，而是记录一次 Agent 执行的完整轨迹——从用户输入到最终输出的每个步骤，包括模型输出摘要、工具调用的参数和结果、状态变化、时间消耗和关键决策摘要。

通过 run / step / tool_call 的层级结构，可以支持调试、评测、审计和成本分析。出了问题，先用 run_id 找到完整 Trace，再逐层定位是哪个 Step、哪个 Tool Call 出了问题。评测失败后通过 Trace 可以解释为什么失败——是检索问题、工具问题还是生成问题。安全审计时可以通过 Trace 还原 Agent 到底调用了什么工具、传了什么参数。

在多 Agent 系统中，Trace 能帮助还原任务分派、工具调用和结果聚合过程。每个 Agent 的执行都是一个 Step，最终结果可以追溯到每个 Agent 的输入输出。工程上需要考虑存储成本（保留策略）、脱敏（敏感信息不入库）、异步写入（不阻塞主流程）和采样策略（失败 100% 保留，成功按比例采样）。

## 后续 TODO

- 补充 Trace 数据库表设计，包括索引策略和分区方案。
- 补充 Trace 前端展示样例，如何把 Trace 数据展示成时间线或流程图。
- 补充 Trace 与 Evaluation 的联动设计，如何从失败 Trace 自动生成评测用例。
- 补充多 Agent Trace 示例，展示子 Agent 的 Trace 如何挂载到主 Agent 下。

## 相关链接

- [Agent Trace 工程化笔记](/note/Engineering/agent-trace) — 更详细的工程化知识点
- [日志与可观测性](/note/Engineering/observability) — 可观测性三大支柱
- [Evaluation Pipeline](/note/Engineering/eval-pipeline) — 评测流水线设计
- [Trace 与 Evaluation](/note/AI-Agent/evaluation) — 评测方法论
- [从 RAG 到生产级 Agent Harness 的工程化学习路线](/topics/rag-to-agent-harness) — 完整学习路线
