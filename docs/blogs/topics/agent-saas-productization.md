# Agent SaaS 产品化：从个人 Demo 到可卖的产品

## 这篇文章解决什么问题

很多 AI Agent 项目能在本地跑，但离“产品”还有很远：

- 没有账号和组织。
- 没有套餐、额度和计费。
- 没有团队协作和权限。
- 没有使用量统计。
- 没有失败处理和客服入口。
- 没有数据隔离。
- 没有产品 onboarding。
- 没有留存和反馈指标。

Agent SaaS 产品化的目标是把技术能力变成用户愿意持续使用的产品系统。

## 产品化能力地图

| 层级 | 核心问题 |
|---|---|
| 用户体系 | 谁在用？个人还是组织？ |
| 租户体系 | 数据如何隔离？团队如何协作？ |
| 权限体系 | 谁能看、谁能执行、谁能审批？ |
| 额度体系 | 每月调用多少次、多少 token？ |
| 计费体系 | 免费、试用、订阅、按量？ |
| 任务体系 | 用户提交什么任务，如何查看状态？ |
| 反馈体系 | 用户如何纠错、评价、转人工？ |
| 运维体系 | 如何监控成本、延迟、失败？ |
| 合规体系 | 数据如何存储、删除、导出？ |

## 多租户设计

最小多租户字段：

- tenant_id。
- user_id。
- role。
- workspace_id。
- project_id。

所有核心表都要考虑 tenant_id：

- documents。
- chunks。
- tasks。
- runs。
- tool_calls。
- feedback。
- billing_usage。
- audit_logs。

RAG 和工具调用都必须带 tenant filter。

## 套餐与额度

套餐可以按：

| 维度 | 示例 |
|---|---|
| 调用次数 | 每月 1000 次 Agent run |
| Token | 每月 500 万 token |
| 文档量 | 1GB / 10GB / 100GB |
| 成员数 | 1 / 5 / 50 人 |
| 工具数 | 只读工具 / 写工具 / 自定义 MCP |
| 评测 | 基础评测 / 高级评测 |
| SLA | 社区支持 / 企业支持 |

额度系统要记录真实消耗：

```json
{
  "tenant_id": "t_001",
  "run_id": "run_123",
  "input_tokens": 5000,
  "output_tokens": 900,
  "tool_calls": 3,
  "cost_cents": 2.4,
  "billing_category": "rag_answer"
}
```

## Onboarding

用户第一次使用 Agent SaaS，不能只看到一个聊天框。需要引导：

- 选择使用场景。
- 上传示例文档。
- 配置数据源。
- 邀请团队成员。
- 设置权限。
- 跑一个示例任务。
- 展示 Trace / 引用 / 反馈入口。

好的 onboarding 会显著提升留存。

## 产品指标

| 指标 | 含义 |
|---|---|
| activation rate | 用户是否完成首次有效任务 |
| task success rate | Agent 任务成功率 |
| time to value | 从注册到得到价值耗时 |
| retention | 次日/7日/30日留存 |
| cost per active user | 单活跃用户成本 |
| feedback rate | 用户是否愿意反馈 |
| human escalation rate | 转人工比例 |
| expansion | 团队成员和用量增长 |

技术指标要和产品指标一起看。

## 用户信任设计

Agent SaaS 要让用户相信系统：

- 回答带引用。
- 工具调用可审批。
- 高风险动作可撤销或确认。
- 数据来源可查看。
- 执行过程可追踪。
- 错误能解释和重试。
- 用户能导出或删除数据。

信任比“模型很聪明”更重要。

## 客服与运营后台

SaaS 需要运营后台：

- 查看租户用量。
- 查看失败任务。
- 查看成本异常。
- 查看用户反馈。
- 手动重跑任务。
- 禁用异常工具。
- 调整额度。
- 导出审计日志。

没有后台，线上问题只能查数据库。

## 面试表达模板

> 我会把 Agent SaaS 产品化拆成用户体系、租户隔离、权限、额度计费、任务状态、反馈闭环和运维后台。技术上不仅要做模型调用，还要记录每个 tenant 的 token、工具调用、成本和任务结果；RAG 检索和工具执行都必须带 tenant_id 权限过滤。产品上要设计 onboarding、任务面板、引用证据、工具审批和反馈入口，让用户能理解和控制 Agent。运营上要有用量、成本、失败任务、反馈和审计后台，这样系统才从 Demo 变成可运营产品。

## 作品集亮点

如果做 Agent SaaS 项目，可以突出：

- 多租户数据隔离。
- Token / 用量计费。
- 团队权限和审批。
- Agent 任务面板。
- RAG 引用和反馈。
- 运维后台。
- 成本监控和限额。

## 相关链接

- [Agent UI 产品化设计](/topics/agent-ui-product-design)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [Agent 反馈闭环](/note/Engineering/agent-feedback-loop)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
