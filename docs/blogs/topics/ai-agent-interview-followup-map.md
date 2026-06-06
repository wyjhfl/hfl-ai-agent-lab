# AI Agent 面试追问地图：从基础题一路追到生产级系统

## 这篇文章解决什么问题

AI Agent 面试很少停留在“什么是 Agent”。面试官通常会不断追问：为什么不用普通 Workflow？失败怎么排查？工具怎么控权？RAG 怎么评测？多租户怎么隔离？成本怎么压？上线怎么回滚？

这篇文章整理一张追问地图，帮助你从基础概念逐层准备到生产级系统设计。

## 追问层级

| 层级 | 面试官关注 |
|---|---|
| L1 概念 | Agent、Workflow、RAG、Tool Calling 是什么 |
| L2 设计 | 怎么拆模块，怎么选框架，怎么建数据模型 |
| L3 工程 | 状态机、工具、权限、Trace、评测、队列 |
| L4 生产 | 成本、延迟、安全、多租户、运维、发布 |
| L5 复盘 | 失败案例、取舍、指标、上线事故和改进 |

准备时不要只背 L1，要能讲到 L3-L5。

## Agent vs Workflow 追问

| 追问 | 回答方向 |
|---|---|
| 为什么不用固定 Workflow？ | 如果流程稳定、规则明确，Workflow 更可靠；Agent 适合开放任务和动态工具选择 |
| Agent 的不可控怎么解决？ | 状态机、工具 schema、权限策略、Trace、评测和人工审批 |
| 多 Agent 有必要吗？ | 只有角色分工、并行任务、互审或复杂协作明显时才需要 |
| 怎么避免 Agent 无限循环？ | step budget、tool budget、状态转移、early stop、失败分类 |

高质量回答不是吹 Agent，而是知道什么时候不用 Agent。

## RAG 追问

| 追问 | 回答方向 |
|---|---|
| 答案错了怎么排查？ | 入库、召回、rerank、context pack、生成、citation 逐层看 Trace |
| chunk 怎么切？ | 按文档结构、语义边界、表格和 metadata，不只按固定长度 |
| 怎么评估 RAG？ | recall、MRR、citation accuracy、no-answer、权限过滤 |
| 为什么要 rerank？ | 提升 context precision，减少无关证据进入上下文 |
| 怎么处理无答案？ | 检测证据不足，拒答或请求补充，不编造 |

RAG 面试要讲证据链，而不是只说 embedding + vector db。

## Tool / MCP 追问

| 追问 | 回答方向 |
|---|---|
| 工具调用怎么设计？ | tool schema、参数校验、结构化输出、错误分类和 Trace |
| 高风险工具怎么控制？ | risk_level、审批、沙箱、最小权限、审计 |
| MCP 有什么价值？ | 标准化外部工具接入，但需要 Client/Gateway 治理 |
| MCP Server 怎么测试？ | schema test、fake client、invalid args、timeout、permission |
| MCP Client 怎么测试？ | fake server、tool discovery、policy filter、error mapping、注入样本 |

不要把 MCP 讲成“会接协议”，要讲治理和测试。

## 状态和可靠性追问

| 追问 | 回答方向 |
|---|---|
| 长任务失败怎么办？ | 状态机、幂等键、断点续跑、重试预算、人工接管 |
| 怎么做任务进度？ | Created、Queued、Planning、RunningTool、Validating、Completed、Failed |
| 工具重复执行怎么办？ | idempotency_key、intent/result 记录、写操作审批 |
| 队列积压怎么办？ | backpressure、优先级、限流、熔断、死信队列 |

可靠性问题最能区分 Demo 和生产系统。

## 评测追问

| 追问 | 回答方向 |
|---|---|
| 怎么知道 Agent 变好了？ | Scorecard、regression set、benchmark、人工抽检 |
| LLM-as-Judge 可信吗？ | Rubric、样例、人工校准、规则评分结合 |
| 评测集怎么来？ | golden path、edge case、线上失败、对抗样本 |
| 上线前跑什么？ | smoke、regression、safety、cost、latency、contract gate |

不要只说“人工看效果还不错”。要有维度和门禁。

## 安全和多租户追问

| 追问 | 回答方向 |
|---|---|
| Prompt Injection 怎么防？ | untrusted evidence、tool policy、审批、沙箱、红队回归 |
| 多租户怎么隔离？ | API、RAG metadata、Memory、Cache、MCP、Trace、Billing 全链路隔离 |
| 数据能不能用于训练？ | 数据分级、脱敏、授权、用途隔离、保留周期和 lineage |
| 工具越权怎么办？ | 系统注入 tenant/user，执行层硬校验，不信任模型参数 |

安全题不能只靠系统提示，必须讲系统边界。

## 成本和运维追问

| 追问 | 回答方向 |
|---|---|
| 成本怎么控制？ | token budget、模型路由、缓存、top_k、批处理、cost_per_success |
| 延迟怎么优化？ | 并行检索、流式输出、缓存、异步任务、降级 |
| 线上事故怎么复盘？ | Trace、错误分类、失败样本、Release Gate 更新 |
| 怎么灰度新模型？ | A/B、canary、shadow eval、自动回滚 |

成本和运维是生产级意识的重要证明。

## 项目表达追问

| 追问 | 回答方向 |
|---|---|
| 你负责什么？ | 模块、设计、实现、测试、指标和结果 |
| 最大难点是什么？ | 具体工程难点 + 方案 + 验证 |
| 如果重做会改什么？ | 评测集、数据模型、权限、成本或用户体验改进 |
| 项目怎么上线？ | Docker、环境变量、健康检查、日志、监控、回滚 |

面试官看重真实取舍，不只是完美包装。

## 30 秒总答法

当被追问一个陌生问题时，可以用这个结构回答：

1. 先界定问题属于哪一层：模型、RAG、工具、状态、权限、评测、运维。
2. 说明风险是什么。
3. 给出工程方案。
4. 说明怎么验证。
5. 补一句项目中如何落地或如何计划落地。

这比直接背答案更稳。

## 常见误区

### 误区一：只背概念定义

Agent 面试更关注工程落地，概念只是入口。

### 误区二：什么都说用多 Agent

多 Agent 不是银弹。很多场景状态机 + 工具治理更重要。

### 误区三：没有失败案例

能讲清楚失败和复盘，反而更能证明真实项目经验。
