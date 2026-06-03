# FastAPI 到 Agent Backend：接口层怎么设计

## 这篇文章解决什么问题

很多人理解 FastAPI 时，只停留在：

用户请求 → 调模型 → 返回结果

但真正做 Agent / RAG 项目时，FastAPI 要负责更多事情：

- RAG 问答入口
- 文档上传入口
- Agent 任务创建入口
- 长任务状态查询
- Trace 查询
- Evaluation 触发
- 健康检查
- 权限校验
- 错误响应

核心观点：**FastAPI 不是简单 API 壳，而是 Agent 系统的服务边界。** 它不只是提供几个 HTTP 接口，而是把用户请求、任务状态、RAG 查询、工具调用、执行轨迹和评测触发组织成稳定的服务层。

---

## 为什么 Agent Backend 不能只写 main.py

把所有逻辑写进 main.py 的问题：

- 路由、业务逻辑、数据库访问混在一起，难以维护。
- 请求响应模型不清晰，前后端协作困难。
- Trace、Evaluation、任务队列不好接入。
- 错误处理和权限控制分散，容易遗漏。
- 后续项目扩展困难，新增功能时不知道代码该放哪里。

从工程角度看，Agent Backend 需要分层：路由层负责协议和校验，Service 层负责业务编排，Repository 层负责数据访问，Worker 层负责长任务执行。

---

## 工程链路总览

| 模块 | 作用 | 在 Agent 项目中的价值 |
|---|---|---|
| API Router | 接收请求、校验输入、返回响应 | Agent 系统的服务入口，定义接口语义 |
| Schema | Pydantic 请求 / 响应模型 | 确保输入输出结构化，便于校验和文档生成 |
| Service | 业务编排逻辑 | RAG 查询、任务创建、Agent 运行调度的核心层 |
| Repository | 数据库访问逻辑 | 读写任务、文档、Trace、Evaluation 数据 |
| Core Config | 配置管理、日志初始化 | 统一管理数据库连接、模型配置、环境变量 |
| Auth / Security | 权限校验、安全策略 | 工具调用前的权限检查、高风险操作审批 |
| Worker | 后台任务执行 | 文档入库、Embedding、Evaluation、Agent 长任务 |
| Trace | 执行轨迹查询 | 通过 run_id 查询完整执行过程 |
| Evaluation | 评测触发和结果查询 | 触发评测运行、查询评测结果、对比版本 |
| Health Check | 健康检查 | 判断服务、数据库、向量库、模型服务是否可用 |

---

## 推荐项目结构

下面是一个 Agent / RAG 后端服务的推荐目录结构：

```text
app/
  main.py
  api/
    routes_rag.py
    routes_documents.py
    routes_tasks.py
    routes_traces.py
    routes_evaluation.py
  schemas/
    rag.py
    task.py
    trace.py
  services/
    rag_service.py
    agent_service.py
    document_service.py
    evaluation_service.py
  repositories/
    document_repo.py
    run_repo.py
  core/
    config.py
    security.py
    errors.py
  workers/
    tasks.py
```

每一层职责：

