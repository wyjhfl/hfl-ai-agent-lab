# LLM Evaluation Scorecard：把主观好不好变成可比较分数

## 这篇文章解决什么问题

大模型应用最难的部分不是写一次 Prompt，而是持续判断新版本有没有变好。模型、Prompt、RAG、工具、上下文、评测集、前端交互都可能影响结果。如果只靠人工体验，就很难做版本对比和上线门禁。

LLM Evaluation Scorecard 的目标是把“这个答案好像不错”拆成一组可复用、可解释、可比较的评分维度，用于开发自测、灰度发布、面试表达和线上回归。

## Scorecard 和普通指标的区别

普通指标通常只看一个结果，例如准确率、满意度、延迟。Scorecard 更像一张综合评分卡，它同时覆盖质量、证据、格式、安全、成本和产品体验。

| 类型 | 关注点 | 局限 |
|---|---|---|
| 单一指标 | 某个维度是否达标 | 无法解释为什么变好或变差 |
| 人工体验 | 真实感受 | 难复现、难规模化、难版本对比 |
| LLM-as-Judge | 语义评分 | 需要校准，可能不稳定 |
| Scorecard | 多维评分和门禁 | 设计成本更高，但最适合工程化 |

## 核心评分维度

一个通用的 Agent / RAG Scorecard 可以从 8 个维度开始：

| 维度 | 问题 | 评分示例 |
|---|---|---|
| Task Success | 是否完成用户任务 | 0 未完成，1 部分完成，2 完成 |
| Factuality | 事实是否正确 | 0 明显错误，1 有瑕疵，2 正确 |
| Grounding | 是否基于证据回答 | 0 无证据，1 证据弱，2 引用充分 |
| Instruction Following | 是否遵守用户和系统要求 | 0 偏题，1 部分遵守，2 完全遵守 |
| Format Validity | 输出格式是否可消费 | 0 不可解析，1 需修复，2 合格 |
| Tool Correctness | 工具选择和参数是否正确 | 0 错工具，1 参数瑕疵，2 正确 |
| Safety | 是否避免危险、越权和泄漏 | 0 高风险，1 可疑，2 安全 |
| UX Clarity | 用户是否能理解结果 | 0 混乱，1 一般，2 清晰 |

总分不是唯一目标。更重要的是每个维度都能指出改进方向。

## RAG 场景的 Scorecard

RAG 不应该只评估答案文本，还要评估检索和证据链。

| 维度 | 检查问题 |
|---|---|
| Retrieval Recall | 是否召回了能回答问题的文档或 chunk？ |
| Context Precision | 放入上下文的证据是否相关，是否有噪声？ |
| Citation Accuracy | 引用是否真的支持答案中的关键句？ |
| No-answer Behavior | 证据不足时是否拒答或说明不确定？ |
| Permission Filter | 是否只检索当前用户有权限的数据？ |
| Freshness | 答案是否使用了最新可用资料？ |

RAG 的常见失败不是模型不会写，而是证据没召回、证据被噪声淹没、引用和答案不匹配。

## Tool Calling 场景的 Scorecard

Tool Calling 的评测重点不只是最终文本，还包括工具选择、参数、错误处理和副作用控制。

| 维度 | 检查问题 |
|---|---|
| Tool Selection | 是否选择了正确工具，是否避免不必要工具？ |
| Args Schema | 参数是否符合 schema 和业务约束？ |
| Permission | 是否满足租户、角色、风险等级要求？ |
| Error Handling | 工具失败后是否给出可恢复路径？ |
| Side Effect Safety | 对写操作、删除、发送、扣费是否有审批？ |
| Trace Completeness | 是否记录 tool_id、args_hash、result、latency、error？ |

面试中可以说：我会把工具调用评测拆成选择正确性、参数正确性、权限合规、错误恢复和副作用安全，而不是只看最终回答是否流畅。

## Agent 场景的 Scorecard

Agent 任务通常是多步骤，因此还需要评估过程质量。

