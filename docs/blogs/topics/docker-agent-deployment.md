# Docker 部署工程化：从本地 Demo 到可上线服务

## 这篇文章解决什么问题

很多人理解 Docker 时只停留在：

写 Dockerfile → build image → run container

但 Agent / RAG 项目通常不只有一个服务，而是包含多个组件：

- API 服务
- Worker 服务
- Postgres 数据库
- Redis 缓存 / 队列
- 向量数据库
- 对象存储
- Evaluation Job
- 日志和监控
- 健康检查

核心观点：**Docker 不是部署的终点，而是让 Agent 系统从本地 Demo 走向可上线服务的基础。** 它承担环境复现、服务编排、配置隔离、数据持久化、健康检查和上线回滚的职责。

---

## 工程链路总览

### 部署架构总览

| 服务 | 作用 | 部署关注点 |
|---|---|---|
| api | 接收请求、返回状态、触发任务 | 端口映射、健康检查、环境变量 |
| worker | 执行长任务（文档解析、Embedding、Evaluation） | 命令配置、依赖服务、重试策略 |
| postgres | 保存业务数据、执行记录、Trace、Evaluation | 数据卷、备份策略、连接配置 |
| redis | 任务队列、缓存、限流 | 持久化配置、内存限制 |
| vector-db | 向量检索 | 数据卷、索引持久化 |
| object-storage | 上传文件、大对象存储 | 数据卷或外部服务 |
| eval-worker | 定期运行评测集 | 定时触发、独立资源 |
| log / monitor | 日志采集、指标监控 | stdout/stderr 采集、告警配置 |

---

## Dockerfile 设计原则

Agent / RAG 项目的 Dockerfile 要遵循以下原则：

- **固定依赖版本**：`requirements.txt` 中不要只写宽泛版本，否则同一份代码在不同时间构建可能安装到不同依赖。
- **不把 .env 和密钥打进镜像**：镜像可能被上传到镜像仓库，如果包含密钥就会扩大泄露范围。
- **尽量不用 root 用户运行**：使用非 root 用户可以降低容器逃逸或应用漏洞带来的风险。
- **使用合理的工作目录**：`WORKDIR /app` 设置容器内工作目录。
- **只复制必要文件**：配合 `.dockerignore`，避免把无关文件打进镜像。
- **日志输出到 stdout / stderr**：容器重建后本地文件可能丢失，生产环境由平台统一采集日志。
- **区分开发和生产配置**：开发环境可以开启 reload 和 debug，生产环境要关闭。

示例 Dockerfile：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Docker Compose 适合什么

Docker Compose 适合本地和测试环境编排多个服务。Agent 项目通常不是单服务，一个常见的本地开发编排如下：

```yaml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

  worker:
    build: .
    command: python -m app.workers.task_worker
    env_file:
      - .env
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: agent_app
      POSTGRES_USER: agent
      POSTGRES_PASSWORD: example
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7

volumes:
  postgres_data:
```

服务之间的依赖关系：

- API 依赖 Postgres 和 Redis。
- Worker 依赖 Postgres 和 Redis。
- API 和 Worker 分开部署，避免长任务阻塞接口。
- Postgres 使用数据卷持久化，容器删除后数据不丢失。

---

## 环境变量与密钥

必须避免的行为：

- 把 .env 提交到仓库。
- 把 API Key 写入 Dockerfile。
- 把生产密钥放进镜像。
- 在日志里输出密钥。

推荐做法：

- **.env.example**：提交到仓库，列出所有需要的环境变量，但不包含真实值。
- **平台环境变量**：通过部署平台注入环境变量。
- **Secret Manager**：使用云平台密钥管理服务。
- **分环境配置**：开发、测试、生产使用不同的配置。

常见环境变量：

| 变量 | 作用 |
|---|---|
| DATABASE_URL | 数据库连接串 |
| REDIS_URL | Redis 连接串 |
| MODEL_API_KEY | 模型服务密钥 |
| VECTOR_DB_URL | 向量库地址 |
| LOG_LEVEL | 日志级别 |
| APP_ENV | 运行环境 |

---

## 数据持久化

Postgres、Redis、向量库、对象存储都要考虑数据卷。容器删除不应该导致核心数据丢失。

- **Postgres**：必须使用 volume，否则容器删除后数据丢失。
- **Redis**：如果需要持久化，配置 AOF 或 RDB。
- **向量库**：索引数据需要持久化，否则重建索引成本高。
- **对象存储**：上传文件不能只存在容器临时文件系统里。

