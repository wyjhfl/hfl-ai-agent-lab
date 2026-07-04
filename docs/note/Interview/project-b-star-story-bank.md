# Project B STAR 故事库

## 故事 1：把多 Agent 从概念变成 Runtime

**Situation**：很多多 Agent Demo 只是多个角色轮流生成文本，很难解释系统边界。
**Task**：我希望把它做成可展示的 Runtime，能讲清任务状态、角色分工、工具治理和审计。
**Action**：我设计 Coordinator、Analyst、Executor、Reviewer 四个角色，并用 custom Harness 记录每一步输入输出。
**Result**：面试时可以用 Trace 和 Trajectory 解释系统执行过程，而不是只展示最终答案。

## 故事 2：控制工具风险

**Situation**：Agent 一旦能调用工具，就可能误执行高风险动作。
**Task**：我需要让工具调用可控、可审计。
**Action**：我引入 ToolGateway、PolicyEngine、OperationWhitelist 和 Human Approval，把工具执行从模型输出中隔离出来。
**Result**：系统能区分允许、拒绝和需要审批的动作，高风险工具不会自动执行。

## 故事 3：保证 Demo 稳定

**Situation**：面试 Demo 如果依赖真实 LLM 或外部服务，很容易因为网络、额度或配置失败。
**Task**：我需要一个稳定可演示的多 Agent 项目。
**Action**：我把默认模式设计成 fake/offline，真实 provider 只作为 opt-in。
**Result**：项目能稳定展示架构和工程能力，同时避免过度声明生产能力。

## 故事 4：把可观测性做成产品界面

**Situation**：多 Agent 系统出错时，只看最终答案无法定位问题。
**Task**：我需要让运行过程可解释。
**Action**：我在 Operator Console 中设计 Tasks、Trace、Audit、Metrics、Approvals 和 Trajectory 页面。
**Result**：面试官可以看到角色协作、工具调用、审批和审计证据，项目更像工程系统而不是 Prompt Demo。
