# Docker 部署：从本地运行到可上线服务

## 1. 这一篇解决什么问题

AI Agent 项目通常依赖后端服务、数据库、向量库、Redis、Worker、模型 API 和配置文件。Docker 的价值是让环境可复现、服务可组合、部署可迁移。

Docker 不只是写一个 Dockerfile。对 Agent / RAG 项目来说，Docker 还承担开发环境统一、多服务编排、配置隔离、日志输出、健康检查和生产交付的职责。

如果没有容器化，本地能跑不代表测试环境能跑，测试环境能跑也不代表生产环境稳定。Docker 的目标是让服务在不同环境中以一致方式构建、启动和运行。

## 2. 学习目标

- 理解 Dockerfile 的基本结构。
- 理解镜像、容器、数据卷、网络。
- 掌握多服务 Compose 编排。
- 掌握环境变量和密钥管理。
- 掌握健康检查、日志和非 root 用户。
- 理解开发环境与生产环境的区别。

## 3. 核心概念

镜像是应用运行环境的打包结果，包含代码、依赖、运行时和启动命令。容器是镜像运行后的实例。

数据卷用于持久化数据。数据库、上传文件和某些缓存文件不能只存在容器临时文件系统中。

网络用于服务之间通信。Compose 中的服务可以通过服务名互相访问，例如 API 连接 `postgres` 或 `redis`。

环境变量用于注入配置。模型 API Key、数据库连接串、日志级别和运行模式都应该通过环境变量配置，而不是写死在代码或镜像中。

## 4. 基础 Dockerfile

下面是一个 FastAPI 示例：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`FROM python:3.11-slim` 指定基础镜像。slim 镜像体积更小，适合多数 Python Web 服务。

`WORKDIR /app` 设置容器内工作目录。后续命令都在这个目录下执行。

`COPY requirements.txt .` 先复制依赖文件。这样 Docker 可以利用缓存，代码变化时不一定重新安装依赖。

`RUN pip install --no-cache-dir -r requirements.txt` 安装 Python 依赖。`--no-cache-dir` 可以减少镜像体积。

`COPY . .` 复制项目代码。注意要配合 `.dockerignore`，避免把无关文件打进镜像。

`EXPOSE 8000` 声明服务端口。它不等于发布端口，真正端口映射通常在 Compose 或部署平台中配置。

`CMD [...]` 是容器默认启动命令。FastAPI 服务通常用 uvicorn 或 gunicorn 启动。

## 5. 生产 Dockerfile 优化

生产镜像要关注体积、安全和可复现性。

- 使用 slim 镜像。
- 减少层和缓存污染。
- 不把 `.env` 打进镜像。
- 使用非 root 用户。
- 明确启动命令。
- 控制依赖版本。

非 root 用户示例：

```dockerfile
RUN useradd -m appuser
USER appuser
```

使用非 root 用户可以降低容器逃逸或应用漏洞带来的风险。虽然它不能替代完整安全策略，但应作为生产镜像的基本要求。

依赖版本要固定。`requirements.txt` 中不要只写宽泛版本，否则同一份代码在不同时间构建可能安装到不同依赖，导致行为不一致。

不要把 `.env` 打进镜像。镜像可能被上传到镜像仓库，如果包含密钥就会扩大泄露范围。

## 6. .dockerignore

`.dockerignore` 用于排除不应该进入镜像的文件。

不要把这些打进镜像：

- `.git`
- `node_modules`
- `pycache`
- `.env`
- `logs`
- `dist`
- `.venv`

示例：

```text
.git
.env
__pycache__/
.venv/
node_modules/
logs/
dist/
```

`.dockerignore` 的价值不只是减小镜像体积，还能避免把密钥、本地缓存、构建产物和开发环境文件带到生产镜像中。

## 7. Docker Compose 编排

Agent 项目通常不是单服务。一个常见本地开发编排如下：

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

API 和 Worker 分开。API 负责接收请求和返回状态，Worker 负责执行文档入库、长任务、评测等耗时任务。

Postgres 保存业务数据，包括用户、任务、文档、Chunk、Trace 和评测结果。

Redis 支撑队列或缓存，例如任务队列、短期查询缓存和限流计数。

数据卷保存持久化数据。Postgres 如果不挂载 volume，容器删除后数据也会丢失。

