# LLM 数据治理：训练、评测、日志和隐私怎么管

## 这篇文章解决什么问题

大模型应用会产生大量数据：用户输入、模型输出、RAG 文档、工具参数、Trace、反馈、人工修正、评测样本、微调样本。如果没有治理，这些数据很容易出现隐私泄漏、权限混乱、样本污染、不可追溯和无法复用。

LLM 数据治理的目标是让数据可用、可控、可追溯、可删除、可评测。

## 数据类型地图

| 数据 | 用途 | 主要风险 |
|---|---|---|
| 用户输入 | 在线推理、问题理解 | 隐私、敏感信息 |
| 模型输出 | 展示、落库、反馈 | 幻觉、敏感输出 |
| RAG 文档 | 检索证据 | 权限、版权、文档注入 |
| Tool Args | 执行业务动作 | 越权、危险参数 |
| Trace | 调试、审计、评测 | 保存过多敏感内容 |
| Feedback | 改进、评测集构建 | 噪声、主观偏差 |
| Human Correction | 高质量训练/评测样本 | 标注一致性 |
| Eval Dataset | 回归和发布门禁 | 数据泄漏、过拟合 |
| Fine-tuning Data | 行为训练 | 脱敏、版权、质量 |

## 数据分级

| 等级 | 示例 | 处理策略 |
|---|---|---|
| Public | 公开文档、公开 FAQ | 可用于检索和评测 |
| Internal | 内部流程、项目文档 | 租户/团队内可见 |
| Confidential | 客户信息、业务数据 | 最小权限、脱敏、审计 |
| Secret | 密钥、token、凭证 | 不进入模型上下文，不入训练集 |
| Regulated | 身份证、医疗、财务 | 合规审批、强脱敏、保留周期 |

数据分级要进入 ingestion、trace、feedback 和 training pipeline。

## 数据生命周期

```text
collect → classify → filter → redact → store → use → audit → expire/delete
```

| 阶段 | 关键控制 |
|---|---|
| collect | 明确收集目的和用户授权 |
| classify | 自动/人工标记敏感级别 |
| filter | 排除 secret 和不允许用途数据 |
| redact | 脱敏或摘要化 |
| store | 加密、租户隔离、访问控制 |
| use | 区分推理、评测、训练用途 |
| audit | 记录谁使用了什么数据 |
| expire/delete | 保留周期和删除请求 |

## Trace 数据治理

Trace 很有价值，但也最容易保存过多敏感内容。建议：

- 原始输入按权限存储。
- 日志中保存摘要和 hash。
- Tool Args 只保存脱敏版本和 args_hash。
- Tool Result 保存 result_digest 和必要摘要。
- 高敏字段默认不进入 prompt snapshot。
- 对调试人员做 RBAC 和审计。

## 评测集治理

评测集不是随便收集聊天记录。每条 eval case 应该记录：

```text
case_id
source_run_id
task_type
dataset_version
data_classification
redaction_status
expected_behavior
rubric
owner
created_at
```

评测集要防止把测试答案泄漏到训练数据里，也要防止包含不该出域的数据。

## 训练数据治理

进入微调或偏好训练的数据必须经过：

- 去重。
- 脱敏。
- 质量筛选。
- 标注一致性检查。
- train/val/test 切分。
- 数据来源和授权记录。
- 可删除和可追溯机制。

## 面试表达

> 我会把 LLM 数据治理分成用户输入、模型输出、RAG 文档、工具参数、Trace、反馈、评测集和训练数据几类分别管理。每类数据都有 classification、purpose、retention、owner 和 access policy。Secret 不进入模型上下文，Confidential 数据要脱敏和租户隔离。Trace 中尽量保存摘要、hash 和 result_digest，而不是裸敏感数据。评测集和训练集要记录 source_run_id、dataset_version、redaction_status 和授权来源，防止隐私泄漏、样本污染和不可追溯。

## 相关链接

- [Fine-tuning 数据流水线](/note/Engineering/finetuning-data-pipeline)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
