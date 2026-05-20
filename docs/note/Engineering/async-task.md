# 异步任务与长任务处理

## 这一节解决什么问题

AI Agent 的任务执行时间往往不可预测。一个简单的查询可能几百毫秒返回，但一个涉及多轮工具调用、多步推理的复杂任务可能需要几十秒甚至几分钟。如果所有任务都用同步 HTTP 请求，客户端会超时，服务器会阻塞连接，用户体验极差。异步任务处理解决的就是"长任务怎么可靠执行、怎么让用户知道进度、怎么处理失败"的问题。

## 核心概念

**同步 vs 异步**：同步请求要求客户端一直等待直到响应返回，适合毫秒级操作。异步请求先返回一个任务 ID，任务在后台执行，客户端通过轮询或推送获取结果。

**任务 ID**：每个异步任务的唯一标识符，客户端用它查询任务状态和获取结果。

**任务状态**：常见的状态包括 pending（等待执行）、running（执行中）、completed（已完成）、failed（失败）、cancelled（已取消）。

**幂等性**：同一个任务执行多次和执行一次的结果相同。这对失败重试至关重要——如果任务不是幂等的，重试可能导致重复操作。

**任务队列**：用消息队列（如 Redis、RabbitMQ、Celery）管理待执行的任务，支持优先级、延迟执行、重试策略。

## 工程化设计

典型的异步任务架构包含四个组件：

1. **API 层**：接收请求，创建任务记录，返回任务 ID
2. **任务队列**：存储待执行任务，支持优先级和重试
3. **Worker 层**：从队列取任务执行，更新任务状态
4. **结果存储**：存储任务执行结果，供客户端查询

任务状态流转：创建 → pending → running → completed/failed。如果支持取消，running 状态可以转到 cancelled。

进度通知有两种方式：轮询（客户端定期查询任务状态）和推送（通过 WebSocket 或 SSE 实时推送进度变更）。轮询实现简单但有延迟，推送实时性好但连接管理复杂。

## 最小实现思路

```python
# 1. API 层：创建任务，返回任务 ID
@app.post("/tasks")
async def create_task(request: TaskRequest):
    task_id = str(uuid.uuid4())
    save_task(task_id, status="pending", params=request.dict())
    queue.enqueue(execute_task, task_id)
    return {"task_id": task_id, "status": "pending"}

# 2. 查询任务状态
@app.get("/tasks/{task_id}")
async def get_task(task_id: str):
    task = load_task(task_id)
    return {"task_id": task_id, "status": task.status, "result": task.result}

# 3. Worker 执行任务
def execute_task(task_id: str):
    update_task(task_id, status="running")
    try:
        result = do_actual_work(task_id)
        update_task(task_id, status="completed", result=result)
    except Exception as e:
        update_task(task_id, status="failed", error=str(e))

# 4. SSE 进度推送（可选）
@app.get("/tasks/{task_id}/stream")
async def stream_task(task_id: str):
    async def event_generator():
        while True:
            task = load_task(task_id)
            yield f"data: {json.dumps(task)}\n\n"
            if task.status in ("completed", "failed", "cancelled"):
                break
            await asyncio.sleep(1)
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

## 生产环境注意点

**超时控制**：必须设置任务最大执行时间。超时后标记为 failed，释放 Worker 资源。Agent 任务的超时通常设 60-300 秒，取决于任务复杂度。

**失败重试**：区分可重试错误（网络超时、服务暂时不可用）和不可重试错误（参数错误、权限不足）。可重试错误用指数退避策略，最多重试 3 次。

**幂等性**：工具调用需要设计幂等操作。比如"发送邮件"任务重试时不能重复发送，需要用任务 ID 做去重。

**任务取消**：用户主动取消时，需要中断正在执行的 Worker。这要求 Worker 定期检查取消标志，而不是执行完才能停止。

**资源清理**：过期的任务结果需要定期清理，避免存储无限增长。通常保留 7-30 天。

**监控指标**：任务创建数、完成数、失败数、平均执行时间、队列深度、Worker 数量。

## 常见误区

1. **所有任务都用同步请求**：长任务会导致客户端超时和服务器连接耗尽。
2. **不做超时控制**：一个卡死的任务会永久占用 Worker，最终耗尽资源。
3. **忽略幂等性**：重试导致重复操作（如重复发邮件、重复扣款）。
4. **不区分可重试和不可重试错误**：对参数错误做重试是浪费资源。
5. **不清理过期任务**：任务结果无限增长，最终占满存储。

## 面试表达

Agent 任务的执行时间不可预测，涉及多轮推理和工具调用时可能需要几十秒甚至几分钟。如果用同步 HTTP 请求，客户端会超时，服务器会阻塞连接。所以需要异步任务处理：API 层接收请求后创建任务记录，返回任务 ID，任务在后台 Worker 执行，客户端通过轮询或 SSE 推送获取结果。

工程上需要关注几个点：超时控制防止卡死任务占用资源；失败重试需要区分可重试错误和不可重试错误，用指数退避策略；幂等性保证重试不会导致重复操作；任务取消需要 Worker 定期检查取消标志。这些是异步任务系统的基本工程要求。

## 相关链接

- [FastAPI 后端接口](/note/Engineering/fastapi) — API 层实现基础
- [Docker 部署](/note/Engineering/docker-deploy) — Worker 容器化部署
- [日志与可观测性](/note/Engineering/observability) — 任务执行监控
