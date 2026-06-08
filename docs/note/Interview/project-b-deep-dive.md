# 项目 B 深挖版：Multi-Agent Copilot 面试问答

> 这页用于准备项目深挖。回答原则：每个问题都要落到工程取舍、系统边界和可验证证据，不要只堆框架名。

## Q1：为什么选择运营中台场景？

运营中台任务天然是多步骤、强上下文、带风险的任务。比如分析活动转化率下降，不只是让模型回答原因，而是要查指标口径、拉活动数据、对比历史、判断异常、生成工单或通知文案，并且高风险动作不能直接执行。

这个场景适合展示 Agent 工程化，因为它同时涉及 RAG、工具调用、权限、审批、Trace 和 Evaluation，不会停留在简单问答。

## Q2：为什么不用单 Agent？

单 Agent 可以完成 demo，但难以解释每一步责任。Project B 采用 Router / Planner / Executor / Reviewer 拆分，是为了把复杂任务拆成可控边界：

- Router 判断任务类型和风险。
- Planner 只负责拆步骤。
- Executor 只负责按 schema 调工具。
- Reviewer 负责证据、安全和最终质量检查。

这样每一步都能被 trace、测试和替换。如果某次结果错了，可以定位是路由错、计划错、工具错、检索错还是总结错。

## Q3：为什么需要 LangGraph 或状态机？

因为运营任务不是一次模型调用，而是带条件分支的工作流：有些任务需要检索，有些需要审批，有些工具失败要重试，有些没有证据要停止。状态机可以把这些分支显式表达出来。

我的状态流包括 Understand、Retrieve、Plan、Approval、Execute、Review、Repair、Final。这样比“while 循环让模型自己决定下一步”更可控，也更容易测试。

## Q4：工具调用如何设计？

我会先做 Tool Contract，而不是直接把 API 暴露给模型。每个工具都有：

- name 和 description，帮助模型正确选择。
- input / output schema，保证参数可校验。
- risk level，决定是否需要审批。
- timeout 和 error code，方便失败处理。
- audit fields，方便审计和 replay。

模型只生成参数和调用意图，真正执行在后端工具层完成。

## Q5：如何防止越权或误操作？

有三层控制：

1. **Discovery 层**：用户没有权限的工具和资源不暴露。
2. **Call 层**：每次调用都校验 user、tenant、role、scope。
3. **Action 层**：写操作和外部副作用动作进入审批。

如果用户要求查询无权数据，工具层直接返回 permission denied，Agent 不能通过其他工具绕过。

## Q6：Human-in-the-loop 怎么设计？

高风险动作不会直接执行，而是生成 action preview：动作类型、参数、影响范围、证据、回滚方式。用户可以 approve、reject 或 edit。

审批通过后才调用最终执行工具，审批记录写入 audit log 和 trace。拒绝时系统要给替代建议，而不是假装任务完成。

## Q7：Trace 记录什么？

Trace 不只记录最终回答，而是记录整个 run：

- task brief
- Router 分类和风险
- Planner 计划
- RAG 检索 query 和引用
- tool call 输入输出和错误
- approval decision
- Reviewer verdict
- token cost 和 latency

有了这些，线上问题可以分层排查，也能把失败样本加入回归集。

## Q8：Evaluation 怎么做？

我会把评测分成硬断言和软评估：

- 硬断言：必须调用哪些工具、不能调用哪些工具、是否必须审批、是否必须引用证据、是否返回指定错误码。
- 软评估：用 rubric 判断答案是否完整、清楚、有证据、对运营人员有帮助。

关键安全用例不能只靠 LLM-as-Judge，必须用规则断言。

## Q9：项目最大难点是什么？

最大难点不是把多个 Agent 串起来，而是让它们可控：

- 工具调用不能误执行。
- 没有证据不能编造。
- 高风险动作必须审批。
- 失败要能降级。
- 结果要能追踪和评估。

所以我把重点放在 Tool Registry、Risk Policy、Trace 和 Eval，而不是只追求“多 Agent”这个概念。

## Q10：如果模型升级导致效果变差怎么办？

所有关键任务进入 Eval Dataset。升级模型、Prompt、工具 schema 或 RAG 数据后，必须跑 regression：

- critical cases 100% 通过。
- high-risk approval 100% 通过。
- no-evidence answer rate 不上升。
- tool schema error 不新增。
- p95 latency 和 cost 不超过预算。

如果不通过，就回滚模型或 Prompt 版本。

## 面试总结句

> Project B 的核心不是“用了多 Agent”，而是把多步骤 AI 任务做成受控工程系统：状态机控制流程，工具层控制动作，审批层控制风险，Trace 负责复盘，Eval 负责防回归。

## 关联材料

- [Project B 主入口](/projects/project-b-agent-copilot)
- [Project B 架构设计](/projects/project-b-architecture)
- [Project B Trace / Eval 方案](/projects/project-b-trace-eval-plan)
- [Project B Demo 验收脚本](/projects/project-b-demo-script)
