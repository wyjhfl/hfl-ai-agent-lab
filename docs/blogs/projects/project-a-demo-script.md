# Project A Demo 验收脚本

> 目标：用 6 分钟讲清“设备售后诊断 Agentic RAG 平台”的工程闭环。

## Demo 路线

| 时间 | 页面 | 讲什么 |
|---|---|---|
| 0:00 - 0:40 | Acceptance | 这是企业设备售后诊断平台，不是聊天套壳 |
| 0:40 - 1:30 | Architecture | Vue / FastAPI / RAG / Worker / Observability / Acceptance Gate 分层 |
| 1:30 - 2:40 | Agentic RAG | 设备型号、故障码、现场现象进入 diagnosis controller |
| 2:40 - 3:30 | Quality | regression、context precision、faithfulness、context recall、bad case |
| 3:30 - 4:20 | System Status | release、healthz / readyz、metrics、Request ID |
| 4:20 - 5:10 | Jobs | worker claim、heartbeat、cancel、retry、timeout |
| 5:10 - 6:00 | Tickets / Eval / Audit | 高风险工单升级、评测记录、traceability |

## 主场景输入

```text
设备型号 A100，故障码 E42，启动后三分钟自动停机，现场温度偏高。
```

## 期望展示

- 系统返回 grounded answer，而不是自由编造维修建议。
- 每条关键结论都有 citation。
- 返回 trace_id，可进入 trace review。
- 如果资料不足或风险过高，系统拒答或升级人工工单。
- Audit events 和 metrics 能证明系统动作可追踪。

## 收尾证据

展示 `v1.0.5` 的验收基线：

- 185 backend tests passed。
- 35 Playwright E2E tests。
- Secret scan clean。
- Docker compose config passed。
- PostgreSQL / Redis smoke passed。
- Worker stress passed。
- Full E2E passed。
