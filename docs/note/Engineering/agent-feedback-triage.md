# Agent Feedback Triage：用户反馈怎么分诊成迭代任务

## 这篇文章解决什么问题

用户点踩一句“答案不好”并不能直接指导优化。需要把反馈和 run_id、Trace、RAG 证据、工具调用、模型版本、Prompt 版本、成本延迟、用户场景关联起来，再分诊为产品问题、检索问题、工具问题、模型问题、安全问题或数据问题。

Agent Feedback Triage 的目标是把线上反馈从情绪信号变成可执行的工程迭代任务。

## 反馈字段

| 字段 | 说明 |
|---|---|
| feedback_id | 反馈 ID |
| run_id / step_id | 关联执行轨迹 |
| user_rating | 点赞、点踩、星级 |
| reason_code | 不准确、无引用、太慢、越权、格式错等 |
| user_comment | 用户补充说明 |
| expected_answer | 用户或运营给出的期望答案 |
| trace_snapshot | Prompt、RAG、工具、模型版本 |
| severity | P0-P3 |
| owner | 处理负责人 |
| triage_result | 归因和动作 |

## 分诊类别

| 类别 | 例子 | 动作 |
|---|---|---|
| retrieval_issue | 没召回正确文档 | 调整入库、query rewrite、rerank、metadata |
| grounding_issue | 引用不支持答案 | 更新 grounding contract 和 citation eval |
| freshness_issue | 用了旧知识 | 检查 index_version、cache、effective time |
| tool_issue | 工具参数错或失败 | Tool Replay、schema 修复、错误映射 |
| prompt_issue | 格式或语气不对 | Prompt regression 和版本修复 |
| model_issue | 模型推理或遵循差 | 路由、canary、provider failover |
| safety_issue | 越权、PII、危险建议 | 进入安全队列和红队回归 |
| product_issue | 用户预期和功能不匹配 | 更新 PRD、UI、引导和范围 |

## Triage 流程

1. 收集反馈并绑定 run_id；
2. 自动拉取 trace snapshot；
3. 初步分类 reason_code；
4. 人工或 LLM-as-Judge 辅助归因；
5. 标注 severity 和 owner；
6. 转化为 eval case、bug、产品需求或文档任务；
7. 修复后回放 run，并更新 regression set。

## 面试表达模板

> 我不会只统计点赞点踩，而是把用户反馈绑定 run_id 和 Trace。每条负反馈会分诊为检索、grounding、freshness、工具、Prompt、模型、安全或产品问题，并转成 eval case、bug 或 PRD 任务。修复后通过 Run Replay 和 regression set 验证，形成反馈闭环。

## 常见误区

### 误区一：点踩率下降就说明系统变好

点踩率受用户量、入口和预期影响，必须结合任务类型和 Trace 归因。

### 误区二：所有负反馈都改 Prompt

很多问题来自知识库、权限、工具、产品范围或用户引导，不是 Prompt 能解决的。

### 误区三：反馈不进入评测集

高质量反馈应该转成 regression case，否则问题容易反复出现。

## 相关链接

- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Agent Run Replay](/note/Engineering/agent-run-replay)
- [Eval Case Lifecycle](/note/Engineering/eval-case-lifecycle)
- [RAG Grounding Contract](/note/Engineering/rag-grounding-contract)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
