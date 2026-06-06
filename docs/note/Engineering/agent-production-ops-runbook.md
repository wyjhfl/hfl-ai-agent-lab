# Agent 生产运维 Runbook：上线后每天看什么、出事怎么查

## 这篇文章解决什么问题

很多 Agent 项目上线前有 Demo、README、部署脚本，但上线后缺少运维 Runbook。结果一出问题就只能问：

- 是模型挂了，还是向量库慢了？
- 是 Prompt 改坏了，还是用户问题变了？
- 是工具权限拦截，还是外部 API 失败？
- 是成本突然上涨，还是重试风暴？
- 是个别用户问题，还是全局事故？

生产运维 Runbook 的目标是让团队知道：平时看哪些指标，报警后先查什么，如何止损、定位、恢复和复盘。

## Agent 系统 SLO

建议至少定义：

| SLO | 示例 |
|---|---|
| 可用性 | 99% 请求能返回非 5xx |
| 延迟 | RAG 问答 p95 < 8s |
| 成本 | 单次成功任务成本 < 预算阈值 |
| 质量 | 核心评测集通过率 > 95% |
| 安全 | 高风险工具未审批执行次数 = 0 |
| 检索 | 有答案问题 top_k 召回率 > 目标值 |
| 结构化输出 | schema pass rate > 98% |
| 任务恢复 | stale running 任务可在 N 分钟内回收 |

SLO 要按 task_type 分开看。聊天、RAG、工具调用、长任务不能混在一起平均。

## 每日巡检清单

- 昨日请求量、成功率、错误率。
- p50 / p95 / p99 延迟。
- Token 和成本趋势。
- 模型 fallback 和 retry 发生率。
- Top error_type。
- Top negative feedback task。
- RAG 无答案率和引用投诉率。
- 工具调用失败率和审批拒绝率。
- 评测集最新通过率。
- 新增线上失败样本是否进入 triage。

## 报警分级

| 等级 | 例子 | 处理 |
|---|---|---|
| P0 | 大量请求失败、高风险工具越权执行 | 立即止血，必要时关闭工具或切只读模式 |
| P1 | p95 延迟大幅上涨、模型全局限流 | 切备用模型、降级、扩容 |
| P2 | 某类任务质量下降 | 回滚 Prompt / 模型策略，补评测 |
| P3 | 负反馈上升、个别工具失败 | 排查并加入迭代队列 |

## 事故排查路径

### 1. 请求失败率升高

先查：

- API 5xx 是否上升。
- 模型 provider 是否超时或限流。
- 数据库 / Redis / 向量库是否不可用。
- 最近是否发布过 Prompt、模型路由、代码。
- retry 是否放大流量。

止损：

- 启用备用 provider。
- 降低 top_k 或关闭 rerank。
- 暂停低优先级批任务。
- 对高成本任务限流。

### 2. 成本突然上涨

先查：

- 请求量是否上涨。
- input_tokens / output_tokens 是否上涨。
- Prompt 版本是否变长。
- RAG context 是否塞入过多 chunk。
- retry / fallback 是否增加。
- 是否有异常用户或脚本刷接口。

止损：

- 限流异常用户。
- 降低 max_tokens。
- 缩小 context budget。
- 切低成本模型。
- 暂停批处理。

### 3. 质量突然下降

先查：

- Prompt version 是否变更。
- model/router policy 是否变更。
- 知识库是否更新。
- 检索结果是否变化。
- eval dataset 是否新增难样本。
- 负反馈集中在哪些 failure_type。

止损：

- 回滚 Prompt。
- 回滚模型路由。
- 暂停问题知识库更新。
- 对高风险回答要求引用或拒答。

### 4. 工具调用异常

先查：

- tool_call error_type。
- 参数 schema 失败率。
- 权限拦截次数。
- 外部 API 状态。
- 是否有 Prompt Injection 样本。
- 高风险工具是否绕过审批。

止损：

- 将工具切只读。
- 提高审批等级。
- 禁用异常工具。
- 回滚 MCP Server 版本。

### 5. 长任务卡住

先查：

- running task 数量。
- stale running 数量。
- worker heartbeat。
- queue depth。
- 当前 step 分布。
- 是否卡在 WAITING_APPROVAL。

止损：

- 回收 stale task。
- 扩 worker。
- 暂停新长任务。
- 从最近成功 step 续跑。

## 运行模式开关

生产系统建议预留开关：

| 开关 | 用途 |
|---|---|
| read_only_mode | 禁止写工具，只允许查询 |
| disable_high_risk_tools | 禁用高风险动作 |
| force_human_approval | 所有写操作进入审批 |
| fallback_model_only | 强制使用备用模型 |
| reduce_context_budget | 降低 token 消耗 |
| pause_batch_jobs | 暂停离线任务 |
| maintenance_banner | 前端提示维护状态 |

这些开关要在事故前设计好，不要等事故时临时改代码。

## 复盘模板

```text
事故时间：
影响范围：
用户影响：
触发条件：
根因：
为什么监控没有提前发现：
止血动作：
恢复动作：
长期修复：
需要补充的评测样本：
需要补充的 Runbook：
```

每次事故都应该转化为：

- 新监控指标。
- 新报警规则。
- 新评测样本。
- 新防护逻辑。
- 新文档。

## 面试表达模板

> 我会为 Agent 系统设计生产运维 Runbook，而不是只写部署文档。上线后按 task_type 监控可用性、p95 延迟、成本、schema pass rate、fallback rate、工具失败率、审批拒绝率和负反馈。事故排查会从 API、模型 provider、RAG、工具、数据库、队列和最近发布变更逐层定位。系统预留只读模式、禁用高风险工具、强制人审、降低上下文预算、暂停批任务等止血开关。每次事故复盘都要补监控、补评测样本和补 Runbook。

## 项目落地清单

- [ ] SLO 按 task_type 定义。
- [ ] 成本、延迟、质量、安全指标都有监控。
- [ ] error_type 标准化。
- [ ] 事故排查路径文档化。
- [ ] 有只读/禁用工具/暂停批任务开关。
- [ ] stale task 可回收。
- [ ] 复盘能转化为评测样本。
- [ ] Runbook 随系统迭代更新。

## 相关链接

- [日志与可观测性](/note/Engineering/observability)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [Agent 失败恢复与幂等设计](/note/Engineering/agent-failure-recovery)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [AI Agent 上线检查清单](/note/Engineering/production-checklist)
