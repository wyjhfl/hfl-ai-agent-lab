# Docker 部署

## 这一节解决什么问题

AI 应用需要能在不同环境中稳定运行——本地开发、测试服务器、生产环境。如果没有容器化，"在我机器上能跑"是常态，"到线上就出问题"也是常态。Docker 容器化解决了环境一致性问题，让应用在任何地方都能以相同的方式运行。

本节会系统讲解 AI 应用的 Docker 容器化方法，包括 Dockerfile 编写、docker-compose 编排、环境变量管理、日志挂载和健康检查。

## 核心概念

### 为什么 AI 应用需要容器化

AI 应用的依赖通常比普通 Web 应用更复杂：Python 运行时、各种 AI/ML 库、向量数据库客户端、外部 API 依赖。这些依赖的版本组合在不同环境中很容易出现不一致。

容器化的好处：环境一致（开发、测试、线上用同一个镜像）、依赖隔离（不同服务的依赖不冲突）、部署标准化（镜像构建一次，到处运行）、资源可控（限制 CPU、内存使用）。

### Dockerfile

Dockerfile 定义了如何构建应用镜像。一个典型的 Python AI 应用 Dockerfile：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 先复制依赖文件，利用缓存
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 再复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

关键点：基础镜像选择 `slim` 版本（减小体积）、先复制 `requirements.txt` 再复制代码（利用 Docker 缓存层）、`--no-cache-dir` 减小 pip 缓存体积。

### 多阶段构建

构建阶段和运行阶段分离，进一步减小镜像体积：

```dockerfile
# 构建阶段：安装依赖
FROM python:3.11-slim AS builder
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# 运行阶段：只复制运行时需要的文件
FROM python:3.11-slim
COPY --from=builder /root/.local /root/.local
COPY . .
CMD ["uvicorn", "main:app"]
```

构建阶段包含编译工具（gcc 等），运行阶段不需要。多阶段构建能让最终镜像小很多。

### docker-compose

多个服务一起启动时用 docker-compose 编排：

```yaml
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - MODEL_API_KEY=${MODEL_API_KEY}
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

docker-compose 的价值：一键启动所有服务、定义服务间依赖关系、统一管理网络和数据卷。

### 环境变量管理

敏感配置通过环境变量注入，不要写进镜像：

- API Key（模型服务、第三方 API）
- 数据库连接串
- 调试开关
- 日志级别

生产环境用 `.env` 文件或密钥管理服务（如 Docker Secrets、Kubernetes Secrets），不要把 `.env` 文件提交到代码仓库。

### 数据卷

数据卷用于持久化数据和共享文件：

- **数据库数据**：`pgdata:/var/lib/postgresql/data`
- **日志文件**：`./logs:/app/logs`
- **配置文件**：`./config:/app/config`

数据卷的生命周期独立于容器——容器删除后数据卷中的数据不会丢失。

### 日志挂载

AI 应用通常需要记录详细的执行日志。把日志目录挂载到宿主机，方便查看和收集。

```yaml
volumes:
  - ./logs:/app/logs
```

日志文件建议按日期分割，避免单个文件过大。

### 端口暴露

容器内的端口通过 `ports` 映射到宿主机。注意：宿主机端口不要和已有服务冲突。

```yaml
ports:
  - "8000:8000"  # 宿主机:容器
```

### 服务健康检查

健康检查让 docker-compose 和负载均衡器知道服务是否可用：

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

健康检查应该验证服务的核心功能是否正常，不只是"进程是否存在"。

### 镜像大小控制

AI 应用的镜像容易很大（各种 ML 库）。控制方法：用 slim 基础镜像、多阶段构建、清理缓存（`--no-cache-dir`）、只安装必要的依赖。

## 为什么重要

Docker 部署在 AI 应用工程中的价值体现在多个方面。

首先，**环境一致性**。AI 应用的依赖复杂，版本冲突常见。容器化确保开发、测试、线上用同一个镜像，消除"环境不一致"问题。

其次，**部署标准化**。镜像构建一次，到处运行。不需要在每台服务器上手动安装依赖、配置环境。

再次，**资源可控**。通过 Docker 限制 CPU 和内存使用，防止 AI 应用（特别是模型推理）占用过多资源影响其他服务。

最后，**扩展性**。容器化后可以方便地水平扩展——启动多个容器实例，通过负载均衡分发请求。

## 工程化理解

从工程角度看，Docker 部署不只是写一个 Dockerfile，还需要考虑多个工程化要点。

**镜像版本管理**：每次构建的镜像应该有明确的版本标签（如 git commit hash），不要只用 `latest`。版本标签让回滚变得简单。

**构建缓存优化**：利用 Docker 的层缓存机制，把不常变化的步骤（安装依赖）放在前面，常变化的步骤（复制代码）放在后面。这样修改代码后不需要重新安装依赖。

**CI/CD 集成**：镜像构建应该自动化——代码提交后自动构建镜像、运行测试、推送到镜像仓库、部署到环境。

**安全扫描**：定期扫描镜像中的安全漏洞。基础镜像和依赖库可能有已知漏洞。

**本地开发环境**：docker-compose 应该能一键启动完整的本地开发环境，包括所有依赖服务。

## 常见误区

**误区一：把密钥写进镜像**

API Key、数据库密码等敏感信息不应该写在 Dockerfile 或代码中。应该通过环境变量或密钥管理服务注入。

**误区二：用 latest 标签**

`latest` 标签不明确，可能指向不同版本。应该用明确的版本标签，方便追溯和回滚。

**误区三：不做健康检查**

没有健康检查，docker-compose 不知道服务是否真正可用。`depends_on` 只等容器启动，不等服务就绪。

**误区四：镜像太大不关心**

AI 应用的镜像可能好几个 GB。镜像太大会导致拉取慢、存储成本高。用 slim 基础镜像和多阶段构建能显著减小体积。

**误区五：日志不持久化**

容器重启后容器内的日志会丢失。日志目录应该挂载到宿主机或发送到日志收集系统。

## 和项目的关系

后续在项目实践中会用到 Docker 容器化部署，但当前阶段只做工程化知识准备，不展开具体项目实现。

理解 Dockerfile 编写、docker-compose 编排、环境变量管理和健康检查，是部署任何 AI 应用的基础能力。

## 面试表达

可以这样表达：

> 我用 Docker 做 AI 应用的容器化部署。Dockerfile 方面，我用 slim 基础镜像减小体积，用多阶段构建分离构建和运行环境，利用层缓存优化构建速度。docker-compose 方面，我编排应用服务、数据库和依赖服务，通过健康检查确保服务就绪后再启动依赖方。敏感配置通过环境变量注入，不写进镜像。日志目录挂载到宿主机，方便查看和收集。这样可以确保开发、测试、线上环境一致，减少部署问题。
