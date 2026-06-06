# LLM Output Safety Filter：大模型输出安全过滤怎么做

## 这篇文章解决什么问题

很多系统只在输入侧做安全检查，却忽略输出侧。模型可能输出 PII、错误引用、越权内容、危险操作建议、未审批工具结果、内部调试信息或不符合业务格式的内容。输出安全过滤的目标不是简单“敏感词替换”，而是在答案交付给用户前做最后一道策略校验。

## 输出风险类型

| 风险 | 例子 |
|---|---|
| PII 泄漏 | 电话、身份证、邮箱、客户信息 |
| 越权内容 | 引用了用户无权限文档 |
| 危险建议 | 引导执行高风险命令或绕过审批 |
| 未证实断言 | RAG claim 无引用支持 |
| 内部信息泄漏 | Prompt、debug trace、secret、系统路径 |
| 格式不合规 | JSON schema 错误、字段缺失 |
| 品牌/合规风险 | 不符合产品语气或合规要求 |

## 过滤层级

1. Schema validation：结构是否可解析；
2. Citation validation：引用是否支持、可见、有效；
3. PII / Secret scan：敏感信息是否泄漏；
4. Policy check：是否违反工具、安全、业务策略；
5. Grounding check：关键 claim 是否有证据；
6. Tone / Compliance check：是否符合产品和合规要求；
7. Fallback：拒答、重写、人工接管或请求澄清。

## 处理动作

| 检查结果 | 动作 |
|---|---|
| schema invalid | 修复或重试，仍失败则返回结构化错误 |
| citation invalid | 删除无证据 claim 或进入 no-answer |
| pii detected | mask、tokenize、删除或人工审核 |
| dangerous content | 阻断并解释安全原因 |
| permission violation | 拒答并记录 policy hit |
| low confidence | 降级为不确定回答或转人工 |

## 面试表达模板

> 我会在输出前做 safety filter，不只是输入过滤。输出要经过 schema、citation、PII、policy、grounding 和 compliance 检查。比如 RAG 答案里的关键 claim 必须有可见且有效的 citation 支持；如果发现越权引用、PII 或危险建议，就会重写、拒答或进入人工接管。

## 常见误区

### 误区一：输入安全就够了

模型可能在输出阶段拼接工具结果、RAG 证据或记忆内容，仍然可能泄漏。

### 误区二：输出过滤只做敏感词

输出安全还包括权限、证据、格式、工具审批和合规语气。

### 误区三：过滤后不记录原因

每次过滤都应该记录 policy_hit、redaction_version 和处理动作，便于评测和复盘。

## 相关链接

- [PII 脱敏策略](/note/Engineering/pii-redaction-for-llm)
- [RAG Grounding Contract](/note/Engineering/rag-grounding-contract)
- [Prompt Injection 纵深防御](/note/Engineering/prompt-injection-defense-in-depth)
- [Structured Output 工程化](/note/Engineering/structured-output-engineering)
- [Agent 审计日志设计](/note/Engineering/agent-audit-log-design)
