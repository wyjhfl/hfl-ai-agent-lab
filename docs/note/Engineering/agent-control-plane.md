# Agent Control Plane：把 Agent 能力从业务代码里抽出来治理

## 这篇文章解决什么问题

当 Agent 项目从一个 Demo 发展成多个场景、多模型、多工具、多租户、多版本时，业务代码里会散落大量配置：模型选择、Prompt 版本、工具白名单、风险策略、审批规则、评测门禁、限流和成本预算。没有 Control Plane，系统会越来越难维护。

Agent Control Plane 的目标是把“控制 Agent 怎么运行”的能力从业务逻辑里抽出来，做成统一的治理面板和配置系统。

## Control Plane 与 Data Plane

| 平面 | 负责什么 | 示例 |
|---|---|---|
| Data Plane | 真正执行任务 | 模型调用、工具执行、RAG 检索、任务状态推进 |
| Control Plane | 管理执行策略 | 模型路由、Prompt 版本、工具权限、评测门禁、限流、成本 |

一句话：Data Plane 负责跑任务，Control Plane 负责决定任务怎么跑、能不能跑、用什么配置跑。

## 为什么需要 Control Plane

没有 Control Plane 时常见问题：

- 每个业务接口自己写模型配置。
- Prompt 版本散落在代码里，无法灰度和回滚。
- 工具权限靠 if else，审计困难。
- 新模型上线只能全量切换。
- 评测门禁和发布流程脱节。
- 成本预算只能事后看账单。
- 多租户策略无法统一管理。

这些问题在个人 Demo 中不明显，但在真实业务中会迅速放大。

## Control Plane 核心模块

| 模块 | 作用 |
|---|---|
| Model Registry | 管理可用模型、价格、能力、上下文长度 |
| Prompt Registry | 管理 Prompt 版本、变量、灰度和回滚 |
| Tool Registry | 管理工具 schema、风险等级、owner 和启停 |
| Policy Engine | 管理权限、审批、租户、风险策略 |
| Eval Gate | 管理 smoke、regression、benchmark、safety 门禁 |
| Routing | 管理模型路由、A/B 实验、canary、fallback |
| Budget | 管理 token、成本、租户额度和任务预算 |
| Observability | 管理 Trace、指标、报警和质量看板 |
| Release | 管理版本发布、变更记录和回滚开关 |

Control Plane 不一定一开始就做成完整平台，但设计时要知道这些能力最终会出现。

## 配置对象设计

可以把 Agent 运行配置抽象成 Agent Profile：

| 字段 | 说明 |
|---|---|
| agent_id | Agent 标识 |
| workflow_version | 工作流版本 |
| prompt_version | Prompt 版本 |
| model_route | 模型路由策略 |
| tool_policy | 工具白名单和风险策略 |
| rag_policy | 检索 top_k、rerank、权限过滤 |
| memory_policy | 记忆读写范围 |
| eval_policy | 上线前和运行时评测策略 |
| budget_policy | token、成本、超时、并发预算 |
| release_stage | dev、staging、canary、prod |

业务请求只引用 agent_id 和版本，具体策略由 Control Plane 下发。

## 变更流程

生产级 Agent 变更不应该直接改代码上线。建议流程：

1. 创建配置变更：Prompt、模型、工具、RAG、策略。
2. 自动跑 contract test 和 regression eval。
3. 检查成本、延迟和安全门禁。
4. 进入 staging。
5. 小流量 canary。
6. 对比指标和失败样本。
7. 全量发布或回滚。

这能把 Prompt 改动、模型切换和工具变更都纳入工程发布流程。

## 权限与审批

Control Plane 本身也需要权限控制。

| 操作 | 建议权限 |
|---|---|
| 查看配置 | 开发者、运营、管理员 |
| 修改 Prompt | 开发者或 Prompt owner |
| 启用高风险工具 | 安全负责人审批 |
| 修改模型路由 | 平台 owner 审批 |
| 提高租户额度 | 商业或管理员审批 |
| 跳过 Release Gate | 默认禁止或强审批 |

不要让任何人都能在生产环境随意修改 Prompt、模型和工具策略。

## 与观测系统的关系

Control Plane 需要从 Observability 获取反馈：

- 哪个 Prompt 版本失败率升高。
- 哪个模型成本异常。
- 哪个工具错误率升高。
- 哪个租户触发安全拦截。
- 哪个 canary 版本低于基线。
- 哪些失败样本应进入 regression set。

没有观测反馈，Control Plane 只是配置面板；有反馈后，它才是治理闭环。

## 面试表达模板

我会把 Agent 系统分成 Data Plane 和 Control Plane。Data Plane 负责执行模型调用、RAG、工具和状态机；Control Plane 管理模型注册、Prompt 版本、工具权限、策略、评测门禁、成本预算和发布灰度。这样 Prompt、模型、RAG 和 MCP 工具变更都可以配置化、可灰度、可回滚，而不是散落在业务代码里。

## 常见误区

### 误区一：Control Plane 等于后台页面

后台页面只是入口，真正重要的是配置模型、权限、发布流程和观测闭环。

### 误区二：早期项目不需要治理

早期不一定要做完整平台，但至少要设计版本、配置和 Trace 字段，避免后期重构困难。

### 误区三：配置越灵活越好

灵活配置也会带来风险。高风险策略必须有权限、审批和回滚。
