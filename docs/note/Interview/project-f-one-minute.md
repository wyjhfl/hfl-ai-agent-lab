# Project F 一分钟介绍

## 版本一：作品集介绍

> Project F 是一个多模态文档智能与知识运营 Agent，解决的是企业文档进入 RAG 知识库之前的解析、抽取、脱敏、复核和入库质量问题。它不是简单把 PDF 切块进向量库，而是先做文档质量检测，然后按页选择 native parser、OCR 或 Vision LLM，再把标题、段落、表格、图片和脚注归一化成统一元素模型。结构化抽取会按照 schema 输出字段，并保存 page、bbox、source span 和 confidence。低置信字段进入人工复核，PII 会在入库前脱敏或打权限标签，最后通过 ingestion gate 检查引用覆盖、chunk 质量、ACL 和 freshness。这个项目能展示我对多模态文档解析、RAG 数据治理、安全合规和评测闭环的理解。

## 版本二：面试开场

> 我做 Project F 的原因是很多 RAG 项目的瓶颈其实在数据进入知识库之前。PDF、扫描件、表格、图片和合同条款如果解析错，后面检索和回答都会错。我的方案是把文档处理拆成 Intake、Parser Router、Layout Normalizer、Structured Extraction、PII Redaction、Human Review 和 Ingestion Gate。每个字段都能追溯到原文页码和 bbox，每个 chunk 都有 ACL、版本和引用信息。这样系统不是黑盒 PDF 问答，而是可复核、可审计、可评测的文档智能流水线。

## 30 秒版本

> Project F 是一个多模态文档智能项目，重点是把复杂 PDF、扫描件、表格和图片安全地变成可检索知识。它有解析路由、结构化抽取、引用坐标、PII 脱敏、人工复核和入库门禁，证明我不是只会做 RAG 问答，而是能把文档数据治理做到工程化。

## 简历 Bullet

- 设计多模态文档智能 Agent，将 PDF/扫描件/图片文档经过 OCR、Layout Parsing、Vision LLM、结构化抽取和人工复核后接入 RAG 知识库。
- 建立字段级 citation contract，保存 page、bbox、source span、confidence 和 parser version，支持结果复核、审计和回放。
- 设计 PII Redaction 与 Ingestion Gate，对敏感信息、ACL、引用覆盖、chunk 质量和 freshness 做入库前门禁。
- 构建 Parser / Extraction / Citation / PII / Retrieval 五层评测指标，降低文档解析与知识入库回归风险。

## 最适合强调的能力

- 多模态文档解析。
- RAG ingestion 工程。
- 结构化输出与 schema 约束。
- 引用与可追溯性。
- PII 脱敏和权限治理。
- Human-in-the-loop 复核。
- 评测驱动的知识库运营。
