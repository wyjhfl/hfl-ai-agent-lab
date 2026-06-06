# Prompt Regression Testing：Prompt 改动怎么防止能力退化

## 这篇文章解决什么问题

Prompt 是 AI 应用里最容易被低估的工程资产。很多项目的问题不是模型不会，而是一次看似很小的 Prompt 改动破坏了历史能力：格式变了、拒答变少了、工具参数错了、引用消失了、安全边界被绕过了。

Prompt Regression Testing 的目标是：每次 Prompt、模型、RAG、工具 schema 或策略变更，都能用固定样本集验证“旧能力没有坏”。

## 哪些变更需要回归

只要影响模型上下文或执行行为，就应该触发回归：

- system prompt / developer prompt 改动；
- few-shot 示例增删；
- 输出 JSON schema 改动；
- 工具描述、参数、风险等级改动；
- RAG context pack、引用格式、过滤策略改动；
- 模型版本、温度、路由策略改动；
- 安全策略、拒答规则、审批规则改动；
- Memory 写入和检索策略改动。

## 回归集分层

| 集合 | 用途 | 样本特点 |
|---|---|---|
| smoke set | 快速检查主路径 | 数量少，运行快，覆盖核心功能 |
| golden set | 核心能力保护 | 每条有期望格式、关键事实、引用和工具断言 |
| failure replay set | 防止线上问题复发 | 来自事故、用户反馈、人工修正 |
| adversarial set | 安全边界验证 | 注入、越权、PII、危险工具、冲突证据 |
| compatibility set | 格式和接口兼容 | JSON schema、字段类型、前端渲染约束 |

## 一条回归样本应包含什么

| 字段 | 说明 |
|---|---|
| case_id | 样本唯一标识，方便失败追踪 |
| user_input | 用户输入或多轮对话 fixtures |
| tenant / role | 权限和租户上下文 |
| knowledge_version | 知识库版本，避免旧索引污染结果 |
| expected_behavior | 必须回答、必须拒答、必须调用工具或必须不调用工具 |
| required_assertions | schema、citation、tool、safety、cost、latency 等断言 |
| source | smoke、golden、线上失败、红队样本或人工修正 |

## 自动断言类型

| 断言 | 检查内容 |
|---|---|
| schema assertion | JSON 字段是否完整、类型是否正确 |
| citation assertion | 引用是否存在、是否支持答案、是否有权限 |
| tool assertion | 是否调用正确工具、参数是否合规、风险是否审批 |
| safety assertion | 是否拒绝越权、注入、敏感信息请求 |
| semantic assertion | LLM-as-Judge 按 rubric 判断事实和表达质量 |
| cost assertion | token、重试、模型选择是否超预算 |
| latency assertion | 是否超过主路径或长任务延迟阈值 |

## CI / Release Gate 中怎么接入

推荐三层门禁：

1. PR 阶段：跑 smoke set 和 schema assertion；
2. 合并前：跑 golden set、tool assertion、citation assertion；
3. 灰度前：跑 failure replay set、adversarial set、成本延迟对比。

如果回归失败，不应该简单“调一下 Prompt 直到过”，而要记录失败样本、失败归因、Prompt diff、是否需要更新期望、是否需要新增安全规则或工具策略、是否需要纳入 Release Gate。

## 面试表达模板

> 我把 Prompt 当成可测试资产管理。每次改 Prompt 或工具描述，都会跑 smoke、golden、failure replay 和 adversarial 四类回归样本，不只看答案像不像，还检查 JSON schema、引用、工具参数、安全拒答、成本和延迟。这样可以避免修了一个问题、坏了历史能力。

## 常见误区

### 误区一：Prompt 回归只靠人工读几个答案

人工读只能发现明显问题，不能稳定覆盖格式、工具、引用、权限和安全边界。

### 误区二：只保留成功样本

失败样本更有价值。线上事故、用户反馈和人工修正都应该进入 failure replay set。

### 误区三：Judge 分数高就一定可以上线

Judge 需要校准，且不能替代确定性断言。schema、权限、工具风险必须用规则检查。

## 相关链接

- [PromptOps：Prompt 版本、评测和回滚](/note/Engineering/promptops-versioning)
- [Conversation Regression Testing](/topics/conversation-regression-testing)
- [LLM-as-Judge 与 Rubric 评测](/note/Engineering/llm-as-judge-rubric-eval)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [合成数据与对抗评测集](/note/Engineering/synthetic-adversarial-eval-data)
