# Docker 部署

## 这一节解决什么问题

AI 应用需要能在不同环境中稳定运行。Docker 容器化可以保证开发、测试、线上环境一致。

## Dockerfile 编写

### 基本结构

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 多阶段构建

构建阶段和运行阶段分离，减小镜像体积：

```dockerfile
# 构建阶段
FROM python:3.11-slim AS builder
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# 运行阶段
FROM python:3.11-slim
COPY --from=builder /root/.local /root/.local
COPY . .
CMD ["uvicorn", "main:app"]
```

## Docker Compose

多个服务一起启动：

```yaml
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://...
    depends_on:
      - db
  
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
```

## 环境变量管理

敏感配置通过环境变量注入：

- API Key
- 数据库连接串
- 模型配置
- 调试开关

不要把密钥写进镜像。

## 健康检查

```dockerfile
HEALTHCHECK --interval=30s CMD curl -f http://localhost:8000/health || exit 1
```

## 面试表达

可以这样表达：

> 我用 Docker 做 AI 应用的容器化部署，通过 Docker Compose 编排多个服务，用环境变量管理敏感配置，用健康检查保证服务可用性。这样可以确保开发、测试、线上环境一致，减少部署问题。
