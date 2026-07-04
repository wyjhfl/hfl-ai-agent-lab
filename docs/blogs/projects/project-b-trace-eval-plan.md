# Project B Trace / Evaluation 方案

> 目标：让 Multi-Agent Runtime 的每一步可解释、可审计、可回放。

## Trace 关注点

| Trace 对象 | 记录什么 | 为什么重要 |
|---|---|---|
| task | task_id、类型、状态、创建者 | 串起一次运行 |
| role step | Coordinator / Analyst / Executor / Reviewer 的输入输出 | 解释多角色协作 |
| tool call | 工具名、参数、结果、错误、耗时 | 排查工具执行 |
| policy decision | allow / deny / approval_required | 证明工具治理 |
| approval | 审批人、动作、参数摘要、结果 | HITL 可审计 |
| audit event | actor、action、target、risk、timestamp | 合规与复盘 |
| trajectory | 多 Agent 状态迁移和 handoff | 面试中可视化讲解 |

## 示例 Trajectory

| step | actor | action | governance |
|---|---|---|---|
| 1 | Coordinator | 创建 `multi_agent` task | 记录 task_id |
| 2 | Analyst | 分析运营问题并生成查询意图 | fake/offline LLM boundary |
| 3 | Executor | 请求 ToolGateway 执行查询工具 | PolicyEngine 检查 |
| 4 | PolicyEngine | 判断写动作需要审批 | approval_required |
| 5 | Human Approver | approve / reject / edit | audit trail |
| 6 | Reviewer | 汇总结果并检查风险 | reviewer verdict |

## Evaluation 关注点

| 指标 | 验证点 |
|---|---|
| Orchestration correctness | 角色顺序、handoff、状态迁移是否符合预期 |
| Tool governance | 未白名单工具是否被拒绝，高风险工具是否进入审批 |
| Audit completeness | 关键动作是否都有 audit event |
| Trace completeness | 是否能从 task_id 找到完整 trajectory |
| Offline reproducibility | 默认测试是否不依赖真实 LLM 或外部 MCP |

## 验证命令

```powershell
python -m pytest
python -m py_compile app/api/observability.py app/api/operations.py scripts/start_dev.py
```

Frontend：

```powershell
cd frontend
npm run lint
npm run build
```
