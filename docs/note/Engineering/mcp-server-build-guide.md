# MCP Server 创建实战：从工具函数到可接入 Agent 的服务

## 这篇文章解决什么问题

很多人理解 MCP 时只停留在“给 AI 接工具”。但真正落地时，问题会变成：

- 工具怎么被发现？
- 参数 schema 怎么设计？
- 工具失败怎么返回？
- 资源和工具怎么区分？
- 本地 stdio 和远程 HTTP 怎么选？
- 鉴权、审计、超时、幂等怎么做？
- 怎么证明这个 MCP Server 可用？

这篇文章从工程实践角度整理一个 MCP Server 的创建流程，重点不是背协议名词，而是把一个普通函数变成 Agent 可以安全调用、可测试、可审计的工具服务。

## MCP Server 的定位

MCP Server 是连接 AI 应用和外部系统的标准化能力提供方。它可以暴露三类核心能力：

| 能力 | 谁控制 | 适合承载什么 |
|---|---|---|
| Tools | 模型可选择调用 | 查询数据库、调用 API、执行计算、创建工单 |
| Resources | 应用或用户选择提供上下文 | 文件、数据库 schema、文档、配置、只读资料 |
| Prompts | 用户主动选择的模板 | 代码审查提示、巡检模板、业务分析模板 |

工程上要先分清：不是所有东西都应该做成 Tool。只读资料优先做 Resource；固定操作流程可以做 Prompt；真正需要执行外部动作的能力才做 Tool。

## 创建 MCP Server 的流程

### 1. 选一个小而明确的业务能力

不要一开始就做“万能业务系统 MCP”。先选一个边界清楚的能力，例如：

- 查询工单状态。
- 检索知识库文档。
- 生成设备故障排查清单。
- 查询项目 release 状态。
- 写入一条人工审核后的运营备注。

好的 MCP Tool 应该满足：

- 名称清晰。
- 输入参数少但明确。
- 输出结构稳定。
- 失败原因可解释。
- 权限边界清楚。

### 2. 设计工具 schema

Schema 是模型选择和调用工具的依据。描述不能只写“查询数据”，要说明用途、输入格式、限制条件和返回结果。

```json
{
  "name": "search_knowledge_base",
  "description": "Search troubleshooting documents for equipment after-sales diagnosis. Use when the user asks for causes, repair steps, required evidence, or known failure patterns.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The user's troubleshooting question or failure symptom."
      },
      "equipment_type": {
        "type": "string",
        "description": "Optional equipment category used for metadata filtering."
      },
      "top_k": {
        "type": "integer",
        "description": "Maximum number of documents to return. Default is 5.",
        "minimum": 1,
        "maximum": 10
      }
    },
    "required": ["query"]
  }
}
```

Schema 设计的关键是让模型知道什么时候该用、怎么用、不要怎么用。

### 3. 明确返回结构

不要只返回一大段自然语言。生产级工具应该返回结构化结果，方便模型继续推理，也方便 Trace 和评测。

```json
{
  "ok": true,
  "results": [
    {
      "doc_id": "manual-2026-001",
      "title": "Pump overheating troubleshooting",
      "snippet": "Check fan obstruction, lubricant level, and current draw.",
      "score": 0.82,
      "source": "maintenance_manual"
    }
  ],
  "trace": {
    "query_id": "kbq_20260606_001",
    "latency_ms": 183
  }
}
```

这样 Agent 后续可以引用 `doc_id`、展示 `source`、记录 `latency_ms`，而不是只能处理一段不可追踪文本。

### 4. 给错误返回分类

MCP Tool 失败时，错误信息要能指导模型下一步动作。

| 错误类型 | 示例 | 模型应该怎么处理 |
|---|---|---|
| 参数错误 | `query is required` | 修正参数后重试 |
| 权限不足 | `missing scope: ticket:write` | 请求用户授权或停止 |
| 外部服务超时 | `upstream timeout` | 可重试或降级 |
| 资源不存在 | `ticket not found` | 告知用户并请求确认 |
| 业务规则拒绝 | `ticket is closed` | 解释原因，不应重试 |

错误返回要包含是否可重试、是否需要人工介入、是否可以降级。

## 本地 stdio 和远程 HTTP 怎么选

| 方式 | 适合场景 | 注意事项 |
|---|---|---|
| stdio | 本地开发、文件系统、命令行工具、个人工作流 | 凭据通常从环境变量读取；进程生命周期由 Host 管理 |
| Streamable HTTP | 远程服务、团队共享、Web 系统集成 | 需要考虑鉴权、网络、限流、审计和部署 |

个人项目可以从 stdio 开始，降低复杂度。团队级工具或需要多人共享的业务能力，应该逐步演进到 HTTP。

## 最小工程结构

一个可维护的 MCP Server 不应该只有一个大文件。建议拆成：

```text
mcp-server/
├── pyproject.toml
├── src/
│   ├── server.py
│   ├── tools/
│   │   ├── search_kb.py
│   │   └── ticket_status.py
│   ├── resources/
│   │   └── schema_docs.py
│   ├── auth.py
│   ├── errors.py
│   └── telemetry.py
└── tests/
    ├── test_tools.py
    └── test_schema.py
```

工程分层的目标是把协议层、业务逻辑、权限、错误处理和测试分开。否则工具数量一多，MCP Server 会变成难以维护的脚本集合。

