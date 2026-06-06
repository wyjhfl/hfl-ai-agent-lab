# RAG Grounding Contract：RAG 答案可信契约怎么设计

## 这篇文章解决什么问题

RAG 系统经常要求“答案必须基于引用”，但这句话太模糊。什么叫基于引用？引用覆盖哪些断言？无证据时是否拒答？引用是否有权限？过期文档能不能引用？模型能不能用常识补充？

RAG Grounding Contract 的目标是把“基于知识回答”变成明确的输入输出契约和可测试断言。

## Contract 包含什么

| 契约项 | 说明 |
|---|---|
| evidence_required | 哪些问题必须有证据才能回答 |
| claim_to_citation | 每个关键事实是否需要 citation 支撑 |
| no_answer_policy | 无证据、证据冲突、权限不足时如何拒答 |
| citation_visibility | citation 是否对当前用户可见 |
| freshness_rule | 是否必须使用 active 且有效期内文档 |
| allowed_knowledge | 是否允许模型使用通用常识 |
| forbidden_behavior | 不得编造来源、不得引用无关片段 |
| output_schema | 答案、引用、置信度、缺口说明的结构 |

## 输出结构建议

| 字段 | 含义 |
|---|---|
| answer | 最终回答 |
| claims | 关键事实列表 |
| citations | 每个 claim 对应的 doc_id、chunk_id、version |
| confidence | 高/中/低或分数 |
| missing_evidence | 缺失证据说明 |
| no_answer_reason | 无法回答原因 |
| policy_checks | 权限、freshness、PII、安全检查结果 |

## Claim 级别引用

不要只在答案末尾放几个来源链接。更好的方式是：

- 抽取关键 claim；
- 每个 claim 绑定 citation；
- 校验 citation 是否支持 claim；
- 校验 citation 是否可见、有效、未过期；
- 对无法支持的 claim 降级、删除或标注不确定。

## No-answer 场景

| 场景 | 应答 |
|---|---|
| 没有召回证据 | 明确说没有找到依据，而不是猜测 |
| 证据冲突 | 说明冲突并请求确认或展示差异 |
| 权限不足 | 拒绝透露内容，并说明权限不足 |
| 文档过期 | 不使用过期文档，提示需要最新资料 |
| 问题超出知识库 | 说明知识库不覆盖，必要时给通用建议但标注非引用 |

## 评测断言

| 断言 | 检查 |
|---|---|
| citation_coverage | 关键 claim 是否都有引用 |
| citation_support | 引用是否真的支持 claim |
| citation_permission | 当前用户是否能访问引用 |
| citation_freshness | 引用文档是否 active 且有效 |
| no_answer_correctness | 无证据时是否拒答 |
| unsupported_claim_rate | 无引用或引用不支持的断言比例 |

## 面试表达模板

> 我会把 RAG 的 grounding 做成契约，而不是只要求“带引用”。每个关键 claim 都要绑定 citation，并校验 citation 的支持度、权限和 freshness。无证据、证据冲突、权限不足或文档过期时，系统必须进入 no-answer policy，而不是让模型猜测。

## 常见误区

### 误区一：答案后面有链接就等于可信

链接可能不支持答案，也可能不可见、过期或只是语义相关。

### 误区二：所有问题都强制引用

有些通用解释可以不引用，但必须标注哪些内容来自知识库，哪些是通用说明。

### 误区三：只用 Prompt 约束 Grounding

Grounding 需要检索、citation、权限、freshness 和评测断言共同保证。

## 相关链接

- [RAG Citation Evaluation](/note/Engineering/rag-citation-evaluation)
- [RAG Freshness Evaluation](/note/Engineering/rag-freshness-evaluation)
- [RAG 权限过滤](/note/Engineering/rag-permission-filtering)
- [RAG 评测报告模板](/note/Engineering/rag-evaluation-report-template)
- [Prompt Regression Testing](/note/Engineering/prompt-regression-testing)
