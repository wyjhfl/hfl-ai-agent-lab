# Project A 深挖问答：Agentic RAG 诊断平台

## Q1：Project A 和普通 RAG Chatbot 有什么区别？

普通 RAG Chatbot 重点是“上传文档后问答”。Project A 的重点是设备售后诊断闭环：输入设备型号、故障码和现场现象后，系统要做安全检查、动态检索、query rewrite、GraphRAG 关系、grounded answer、citations、trace_id、高风险工单升级、评测和监控。它证明的是工程闭环，不是一次模型回答。

## Q2：为什么不用多 Agent？

Project A 刻意不做多 Agent。设备诊断链路的核心风险是证据、引用、拒答和工单升级，所以我优先用单诊断控制器把链路做可控：输入校验、检索策略、风险识别、引用校验、trace 持久化和升级动作都在一个清晰控制面内完成。多 Agent 会放大协调复杂度，不适合作为这个项目的主卖点。

## Q3：如何证明质量？

我把质量拆成 regression、context precision、faithfulness、context recall、bad case boundaries 和 trace review。最终用 final production acceptance 串联 pytest、ruff、前端构建、OpenAPI drift、secret scan、Docker config、Redis/PostgreSQL smoke、worker stress 和 Playwright Full E2E。`v1.0.5` 基线是 13/13 checks passed。

## Q4：系统如何处理资料不足？

资料不足时不强行回答。系统会返回拒答或要求补充型号、故障码、现场现象；如果风险较高，会升级为人工工单。这样能避免模型在设备维修场景里编造不可靠建议。

## Q5：可运维性体现在哪里？

项目包含 `healthz`、`readyz`、Request ID、structured errors、audit events、Prometheus `/metrics` 和 Grafana demo dashboard。异步任务通过 JobService 支持 claim、heartbeat、cancel、retry、timeout，还验证了 PostgreSQL worker stress。

## Q6：面试时最应该强调什么？

强调“可验收”。这个项目不是只展示页面或模型效果，而是用测试、构建、类型同步、secret scan、Docker、smoke、E2E 和 release tag 证明交付质量。
