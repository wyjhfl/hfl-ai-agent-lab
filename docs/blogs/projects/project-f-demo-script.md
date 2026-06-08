# Project F Demo 验收脚本

> 目标：用 6 分钟把 Project F 讲成一个“可验证的文档智能系统”，而不是普通 PDF 问答。

## Demo 准备

准备 3 份样例文档：

1. 合同 PDF：包含生效日期、金额、续约条款、手机号。
2. 扫描发票或报销单：包含表格和税号。
3. 设备手册：包含图片、步骤、型号和故障码。

准备 4 个展示页面：

- [项目主入口](/projects/project-f-multimodal-document-agent)
- [架构设计](/projects/project-f-architecture)
- [Document Review Console UI](/projects/project-f-document-review-console-ui)
- [Ingestion Eval Plan](/projects/project-f-ingestion-eval-plan)

## 6 分钟演示节奏

### 0:00 - 0:40 业务问题

话术：

> 普通 RAG Demo 通常直接把 PDF 切块进向量库，但真实企业文档里有扫描页、表格、图片、PII、权限和版本。如果入库前不治理，后面问答再强也会引用错、答错或泄露数据。

### 0:40 - 1:40 上传与解析路由

展示：

- 文档上传队列。
- 每页 parser strategy：native / OCR / VLM / mixed。
- 解析质量分数。

强调：

> 我不是所有页面都用 VLM，而是按文档质量路由。这样能平衡准确率、延迟和成本。

### 1:40 - 2:50 字段抽取与引用

展示：

- 字段面板：effective_date、total_amount、risk_flags。
- 点击字段反向定位 page + bbox。
- 低置信字段黄色提醒。

强调：

> 每个字段都保存 value、confidence、page、bbox、source span 和 parser version。这个引用契约让结果能被复核和审计。

### 2:50 - 3:50 PII 脱敏与权限

展示：

- 手机号或税号被识别为 PII。
- 默认 mask。
- 入库前 Gate 阻断未审批 PII。

强调：

> 文档智能不能只追求抽取更多信息，还要保证不把敏感信息明文塞进向量库。

### 3:50 - 4:50 入库门禁

展示：

- Citation Coverage。
- Chunk Quality。
- ACL Tag。
- Blocking Issues。

强调：

> 只有通过 gate 的 chunk 才能进入知识库。失败原因会明确显示，方便运营修复。

### 4:50 - 5:40 Grounded QA

演示问题：

> 这份合同什么时候生效？是否存在自动续约或责任上限风险？

期望回答：

- 返回结论。
- 附带页码和引用片段。
- 对低置信项标注“不确定，需要人工复核”。

### 5:40 - 6:00 评测闭环

展示：

- Parser Eval。
- Field Exact Match。
- Citation Accuracy。
- PII Recall。
- Retrieval Hit@5。

结尾话术：

> Project F 的核心价值是把文档进入知识库的过程变成可观察、可复核、可评测、可治理的工程流水线。

## 验收清单

| 验收点 | 通过标准 |
|---|---|
| 解析路由 | 不同页面能显示不同 parser strategy |
| 字段抽取 | 字段通过 schema 校验 |
| 引用定位 | 字段能反向定位到页码和 bbox |
| PII 处理 | 手机号/税号等敏感信息被 mask |
| Gate 阻断 | 未处理 PII 或引用缺失时不能入库 |
| 复核闭环 | 低置信字段可被人工接受、修改或重解析 |
| 评测报告 | 能显示至少 5 个质量指标 |

## 面试追问准备

- 如果 OCR 和 VLM 结果冲突怎么办？
- 如何避免模型凭空抽取不存在字段？
- 如何保证引用 bbox 正确？
- 如何处理跨页表格？
- 向量库里是否存明文 PII？
- 解析器升级后如何防止回归？
