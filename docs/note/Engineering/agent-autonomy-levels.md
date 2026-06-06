# Agent Autonomy Levels：Agent 自主等级怎么设计

## 这篇文章解决什么问题

很多项目一上来就说“让 Agent 自主完成任务”，但没有定义它到底能自主到什么程度：只是推荐方案、自动生成草稿、自动执行低风险工具，还是能改配置、发消息、删除数据？如果没有自主等级，安全、产品体验和审批策略都会混乱。

Agent Autonomy Levels 的目标是把 Agent 的自主能力拆成可解释、可审批、可灰度、可回滚的等级。

## 自主等级划分

| 等级 | 能力 | 典型场景 | 控制策略 |
|---|---|---|---|
| L0 Assist | 只回答和建议，不执行 | 知识问答、方案建议 | 只读、无副作用 |
| L1 Draft | 生成草稿，用户手动确认 | 邮件草稿、报告草稿 | 不触发外部动作 |
| L2 Execute Low Risk | 自动执行低风险只读/可逆操作 | 查询数据、创建待办 | 记录 Trace，可撤销 |
| L3 Execute With Approval | 高风险动作需审批 | 发邮件、提交工单、改配置 | 人审、args_hash、审计 |
| L4 Delegated Autonomy | 在限定目标内连续执行多步 | 自动巡检、批量整理 | 预算、SLO、暂停开关 |
| L5 Full Autonomy | 可跨系统长期自主行动 | 高风险生产自动化 | 默认不建议，需强治理 |

## 设计原则

1. 自主等级要和工具风险等级绑定；
2. 等级提升必须经过评测、灰度和审计；
3. 用户必须能看到 Agent 当前权限；
4. 高风险副作用必须支持审批和撤销；
5. 长任务必须支持暂停、接管、重放和复盘。

## 不同等级的产品提示

| 等级 | 用户界面提示 |
|---|---|
| L0 | “我可以帮你分析和建议” |
| L1 | “我会生成草稿，提交前由你确认” |
| L2 | “我会自动执行低风险操作，并记录过程” |
| L3 | “高风险操作会先生成审批卡片” |
| L4 | “我会在限定范围内持续执行，可随时暂停” |

## 评测门禁

自主等级提升前至少验证：

- task_success_rate；
- tool_arg_correctness；
- safety_violation_rate；
- approval_bypass_rate；
- rollback_success_rate；
- cost_per_success；
- human_takeover_rate；
- replay_reproducibility。

## 面试表达模板

> 我不会把 Agent 自主性设计成开关，而是拆成 L0 到 L5 的自主等级。低等级只建议或生成草稿，高风险动作必须进入审批；只有在评测、SLO、工具风险和回放机制都满足后，才允许提升自主等级。这样既能展示智能化能力，也能控制副作用和安全风险。

## 常见误区

### 误区一：越自主越高级

生产系统更看重可控性。高自主但不可审计、不可接管，风险很高。

### 误区二：自主等级只由模型能力决定

自主等级取决于工具风险、权限、SLO、评测、业务后果和用户信任。

### 误区三：用户不知道 Agent 会做什么

界面必须明确告诉用户 Agent 能做什么、不能做什么、哪些动作需要确认。

## 相关链接

- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)
- [Agent SLO 与 Error Budget](/note/Engineering/agent-slo-error-budget)
- [Agent Run Replay](/note/Engineering/agent-run-replay)
- [Human Takeover 运营台](/topics/human-takeover-operations-console)