示例密码只是占位，不要用于生产。生产环境应使用平台 Secret 或密钥管理服务注入真实密码。

## 8. 环境变量和密钥

本地可以用 `.env`。生产应使用平台 Secret，例如云平台密钥管理、Kubernetes Secret、Docker Secret 或 CI/CD Secret。

不要提交真实 API Key。即使是测试 Key，也可能被滥用或产生费用。

不要把密钥写进 Dockerfile。Dockerfile 构建层可能被缓存，密钥可能残留在镜像历史中。

日志里要脱敏。模型 API Key、数据库密码、访问 Token 和用户敏感字段都不应该明文打印。

常见环境变量包括：

| 变量 | 作用 |
|---|---|
| `DATABASE_URL` | 数据库连接串 |
| `REDIS_URL` | Redis 连接串 |
| `MODEL_API_KEY` | 模型服务密钥 |
| `VECTOR_DB_URL` | 向量库地址 |
| `LOG_LEVEL` | 日志级别 |
| `APP_ENV` | 运行环境 |

## 9. 健康检查

健康检查可以用于：

- 判断服务是否启动。
- 判断数据库是否连接。
- 判断队列是否可用。
- 让平台自动重启异常服务。

示例：

```dockerfile
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1
```

健康检查要分层。简单的 `/health` 可以检查进程是否存活，`/ready` 可以检查数据库、Redis、向量库和模型服务是否可用。

生产平台通常根据健康检查决定是否把流量转发给容器。如果健康检查过于宽松，异常服务仍可能接收流量；如果过于严格，依赖短暂抖动可能导致服务频繁重启。

## 10. 日志输出

容器内日志应输出到 stdout / stderr。不建议只写本地文件。

生产环境由平台采集日志，例如 Docker logs、Kubernetes 日志采集、云日志服务或可观测平台。

Agent 项目要记录 `run_id` / `task_id`。没有这些 ID，日志只能看到零散事件，无法还原一次完整执行。

日志内容要结构化。推荐记录时间、级别、服务名、请求 ID、任务 ID、运行 ID、错误码和耗时。

## 11. 数据卷

数据库必须使用 volume。否则容器删除或重建后，数据库文件会丢失。

上传文件、缓存文件需要明确存储策略。开发环境可以用本地 volume，生产环境通常更适合对象存储或托管存储服务。

不要把重要数据只保存在容器临时文件系统里。容器应该被视为可随时重建的运行实例，而不是持久数据存储位置。

数据卷也要考虑备份。Postgres volume 不是备份方案，生产环境仍需要数据库备份和恢复流程。

## 12. 开发环境与生产环境区别

| 项目 | 开发环境 | 生产环境 |
|---|---|---|
| reload | 可以开启自动 reload | 不开启 reload，使用稳定进程管理 |
| debug | 可以开启详细错误 | 关闭 debug，对外错误脱敏 |
| env | 本地 `.env` | 平台 Secret 和环境变量 |
| logging | 控制台调试为主 | stdout / stderr + 集中日志采集 |
| database | 本地 Postgres 或 SQLite | 托管数据库或独立数据库服务 |
| secrets | 本地测试密钥 | 密钥管理系统 |
| scaling | 单实例即可 | API、Worker 可独立扩缩容 |

开发环境追求快速反馈，生产环境追求稳定、安全、可观测和可回滚。

不要把开发配置直接用于生产。例如 `reload`、弱密码、开放调试页面、详细堆栈和本地文件存储都不应直接进入生产。

## 13. Agent 项目部署形态

常见组件包括：

- API 服务。
- Worker 服务。
- Postgres。
- Redis。
- Vector DB。
- Object Storage。
- Monitoring。
- Evaluation Job。

API 服务负责同步请求和状态查询。Worker 服务负责长任务，例如文档解析、Embedding、批量评测和复杂 Agent 执行。

Postgres 保存业务数据和执行记录。Redis 支撑队列、缓存和限流。Vector DB 提供相似度检索。Object Storage 保存上传文件和大对象。

Monitoring 负责收集日志、指标和告警。Evaluation Job 可以定期运行评测集，监控 RAG 或 Agent 效果变化。

## 14. 部署检查清单

