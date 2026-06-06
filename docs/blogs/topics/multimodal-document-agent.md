# 多模态文档理解 Agent：PDF、图片、表格和结构化抽取

## 这篇文章解决什么问题

很多真实业务文档不是纯文本：

- 扫描 PDF。
- 发票和合同。
- 设备维修单。
- 截图。
- 表格。
- 图纸。
- 图片中的文字和布局。

如果只做文本 RAG，会丢失版面、表格、图片和视觉线索。多模态文档理解 Agent 的目标是把这些复杂文档转成可检索、可引用、可抽取、可审核的结构化信息。

## 核心链路

```text
文件上传
  ↓
页面解析
  ↓
OCR / Vision Understanding
  ↓
版面和表格抽取
  ↓
结构化 JSON
  ↓
索引和检索
  ↓
Agent 问答 / 审核 / 工单生成
```

关键是不要把整份 PDF 一次性丢给模型，而是拆成可追踪的页面、区域、表格和字段。

## 适合场景

- 发票报销审核。
- 合同条款抽取。
- 设备维修单录入。
- 医疗/保险资料初审。
- 论文图表理解。
- 工业图纸辅助问答。
- 截图问题诊断。

## 数据模型

建议把文档拆成：

```json
{
  "document_id": "doc_001",
  "pages": [
    {
      "page": 1,
      "blocks": [
        {
          "type": "table",
          "bbox": [10, 20, 500, 300],
          "text": "...",
          "json": {},
          "confidence": 0.91
        }
      ]
    }
  ]
}
```

这样可以支持：

- 页面级引用。
- 区域级定位。
- 表格级抽取。
- 人工复核。

## 多模态 Agent 的难点

### 1. OCR 错误

扫描件、倾斜图片、低清截图都可能导致识别错误。需要：

- 置信度。
- 人工复核。
- 原图定位。
- 多次识别对比。

### 2. 表格结构

表格不是普通文本。需要保留：

- 行列结构。
- 表头。
- 合并单元格。
- 单位。
- 脚注。

### 3. 引用定位

回答必须能说明来自哪一页、哪一区域。

引用格式可以是：

```text
doc_001#page=3&block=table_2
```

### 4. 结构化输出

合同、发票、工单等任务需要稳定 JSON：

```json
{
  "vendor": "示例公司",
  "amount": 12800,
  "date": "2026-06-06",
  "risk_flags": ["金额大于审批阈值"]
}
```

结构化输出必须有 schema 校验。

## 和 RAG 的关系

多模态文档理解不是替代 RAG，而是增强 RAG 的文档处理阶段。

```text
普通 RAG：文本 -> Chunk -> Embedding -> 检索
多模态 RAG：页面/图像/表格 -> 结构化块 -> Embedding + metadata -> 检索
```

metadata 很重要：

- page。
- block_type。
- bbox。
- table_id。
- confidence。
- source_file。
- permission_scope。

## Agent 可以做什么

在多模态文档基础上，Agent 可以：

- 回答文档问题。
- 抽取字段。
- 比对两份合同差异。
- 发现风险条款。
- 生成工单草稿。
- 请求人工复核低置信字段。
- 把结构化数据写入业务系统。

高风险写入仍然需要审批。

## 评测方式

多模态文档 Agent 不能只看最终回答。要评测：

- OCR 准确率。
- 字段抽取准确率。
- 表格结构还原率。
- 引用定位准确率。
- 低置信度召回率。
- 人工复核修改率。

失败样本要记录原始文件、页面、区域、错误字段和修复版本。

## 面试表达

可以这样讲多模态文档 Agent：

> 我会把多模态文档理解拆成文档解析、页面级处理、OCR/视觉理解、版面块抽取、结构化 JSON、索引检索和 Agent 问答。重点不是把 PDF 一次性丢给模型，而是保留 page、block、bbox、confidence 和 source metadata。这样回答时能引用到具体页面和区域，字段抽取能做 schema 校验，低置信度字段可以进入人工复核。对于发票、合同、维修单这类业务文档，最终目标不是聊天，而是可审计的结构化数据和业务动作。

## 相关链接

- [RAG 工程化](/note/Engineering/rag-engineering)
- [向量数据库](/note/Engineering/vector-database)
- [Context Engineering](/note/AI-Agent/context-engineering)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [AI Agent 项目选题库](/topics/ai-agent-project-ideas)

## 参考资料

- [OpenAI Vision guide](https://platform.openai.com/docs/guides/images-vision)
- [OpenAI File inputs](https://platform.openai.com/docs/guides/pdf-files)

