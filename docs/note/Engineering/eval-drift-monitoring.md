# Eval Drift Monitoring：评测漂移怎么监控

## 这篇文章解决什么问题

很多团队上线前跑过评测，但上线后就不再持续验证。问题是 Agent 系统会持续变化：模型换了、Prompt 改了、知识库更新了、工具 schema 变了、用户问题分布变了、攻击样本也变了。原来 90 分的系统，可能两周后已经退化到不可接受。

Eval Drift Monitoring 的目标是：持续监控线上真实流量和离线评测结果之间的变化，发现质量、安全、成本、延迟和用户意图分布的漂移。

## 漂移类型

| 类型 | 说明 | 例子 |
|---|---|---|
| input drift | 用户问题分布变化 | 从常见 FAQ 变成复杂业务咨询 |
| knowledge drift | 知识库内容变化 | 新政策上线、旧文档过期、权限变更 |
| model drift | 模型行为变化 | 新模型更会总结但更容易省略引用 |
| prompt drift | Prompt 多次小改导致行为偏移 | 拒答变少、格式变松、工具调用变激进 |
| tool drift | 工具 schema 或外部服务变化 | 参数新增、错误码变化、延迟升高 |
| judge drift | 自动评测标准漂移 | Judge 模型升级后评分偏宽或偏严 |
| cost drift | 成本结构变化 | retry 增加、长上下文比例上升 |
| safety drift | 安全边界退化 | 注入样本通过率上升、PII 脱敏漏检 |

## 需要监控的信号

1. 离线评测分数：task success、grounding、format、tool correctness、safety；
2. 线上行为指标：重试率、接管率、拒答率、引用缺失率、工具失败率；
3. 用户反馈指标：点赞、点踩、人工修正、重新提问、放弃率；
4. 成本延迟指标：token、p95 latency、cost per success、cache hit rate；
5. 分布指标：query topic、intent、tenant、workflow、knowledge_base；
6. 安全指标：policy hit、PII redaction miss、越权拦截、注入命中。

## 漂移检测方法

### 1. 固定评测集趋势

每天或每次发布后跑固定 golden set，观察每个维度趋势。不要只看今天是否过线，还要看相对 baseline 的下降幅度。

### 2. 分桶监控

不要只看总体分。按 tenant、workspace、agent_type、workflow、model_version、prompt_version、knowledge_base、index_version、tool_id、schema_version、query_intent 和 difficulty 分桶。

### 3. 线上样本抽样

从线上抽样进入 shadow eval：高频问题、高成本任务、低置信度任务、人工接管任务、用户点踩任务、安全策略命中任务。

### 4. Judge 校准

自动 Judge 自己也会漂移，所以要维护人工校准集：固定样本、人工标签、Judge 分数趋势、pairwise consistency、与用户反馈的相关性。

## 漂移响应流程

| 漂移信号 | 处理动作 |
|---|---|
| grounding 下降 | 检查检索、rerank、context pack、知识版本 |
| tool correctness 下降 | 检查 tool schema、参数生成、错误映射、回放样本 |
| safety 下降 | 暂停发布，补红队样本，更新策略和回归集 |
| cost 上升 | 检查长上下文、重试、模型路由、缓存失效 |
| latency 上升 | 拆 planning / retrieval / tool / generation / review |
| judge 分数异常波动 | 先校准 Judge，不直接调整业务 Prompt |

## 面试表达模板

> 我会把评测当成上线后的持续监控，而不是上线前一次性报告。系统每天跑固定 golden set，也会从线上抽取低置信度、点踩、接管和高成本样本做 shadow eval。漂移会按模型版本、Prompt 版本、知识库版本、工具版本和租户分桶定位，避免只看总体分掩盖局部退化。

## 常见误区

### 误区一：上线前评测通过就不用再看

Agent 的模型、知识、工具和用户问题都会变，评测必须持续运行。

### 误区二：只看总分

总分稳定可能掩盖某个租户、工具、知识库或意图的严重退化。

### 误区三：Judge 结果绝对可信

Judge 也是模型，也需要版本、校准集和漂移监控。

## 相关链接

- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
- [LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)
- [Batch / 离线评测流水线](/note/Engineering/batch-offline-eval-pipeline)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [Model Rollout Canary](/note/Engineering/model-rollout-canary)
