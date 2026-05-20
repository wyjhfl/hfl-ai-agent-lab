# FastAPI 后端接口

## 这一节解决什么问题

AI 应用需要一个稳定的后端服务来接收请求、调用模型、执行工具、返回结果。FastAPI 是 Python 生态中最适合做这件事的框架。

## 路由设计

AI 应用的路由通常包括：

```text
POST /chat          # 用户对话入口
POST /agent/run     # Agent 执行入口
GET  /task/{id}     # 查询任务状态
POST /tool/execute  # 工具调用入口
GET  /health        # 健康检查
```

路由设计原则：

- 语义清晰
- 版本可控
- 参数校验严格

## 请求校验

使用 Pydantic 模型定义请求体：

```python
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    tools: list[str] | None = None
```

好处：

- 自动校验参数类型
- 自动生成 API 文档
- 类型提示提升开发效率

## 异步处理

Agent 执行通常耗时较长，需要异步处理：

```python
@app.post("/agent/run")
async def run_agent(request: ChatRequest):
    result = await agent.execute(request.message)
    return result
```

对于更长的任务，考虑：

- 后台任务（BackgroundTasks）
- WebSocket 推送
- 轮询任务状态

## 错误处理

统一的错误处理机制：

```python
@app.exception_handler(AgentError)
async def agent_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )
```

需要处理的错误类型：

- 模型调用超时
- 工具执行失败
- 参数校验错误
- 权限不足

## 面试表达

可以这样表达：

> 我用 FastAPI 构建 AI 应用的后端服务，通过 Pydantic 做请求校验，用 async 处理长时间运行的 Agent 任务，并设计了统一的错误处理机制。接口设计遵循 RESTful 规范，同时针对 Agent 场景做了异步和轮询的支持。