- **main.py**：创建 FastAPI 应用、注册路由、注册中间件、挂载异常处理器。保持简洁，不承载业务逻辑。
- **api/**：路由函数。只负责接收请求、调用 Service、返回响应。
- **schemas/**：Pydantic 请求和响应模型。所有对外 API 的输入输出都显式建模。
- **services/**：业务编排逻辑。RAG 查询、任务创建、Agent 运行调度都写在 Service 层。
- **repositories/**：数据库访问逻辑。Service 层通过它访问数据。
- **core/**：通用基础设施——配置读取、鉴权逻辑、错误类型、日志初始化。
- **workers/**：后台任务执行逻辑。文档入库、批量评测、Agent 长任务不应阻塞 HTTP 请求。

---

## Agent / RAG 常见接口设计

| 接口 | 方法 | 作用 |
|---|---|---|
| `/health` | GET | 健康检查，判断服务是否存活 |
| `/rag/query` | POST | RAG 问答，返回答案和引用 |
| `/documents/upload` | POST | 文档上传，触发解析和入库 |
| `/documents/{id}` | GET | 查询文档信息和解析状态 |
| `/tasks` | POST | 创建长任务，返回 task_id |
| `/tasks/{task_id}` | GET | 查询任务状态和结果 |
| `/runs/{run_id}/trace` | GET | 查询执行轨迹 |
| `/eval/runs` | POST | 触发评测运行 |
| `/eval/runs/{eval_run_id}` | GET | 查询评测结果 |

接口不要只围绕模型调用设计，要围绕完整任务链路设计。RAG 项目需要文档管理和引用查询，Agent 项目需要任务创建和 Trace 查询，Evaluation 需要评测触发和结果对比。

---

## Schema 设计

Pydantic Schema 要明确请求和响应结构。下面是一个 RAG 查询接口的示例：

```python
from pydantic import BaseModel, Field

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

显式 Schema 的价值：

- 防止输入不受控。`top_k` 过大会增加检索延迟和模型上下文成本。
- 便于 API 文档自动生成。
- 便于前后端协作。
- 便于评测和日志记录。

---

## 长任务设计

以下任务不应该同步阻塞：

- 批量文档解析
- Embedding 入库
- Agent 多步骤执行
- Evaluation 批量评测
- 报告生成

推荐模式：**创建任务 → 返回 task_id → Worker 异步执行 → 查询任务状态 → 查询结果或 Trace。**

任务状态通常包括 `pending`、`running`、`succeeded`、`failed`、`cancelled`。接口层只负责提交任务和查询任务，不应该让用户一直等待复杂 Agent 执行完成。

示例设计：

```python
@router.post("/tasks")
async def create_task(req: CreateTaskRequest):
    task_id = await task_service.create_task(req)
    return {"task_id": task_id, "status": "pending"}

@router.get("/tasks/{task_id}")
async def get_task(task_id: str):
    task = await task_service.get_task(task_id)
    return {"task_id": task_id, "status": task.status, "result": task.result}
```

---

## 错误处理与响应规范

Agent 项目要区分多种错误类型：

- 参数错误（400）：请求格式不正确。
- 权限错误（401/403）：未认证或无权限。
- 文档解析错误：文档格式不支持或解析失败。
- 检索失败：向量库不可用或查询异常。
- 模型调用失败：模型服务超时或返回错误。
- 工具调用失败：工具参数错误或执行异常。
- 任务超时：任务执行时间超过限制。
- 系统异常（500）：未预期的内部错误。

返回结构要稳定。推荐统一响应格式：

```python
class ApiResponse(BaseModel):
    code: int = 0
    message: str = "ok"
    data: dict | list | None = None
```

高风险错误不要泄露内部堆栈。线上接口不应该把数据库连接串、内部路径、第三方 API 返回细节直接暴露给用户。

---

## 权限与安全

Agent Backend 至少要考虑：

- **API Key / Token**：接口访问需要认证。
- **用户身份**：通过依赖注入获取当前用户。
- **租户隔离**：不同用户只能访问自己的数据。
- **文档权限**：文档上传和访问需要权限控制。
- **工具权限**：Agent 调用工具前需要检查权限。
- **高风险操作审批**：删除数据、发送消息等操作需要确认。
- **请求限流**：防止恶意请求和成本失控。
- **敏感信息脱敏**：日志和 Trace 中不保存明文密钥。

FastAPI 的 `Depends` 适合注入配置、数据库会话、当前用户、权限上下文和服务对象。

---

## Trace 与 Evaluation 接入

FastAPI 不只返回答案，还要返回 `run_id` / `task_id`，让后续可以查执行轨迹和评测结果。

- `/runs/{run_id}/trace`：查询某次运行的完整执行轨迹，包括模型调用、工具调用、状态变化和错误事件。
- `/eval/runs`：触发评测运行，对比不同版本的效果。
- `/eval/runs/{eval_run_id}`：查询评测结果，包括指标、失败样本和版本对比。

这样 API 层不只是"调模型返回答案"，而是"创建可追踪、可评估的任务"。

---

## 常见误区

- 所有代码写在 main.py——难以维护和扩展。
- 只设计 /chat 一个接口——RAG、文档、任务、Trace、Evaluation 都需要接口。
- 没有 task_id / run_id——无法追踪执行过程。
- 长任务同步等待——客户端超时，服务器阻塞。
- 没有统一错误响应——前端和调用方需要为每个接口写不同的错误解析逻辑。
- 不做权限控制——Agent 能调用工具后，安全风险成倍增加。
- 不暴露 Trace 查询入口——出问题后无法排查。
- 不考虑 Evaluation——无法评估系统效果。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

RAG 工单系统可以设计 `/rag/query`、`/documents/upload`、`/runs/{run_id}/trace`。文档入库和评测适合异步任务。每次 RAG 查询返回 `run_id`，方便后续 Trace 和 Evaluation。接口分层让代码更清晰，Service 层编排 RAG 链路，Repository 层读写数据库。

**项目 B（多 Agent 运营中台 Copilot）：**

多 Agent Copilot 更需要清晰的任务入口和状态查询接口。每个 Agent 的执行都需要 `run_id` 和 `step_id`，通过 Trace 查询完整过程。不展开项目 B 实现，只保留设计迁移方向。

---

## 面试表达

我不会把 FastAPI 只当成模型调用接口。在 Agent 项目中，FastAPI 承担服务入口和编排入口的角色。我会把它设计成 Agent 系统的服务边界，包括任务、状态、Trace、Evaluation 和权限。

对长任务，我不会让接口同步等待，而是返回 `task_id`，并通过 Worker 和状态表追踪执行状态。对于 Agent 执行，我会记录 `run_id` 和关键步骤，方便后续查询 Trace 和定位问题。

路由层、Service 层、Repository 层要分开。路由层做请求校验和响应封装，Service 层做业务编排，Repository 层做数据访问。这样接口逻辑更清晰，也更容易测试。

---

## 后续 TODO

- 补充 FastAPI 路由模板。
- 补充异步任务示例。
- 补充统一错误响应结构。
- 补充 Agent Backend 接口图。
