# Eval Dataset 设计：Agent 评测不是随便问几个问题

## 这篇文章解决什么问题

很多 AI 项目评测停留在“我试了几个问题，感觉还行”。这种方式无法支撑版本迭代，因为你不知道：

- 哪类问题变好了。
- 哪类问题变差了。
- 失败来自检索、模型、工具还是上下文。
- 新 Prompt 是否引入回归。
- 更换模型是否值得。
- 多 Agent 增加的成本是否换来了质量提升。

Eval Dataset 的目标是把主观体验变成可复用、可比较、可回归的评测资产。

## Eval Dataset 的基本结构

一个评测样本不应该只有 question 和 answer。生产级样本至少包含：

```json
{
  "id": "rag_support_001",
  "task_type": "support_diagnosis",
  "input": {
    "question": "设备运行 20 分钟后过热停机，可能原因是什么？",
    "equipment_type": "pump"
  },
  "expected": {
    "must_include": ["散热风扇", "负载电流", "润滑状态"],
    "must_cite": ["manual-pump-001"],
    "must_not_include": ["无证据的更换主板建议"]
  },
  "metadata": {
    "difficulty": "medium",
    "risk": "low",
    "source": "manual_regression",
    "tags": ["rag", "citation", "diagnosis"]
  }
}
```

这样才能支持自动评分、人工复核和失败分析。

## 样本类型设计

| 类型 | 目的 | 示例 |
|---|---|---|
| 正常样本 | 验证主流程 | 文档中能找到答案的问题 |
| 边界样本 | 验证边界条件 | 信息不足、问题模糊、多个设备混合 |
| 对抗样本 | 验证安全 | Prompt Injection、越权问题、恶意文档 |
| 回归样本 | 防止旧问题复发 | 历史失败案例 |
| 工具样本 | 验证工具调用 | 应该调用哪个工具、参数是什么 |
| 多轮样本 | 验证上下文 | 前后文依赖、澄清问题 |
| 高风险样本 | 验证审批 | 写操作、发消息、创建工单 |

Eval Dataset 不能只收“模型容易答对”的问题。真正有价值的是边界和失败样本。

## RAG 项目评测字段

RAG 任务建议记录：

- `question`
- `expected_answer_points`
- `required_citations`
- `forbidden_claims`
- `retrieval_scope`
- `gold_documents`
- `difficulty`
- `failure_mode`

核心指标：

| 指标 | 含义 |
|---|---|
| citation_recall | 是否找到了应引用文档 |
| citation_precision | 引用是否真的支持答案 |
| answer_completeness | 答案是否覆盖关键点 |
| hallucination_rate | 是否出现无证据结论 |
| refusal_quality | 信息不足时是否正确拒答或澄清 |

## Tool Calling 评测字段

工具调用任务建议记录：

- `user_request`
- `expected_tool`
- `expected_arguments`
- `forbidden_tools`
- `required_permission`
- `approval_required`
- `expected_error_handling`

核心指标：

| 指标 | 含义 |
|---|---|
| tool_selection_accuracy | 是否选对工具 |
| argument_accuracy | 参数是否正确 |
| permission_compliance | 是否遵守权限 |
| retry_behavior | 失败后是否正确重试或停止 |
| idempotency_safety | 重复调用是否安全 |

## Agent 任务评测字段

长任务 Agent 建议记录：

- `goal`
- `initial_state`
- `available_tools`
- `expected_steps`
- `terminal_state`
- `human_approval_points`
- `success_criteria`
- `acceptable_variants`

核心指标：

| 指标 | 含义 |
|---|---|
| task_success_rate | 任务是否完成 |
| step_efficiency | 是否少走弯路 |
| recovery_rate | 工具失败后是否恢复 |
| state_correctness | 状态是否推进正确 |
| trace_completeness | 是否记录完整过程 |

## 评分方式

### 规则评分

适合确定性字段：

- JSON schema 是否通过。
- 是否包含引用。
- 是否调用指定工具。
- 是否触发审批。
- 是否禁止调用危险工具。

### 模型评分

适合语义质量：

- 答案完整性。
- 语气和可读性。
- 是否真正回答问题。
- 是否与证据一致。

模型评分要配合 rubrics，不能只问“这个回答好吗”。

### 人工抽检

适合高风险或模糊样本：

- 诊断建议是否可执行。
- 工单内容是否符合业务规范。
- 安全拒答是否合理。
- 多 Agent 结果是否可信。

## 失败样本库

每次线上或本地发现失败，都应该沉淀成样本：

```json
{
  "id": "failure_20260606_001",
  "task_type": "rag_answer",
  "input": "...",
  "bad_output": "...",
  "failure_mode": "citation_missing",
  "root_cause": "rerank_dropped_gold_doc",
  "expected_behavior": "include manual-003 as citation",
  "fixed_in": "v0.4.2"
}
```

失败样本库是 Agent 系统持续进步的核心资产。

## 数据集分层

建议把评测集分成三层：

| 层级 | 用途 | 规模 |
|---|---|---|
| smoke set | 每次提交快速跑 | 10-30 条 |
| regression set | 版本发布前跑 | 100-500 条 |
| benchmark set | 模型/架构重大变更时跑 | 500+ 条 |

不要每次都跑全量大评测。根据风险选择评测范围。

## 与 Trace 结合

每个 eval case 应该能关联到 run trace：

```text
eval_case_id -> run_id -> steps -> retrieval -> model_call -> tool_call -> final_output
```

这样评分失败时可以定位：

- 是检索没召回。
- 是 rerank 排错。
- 是上下文组装丢证据。
- 是模型忽略证据。
- 是工具参数错。
- 是状态推进错。

## 面试表达

可以这样讲 Eval Dataset：

> 我不会只靠人工随便试几个问题评估 Agent。我的做法是把评测样本结构化，包含 input、expected、metadata、difficulty、risk 和 tags。RAG 样本会记录 gold documents、required citations 和 forbidden claims；工具调用样本会记录 expected_tool、arguments 和 approval_required；长任务 Agent 样本会记录 expected_steps、terminal_state 和 success_criteria。评测分 smoke、regression、benchmark 三层，并把失败样本沉淀成回归集。每个 eval case 关联 run trace，这样失败后能定位是检索、模型、工具还是状态问题。

## 相关链接

- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [Agent 面试追问库](/note/AI-Interview/agent-followup-interview)
- [Agent 开发 Playbook](/topics/agent-development-playbook)

## 参考资料

- [OpenAI Evals](https://github.com/openai/evals)
- [OpenAI: Evals design guide](https://platform.openai.com/docs/guides/evals)
- [LangSmith evaluation concepts](https://docs.smith.langchain.com/evaluation)