- [ ] 镜像能否构建。
- [ ] 服务能否启动。
- [ ] 健康检查是否通过。
- [ ] 数据库是否持久化。
- [ ] 环境变量是否完整。
- [ ] 密钥是否未提交。
- [ ] 日志是否可查看。
- [ ] Worker 是否能消费任务。
- [ ] 向量库是否可连接。
- [ ] 回滚方案是否明确。

检查清单的价值在于降低上线遗漏。AI Agent 项目依赖多，任何一个环境变量、队列或向量库连接错误，都可能导致系统看似启动但核心功能不可用。

## 15. 最小实现示例

一个本地启动流程可以设计为：

```bash
docker compose build
docker compose up api worker postgres redis
```

启动后先访问健康检查接口，再创建一个测试任务，确认 API 能写入数据库，Worker 能消费任务，日志中能看到同一个 `task_id` 的完整过程。

这只是示例设计。真实生产部署还需要镜像仓库、CI/CD、密钥管理、数据库备份、监控告警和回滚策略。

## 16. 生产环境注意点

- 镜像要有明确版本标签，不要只依赖 `latest`。
- 数据库和向量库要有备份和恢复方案。
- API 与 Worker 要能独立扩缩容。
- 模型 API Key 和数据库密码必须由 Secret 注入。
- 健康检查要覆盖关键依赖，但避免过度敏感。
- 日志中必须能关联 `request_id`、`task_id` 和 `run_id`。
- 部署前要准备回滚方案。

## 17. 常见误区

### 误区一：把 .env 打进镜像

`.env` 可能包含模型 Key、数据库密码和第三方 Token。打进镜像后，任何能拉取镜像的人都可能看到密钥。

### 误区二：容器里只写文件日志

容器重建后本地文件可能丢失。生产环境应该输出到 stdout / stderr，由平台统一采集。

### 误区三：数据库不挂 volume

数据库容器没有 volume，数据会随着容器删除而丢失。

### 误区四：API 和 Worker 混在一起不可扩展

长任务会阻塞 API 资源。API 和 Worker 分开后，可以独立扩容和排查问题。

### 误区五：开发配置直接用于生产

开发配置通常包含 reload、debug、弱密码和宽松跨域策略，直接上线会带来稳定性和安全问题。

### 误区六：镜像里使用 root 用户执行服务

root 用户会放大漏洞影响。生产镜像应尽量使用非 root 用户运行应用。

### 误区七：不写健康检查

没有健康检查，平台无法判断服务是否真正可用，也无法自动重启异常实例。

### 误区八：不控制依赖版本

依赖版本不固定会导致同一份代码在不同时间构建出不同行为，排查问题非常困难。

## 18. 和 AI Agent / RAG 项目的关系

Agent 项目通常有长任务，因此部署时要把 API 和 Worker 分开。API 负责快速响应，Worker 负责耗时执行。

RAG 项目通常依赖数据库、向量库和对象存储。Docker Compose 可以在本地模拟这些依赖，帮助开发者稳定复现问题。

评测任务可以作为独立 Job 运行。这样不会影响在线 API，也能定期检查模型、检索参数和文档更新带来的效果变化。

## 19. 面试表达

我会用 Docker 保证环境一致性，用 Compose 编排 API、Worker、数据库、Redis 和向量库。这样本地开发、测试环境和生产部署的服务拓扑可以保持一致，减少环境差异导致的问题。

对 Agent 项目，我会把 API 和长任务 Worker 分开部署，避免长任务阻塞接口。API 负责创建任务和查询状态，Worker 负责文档入库、工具执行、评测等耗时任务。

生产部署时，我会重点检查环境变量、密钥、健康检查、日志、数据卷和回滚方案。对于 Agent 系统，我还会确保日志中能追踪 `task_id` 和 `run_id`，方便排查线上问题。

## 20. 后续学习 TODO

- 补充 Docker Compose 生产配置示例。
- 补充 API 与 Worker 独立扩缩容示例。
- 补充健康检查与 readiness check 的拆分设计。
- 补充镜像版本和回滚流程示例。

## 21. 相关链接

- [异步任务与长任务处理](/note/Engineering/async-task)
- [AI Agent 上线检查清单](/note/Engineering/production-checklist)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [FastAPI 后端接口工程化](/note/Engineering/fastapi)
