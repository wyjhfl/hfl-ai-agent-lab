# OWASP LLM Top 10 for Agents：把大模型风险映射到 Agent 工程

## 这篇文章解决什么问题

OWASP LLM Top 10 总结了大模型应用常见风险，但在 Agent 项目里，这些风险会被工具调用、RAG、MCP、Memory、浏览器操作和多 Agent 放大。工程落地时不能只说“防 Prompt Injection”，而要把每类风险映射到具体控制点。

这篇文章把 LLM 风险转换成 Agent 系统设计检查清单。

## 风险映射

| LLM 风险 | Agent 中的表现 | 工程控制 |
|---|---|---|
| Prompt Injection | RAG 文档、网页、工具返回诱导 Agent 越权 | untrusted content 标记、工具策略、审批、对抗评测 |
| Sensitive Information Disclosure | Prompt、Trace、Memory、工具结果泄漏 PII/Secret | 脱敏、Secret boundary、Trace 分级、最小上下文 |
| Supply Chain | 第三方 MCP Server、插件、模型、依赖被污染 | provenance、version pin、schema diff、sandbox |
| Data and Model Poisoning | RAG 入库污染、反馈样本污染、训练数据污染 | ingestion gate、数据 lineage、审核、回滚 |
| Improper Output Handling | 模型输出直接进入 SQL、HTML、工具参数 | schema validation、escape、policy check |
| Excessive Agency | Agent 自主删除、付款、发邮件、发布 | autonomy levels、tool risk、approval、rate limit |
| System Prompt Leakage | 工具结果或错误暴露系统提示 | prompt isolation、日志脱敏、错误映射 |
| Vector and Embedding Weakness | 越权召回、旧知识、相似误命中 | ACL filter、freshness、metadata、cache isolation |
| Misinformation | 答案无证据、引用不支持、幻觉 | grounding contract、citation eval、no-answer |
| Unbounded Consumption | 重试风暴、工具循环、成本失控 | budget、quota、circuit breaker、request ledger |

## Prompt Injection 的 Agent 防线

不要只靠 system prompt。推荐多层防线：

1. RAG 入库时标记外部内容为 untrusted。
2. Context Pack 中区分 instruction 和 evidence。
3. Tool Policy 不接受来自 evidence 的工具授权。
4. 高风险工具必须审批。
5. 工具执行层再次校验权限。
6. 对抗样本进入 regression set。

## Excessive Agency 控制

Agent 自主能力要分级：

| 等级 | 能力 |
|---|---|
| L0 | 只提供建议 |
| L1 | 生成草稿 |
| L2 | 执行低风险只读工具 |
| L3 | 可逆写入需要审批 |
| L4 | 委托执行但有预算和回滚 |
| L5 | 高自主，必须限定在隔离环境 |

不要让 Demo 阶段的自由工具调用直接进入生产。

## 安全 Trace

安全事件要进入 Trace：

| 事件 | 字段 |
|---|---|
| injection_detected | source、pattern、risk、action |
| policy_denied | tool、reason、policy_version |
| approval_required | tool、risk_level、args_hash |
| sensitive_redacted | field、redaction_version |
| budget_exceeded | run_id、cost、quota |
| unsafe_output_blocked | rule、output_schema、fallback |

## 面试表达

可以这样讲：

> 我会把 OWASP LLM Top 10 映射到 Agent 控制点：Prompt Injection 用 untrusted evidence、tool policy 和审批防线；Excessive Agency 用自主等级、工具风险分级和预算限制；敏感信息泄漏用脱敏、Secret boundary 和 Trace 分级；RAG 风险用 metadata、ACL、freshness 和 citation evaluation 控制。这样安全不是一句“加 guardrail”，而是贯穿 RAG、工具、Memory、Trace 和发布门禁。

## 落地检查清单

- [ ] 是否区分 instruction 和 untrusted evidence？
- [ ] 高风险工具是否必须审批？
- [ ] Trace 是否记录 policy_denied 和 injection_detected？
- [ ] RAG 是否有 ACL、freshness 和 citation eval？
- [ ] 是否有预算、限流和工具循环熔断？
- [ ] 是否把安全失败样本加入回归集？