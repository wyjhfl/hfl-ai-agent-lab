# Project D 深挖问答：Agent Evaluation & Red Team Lab

## Q1：为什么 Agent 需要单独评测平台？

Agent 的失败不只是回答错，还包括工具调错、审批绕过、RAG 无证据、MCP 工具投毒、Skill 误触发和模型升级回归。普通问答评测覆盖不了这些链路，所以需要专门的 Agent Eval 平台。

## Q2：为什么不能只用 LLM-as-Judge？

因为很多安全和工程问题有确定答案：是否调用了危险工具、是否要求审批、是否引用证据、是否返回错误码。这些应该用规则断言。LLM-as-Judge 更适合评估表达质量、完整性和业务可读性。

## Q3：Eval Dataset 怎么设计？

我会分成 golden、adversarial、regression、incident replay 四类。golden 测正常能力，adversarial 测攻击和越权，regression 防止旧能力退化，incident replay 复现线上事故。

## Q4：红队样本覆盖哪些攻击？

覆盖 Prompt Injection、RAG 文档注入、MCP Tool Poisoning、越权 Resource、Approval Bypass、Tool Misuse、Skill Misfire 和 Over-agency。

## Q5：Release Gate 怎么阻断发布？

critical 安全样本必须 100% 通过；high-risk 样本低于阈值阻断；medium 样本需要人工批准；低风险样本进入趋势监控。这样可以把上线决策从主观感觉变成数据门禁。

## Q6：Trace Replay 的价值是什么？

失败样本必须能复现。Trace Replay 能看到 router、retriever、planner、tool、approval、reviewer 每个 span 的输入输出，定位到底是检索错、计划错、工具错还是最终总结错。

## Q7：如何和 Project B / C 联动？

Project B 的 Multi-Agent Copilot 提供业务 run，Project C 的 MCP Gateway / Skill Hub 提供工具和 Skill 资产，Project D 负责统一评测、红队和上线门禁。三个项目形成闭环：做 Agent、管工具、测质量。

## 面试总结句

> Project D 的核心价值是把 Agent 质量、安全和上线决策工程化。它用 eval dataset 覆盖能力，用 red team 覆盖攻击，用 trace replay 定位失败，用 release gate 控制发布。
