# Agent System Design Whiteboard Template：AI Agent 系统设计白板模板

## 这篇文章解决什么问题

面试或答辩时，很多人讲 Agent 系统设计会陷入两种极端：要么只画一个“用户 → LLM → 工具”的简单图，要么堆满框架名和组件名但讲不清边界。一个好的白板模板应该帮助你快速说明：任务入口、状态机、RAG、工具权限、MCP、Trace、评测、安全、成本和运维。

这篇模板适合准备 AI Agent / 大模型应用开发岗位的系统设计题，也适合把个人项目讲成工程化方案。

## 1. 先写任务边界

白板第一步不是画模型，而是写清楚：

- 用户是谁；
- 输入是什么；
- 输出是什么；
- 任务是否长时间运行；
- 是否需要 RAG；
- 是否需要工具或 MCP；
- 是否有高风险副作用；
- 成功标准是什么；
- 不能做什么。

示例：

| 项 | 示例 |
|---|---|
| 用户 | 企业运营人员 |
| 输入 | 客户问题、知识库、工单上下文 |
| 输出 | 答复草稿、引用、风险提示、工单动作建议 |
| 非目标 | 不自动发送高风险外部消息 |
| 成功标准 | 正确引用、权限不泄漏、人工确认后执行 |

## 2. 画核心架构

推荐按 8 层画：

1. UI / API：任务入口、状态查询、审批、反馈；
2. Agent Runtime：任务状态机、Planner、Executor、Memory；
3. Context Builder：系统规则、用户输入、RAG、Memory、工具结果；
4. RAG Service：ingestion、retrieval、rerank、permission filter、citation；
5. Tool / MCP Layer：tool registry、risk classification、approval、gateway；
6. Data Layer：task、run、step、tool_call、document、eval、audit；
7. Observability：trace、metrics、logs、cost、latency；
8. Governance：eval gate、release gate、SLO、安全策略、rollback。

## 3. 标出关键数据流

不要只画静态组件，要画出主路径：

1. 用户提交任务；
2. API 创建 task / run；
3. Runtime 进入 Planning；
4. Context Builder 拉取规则、记忆和证据；
5. RAG 检索并做权限过滤；
6. 模型生成计划或工具参数；
7. Tool Policy 判断风险；
8. 高风险操作进入 WaitingApproval；
9. Executor 执行工具；
10. Runtime 聚合结果并输出；
11. Trace、Eval、Feedback 写入闭环。

## 4. 必讲的工程细节

| 追问方向 | 必讲点 |
|---|---|
| 状态恢复 | task state、step state、幂等键、断点续跑 |
| RAG 可信 | metadata、permission filter、citation、freshness |
| 工具安全 | risk level、approval、args_hash、sandbox、audit |
| MCP 接入 | gateway、schema cache、token exchange、server health |
| 评测 | smoke、golden、regression、adversarial、drift |
| 成本延迟 | latency budget、model routing、cache、cost ledger |
| 运维 | SLO、error budget、runbook、postmortem、rollback |
| 产品体验 | 状态展示、人工接管、反馈、失败重跑 |

## 5. 白板回答结构

可以按这个顺序讲：

1. 我先限定任务边界和非目标；
2. 然后把系统拆成 Runtime、RAG、Tool/MCP、Data、Observability、Governance；
3. 主路径用状态机推进，避免模型自由发挥；
4. RAG 用 metadata filter、freshness 和 citation 保证可信；
5. 工具按风险分级，高风险必须审批和审计；
6. 所有 run 都有 Trace，失败样本进入 eval case 生命周期；
7. 发布时用 regression、drift、SLO 和 release gate 控制风险；
8. 最后说明取舍：哪些先做 MVP，哪些生产化再补。

## 6. 常见白板错误

### 错误一：上来就说用 LangGraph

框架不是系统设计。先讲任务边界、状态、数据、权限和评测，再说为什么用某个框架。

### 错误二：没有失败路径

系统设计一定会追问工具失败、无权限、无证据、模型超时、审批没人处理怎么办。

### 错误三：没有治理闭环

如果没有 Trace、Eval、SLO、Release Gate 和 Postmortem，系统很难持续运营。

## 面试表达模板

> 我会先限定 Agent 的任务边界和非目标，再把系统拆成 UI/API、Agent Runtime、Context Builder、RAG、Tool/MCP、Data、Observability 和 Governance。主路径由状态机推进，高风险工具进入审批，RAG 做权限过滤和 freshness 校验，所有 run 写 Trace，并把线上失败转成 eval case，最后用 SLO、Error Budget 和 Release Gate 控制上线风险。

## 相关链接

- [Agent 系统设计面试题](/topics/agent-system-design-interview)
- [Agent 系统设计案例库](/topics/agent-system-design-casebook)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
- [RAG Freshness Evaluation](/note/Engineering/rag-freshness-evaluation)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
