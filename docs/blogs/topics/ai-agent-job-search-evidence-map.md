# AI Agent Job Search Evidence Map：求职能力证据地图

## 这篇文章解决什么问题

准备 AI Agent / 大模型应用岗位时，很多简历会写“熟悉 RAG、LangGraph、MCP、Tool Calling、LLMOps”，但面试官真正想看的是证据：你是否做过项目，是否有指标，是否能解释设计取舍，是否能排查失败，是否能控制安全和成本。

Job Search Evidence Map 的目标是把技术能力映射到作品集、代码、文章、Demo、评测和面试故事，避免简历只有关键词。

## 能力域和证据

| 能力域 | 需要的证据 |
|---|---|
| RAG 工程 | 文档入库、metadata、权限过滤、引用评测、失败排查 |
| Agent Runtime | 任务状态机、Trace、Run Replay、长任务恢复 |
| Tool / MCP | tool schema、风险分级、审批、沙箱、MCP Server / Client |
| Evaluation | eval dataset、scorecard、failure clustering、regression set |
| Safety | prompt injection、防越权、PII、secret、输出安全 |
| Cost / Latency | request ledger、budget、cache、provider failover、latency budget |
| Product | PRD、指标、Demo 验收脚本、人工接管、反馈闭环 |
| Ops | SLO、runbook、故障演练、release gate、postmortem |

## 简历 bullet 不是技术清单

弱表达：

> 熟悉 RAG、Agent、MCP、LangGraph。

强表达：

> 设计企业知识库 RAG 入库与检索链路，补充文档 metadata、ACL 过滤、引用评测和失败样本回归，使答案可追溯、可复盘、可做权限隔离。

强表达的特点是包含：场景、动作、工程机制、结果或可验证证据。

## 作品集页面怎么组织

每个项目建议提供 6 类证据：

1. **项目背景**：解决什么业务问题。
2. **架构图**：Runtime、RAG、Tool/MCP、Data、Eval、Ops。
3. **关键代码**：最能证明能力的 3-5 个文件。
4. **验证结果**：测试、评测、Demo 截图、构建日志。
5. **问题复盘**：失败案例、取舍、修复动作。
6. **面试讲法**：60 秒介绍、深挖问答、STAR 故事。

## 能力证据矩阵

| 简历关键词 | 最好配套的材料 |
|---|---|
| RAG | RAG 架构图、metadata schema、引用评测报告、检索排障案例 |
| Multi-Agent | 状态机、handoff payload、Trace、失败恢复案例 |
| Tool Calling | Tool registry、risk classification、idempotency、replay |
| MCP | MCP server build guide、schema、client test、sandbox profile |
| LLMOps | prompt regression、eval drift、release gate、request ledger |
| 安全 | prompt injection 防御、PII redaction、tenant isolation、audit log |
| 产品化 | PRD、product metrics、demo acceptance、feedback triage |

## 投递前自查

| 问题 | 通过标准 |
|---|---|
| 项目是否有主线？ | 能一句话说明用户、痛点和价值 |
| 是否有架构图？ | 能看出数据流、控制流和风险边界 |
| 是否有指标？ | 至少有质量、成本、延迟或安全指标 |
| 是否有失败复盘？ | 能讲一次真实问题和修复闭环 |
| 是否有 Demo 脚本？ | 面试时 5 分钟能稳定展示主路径 |
| 是否有代码入口？ | 面试官能快速找到关键实现 |
| 是否有面试故事？ | 能回答“你最难的点是什么” |

## 面试表达

可以这样讲：

> 我整理作品集时不是按技术名词堆页面，而是按能力证据组织。比如 RAG 不是只写用了向量库，而是展示 metadata、权限过滤、引用评测和失败排查；MCP 不是只写接入工具，而是展示 schema、sandbox、token exchange 和 client test。这样简历里的每个关键词都能在项目、文章和 Demo 中找到证据。

## 下一步行动

- 给每个项目补一张能力证据矩阵。
- 给每个简历 bullet 绑定对应文章和代码文件。
- 给每个项目准备 60 秒版、5 分钟版和深挖版。
- 把失败复盘整理成 STAR 故事。
- 用 Offer Portfolio Review 做投递前最后检查。
