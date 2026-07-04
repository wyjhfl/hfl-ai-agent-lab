# Project A 一分钟介绍

Project A 是一个企业设备售后诊断 Agentic RAG 平台。它解决的是售后知识分散、故障诊断不可追溯、AI 回答容易无证据、工单升级缺少闭环的问题。

用户输入设备型号、故障码和现场现象后，系统通过单诊断控制器完成安全检查、query routing、adaptive retrieval、GraphRAG 关系检索、grounded answer 生成、citation 返回、trace 持久化和高风险工单升级。

工程上我用 FastAPI 做后端 API，用 Vue 3 做运维控制台，用 Chroma / SQLite 支撑 demo 检索和存储路径，同时补了 Jobs、Audit、Prometheus/Grafana、Alembic 骨架、OpenAPI 类型同步、Playwright E2E、Docker Compose 和 final production acceptance。`v1.0.5` 基线通过了 185 个后端测试、35 个 E2E 测试、secret scan、PostgreSQL / Redis smoke、worker stress 和 Full E2E。

这个项目证明我不是只会做 RAG 问答，而是能把 RAG 做成可追溯、可评测、可运维、可验收的企业工程项目。

## 相关链接

- [GitHub 仓库](https://github.com/wyjhfl/project-a-rag-platform)
- [Project A 主入口](/projects/project-a-rag-workorder)
- [Project A 架构设计](/projects/project-a-architecture)
- [Project A Quality / Evaluation 方案](/projects/project-a-eval-plan)
- [Project A Demo 验收脚本](/projects/project-a-demo-script)
