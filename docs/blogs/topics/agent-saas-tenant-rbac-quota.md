# Agent SaaS 多租户、RBAC 与配额设计

## 这篇文章解决什么问题

Agent SaaS 不是把个人 Demo 放到线上。只要有团队、客户、付费套餐和外部工具，就必须处理多租户隔离、角色权限、额度配额、审计和成本控制。

这篇文章整理 Agent SaaS 中 tenant、workspace、RBAC、quota 和 billing 的基础设计。

## 基础对象模型

```text
Tenant
  └── Workspace
        ├── User / Member
        ├── Role / Permission
        ├── Agent Config
        ├── Tool Policy
        ├── Knowledge Base
        ├── Task / Run / Trace
        └── Quota / Usage
```

| 对象 | 说明 |
|---|---|
| tenant | 客户或组织 |
| workspace | 团队空间或项目空间 |
| member | 用户在 workspace 中的身份 |
| role | admin、operator、viewer、billing 等 |
| permission | 可执行动作和可访问资源 |
| quota | token、任务、工具调用、存储、并发等额度 |
| usage | 实际消耗记录 |

## RBAC 设计

| 角色 | 能力 |
|---|---|
| Owner | 管理账单、成员、全局配置 |
| Admin | 配置 Agent、工具、知识库、权限 |
| Operator | 处理任务、审批工具、人工接管 |
| Member | 创建和查看自己的任务 |
| Viewer | 只读查看结果和报表 |
| Billing | 查看用量和发票 |

RBAC 要落到具体 action，例如 task:create、tool:approve、kb:write、billing:read，而不是只写“管理员”。

## Tool Policy 与角色绑定

不同角色可见工具不同：

| 工具 | Viewer | Member | Operator | Admin |
|---|---|---|---|---|
| search_kb | 允许 | 允许 | 允许 | 允许 |
| create_ticket | 禁止 | 允许 | 允许 | 允许 |
| send_email | 禁止 | 禁止 | 需审批 | 允许 |
| delete_record | 禁止 | 禁止 | 禁止 | 需审批 |
| manage_users | 禁止 | 禁止 | 禁止 | 允许 |

模型不应该知道被隐藏的工具。工具列表应先按 tenant、role、task_type、risk_level 过滤。

## 配额设计

| 配额 | 示例 |
|---|---|
| token_quota | 每月 10M tokens |
| task_quota | 每月 5000 个任务 |
| tool_call_quota | 每月 20000 次工具调用 |
| storage_quota | 10GB 知识库 |
| concurrent_runs | 同时 5 个长任务 |
| browser_minutes | 每月 1000 分钟浏览器自动化 |
| premium_model_quota | 高级模型调用额度 |

配额要能按 tenant、workspace、user、task_type 统计。

## 成本账本

每次 run 都要记录：

```text
run_id
tenant_id
workspace_id
user_id
task_type
model
input_tokens
output_tokens
tool_calls
browser_minutes
storage_delta
cost_estimate
billing_plan
```

没有用量账本，就无法做套餐、限流、成本优化和异常检测。

## 多租户隔离

隔离点包括：

- 数据库查询必须带 tenant_id。
- RAG metadata filter 必须带 tenant/workspace。
- 缓存 key 必须包含 tenant_id。
- 向量库 collection 或 filter 必须隔离。
- MCP 凭证按 tenant/workspace 隔离。
- Trace 和日志按租户权限查看。
- 评测样本和训练数据不能跨租户混用。

## 超额和降级策略

| 情况 | 策略 |
|---|---|
| token 接近上限 | 提醒、限制高级模型 |
| task 超额 | 阻止新任务或引导升级 |
| 并发超限 | 排队或拒绝低优先级任务 |
| 工具调用异常高 | 风控检查和临时限流 |
| 成本异常 | 自动切换低成本模型或暂停批任务 |

## 面试表达

> Agent SaaS 必须从第一天设计多租户、RBAC 和配额。我的模型会包含 tenant、workspace、member、role、permission、quota 和 usage。工具列表按 tenant、role、task_type 和 risk_level 过滤，高风险工具绑定 approval。用量账本记录 run_id、tenant_id、model、tokens、tool_calls、browser_minutes 和 cost_estimate。隔离上数据库、RAG metadata、缓存 key、MCP 凭证、Trace 查看和训练数据都要带租户边界。这样才能做商业化套餐、成本控制和企业级安全。

## 相关链接

- [Agent SaaS 产品化](/topics/agent-saas-productization)
- [企业知识库权限与多租户 RAG](/note/Engineering/enterprise-rag-permission-multitenancy)
- [LLM 成本与延迟优化](/note/Engineering/llm-cost-latency-optimization)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [AI Agent PRD 模板](/topics/ai-agent-prd-template)