## 一个工具的实现模板

下面是伪代码模板，重点展示边界，不绑定具体 SDK。

```python
async def search_knowledge_base(arguments: dict, context: ToolContext) -> dict:
    query = arguments.get("query")
    top_k = arguments.get("top_k", 5)

    if not isinstance(query, str) or not query.strip():
        return {
            "ok": False,
            "error": {
                "type": "validation_error",
                "message": "query must be a non-empty string",
                "retryable": False,
            },
        }

    if not context.authz.can("kb:read"):
        return {
            "ok": False,
            "error": {
                "type": "permission_denied",
                "message": "missing permission: kb:read",
                "retryable": False,
                "requires_user_action": True,
            },
        }

    try:
        results = await kb.search(query=query, top_k=top_k)
    except TimeoutError:
        return {
            "ok": False,
            "error": {
                "type": "upstream_timeout",
                "message": "knowledge base search timed out",
                "retryable": True,
            },
        }

    return {
        "ok": True,
        "results": [item.to_dict() for item in results],
        "trace": {
            "tool": "search_knowledge_base",
            "result_count": len(results),
        },
    }
```

这段模板体现了四件事：参数校验、权限校验、错误分类、结构化返回。

## 权限设计

MCP Server 暴露的是能力，不只是数据。因此权限要按工具风险分级。

| 风险等级 | 示例 | 策略 |
|---|---|---|
| 低风险只读 | 查询公开文档、读取 schema | 可直接调用，记录日志 |
| 中风险读取 | 查询用户工单、内部报表 | 需要用户身份和 scope |
| 高风险写入 | 创建工单、修改配置、发送消息 | 需要显式确认或审批 |
| 危险操作 | 删除数据、执行 shell、批量变更 | 默认禁用或只允许人工流程 |

HTTP 传输下可以按 OAuth 2.1 思路做授权；stdio 场景通常从环境变量读取凭据，但仍然需要最小权限和审计。

## Trace 与审计

每次工具调用都应该记录：

- `run_id`
- `tool_name`
- `caller`
- `arguments_summary`
- `result_status`
- `latency_ms`
- `error_type`
- `permission_scope`
- `timestamp`

注意不要把敏感参数、密钥、完整用户隐私直接写入日志。日志应该能复盘问题，但不能成为数据泄漏源。

## 测试清单

一个 MCP Server 至少需要覆盖：

- 工具列表是否能正常暴露。
- 每个工具 schema 是否包含名称、描述、参数和 required。
- 正常参数能返回结构化结果。
- 缺失参数能返回 validation error。
- 权限不足能返回 permission denied。
- 外部服务超时能返回 retryable error。
- 高风险工具不会绕过人工审批。
- 日志不包含密钥。

如果工具会写入外部系统，还要加幂等测试，避免模型重复调用造成重复写入。

## 与 Agent 项目的结合

在项目 A 的 RAG 工单系统中，MCP Server 可以暴露：

- `search_manuals`
- `get_ticket_detail`
- `create_workorder_draft`
- `list_failure_patterns`

在项目 B 的多 Agent 运营中台中，MCP Server 可以暴露：

- `query_campaign_metrics`
- `create_operator_task`
- `summarize_incident`
- `get_policy_document`
- `request_human_approval`

这些工具都应该接入 Trace，让每次 Agent 决策能追溯到具体工具结果。

## 面试表达

可以这样回答 MCP Server 创建：

> 我不会把 MCP 理解成“把函数暴露给模型”这么简单。一个可用的 MCP Server 首先要区分 Tools、Resources 和 Prompts：写操作和外部动作做成 Tool，只读上下文做成 Resource，固定工作流做成 Prompt。工程上我会先设计工具 schema，明确参数、描述、权限和返回结构；再做参数校验、错误分类、超时、审计和 Trace；最后用测试覆盖正常调用、参数错误、权限不足和外部服务失败。对于本地工具可以先用 stdio，团队共享或业务系统接入再上 HTTP，并按 OAuth/Scope 做最小权限控制。

## 常见误区

### 误区一：把所有能力都做成 Tool

只读资料应该优先做 Resource，固定提示模板应该做 Prompt。Tool 应该留给真正需要执行动作的能力。

### 误区二：工具描述过短

模型选择工具依赖名称、描述和 schema。描述太短会导致误调用或漏调用。

### 误区三：没有权限分级

读取、写入、删除、发送消息不是同一个风险级别。高风险工具必须有审批或人工确认。

### 误区四：没有幂等

模型可能重复调用工具。写入类工具必须设计幂等键或重复检测。

### 误区五：没有 Trace

没有 Trace 就无法解释 Agent 为什么调用了某个工具，也无法复盘线上问题。

## 相关链接

- [MCP Server 工程化](/note/Engineering/mcp-server)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Tool Calling](/note/AI-Agent/tool-calling)
- [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview)

## 参考资料

- [Model Context Protocol: Architecture overview](https://modelcontextprotocol.io/docs/learn)
- [Model Context Protocol: Understanding MCP servers](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [Model Context Protocol: Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [Model Context Protocol: Resources](https://modelcontextprotocol.io/docs/concepts/resources)
- [Model Context Protocol: Prompts](https://modelcontextprotocol.io/docs/concepts/prompts)
- [Model Context Protocol: Authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)

