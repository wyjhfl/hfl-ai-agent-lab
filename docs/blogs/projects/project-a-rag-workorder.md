---
description: Project A：设备售后诊断与工单 Agentic RAG 平台，v1.0.5 发布，185 个后端测试与 35 条 E2E（12 个文件）通过，覆盖检索、引用、拒答、工单升级与生产验收的完整工程闭环。
---

# Project A：设备售后诊断与工单 Agentic RAG 平台

> GitHub：<https://github.com/wyjhfl/project-a-rag-platform>
> 定位：企业设备售后诊断与工单闭环 Agentic RAG 平台，用于展示 AI Agent / RAG / 大模型工程岗位需要的工程闭环能力。

<div class="project-status-card">
  <div>
    <p class="project-eyebrow">10 秒速读</p>
    <p><strong>可验收的企业级 Agentic RAG 诊断平台：从检索、引用、拒答到工单升级与生产验收，全链路可追溯、可验证。</strong></p>
    <div class="project-pill-row"><b>v1.0.5</b><b>185 Backend Tests</b><b>35 E2E</b></div>
    <p>岗位相关性：对应 AI Agent · RAG · 大模型应用工程岗，覆盖检索质量、可观测性与生产交付三条主线。</p>
  </div>
  <ul>
    <li><a href="https://github.com/wyjhfl/project-a-rag-platform">GitHub Repo</a></li>
    <li><a href="/projects/project-a-demo-script">Demo 脚本</a></li>
    <li><a href="/note/Interview/project-a-deep-dive">深挖问答</a></li>
  </ul>
</div>

## 项目一句话

Project A 面向设备售后支持场景，把“设备型号 / 故障码 / 现场现象”转成可追溯的 grounded answer、引用证据、trace_id 和高风险工单升级，并通过评测、监控、E2E 和生产验收脚本证明系统不是简单聊天套壳。

## 为什么值得展示

| 面试看点 | 项目中的工程实现 |
|---|---|
| 不是 ChatGPT 套壳 | RAG 检索、引用证据、拒答边界、工单升级 |
| 可证明质量 | Quality 页展示 regression、context precision、faithfulness、context recall、bad case、trace |
| 可讲架构 | Architecture 页展示 Vue / FastAPI / RAG / Worker / Observability / Acceptance Gate |
| 可运维 | `healthz`、`readyz`、Request ID、Audit events、Prometheus `/metrics` |
| 可异步扩展 | JobService、worker claim、heartbeat、cancel、retry、timeout、PostgreSQL worker stress |
| 可交付 | 13 步 final production acceptance，覆盖测试、构建、OpenAPI、secret scan、Docker、smoke、Full E2E |

## 核心链路

```text
设备型号 / 故障码 / 现场现象
-> 文档入库、动态检索、query rewrite、GraphRAG 关系
-> grounded answer + citations + trace_id
-> 资料不足拒答 / 高风险升级人工工单
-> Jobs / Evaluation / Audit / Prometheus + Grafana
-> Alembic skeleton + CI + Docker + Full E2E + Production Acceptance
```

## 技术栈

| 层级 | 技术 |
|---|---|
| Backend | FastAPI、Pydantic、pytest、ruff |
| Frontend | Vue 3、Vite、TypeScript、Element Plus、Playwright |
| RAG | LangChain / LangGraph、Chroma、adaptive retrieval、Agentic diagnosis、GraphRAG relations |
| Storage | SQLite demo path，PostgreSQL smoke path |
| Async | JobService、worker claim、heartbeat、cancel、retry、timeout |
| Security | X-API-Key roles、PromptInjectionGuard、upload constraints、secret scan |
| Observability | Request ID、structured errors、audit logs、Prometheus metrics、Grafana demo dashboard |
| Delivery | Docker Compose、Alembic skeleton、OpenAPI drift guard、Redis/PostgreSQL smoke、Full E2E |

## Console Demo Route

1. **Acceptance**：项目 pitch 和证据入口。
2. **Architecture**：系统分层、RAG flow、Worker flow、observability、production gate。
3. **Agentic RAG**：diagnosis controller、tool calls、adaptive retrieval、trace、GraphRAG relations。
4. **Quality**：RAG metrics、bad case boundaries、trace review、engineering tradeoffs。
5. **System Status**：release、healthz / readyz、metrics、Request ID。
6. **Jobs**：async lifecycle、`claim_next_job`、heartbeat、cancel / retry / timeout。
7. **Chat / Tickets / Evaluations / Audit**：grounded answer、human escalation、evaluation、traceability。

## 当前证据

- Release：`v1.0.5`
- Backend tests：185 passed
- E2E list：35 tests in 12 files
- Secret scan：No secrets found
- Docker compose config：passed
- PostgreSQL smoke / Redis smoke / Worker stress：passed
- Full E2E：passed

## 相关页面

- [Project A 架构设计](/projects/project-a-architecture)
- [Project A RAG Evaluation 方案](/projects/project-a-eval-plan)
- [Project A Demo 验收脚本](/projects/project-a-demo-script)
- [Project A 一分钟介绍](/note/Interview/project-a-one-minute)
- [Project A 深挖问答](/note/Interview/project-a-deep-dive)
