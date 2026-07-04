# Project A Quality / Evaluation 方案

> 目标：证明 RAG 诊断平台的质量，而不是只展示一次顺利问答。

## 评测维度

| 维度 | 说明 | 证据 |
|---|---|---|
| Regression | 固定诊断样例回归，防止 Prompt、检索、模型改动导致退化 | Quality 页 regression |
| Context Precision | 检索到的上下文是否支持答案 | RAG metrics |
| Faithfulness | 回答是否忠实于引用证据 | grounded answer + citations |
| Context Recall | 应召回的关键文档是否出现 | evaluation cases |
| Bad Case Boundaries | 资料不足、故障码缺失、注入攻击时是否拒答或升级 | bad case review |
| Trace Review | 每次诊断是否能追溯 query、retrieval、answer、ticket escalation | trace_id |

## Production Acceptance Gate

Project A 的 `v1.0.5` 基线在最终生产验收脚本后切出：

```text
13/13 ALL CHECKS PASSED
backend/tests: 185 passed, 1 warning
E2E list: 35 tests in 12 files
Secret scan: No secrets found
Docker compose config: passed
PostgreSQL smoke / Redis smoke / Worker stress: passed
Full E2E: passed
```

## 验收覆盖

| Gate | 目的 |
|---|---|
| pytest | 覆盖 API、auth、RAG、jobs、security、production gates |
| ruff | 保持后端代码风格和基础质量 |
| frontend build | Vue console 可构建 |
| OpenAPI drift guard | 前后端类型同步 |
| secret scan | 防止密钥进入仓库 |
| Docker Compose config | 部署配置可解析 |
| Redis/PostgreSQL smoke | 验证生产依赖路径 |
| Worker stress | 验证异步任务 claim / heartbeat / retry / timeout |
| Playwright Full E2E | 验证前端 console 主路径 |

## 面试讲法

> 我没有只说“RAG 效果不错”，而是把质量拆成 regression、context precision、faithfulness、context recall、bad case 和 trace review。最终用生产验收脚本把后端测试、前端构建、OpenAPI 类型、secret scan、Docker、Redis/PostgreSQL smoke、worker stress 和 Full E2E 串起来。这样面试官看到的是一个可验收的工程项目，而不是一次性 Demo。
