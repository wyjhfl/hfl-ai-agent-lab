# RAG Citation Evaluation：引用不是装饰，而是可信答案的证据链

## 这篇文章解决什么问题

很多 RAG Demo 会在答案后面附几个来源链接，看起来像“有引用”。但生产级 RAG 不能只要求“有引用”，而要验证引用是否真的支持答案中的关键结论。否则系统会出现引用错位、引用无关、引用过期、引用越权和“看起来很可信的幻觉”。

RAG Citation Evaluation 的目标是把引用从 UI 装饰变成可评测证据链：答案中的每个关键事实，都能回到文档、chunk、页码、段落和权限范围。

## 引用常见失败类型

| 失败类型 | 表现 | 风险 |
|---|---|---|
| Missing Citation | 答案有关键事实但没有引用 | 用户无法验证 |
| Irrelevant Citation | 引用和结论无关 | 伪可信 |
| Partial Support | 引用只支持部分结论 | 细节错误难发现 |
| Contradictory Citation | 引用内容和答案矛盾 | 高风险错误 |
| Stale Citation | 引用来自旧版本文档 | 版本错误 |
| Permission Leak | 引用用户无权限文档 | 数据泄漏 |
| Over-citation | 每句话都挂引用但无重点 | 体验差，评测难 |

RAG 的引用评测不只是评答案，还要评“答案和证据之间的关系”。

## Citation Evaluation 的基本对象

建议把引用拆成结构化对象，而不是只保存一段 URL。

| 字段 | 说明 |
|---|---|
| citation_id | 引用 ID |
| answer_span | 答案中被引用支持的文本片段 |
| document_id | 文档 ID |
| chunk_id | chunk ID |
| page | 页码或位置 |
| quote_span | 原文证据片段 |
| score | 检索或 rerank 分数 |
| permission_scope | 权限范围 |
| document_version | 文档版本 |
| support_label | support、partial、contradict、irrelevant |

有了结构化引用，才能做自动评测、人工抽检和回归测试。

## 评测维度

| 维度 | 检查问题 |
|---|---|
| Coverage | 答案中的关键事实是否都有引用？ |
| Faithfulness | 引用是否支持答案内容？ |
| Granularity | 引用是否足够精确到段落、页码或 chunk？ |
| Freshness | 引用是否来自最新有效版本？ |
| Permission | 引用是否在用户权限范围内？ |
| No-answer | 证据不足时是否拒答而不是编造？ |
| Traceability | 是否能从答案回溯到 retrieval trace？ |

其中 Faithfulness 是最重要的维度：引用存在不代表引用有效。

## 样本怎么构造

Citation Evaluation 需要专门样本，不要只复用普通问答样本。

| 样本类型 | 目的 |
|---|---|
| Direct Support | 答案直接来自单个 chunk |
| Multi-hop Support | 需要多个证据共同支持 |
| Conflicting Evidence | 文档之间存在冲突 |
| No Evidence | 知识库没有答案 |
| Stale Document | 旧版本和新版本答案不同 |
| Permission Boundary | 其他租户文档包含答案 |
| Table Evidence | 答案来自表格或列表 |
| Long Document | 证据分散在长文档中 |

表格、合同、财务、政策类文档尤其需要 citation evaluation，因为细节错误影响更大。

## 自动评测方法

可以组合三种方法：

1. 规则检查：答案是否包含 citation_id、document_id、chunk_id；引用是否在权限范围内；文档版本是否有效。
2. 文本匹配：答案关键实体、数字、日期是否能在证据中找到。
3. Judge 评测：让 Judge 判断 answer_span 是否被 quote_span 支持，输出 support / partial / contradict / irrelevant。

Judge Prompt 要让评测模型只判断“证据是否支持答案”，不要让它根据常识补全。

## 人工抽检清单

人工抽检时可以用下面清单：

- 答案中的数字、日期、实体是否都能在引用中找到。
- 引用是否来自用户有权限访问的文档。
- 引用是否是最新版本。
- 引用是否足够具体，不只是整个文档链接。
- 答案是否夸大了引用内容。
- 证据不足时是否明确说明不确定。

人工抽检样本要优先覆盖高风险问题、低置信度问题和线上投诉问题。

## 指标设计

| 指标 | 含义 |
|---|---|
| citation_coverage | 有关键事实被引用覆盖的比例 |
| citation_precision | 引用真正支持答案的比例 |
| unsupported_claim_rate | 无证据关键结论比例 |
| contradiction_rate | 引用和答案矛盾比例 |
| permission_violation_rate | 引用越权比例 |
| stale_citation_rate | 旧版本引用比例 |
| no_answer_correctness | 无证据时正确拒答比例 |

上线门禁中，permission_violation_rate 应该是 0；高风险业务中 contradiction_rate 也应该接近 0。

## 和 RAG Trace 的关系

Citation Evaluation 必须能回到 retrieval trace：

- query rewrite 生成了什么查询。
- top_k 召回了哪些 chunk。
- rerank 后排序如何变化。
- context pack 放入了哪些证据。
- 答案引用了哪些证据。
- 未引用但被放入上下文的噪声有哪些。

如果只有最终答案和最终链接，排查会非常困难。

## 面试表达模板

我不会把 RAG 引用当作 UI 装饰，而是会做 citation evaluation。答案中的关键事实要能映射到 document_id、chunk_id、page、quote_span 和 document_version。评测时检查引用覆盖率、引用准确率、无证据拒答、权限边界和旧版本引用。这样当 RAG 答错时，可以判断问题来自召回、rerank、上下文构建还是生成阶段。

## 常见误区

### 误区一：有链接就是有引用

链接可能指向无关文档。真正的引用要能支持答案中的具体结论。

### 误区二：引用越多越好

过多引用会降低可读性，也可能掩盖无关引用。关键事实精准引用更重要。

### 误区三：只看答案不看证据

RAG 的可信度来自证据链。答案文本流畅不代表答案可信。