数据卷也要考虑备份。Postgres volume 不是备份方案，生产环境仍需要数据库备份和恢复流程。

---

## Health Check

Agent 服务上线前至少要有以下健康检查：

- **API health**：`/health` 检查服务进程是否存活。
- **DB health**：检查数据库是否可连接。
- **Redis health**：检查 Redis 是否可连接。
- **Vector DB health**：检查向量库是否可连接。
- **Worker heartbeat**：Worker 是否在消费任务。
- **模型服务可用性检查**：模型 API 是否可调用。

健康检查可以分层设计。`/health` 用于快速判断服务进程是否正常；`/ready` 用于判断依赖是否就绪。

示例：

```dockerfile
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1
```

---

## Worker 与长任务

Agent / RAG 项目中，以下任务适合 Worker 执行：

- 文档解析和 Chunk 切分。
- Embedding 入库。
- Evaluation 批量评测。
- 多步骤 Agent 执行。
- 报告生成。

API 不应该长期阻塞。API 负责接收请求和返回状态，Worker 负责执行耗时任务。API 和 Worker 分开后，可以独立扩容和排查问题。

---

## 日志与观测

容器内日志应输出到 stdout / stderr。不建议只写本地文件，因为容器重建后本地文件可能丢失。

Agent 项目日志要记录：

- `run_id`：运行标识，用于关联执行轨迹。
- `task_id`：任务标识，用于关联任务状态。
- `request_id`：请求标识，用于关联 API 请求。
- `error_code`：错误码，用于分类错误。
- `latency`：耗时，用于性能监控。
- `cost`：token 消耗，用于成本控制。
- `tool_call_status`：工具调用状态，用于排查工具问题。

日志内容要结构化，推荐 JSON 格式，方便部署平台采集和查询。

---

## 上线检查清单

- [ ] 环境变量完整。
- [ ] 密钥未进入镜像。
- [ ] 数据卷已配置。
- [ ] API health 通过。
- [ ] Worker 能消费任务。
- [ ] 数据库连接正常。
- [ ] Redis 连接正常。
- [ ] 向量库连接正常。
- [ ] 日志可查看。
- [ ] 有回滚方案。

检查清单的价值在于降低上线遗漏。AI Agent 项目依赖多，任何一个环境变量、队列或向量库连接错误，都可能导致系统看似启动但核心功能不可用。

---

## 常见误区

- 只写一个 Dockerfile——Agent 项目需要 API 和 Worker 分开部署。
- 把 .env 打进镜像——密钥泄露风险。
- 本地能跑就认为可以上线——开发配置和生产配置不同。
- 没有数据卷——容器删除后数据丢失。
- 没有 health check——平台无法判断服务是否真正可用。
- 没有 Worker——长任务阻塞 API。
- 没有日志规范——出问题后无法排查。
- 没有回滚方案——上线失败后无法快速恢复。
- 生产环境仍用开发配置——reload、debug、弱密码、宽松跨域策略。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

RAG 工单系统可以拆成 API、Worker、Postgres、Redis、Vector DB。文档入库和 Evaluation 用 Worker。API 返回 task_id，Worker 处理长任务。本地用 Compose 编排，生产用平台部署。

**项目 B（多 Agent 运营中台 Copilot）：**

多 Agent Copilot 未来更需要服务拆分、状态存储、队列和观测。每个 Agent 的执行都需要 Worker 资源，不同 Agent 的任务需要隔离。不展开项目 B 实现，只说明部署方向。

---

## 面试表达

我不会把 Docker 只理解为打包镜像。在 Agent 项目里，Docker 要支撑 API、Worker、数据库、缓存、向量库和评测任务的服务编排。

我会把 API 和长任务 Worker 分开部署，避免长任务阻塞接口。API 负责创建任务和查询状态，Worker 负责文档入库、工具执行、评测等耗时任务。

上线前要检查环境变量、数据持久化、健康检查、日志、Worker 状态和回滚方案。对于 Agent 系统，我还会确保日志中能追踪 task_id 和 run_id，方便排查线上问题。这体现的是从 Demo 到可上线服务的工程意识。

---

## 后续 TODO

- 补充 Dockerfile 示例。
- 补充 docker-compose 示例。
- 补充部署检查脚本。
- 补充 Agent 服务上线架构图。