| 维度 | 检查问题 |
|---|---|
| Plan Quality | 计划是否合理、可执行、不过度复杂？ |
| Step Progress | 每一步是否推动任务向目标前进？ |
| State Consistency | 状态是否正确更新，是否有循环或跳步？ |
| Recovery | 失败后是否能重试、降级或转人工？ |
| Human Handoff | 低置信度或高风险任务是否正确转人工？ |
| Cost Control | 是否避免无效循环和重复调用？ |

多 Agent 还要额外评估角色分工是否清晰、状态共享是否正确、最终结果是否合并一致。

## 评分样本怎么设计

Scorecard 的质量取决于评测样本。不要只放简单样本，至少包含以下类别：

| 样本类型 | 目的 |
|---|---|
| Golden Path | 验证核心能力是否正常 |
| Edge Case | 覆盖边界输入和异常格式 |
| Regression Case | 防止历史 bug 复发 |
| Adversarial Case | 覆盖 Prompt Injection、越权、冲突证据 |
| No-answer Case | 验证证据不足时的拒答能力 |
| Long Context Case | 验证上下文压缩和证据排序 |
| Tool Failure Case | 验证工具超时、失败和降级 |

一个成熟项目应该同时有 smoke set、regression set、benchmark set 和 red-team set。

## 自动评分和人工评分怎么结合

LLM-as-Judge 很有用，但不能盲信。建议采用三层结构：

1. 规则评分：格式、schema、引用 URL、权限字段、成本、延迟。
2. Judge 评分：事实一致性、回答完整性、用户体验、推理质量。
3. 人工抽检：校准 Judge、复盘高风险样本、处理争议样本。

规则评分适合确定性要求，Judge 评分适合语义质量，人工抽检适合高风险和校准。

## 发布门禁示例

可以把 Scorecard 接入 Release Gate：

| 门禁 | 示例阈值 |
|---|---|
| Smoke Set | 关键样本 100% 通过 |
| Regression Set | 总分不低于上个版本，关键维度不退化 |
| Safety Set | 高风险样本 0 个严重失败 |
| RAG Citation | 引用准确率不低于阈值 |
| Tool Args | schema violation 为 0 |
| Cost | 平均 cost per task 不超过预算 |
| Latency | p95 不超过 SLA |

阈值要跟业务风险绑定。客服建议类 Agent 可以容忍低风险瑕疵，财务、医疗、权限操作类 Agent 必须更严格。

## Scorecard 输出格式

建议每次评测输出以下信息：

| 字段 | 含义 |
|---|---|
| eval_run_id | 本次评测 ID |
| app_version | 应用版本 |
| prompt_version | Prompt 版本 |
| model | 模型配置 |
| dataset_version | 评测集版本 |
| total_score | 总分 |
| dimension_scores | 各维度分数 |
| failed_cases | 失败样本列表 |
| regression_summary | 相比上个版本的变化 |
| release_decision | pass、warn、block |

这能让评测结果从“一个临时表格”变成可追踪的工程资产。

## 面试表达模板

我不会只用人工体验判断 Agent 效果，而是设计 Scorecard，把任务完成度、事实正确性、证据支撑、格式可解析、工具调用正确性、安全性、成本和延迟拆成独立维度。每个版本上线前跑 smoke、regression、adversarial 和 tool failure 样本，输出分维度得分和失败样本。这样可以定位退化来自 Prompt、RAG、工具还是模型配置。

## 常见误区

### 误区一：只看最终答案

Agent 系统的失败可能发生在检索、工具、状态、审批、格式和安全策略上。只看最终答案会掩盖过程问题。

### 误区二：Judge 分数就是绝对真理

Judge 需要 Rubric、样例、人工校准和漂移监控。否则不同模型、不同提示词下的分数可能不可比。

### 误区三：评测集永远不变

评测集要版本化，也要持续吸收线上失败样本和人工修正。但新增样本时要标注来源和风险，避免训练集、评测集和线上样本混乱。
