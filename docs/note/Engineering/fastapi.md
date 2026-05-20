# FastAPI 后端接口

## 这一节解决什么问题

AI 应用需要一个稳定的后端服务来接收用户请求、调度模型调用、执行工具操作、管理会话状态并返回结果。FastAPI 是 Python 生态中最适合做这件事的框架——它原生支持异步、自带参数校验和 API 文档、性能优秀。

本节会系统讲解 FastAPI 在 AI 应用后端中的核心用法，包括路由设计、请求校验、异步处理、长任务管理、错误处理和部署相关的工程要点。

## 核心概念

### 路由设计

AI 应用的路由需要覆盖几个核心场景：用户对话、Agent 执行、任务状态查询、工具调用和健康检查。

```text
POST /api/v1/chat          # 用户对话入口
POST /api/v1/agent/run     # Agent 执行入口
GET  /api/v1/task/{id}     # 查询任务状态
POST /api/v1/tool/execute  # 工具调用入口
GET  /health               # 健康检查
```

路由设计原则：语义清晰（一看就知道做什么）、版本可控（通过 `/v1/` 前缀管理版本）、参数校验严格（每个接口都有明确的输入输出定义）。

### 请求和响应模型

使用 Pydantic 模型定义请求体和响应体。Pydantic 会自动校验参数类型、自动生成 JSON Schema、自动提供类型提示。

```python
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    tools: list[str] | None = None

class ChatResponse(BaseModel):
    reply: str
    tool_calls: list[dict] | None = None
    session_id: str
```

请求模型定义"用户能传什么"，响应模型定义"系统会返回什么"。两者都应该有明确的字段定义和类型约束。

### Pydantic 参数校验

Pydantic 不只是做类型检查，还可以做范围约束、正则匹配、自定义校验器。这在 AI 应用中很重要——比如限制消息长度、校验工具名称格式、验证会话 ID 合法性。

```python
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    session_id: str | None = Field(None, pattern=r"^[a-zA-Z0-9_-]+$")
```

### 异步接口

Agent 执行通常耗时较长（几秒到几十秒），必须用异步接口避免阻塞。

```python
@app.post("/api/v1/chat")
async def chat(request: ChatRequest):
    result = await agent.execute(request.message)
    return ChatResponse(reply=result.output, session_id=request.session_id)
```

FastAPI 的 `async def` 接口会自动在异步事件循环中运行，不会阻塞其他请求。

### 长任务处理

对于执行时间特别长的任务（如复杂的多 Agent 协作），同步等待不现实。常见方案：

- **后台任务**：用 `BackgroundTasks` 在后台执行，客户端轮询查询结果
- **WebSocket**：服务端主动推送执行进度和结果
- **轮询**：客户端定期查询任务状态

选择哪种方案取决于场景：简单任务用同步接口，中等耗时用轮询，需要实时进度用 WebSocket。

### 错误处理

统一的错误处理机制是后端稳定性的基础。

```python
class AgentError(Exception):
    def __init__(self, message: str, code: str = "AGENT_ERROR"):
        self.message = message
        self.code = code

@app.exception_handler(AgentError)
async def agent_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": exc.message, "code": exc.code}
    )
```

需要处理的错误类型：模型调用超时、工具执行失败、参数校验错误、权限不足、上下文过长。每种错误都应该有明确的错误码和错误信息，方便前端处理和日志排查。

### 中间件

中间件用于在请求处理前后执行通用逻辑。在 AI 应用中常见的中间件：

- **请求日志**：记录每个请求的路径、参数、耗时
- **CORS**：处理跨域请求
- **限流**：防止恶意请求或过载
- **认证**：验证用户身份
- **请求 ID**：为每个请求生成唯一 ID，方便链路追踪

### 健康检查

健康检查接口是部署和监控的基础。它应该验证服务是否正常运行，包括：模型服务是否可达、数据库是否连通、依赖服务是否可用。

