# AI Agent Security Interview Guide：Agent 安全面试怎么讲

## 这篇文章解决什么问题

AI Agent 面试里，安全问题经常被问得很深：如何防 Prompt Injection？如何控制工具权限？MCP Server 怎么授权？如何避免 RAG 越权？Computer Use 怎么确认危险操作？

这篇文章提供一套安全面试表达框架，避免只回答“加过滤、加 guardrail”。

## 一句话框架

> Agent 安全不是一个过滤器，而是任务边界、数据权限、上下文隔离、工具策略、审批、沙箱、Trace、评测和发布门禁组成的体系。

## 高频问题地图

| 问题 | 回答要点 |
|---|---|
| 怎么防 Prompt Injection | untrusted evidence、instruction/evidence 分离、tool policy、审批、对抗评测 |
| 怎么控制工具风险 | risk_level、scope、schema、args_hash、approval、audit |
| MCP 怎么授权 | OAuth/scope、短期 token、audience、tenant/resource 校验 |
| RAG 怎么防越权 | tenant、ACL、metadata filter、citation filter、cache isolation |
| Memory 怎么保护隐私 | write_policy、sensitivity、expires_at、forget request |
| Computer Use 怎么安全 | 观察、风险分类、具体确认、before/after trace |
| 如何证明安全有效 | red team、regression set、policy_denied metrics、incident drill |

## Prompt Injection 答题模板

不要只说：

> 我会在 Prompt 里告诉模型不要听恶意指令。

更好的回答：

> 我会把外部文档、网页、工具返回都标记为 untrusted evidence，在 Context Pack 里和 system/developer instruction 分开。模型不能从 evidence 获得工具授权；工具执行层会校验 scope、risk_level 和 approval。发现注入样本后进入 red team regression set，并通过 Trace 记录 injection_detected 和 policy_denied。

## 工具权限答题模板

> 工具不是函数列表，而是受治理资产。每个工具有 schema_version、risk_level、auth_scope、timeout、idempotency 和 audit_event。模型只能提出 tool_call，真正执行前后端会做 schema、权限、租户、风险和审批校验。高风险工具需要 approval_id 和 args_hash，防止审批后参数被替换。

## MCP 授权答题模板

> MCP 不能用一个全局 API Key。MCP Client 应该通过授权服务拿到短期 access token，token 有 scope、audience、tenant 和 expires_at。MCP Server 校验 token 后还要做 resource 和 action 级权限判断，高风险 tool 仍然走 approval 和 audit。

## RAG 安全答题模板

> 企业 RAG 安全重点是权限过滤和引用可信。检索前先按 tenant、workspace、ACL、classification、status 和 effective time 过滤，缓存 key 包含 user_scope_hash 和 knowledge_version。Citation 只能来自过滤后的 chunks，避免答案正文安全但引用标题泄漏。

## 追问准备

| 追问 | 你可以补充 |
|---|---|
| 如果模型绕过审批怎么办 | 审批在执行层，不在模型层；没有 approval_id 不执行 |
| 如果网页告诉 Agent 上传文件怎么办 | 第三方内容不具备授权能力，上传属于敏感外发，必须用户确认 |
| 如果用户有权限但 Agent 没权限呢 | run token 取用户权限和 Agent policy 的交集 |
| 如果安全策略误杀怎么办 | reason_code、policy_version、灰度、人工复核和回滚 |
| 如何量化安全 | policy_denied、injection_detected、pii_redacted、approval_rate、red team pass rate |

## 面试表达

可以这样总结：

> 我会把 Agent 安全拆成三条线：数据线控制 RAG、Memory 和 Trace 的权限与脱敏；工具线控制 schema、scope、risk、approval 和 sandbox；运行线控制 guardrails、budget、rate limit、observability 和 red team regression。这样既能解释风险，也能落到代码、测试和上线门禁。

## 准备清单

- [ ] 能讲 Prompt Injection 的多层防线。
- [ ] 能讲工具风险分级和审批参数哈希。
- [ ] 能讲 MCP OAuth / scope / token / audience。
- [ ] 能讲 RAG ACL、citation、cache isolation。
- [ ] 能讲 Computer Use 高风险动作确认。
- [ ] 能讲安全指标和红队回归。