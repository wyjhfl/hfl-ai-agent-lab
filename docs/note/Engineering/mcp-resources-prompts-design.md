# MCP Resources and Prompts Design：MCP 不只是 Tools

## 这篇文章解决什么问题

很多人一提 MCP 就想到 tools，但 MCP 还包括 resources 和 prompts。真正可维护的 MCP Server 不能把所有东西都做成工具：只读上下文应该用 resource，固定工作流模板可以用 prompt，有副作用的动作才适合 tool。

这篇文章说明 Tools、Resources、Prompts 的边界怎么划分。

## 三类能力边界

| 类型 | 适合放什么 | 不适合放什么 |
|---|---|---|
| Tools | 可执行动作、外部 API、写入操作 | 大量只读文档上下文 |
| Resources | 文件、数据库记录、schema、runbook、知识片段 | 需要模型决定执行的动作 |
| Prompts | 固定任务流程、分析模板、总结模板 | 动态权限敏感操作 |

## Resource 设计

Resource 适合暴露“可读取上下文”，例如：

| Resource | URI 示例 | 用途 |
|---|---|---|
| 文档 | docs://policy/refund-v3 | RAG 证据 |
| 工单 | ticket://tenant-a/123 | 客服上下文 |
| 数据库 schema | schema://orders/v2 | NL2SQL 约束 |
| Runbook | runbook://incident/model-latency | 运维处理流程 |
| Trace | trace://run/abc | 失败复盘 |

Resource 必须做权限过滤，不要让用户看到没有权限的 URI。

## Prompt 设计

Prompt 不是随便写一段提示词，而是“可复用工作流模板”。

| Prompt | 输入 | 输出 |
|---|---|---|
| incident_summary | trace_id、time_range | 事故摘要 |
| ticket_triage | ticket_id、customer_tier | 分诊建议 |
| rag_eval_report | eval_run_id | 评测报告 |
| code_review_plan | repo、diff | 审查计划 |

Prompt 应该声明参数、适用场景、输出格式和禁止事项。

## Tool 仍然需要治理

Tool 适合会触发动作的能力：

- create_ticket
- send_email
- update_database
- run_sql
- deploy_service
- create_invoice

这些工具需要 schema、risk_level、auth_scope、approval、timeout、audit log。

## 常见设计错误

| 错误 | 后果 |
|---|---|
| 把文档读取做成 search_tool | 权限和缓存难治理 |
| 把固定总结流程写死在 Agent prompt | 无法复用和测试 |
| 所有资源 URI 都暴露 | 跨租户泄漏 |
| Tool 返回大量原始数据 | 模型上下文污染 |
| Prompt 没有输出 schema | 前端和后端无法消费 |

## Agent Runtime 怎么用

一个 Agent Run 可以按顺序使用三类能力：

1. 读取 Resources 获取上下文。
2. 选择 Prompt 模板生成计划或报告。
3. 在必要时调用 Tools 执行动作。
4. 把 Tool 结果写入 Trace，并把新上下文变成 Resource。

## 面试表达

可以这样讲：

> 我不会把 MCP 理解成“工具调用协议”这么窄。MCP 里 Tools、Resources、Prompts 各有边界：Resources 暴露只读上下文，Prompts 沉淀可复用工作流，Tools 执行有副作用动作。这样 Agent 不需要把所有上下文都塞进工具返回，也能更好地做权限、缓存、审计和测试。

## 落地检查清单

- [ ] 只读上下文是否优先设计成 Resource？
- [ ] 固定流程是否沉淀成 Prompt？
- [ ] 有副作用动作是否放 Tool 并加 risk_level？
- [ ] Resource URI 是否做租户和角色过滤？
- [ ] Prompt 是否有参数和输出格式？
- [ ] Tool 是否有结构化错误和审计？