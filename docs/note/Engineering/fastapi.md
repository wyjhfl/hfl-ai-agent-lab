# FastAPI 后端接口工程化

## 1. 这一篇解决什么问题

FastAPI 在 AI Agent 项目里不是只写几个接口，而是作为任务入口、状态查询、工具调用、文件上传、RAG 问答、评测触发和后台任务调度的服务层。

一个 Agent 或 RAG 系统通常会同时面对前端请求、后台 Worker、数据库、向量库、模型服务和权限系统。FastAPI 的价值在于把这些能力组织成清晰、可校验、可追踪、可部署的 API 服务。

如果接口层设计混乱，后续的任务状态、执行轨迹、评测结果和工具权限都会很难维护。因此，FastAPI 工程化的重点不是“接口能跑”，而是“接口边界稳定、输入输出明确、错误可定位、长任务可追踪”。

## 2. 学习目标

- 理解 FastAPI 在 Agent 项目中的位置。
- 掌握项目目录结构。
- 掌握请求 / 响应模型设计。
- 掌握依赖注入和配置管理。
- 掌握统一错误处理和健康检查。
- 理解异步接口和长任务接口的设计。

## 3. 推荐项目结构

下面是一个 Agent / RAG 后端服务的示例设计：

```text
app/
  main.py
  api/
    routes/
      health.py
      rag.py
      tasks.py
      agents.py
  core/
    config.py
    security.py
    errors.py
  schemas/
    rag.py
    task.py
    agent.py
  services/
    rag_service.py
    task_service.py
    agent_service.py
  repositories/
    task_repo.py
    document_repo.py
  workers/
    task_worker.py
```

### main.py

`main.py` 负责创建 FastAPI 应用、注册路由、注册中间件、挂载异常处理器和启动生命周期事件。它应该保持简洁，不应该承载业务逻辑。

### api/routes

`api/routes` 放路由函数。路由层只负责接收请求、调用 Service、返回响应，不直接写复杂业务逻辑，也不直接拼 SQL。

### core

`core` 放通用基础设施，例如配置读取、鉴权逻辑、错误类型、日志初始化和安全策略。它是服务运行的基础层。

### schemas

`schemas` 放 Pydantic 请求和响应模型。所有对外 API 的输入输出都应该显式建模，避免接口字段散落在业务代码中。

### services

`services` 放业务编排逻辑。例如 RAG 查询、任务创建、Agent 运行调度都应该写在 Service 层。

### repositories

`repositories` 放数据库访问逻辑。Repository 层负责读写数据库，Service 层通过它访问数据。

### workers

`workers` 放后台任务执行逻辑。文档入库、批量评测、多 Agent 长任务不应全部阻塞在 HTTP 请求中。

## 4. 路由设计

Agent / RAG 系统常见接口如下：

| 接口 | 作用 |
|---|---|
| `GET /health` | 健康检查 |
| `POST /rag/query` | RAG 问答 |
| `POST /documents/upload` | 文档上传 |
| `POST /tasks` | 创建长任务 |
| `GET /tasks/{task_id}` | 查询任务状态 |
| `POST /agents/run` | 触发 Agent 任务 |
| `GET /runs/{run_id}/trace` | 查询执行轨迹 |

路由设计要关注三个问题。第一，接口语义要清晰，调用方能从路径看出用途。第二，短任务和长任务要区分，不能所有接口都同步等待。第三，关键执行链路要返回 `task_id` 或 `run_id`，方便后续查询状态和排查问题。

## 5. Pydantic 请求 / 响应模型

下面是一个 RAG 查询接口的示例设计：

```python
from pydantic import BaseModel, Field
from typing import Literal

class RagQueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)
    use_rerank: bool = True

class Citation(BaseModel):
    document_id: str
    chunk_id: str
    text: str
    score: float

class RagQueryResponse(BaseModel):
    answer: str
    citations: list[Citation]
    run_id: str
```

显式 Schema 的价值很高。

- 防止输入不受控。
- 便于 API 文档自动生成。
- 便于前后端协作。
- 便于评测和日志记录。

在 Agent 系统中，输入不受控会带来更多问题。例如 `top_k` 过大会增加检索延迟和模型上下文成本，工具参数格式错误会导致工具调用失败，缺少用户身份会造成权限边界不清。

## 6. 统一响应与错误处理

一个常见的统一响应结构如下：

```python
from pydantic import BaseModel

class ApiResponse(BaseModel):
    code: int = 0
    message: str = "ok"
    data: dict | list | None = None
```

业务错误不要直接返回不统一结构。否则前端和调用方需要为每个接口写不同的错误解析逻辑。

HTTP 状态码和业务 code 要分清。HTTP 状态码表示协议层面的结果，例如 400、401、403、404、500；业务 code 表示系统内部可识别的业务错误，例如任务不存在、工具无权限、文档解析失败、模型服务超时。

高风险错误不要泄露内部堆栈。线上接口不应该把数据库连接串、内部路径、第三方 API 返回细节直接暴露给用户。详细错误应该写入服务日志或 Trace 中，对外只返回安全的错误信息和可定位的 `request_id` 或 `run_id`。

## 7. 依赖注入

FastAPI 的 `Depends` 适合注入配置、数据库会话、当前用户、权限上下文和服务对象。

Agent 工具调用前可以通过依赖注入获得权限上下文。例如当前用户是否允许调用某个工具、是否允许访问某个知识库、是否允许执行写操作。

示例伪代码：

```python
from fastapi import Depends, APIRouter

router = APIRouter()

def get_current_user():
    ...

def get_db():
    ...

@router.post("/rag/query")
async def query_rag(
    req: RagQueryRequest,
    user = Depends(get_current_user),
    db = Depends(get_db),
):
    ...
```

