# 简历描述模板

## Project A：设备售后诊断 Agentic RAG 平台

- 构建企业设备售后诊断 Agentic RAG 平台，基于 FastAPI、Vue 3、Chroma/SQLite、LangChain/LangGraph 实现单诊断控制器、动态检索、query rewrite、GraphRAG 关系展示、grounded answer、citations 和 trace_id。
- 设计资料不足拒答与高风险工单升级链路，将设备型号、故障码、现场现象转化为可追溯诊断建议、引用证据、审计事件和人工处理工单。
- 补齐工程交付闭环：Jobs、Audit、Prometheus/Grafana、Alembic skeleton、OpenAPI 类型同步、Docker Compose、Redis/PostgreSQL smoke、Playwright E2E 和 final production acceptance；`v1.0.5` 基线通过 185 个后端测试、35 个 E2E 测试和 13/13 生产验收检查。

## Project B：运营中台 Multi-Agent Runtime

- 设计企业级 Multi-Agent Runtime 工程原型，基于 FastAPI、custom Harness、Coordinator / Analyst / Executor / Reviewer 实现可解释角色编排和任务轨迹记录。
- 建立 ToolGateway、PolicyEngine、OperationWhitelist、Human Approval 和 Audit Trail，将工具执行从模型输出中隔离，控制高风险动作并保留审批证据。
- 构建 Next.js Operator Console，覆盖 Tasks、Approvals、Trace、Audit、Metrics、Tools、NL2SQL、RBAC、LLM status 和 Multi-Agent Trajectory；默认 fake/offline 模式，稳定支持面试演示且避免过度声明生产能力。

## 通用技术点描述

- 熟悉 Agentic RAG 工程化，具备动态检索、引用证据、拒答边界、Trace、评测和生产验收实践。
- 熟悉 Multi-Agent Runtime 设计，理解角色编排、工具治理、人审、审计、Trajectory 和离线可复现 Demo。
- 具备 FastAPI / Vue / Next.js / TypeScript / pytest / Playwright / Docker / Prometheus 等大模型应用工程经验。
