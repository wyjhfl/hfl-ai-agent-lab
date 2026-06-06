# Eval Case Lifecycle：评测样本生命周期怎么管理

## 这篇文章解决什么问题

很多 AI 项目会建立评测集，但后续没人维护。样本从哪里来、谁审核、什么时候过期、失败后如何修复、是否能进入 release gate，都没有流程。结果评测集越来越陈旧，无法代表真实业务。

Eval Case Lifecycle 的目标是把评测样本当成工程资产管理：采集、脱敏、标注、审核、分层、运行、失败归因、过期和归档。

## 样本来源

| 来源 | 价值 |
|---|---|
| 产品主路径 | 保证核心功能不坏 |
| 线上失败 | 防止事故复发 |
| 用户点踩 | 捕捉真实体验问题 |
| 人工修正 | 提供高质量期望答案 |
| 红队样本 | 覆盖安全边界 |
| 合成样本 | 补齐低频但重要场景 |
| 业务规则 | 约束格式、权限、流程和合规 |

## 生命周期状态

| 状态 | 含义 |
|---|---|
| candidate | 候选样本，未审核 |
| redacted | 已脱敏，可进入标注 |
| labeled | 已标注期望行为或 rubric |
| reviewed | 通过人工审核 |
| active | 进入 smoke、golden 或 regression set |
| flaky | 结果不稳定，暂停作为门禁 |
| deprecated | 业务规则过期或样本失效 |
| archived | 归档保留，不再运行 |

## 样本字段

| 字段 | 说明 |
|---|---|
| case_id | 唯一 ID |
| source | 来源：prod、feedback、incident、redteam、synthetic |
| task_type | RAG、Tool、Workflow、Safety、Memory、MCP |
| input | 用户问题或多轮对话 |
| fixtures | tenant、role、knowledge_version、tool_schema_version |
| expected | 期望答案、拒答、工具调用、引用或状态转移 |
| assertions | schema、citation、permission、safety、cost、latency |
| rubric | Judge 评分标准 |
| owner | 维护负责人 |
| status | 生命周期状态 |
| expires_at | 过期时间 |

## 失败归因

每次评测失败后，不要只记录“failed”，要归因：

- prompt regression；
- model behavior change；
- retrieval miss；
- stale knowledge；
- permission filter bug；
- tool schema mismatch；
- judge unstable；
- expected outdated；
- product requirement changed。

不同归因对应不同修复动作。比如 expected outdated 应该更新样本，而不是强行改 Prompt。

## 样本分层

| 集合 | 用法 |
|---|---|
| smoke | 每次 PR 快速跑 |
| golden | 合并和灰度前必跑 |
| regression | 历史问题防复发 |
| adversarial | 安全和越权样本 |
| canary | 新模型/新 Prompt 灰度验证 |
| benchmark | 横向比较方案 |

## 面试表达模板

> 我会把 eval case 当成有生命周期的资产。线上失败、用户点踩、人工修正和红队样本先进入 candidate，脱敏后标注 expected behavior 和 assertions，通过 review 后进入 smoke、golden 或 regression set。每次失败会做归因，区分 Prompt 退化、检索失败、权限 bug、Judge 不稳定还是期望过期。

## 常见误区

### 误区一：评测集越大越好

大但脏的评测集会拖慢迭代，还会误导优化方向。质量、分层和维护更重要。

### 误区二：线上样本直接进评测

线上样本必须脱敏、去重、标注和审核，否则会引入隐私、噪声和错误期望。

### 误区三：评测失败一定是系统错

可能是样本过期、Judge 漂移、业务规则变化或期望答案错误。

## 相关链接

- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [Prompt Regression Testing](/note/Engineering/prompt-regression-testing)
- [Eval Drift Monitoring](/note/Engineering/eval-drift-monitoring)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