依赖注入的好处是让路由函数不需要手动创建所有对象。测试时也可以替换依赖，例如替换数据库会话或权限上下文。

## 8. 异步接口与长任务

RAG 批量入库、多 Agent 任务、评测任务不能都同步阻塞。同步接口适合短请求，例如一次普通问答；长任务应该拆成创建任务、后台执行、查询状态三部分。

常见设计如下：

- `POST /tasks` 创建任务，返回 `task_id`。
- `GET /tasks/{task_id}` 查询状态。
- 后台 Worker 执行任务。
- Trace 按 `run_id` 查询。

任务状态通常包括 `pending`、`running`、`succeeded`、`failed`、`cancelled`。接口层只负责提交任务和查询任务，不应该让用户一直等待复杂 Agent 执行完成。

示例设计：

```python
@router.post("/tasks")
async def create_task(req: CreateTaskRequest):
    task_id = await task_service.create_task(req)
    return ApiResponse(data={"task_id": task_id})

@router.get("/tasks/{task_id}")
async def get_task(task_id: str):
    task = await task_service.get_task(task_id)
    return ApiResponse(data=task.model_dump())
```

## 9. 健康检查

健康检查不是简单返回 `ok`。一个可部署的 Agent 服务至少应该检查以下内容：

- 服务是否启动。
- 数据库是否可连接。
- 向量库是否可连接。
- 模型服务是否可用。
- 队列是否可用。

健康检查可以分层设计。`/health` 用于快速判断服务进程是否正常；`/ready` 用于判断依赖是否就绪；`/metrics` 用于暴露监控指标。

示例设计：

```python
@router.get("/health")
async def health():
    return {"status": "ok"}

@router.get("/ready")
async def ready():
    return {
        "database": await check_database(),
        "vector_store": await check_vector_store(),
        "queue": await check_queue(),
        "model_service": await check_model_service(),
    }
```

## 10. 工程化设计思路

FastAPI 项目要把路由层、Service 层和 Repository 层分开。路由层负责协议和校验，Service 层负责编排业务，Repository 层负责数据访问。

请求进入系统后应该生成 `request_id`。如果该请求触发 Agent 执行，则进一步生成 `task_id` 和 `run_id`。这几个 ID 可以贯穿日志、数据库、工具调用和评测记录。

对于工具调用接口，要把权限检查放在调用之前。不要让模型输出的工具名和参数直接进入真实工具执行层，中间必须经过 schema 校验、权限校验和审计记录。

## 11. 生产环境注意点

- 设置合理的请求超时，避免连接长期占用。
- 对模型调用和工具调用设置限流，控制成本和风险。
- 对上传文件设置大小限制和类型校验。
- 日志中记录 `request_id`、`task_id`、`run_id`，但不要记录明文密钥。
- 对高风险操作增加权限校验和审计记录。
- API 文档可以在生产环境限制访问。
- 对外错误信息要脱敏，内部日志保留可排查信息。

## 12. 常见误区

### 误区一：把所有逻辑写进路由函数

路由函数一旦承载业务逻辑、数据库访问和工具调用，就会迅速变得难以测试和维护。

### 误区二：不做请求校验

没有请求校验会让无效参数进入模型、数据库或工具层，导致错误更晚暴露，也更难排查。

### 误区三：不区分同步接口和长任务

文档入库、批量评测、多 Agent 执行都可能耗时很长，应该用任务模型处理，而不是让 HTTP 请求一直等待。

### 误区四：不做统一错误处理

每个接口返回不同错误结构，会让前端、调用方和日志分析都变复杂。

### 误区五：不记录 run_id / task_id

没有 `run_id` 和 `task_id`，就无法把接口请求、后台任务、模型调用和工具调用串起来。

### 误区六：不做鉴权和权限边界

Agent 系统可能调用外部工具或访问敏感知识库。没有权限边界会带来数据泄露和误操作风险。

## 13. 和 AI Agent / RAG 项目的关系

在 RAG 项目中，FastAPI 提供查询接口、文档上传接口、文档入库任务接口和引用结果查询接口。它是前端、评测脚本和后台任务之间的统一入口。

在 Agent 项目中，FastAPI 提供任务入口和状态查询入口。用户不应该直接操作 Worker 或工具层，而是通过 API 创建任务、查询执行轨迹和获取结果。

在工程化项目中，FastAPI 还承担编排入口的角色。它不一定执行所有工作，但要负责把请求转化为可追踪的任务，并把系统状态以稳定接口暴露给调用方。

## 14. 面试表达

FastAPI 在 Agent 项目中承担服务入口和编排入口。它不只是提供几个 HTTP 接口，而是把用户请求、任务状态、RAG 查询、工具调用、执行轨迹和评测触发组织成稳定的服务层。

我会把路由层、Service 层、Repository 层分开。路由层做请求校验和响应封装，Service 层做业务编排，Repository 层做数据访问，这样接口逻辑更清晰，也更容易测试。

对长任务，我不会让接口同步等待，而是返回 `task_id`，并通过 Worker 和状态表追踪执行状态。对于 Agent 执行，我会记录 `run_id` 和关键步骤，方便后续查询 Trace 和定位问题。

## 15. 后续学习 TODO

- 学习 FastAPI 生命周期事件和依赖注入的测试写法。
- 补充基于 JWT 或 Session 的用户认证示例。
- 补充任务状态查询接口的完整数据模型。
- 补充 Agent Trace 查询接口的分页设计。

## 16. 相关链接

- [异步任务与长任务处理](/note/Engineering/async-task)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [数据库设计：从业务数据到 Agent 运行记录](/note/Engineering/database)
