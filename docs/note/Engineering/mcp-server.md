# MCP Server 工程化

## 这一节解决什么问题

AI Agent 需要调用大量外部工具来完成任务。每个工具的接入都需要写适配代码：定义工具 schema、实现参数校验、处理错误、管理权限。当工具数量增多时，接入成本线性增长。MCP（Model Context Protocol）解决的是"怎么标准化工具接入，让工具开发者和 Agent 开发者各管各的"的问题。工程化关注的是"怎么让 MCP Server 在生产环境中可靠运行"。

## 核心概念

**MCP（Model Context Protocol）**：Anthropic 提出的标准化协议，定义模型和外部工具、数据源之间的通信规范。

**Tools**：MCP Server 暴露的可调用能力。每个 Tool 定义了名称、描述、参数 schema 和执行函数。

**Resources**：MCP Server 暴露的可读取数据源。Resources 是只读的，模型可以获取资源内容但不能修改。

**Prompts**：MCP Server 暴露的预定义 Prompt 模板。Host 应用可以用这些模板构建更好的上下文。

**MCP Server 的职责**：注册工具、校验参数、执行操作、返回结果、记录日志、管理权限。

**MCP 和 Function Calling 的关系**：Function Calling 是模型能力（模型怎么表达调用意图），MCP 是协议标准（工具怎么被发现和接入）。两者互补。

## 工程化设计

一个生产级 MCP Server 需要处理以下工程问题：

**工具注册**：每个工具需要定义清晰的名称、描述、参数 schema。描述要说明工具的用途和适用场景，参数 schema 要标注类型、必填性、取值范围。这些信息直接影响模型的调用准确率。

**参数校验**：模型生成的参数可能不符合 schema 定义，需要在执行前做严格校验。校验失败时返回清晰的错误信息，让模型知道参数哪里不对。

**权限控制**：不同工具有不同的权限要求。只读工具可以直接执行，写入工具可能需要人工确认，高风险工具可能被禁止自动调用。

**错误处理**：工具执行可能失败（网络超时、服务不可用、参数错误）。错误信息需要结构化返回，包含错误类型、错误描述、是否可重试。

**日志与审计**：记录每次工具调用的输入、输出、执行时间、调用者身份，用于调试和安全审计。

## 最小实现思路

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("my-agent-tools")

# 工具注册
@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="query_order",
            description="查询订单状态。根据订单号查询订单的当前状态、物流信息。",
            inputSchema={
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "订单号",
                    },
                },
                "required": ["order_id"],
            },
        ),
    ]

# 工具执行
@server.call_tool()
async def call_tool(name: str, arguments: dict):
    # 参数校验
    if name == "query_order":
        order_id = arguments.get("order_id")
        if not order_id or not isinstance(order_id, str):
            return [TextContent(type="text", text="错误：order_id 必须是非空字符串")]

        # 执行
        try:
            result = await query_order_from_db(order_id)
            return [TextContent(type="text", text=str(result))]
        except OrderNotFoundError:
            return [TextContent(type="text", text=f"错误：订单 {order_id} 不存在")]
        except Exception as e:
            return [TextContent(type="text", text=f"错误：查询失败 - {str(e)}")]

    return [TextContent(type="text", text=f"错误：未知工具 {name}")]
```

## 生产环境注意点

**Schema 质量**：工具描述和参数 schema 是模型选择工具的依据。描述不清楚会导致模型调用错误，schema 不准确会导致参数校验失败。需要投入时间打磨每个工具的 schema。

**版本管理**：工具 schema 变更时需要考虑向后兼容。删除参数、修改参数类型可能导致已有的调用失败。

**超时控制**：工具执行可能很慢（如数据库查询、外部 API 调用），需要设置超时时间，超时后返回错误而不是无限等待。

**并发控制**：MCP Server 可能同时收到多个调用请求，需要考虑并发安全。共享资源（如数据库连接池）需要做并发控制。

**健康检查**：MCP Server 需要暴露健康检查端点，让 Host 应用知道 Server 是否可用。

## 常见误区

1. **Schema 描述写得太简略**：模型需要通过描述理解工具用途，描述不清楚会降低调用准确率。
2. **不做参数校验**：模型生成的参数可能有格式错误或类型错误，必须校验。
3. **错误信息不结构化**：错误信息需要让模型能理解，方便模型决定是否重试或换一种方式。
4. **不做版本管理**：工具 schema 变更可能导致已有调用失败。
5. **把 MCP 当作万能方案**：简单的工具集成直接用 Function Calling 就够了，不需要引入 MCP。

## 面试表达

MCP 是 Anthropic 提出的标准化协议，解决工具接入的标准化问题。MCP Server 的职责是注册工具、校验参数、执行操作、返回结果。工程上需要关注 Schema 质量（描述和参数定义直接影响调用准确率）、参数校验（模型生成的参数可能不符合预期）、错误处理（结构化错误信息让模型能理解）、权限控制（不同工具有不同的权限要求）。

MCP 和 Function Calling 的关系是互补：Function Calling 是模型能力，MCP 是协议标准。MCP Server 暴露工具，Function Calling 让模型表达调用意图。简单的工具集成直接用 Function Calling 就够了，MCP 适合工具数量多、需要标准化接入的场景。

## 相关链接

- [Tool Calling](/note/AI-Agent/tool-calling) — 工具调用机制
- [API 安全](/note/Engineering/api-security) — 权限控制和安全审查
- [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) — MCP 面试题