```python
@app.get("/health")
async def health_check():
    return {"status": "ok", "model": await check_model(), "db": await check_db()}
```

## 为什么重要

FastAPI 在 AI 应用后端中的价值体现在多个方面。

首先，**原生异步支持**。AI 应用的核心操作（模型调用、工具执行）都是 I/O 密集型的，FastAPI 的异步接口能高效处理并发请求，不会因为一个长任务阻塞整个服务。

其次，**自动参数校验**。Pydantic 模型自动校验请求参数，减少无效请求进入业务逻辑层。这在 Agent 系统中特别重要——无效的工具名称、格式错误的参数都会导致模型调用失败。

再次，**自动 API 文档**。FastAPI 自动生成 OpenAPI 文档，方便前端对接和调试。Agent 系统的接口通常比较复杂（多种输入输出格式），自动生成的文档能显著降低沟通成本。

最后，**生态兼容性**。FastAPI 和 Python 的 AI 生态（LangChain、OpenAI SDK、各种向量数据库客户端）完全兼容，不需要额外的适配层。

## 工程化理解

从工程角度看，FastAPI 接口不是"能跑就行"，需要考虑多个工程化要点。

**API 版本管理**：通过 URL 前缀（如 `/api/v1/`）管理接口版本。当接口有不兼容变更时，发布新版本而不是修改旧版本。这对 Agent 系统尤为重要——模型升级可能改变接口行为。

**请求限流**：AI 应用的模型调用有成本和并发限制。需要在接口层做限流，防止单个用户或单个 API Key 耗尽资源。

**超时控制**：模型调用可能超时，需要在接口层设置合理的超时时间。超时后应该返回明确的错误信息，而不是让客户端无限等待。

**请求链路追踪**：为每个请求生成唯一 ID（request_id），贯穿整个处理链路。出了问题能通过 request_id 定位完整的执行过程。

**结构化响应**：响应体应该有统一的格式，包括状态码、数据、错误信息、请求 ID。不要让每个接口返回不同结构的数据。

## 常见误区

**误区一：同步接口就够了**

Agent 执行耗时可能超过 30 秒，用同步接口会阻塞整个请求线程。FastAPI 的异步接口是必须的，长任务还要考虑后台任务或 WebSocket。

**误区二：不需要参数校验**

"模型能处理各种输入"是错误的假设。无效参数会导致模型调用失败、工具执行异常，甚至安全漏洞。每个接口的输入都应该经过严格校验。

**误区三：错误处理就是返回 500**

统一的错误码和错误信息比简单返回 500 更重要。前端需要根据错误码做不同处理（重试、提示用户、降级），日志排查也需要明确的错误信息。

**误区四：不需要健康检查**

健康检查是部署和监控的基础。没有健康检查，负载均衡器不知道服务是否可用，监控系统无法自动报警。

**误区五：API 不需要版本管理**

AI 应用的接口会随着模型升级、功能迭代而变化。没有版本管理，接口变更会破坏已有的客户端。版本管理让你能在不破坏旧客户端的情况下发布新功能。

## 和项目的关系

后续在项目实践中会用到 FastAPI 构建后端接口，但当前阶段只做工程化知识准备，不展开具体项目实现。

理解路由设计、请求校验、异步处理、错误处理和部署相关的工程要点，是构建稳定 AI 应用后端的基础。

## 面试表达

可以这样表达：

> 我用 FastAPI 构建 AI 应用的后端服务。FastAPI 原生支持异步，适合处理 Agent 执行这种耗时较长的 I/O 密集型任务。通过 Pydantic 做请求校验，确保无效参数不会进入业务逻辑层。接口设计遵循 RESTful 规范，通过 URL 前缀做版本管理。错误处理方面，我设计了统一的错误码体系，每种异常都有明确的错误码和信息。另外，我会为每个请求生成唯一 ID，贯穿整个执行链路，方便问题定位。
