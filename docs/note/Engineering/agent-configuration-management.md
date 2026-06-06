# Agent Configuration Management：Agent 配置治理怎么做

## 这篇文章解决什么问题

Agent 系统越往生产走，越会出现大量配置：模型路由、Prompt 版本、工具白名单、审批策略、RAG 参数、Memory 策略、预算、限流、灰度比例、安全规则。如果这些配置散落在代码、环境变量和临时后台页面里，就很难解释“线上这个 Agent 到底按什么策略在运行”。

Agent Configuration Management 的目标是把配置变成可版本化、可审计、可灰度、可回滚、可评测的工程资产。

## 哪些配置需要治理

| 配置类型 | 示例 |
|---|---|
| 模型配置 | model route、fallback、temperature、max tokens |
| Prompt 配置 | prompt_version、变量、system policy |
| RAG 配置 | top_k、rerank、filter、context budget |
| 工具配置 | allowlist、risk_level、approval policy |
| MCP 配置 | server_id、schema_version、scope、timeout |
| Memory 配置 | read/write policy、retention、forget rule |
| 安全配置 | injection policy、PII mask、deny rule |
| 成本配置 | token budget、tenant quota、model mix |
| 发布配置 | stage、canary、rollback target |

配置治理的关键是：同一次 run 必须能还原当时使用的完整配置快照。

## 配置对象模型

建议定义 Agent Profile：

| 字段 | 说明 |
|---|---|
| profile_id | 配置标识 |
| agent_id | Agent 标识 |
| version | 配置版本 |
| stage | dev、staging、canary、prod |
| model_policy | 模型路由和 fallback |
| prompt_policy | prompt_version 和变量策略 |
| rag_policy | 检索、重排、上下文预算 |
| tool_policy | 工具白名单和风险策略 |
| approval_policy | 审批规则 |
| memory_policy | 记忆读写策略 |
| safety_policy | 安全拦截策略 |
| budget_policy | token、成本、超时和 step 预算 |
| owner | 配置负责人 |
| changelog | 变更说明 |

业务代码只引用 profile_id 和 version，具体策略由 Control Plane 下发。

## 配置变更流程

生产配置不应该随手改。推荐流程：

1. 创建配置草稿。
2. 自动校验 schema。
3. 跑 contract test。
4. 跑 smoke eval。
5. 对高风险变更请求审批。
6. 发布到 staging。
7. 小流量 canary。
8. 观察质量、成本、延迟和安全指标。
9. 全量发布或回滚。

这和代码发布类似，只是发布对象变成 Prompt、模型路由、工具策略和 RAG 参数。

## 配置快照

每次 Agent run 都应保存配置快照：

- profile_id
- profile_version
- prompt_version
- model_route_version
- tool_policy_version
- rag_policy_version
- safety_policy_version
- budget_policy_version
- release_stage

不要只保存“当前配置”。因为事故复盘时，当前配置可能已经变了，必须能还原当时版本。

## 回滚策略

配置回滚要满足：

| 场景 | 回滚方式 |
|---|---|
| Prompt 质量退化 | 回到上一 prompt_version |
| 新模型成本过高 | 切回旧 model_route |
| 工具错误率升高 | 禁用工具或切回旧 schema |
| RAG 召回退化 | 回滚 index_version / rag_policy |
| 安全误拦截 | 回滚 safety_policy 或降级策略 |
| 租户投诉 | 单租户回滚 profile |

配置回滚要比代码回滚更快，因为很多 Agent 事故来自策略变更。

## 审计和权限

配置系统本身要做权限控制：

- 谁能查看生产配置？
- 谁能修改 Prompt？
- 谁能启用高风险工具？
- 谁能提高预算？
- 谁能跳过 eval gate？
- 谁能回滚？

每次配置变更都要写 Audit Log，包括变更人、变更前后 diff、审批人、发布时间和影响范围。

## 面试表达模板

我会把 Agent 配置当成工程资产管理，而不是散落在代码里。每个 Agent 有 profile_id 和 version，里面包含 model_policy、prompt_policy、rag_policy、tool_policy、approval_policy、safety_policy 和 budget_policy。配置变更要跑 schema 校验、contract test、smoke eval 和 canary；每次 run 保存配置快照，事故复盘时能还原当时的 Prompt、模型、工具和策略版本。

## 常见误区

### 误区一：配置放环境变量就够了

环境变量适合基础连接信息，不适合治理 Prompt、工具策略、灰度和评测门禁。

### 误区二：配置越灵活越好

配置越灵活，越需要权限、审批、测试和回滚，否则会引入隐蔽风险。

### 误区三：只记录当前配置

事故复盘需要历史配置快照，而不是当前配置。

## 相关链接

- [Agent Control Plane](/note/Engineering/agent-control-plane)
- [PromptOps：Prompt 版本、评测和回滚](/note/Engineering/promptops-versioning)
- [Agent Release Gate](/note/Engineering/agent-release-gate)
- [Agent 审计日志设计](/note/Engineering/agent-audit-log-design)
