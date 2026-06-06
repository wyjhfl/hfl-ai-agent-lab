# Conversation Regression Testing：让对话能力不随版本退化

## 这篇文章解决什么问题

Agent 项目经常出现一个问题：修好了一个场景，却把另一个老场景弄坏。Prompt、模型、RAG、工具 schema、Memory、权限策略任何一个变化，都可能影响对话行为。

Conversation Regression Testing 的目标是把关键对话路径沉淀成回归测试，确保版本迭代不会破坏历史能力。

## 对话回归测试测什么

| 类型 | 示例 | 断言方式 |
|---|---|---|
| 单轮问答 | 用户问一个知识点 | 结构、引用、拒答边界 |
| 多轮澄清 | 用户需求不完整 | 是否提出正确澄清问题 |
| 工具调用 | 用户要求创建任务 | 是否选择正确工具和参数 |
| 权限边界 | 用户请求越权数据 | 是否拒绝或转审批 |
| 记忆使用 | 用户偏好已保存 | 是否正确引用记忆 |
| 失败恢复 | 工具第一次超时 | 是否重试或给出可恢复提示 |
| 安全攻击 | 注入指令 | 是否忽略恶意内容 |

## 测试用例结构

建议每个用例包含：

```yaml
case_id: rag_no_answer_001
task_type: rag_qa
messages:
  - role: user
    content: "文档里有没有提到退款时限？"
fixtures:
  documents: [...]
  memory: []
expected:
  must_include_citation: true
  should_refuse_if_no_evidence: true
  tool_calls: []
assertions:
  - schema_valid
  - citation_exists
  - no_unsupported_claim
```

用例不一定真的用 YAML 存储，但结构要清楚。

## 不要逐字匹配回答

自然语言输出有波动，回归测试不应该要求模型每次说同一句话。更稳的断言包括：

- 是否有引用。
- 是否包含关键事实。
- 是否没有编造 unsupported claim。
- 是否触发正确工具。
- 是否遵守 JSON schema。
- 是否拒绝越权请求。
- 是否提出澄清问题。

## Golden Conversation

对关键业务流程，可以保存 golden conversation：

- 用户输入。
- 检索 fixture。
- 工具 fixture。
- 期望状态流转。
- 期望 tool_call。
- 期望引用。
- 期望风险策略。

模型回答可以允许语义等价，但状态、工具和引用必须稳定。

## 版本变更触发条件

以下变更都应该跑对话回归：

- Prompt 变更。
- 模型切换。
- RAG chunk 或 embedding 变更。
- 工具 schema 变更。
- MCP Server 变更。
- Memory 策略变更。
- 权限策略变更。
- UI 关键流程变更。

## 结果分析

| 结果 | 含义 |
|---|---|
| pass | 行为仍符合预期 |
| contract_fail | 输出结构或状态不符合契约 |
| quality_regression | 语义质量下降 |
| safety_regression | 安全边界被破坏 |
| flaky | 同一版本多次结果不稳定 |
| expected_changed | 产品预期变化，需要更新用例 |

不要把所有失败都直接改 expected。先判断是系统退化，还是需求真的变了。

## 和线上反馈闭环结合

高价值线上失败样本应该进入 regression set：

1. 用户负反馈或人工接管。
2. 关联 run_id 和 trace。
3. 标注失败原因。
4. 修复问题。
5. 把该对话加入回归测试。

这样每次线上事故都会提高未来版本的防退化能力。

## 面试表达

> 我会为 Agent 建 Conversation Regression Testing，避免 Prompt、模型、RAG、工具 schema 或 Memory 变更导致历史能力退化。测试用例保存用户消息、文档 fixture、工具 fixture、期望状态、期望 tool_call、引用和安全策略。自然语言回答不做逐字匹配，而是断言 schema、关键事实、引用、拒答边界、澄清行为和工具调用。线上失败样本会通过 run_id 回放并加入 regression set，形成持续回归。

## 相关链接

- [Agent Contract Testing](/topics/agent-contract-testing)
- [Agent Benchmark 设计](/note/Engineering/agent-benchmark-design)
- [AI Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Browser Automation Testing](/topics/browser-automation-testing-agent-ui)
