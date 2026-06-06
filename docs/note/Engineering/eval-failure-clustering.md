# Eval Failure Clustering：评测失败样本怎么聚类成迭代方向

## 这篇文章解决什么问题

跑完评测后，如果只看到通过率下降，很难知道下一步该改 Prompt、RAG、工具、模型、UI 还是数据。真正有价值的是把失败样本聚类，找出高频失败模式，并把它们转成可执行迭代任务。

Eval Failure Clustering 的目标是把一堆失败 case 变成原因清楚、优先级明确、owner 明确的改进 backlog。

## 失败样本需要记录什么

| 字段 | 说明 |
|---|---|
| eval_case_id | 评测样本 ID |
| run_id | 对应执行记录 |
| task_type | RAG、tool、workflow、memory、safety |
| expected_behavior | 期望行为 |
| actual_output | 实际输出摘要 |
| failed_assertions | 失败断言 |
| prompt_version | Prompt 版本 |
| model_version | 模型版本 |
| knowledge_version | RAG 知识版本 |
| tool_versions | 工具版本 |
| latency / cost | 成本和延迟 |
| user_segment | 租户、角色、场景分桶 |

## 聚类维度

| 维度 | 示例 |
|---|---|
| 输入问题 | 模糊问题、长问题、多意图、越权问题 |
| RAG 链路 | 未召回、召回旧文档、引用不支持、权限过滤错误 |
| 输出格式 | JSON 不合法、字段缺失、引用格式错 |
| 工具调用 | 工具选错、参数错、重试失败、审批缺失 |
| 安全 | prompt injection、PII 泄漏、越权回答 |
| 成本延迟 | token 过高、重试风暴、工具超时 |
| 产品体验 | 用户不知道下一步、错误提示不可行动 |

## 聚类流程

1. 收集失败 case 和 Trace。
2. 给每个失败打初始标签：retrieval、generation、tool、policy、format、ops、ux。
3. 按相同根因合并成 cluster。
4. 统计 cluster 的频次、影响用户、成本和严重度。
5. 为每个 cluster 指定修复动作和 owner。
6. 修复后把 cluster 里的代表样本加入 regression set。

## Cluster 优先级

| 指标 | 说明 |
|---|---|
| frequency | 出现频率 |
| severity | 是否影响安全、权限、财务或核心任务 |
| business_impact | 影响多少真实用户或关键流程 |
| fix_cost | 修复成本 |
| regression_value | 是否能沉淀成长期回归样本 |

高优先级不一定是出现最多的，而是高风险、高影响、可复现、可转成回归资产的失败。

## 输出模板

| 字段 | 示例 |
|---|---|
| cluster_id | rag_permission_leak_001 |
| title | 权限过滤后 citation 仍暴露旧文档标题 |
| root_cause | citation pack 使用过滤前结果 |
| affected_cases | 12 |
| severity | high |
| owner | RAG backend |
| fix_plan | citation 生成改用 filtered chunks |
| regression_cases | 3 个代表样本 |

## 面试表达

可以这样讲：

> 我不会只看 eval pass rate，而是把失败样本按根因聚类。比如把 RAG 失败拆成未召回、旧知识、引用不支持、权限过滤错误，把工具失败拆成选错工具、参数错误、审批缺失。每个 cluster 都会有频次、严重度、owner、修复计划和回归样本，这样评测才能真正驱动迭代。

## 常见坑

- 只汇报平均分，不看失败分布。
- 失败样本没有 run_id，无法复盘。
- 聚类标签太抽象，比如全部写成“模型幻觉”。
- 修复后没有加入 regression set。
- 没有区分质量问题和安全问题。

## 落地检查清单

- [ ] 每个失败 case 是否能关联 Trace？
- [ ] 是否有统一失败标签体系？
- [ ] 是否按 cluster 输出频次和严重度？
- [ ] 每个 cluster 是否有 owner 和修复动作？
- [ ] 修复后是否进入回归集？
