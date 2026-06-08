# Project F 深挖问答

## Q1：为什么不直接把 PDF 切块进向量库？

因为企业文档常常有扫描页、表格、页眉页脚、脚注、图片、跨页段落和敏感信息。直接切块会带来 4 个问题：

1. 结构丢失：表格和图注被拆碎。
2. 引用缺失：回答无法回到页码和原文位置。
3. 安全风险：PII 或私密合同内容进入明文索引。
4. 运营困难：文档更新后不知道哪些 chunk 失效。

所以 Project F 在向量化之前增加解析、抽取、脱敏、复核和入库门禁。

## Q2：OCR、传统 parser 和 Vision LLM 怎么选择？

我会设计 Parser Router：

- 原生 PDF 或 Office 文档优先用 native parser，成本低、速度快。
- 扫描件和图片走 OCR。
- 复杂图表、截图、跨页表格或 OCR 低置信页面走 Vision LLM。
- 对关键字段低置信的页面进入人工复核。

这个选择不是技术炫技，而是为了平衡准确率、延迟、成本和可解释性。

## Q3：如何避免模型抽取不存在的字段？

三层约束：

1. 用 Structured Outputs / JSON Schema 限定字段结构。
2. 每个字段必须附带 citation：page、bbox、source span。
3. schema 校验和 citation 校验失败时不允许入库，只能重试或人工复核。

也就是说，字段不是“模型说有就有”，而是必须能回到原文证据。

## Q4：引用 bbox 有什么价值？

bbox 让系统能从字段或回答反向定位到原始页面区域。它的价值是：

- 业务复核员可以快速验证。
- 评测可以判断引用是否覆盖 gold span。
- 审计时能说明答案来自哪里。
- 文档重新解析后可以比较位置和内容变化。

在合同、票据和合规场景里，只有文字引用不够，最好有页码和页面坐标。

## Q5：如何处理 PII？

PII 处理前置到 ingestion：

1. 在元素和字段层识别手机号、身份证、邮箱、地址、银行卡、税号等。
2. 默认 mask 或 tokenize。
3. 对敏感字段设置 field_acl。
4. 未通过隐私策略的 chunk 阻断入库。
5. 任何查看原文敏感字段的行为都写 audit log。

问答时先按 ACL 过滤，再检索，不能把越权内容交给模型后再要求它不要输出。

## Q6：如何评测这个系统？

不只评估最终问答，而是拆成五层：

- Parser Eval：版面元素识别 F1。
- Extraction Eval：字段 exact match 和数值一致性。
- Citation Eval：引用页码和 bbox 是否正确。
- PII Eval：PII recall 和误报率。
- RAG Eval：Retrieval Hit@5、回答引用覆盖、grounded answer rate。

这样可以定位错误发生在哪一层，而不是只看到“问答错了”。

## Q7：如果解析器升级，怎么防止回归？

我会保留 parser version，并建立回归数据集。每次升级前：

1. 固定一批合同、票据、手册、研报和 adversarial 文档。
2. 比较元素识别、字段抽取、引用、PII 和检索指标。
3. 对差异样本生成报告。
4. 不满足 release gate 的版本不能上线。
5. 已上线文档可按版本重解析和回滚。

## Q8：这个项目和普通 RAG 项目有什么区别？

普通 RAG 重点在 chunking、embedding、retrieval 和 generation。Project F 重点在 RAG 之前的 data readiness：

- 文档能不能被正确理解。
- 字段能不能结构化输出。
- 结果能不能追溯到证据。
- 敏感信息能不能被治理。
- 入库数据能不能被评测和运营。

所以它更像“RAG ingestion + document intelligence + knowledge ops”项目。

## Q9：面试官问你具体负责什么，怎么答？

可以这样说：

> 我负责整体架构和核心链路设计，包括 Parser Router、统一元素模型、字段级 citation contract、PII redaction gate、人工复核流程和 ingestion eval 指标。我重点把文档解析结果从一次性文本变成可追溯、可复核、可评测的知识资产。

## Q10：最大的技术难点是什么？

最大难点是“多模态解析结果的一致性”。不同解析器输出结构不同，有的给文本，有的给 bbox，有的给表格 markdown，有的给图片描述。解决方式是设计统一元素模型，并把 page、bbox、type、confidence、parser、source_hash 作为公共字段。后续抽取、复核、chunking 和评测都基于这个模型。
